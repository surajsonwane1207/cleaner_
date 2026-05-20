import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { razorpay } from "@/lib/razorpay";
import { verifyPaymentSchema } from "@/lib/validation";
import crypto from "crypto";

export async function POST(req: Request) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = verifyPaymentSchema.safeParse(await req.json());

  if (!result.success) {
    return NextResponse.json({ error: "Invalid payment verification input" }, { status: 400 });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId, isTest } = result.data;

  let isAuthentic = false;

  if (isTest && process.env.NODE_ENV === "development") {
    isAuthentic = true;
  } else {
    if (!process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json({ error: "Payment gateway is not configured" }, { status: 500 });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    isAuthentic =
      expectedSignature.length === razorpay_signature.length &&
      crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(razorpay_signature)
      );
  }

  if (isAuthentic) {
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    if (!isTest || process.env.NODE_ENV !== "development") {
      const order = await razorpay.orders.fetch(razorpay_order_id);
      const expectedAmount = Math.round(plan.price * 100);

      if (
        order.amount !== expectedAmount ||
        order.currency !== "INR" ||
        order.notes?.planId !== plan.id ||
        order.notes?.userId !== session.user.id
      ) {
        return NextResponse.json({ error: "Payment order does not match subscription" }, { status: 400 });
      }
    }

    await prisma.userSubscription.create({
      data: {
        userId: session.user.id,
        planId: plan.id,
        status: "ACTIVE",
        startDate: new Date(),
        endDate: new Date(Date.now() + plan.duration * 24 * 60 * 60 * 1000),
      },
    });

    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
}
