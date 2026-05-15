import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId, isTest } = await req.json();

  let isAuthentic = false;

  if (isTest && process.env.NODE_ENV === "development") {
    isAuthentic = true;
  } else {
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    isAuthentic = expectedSignature === razorpay_signature;
  }

  if (isAuthentic) {
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    // Update database
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
