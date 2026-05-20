import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isRazorpayConfigured, razorpay } from "@/lib/razorpay";
import { createOrderSchema } from "@/lib/validation";

export async function POST(req: Request) {
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isRazorpayConfigured()) {
    return NextResponse.json({ error: "Payment gateway is not configured" }, { status: 500 });
  }

  const result = createOrderSchema.safeParse(await req.json());

  if (!result.success) {
    return NextResponse.json({ error: "Invalid payment input" }, { status: 400 });
  }

  const { planId } = result.data;

  const plan = await prisma.subscriptionPlan.findUnique({
    where: { id: planId },
  });

  if (!plan) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  }

  const options = {
    amount: plan.price * 100, // Amount in paise
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
    notes: {
      planId: plan.id,
      userId: session.user.id ?? "",
    },
  };

  try {
    const order = await razorpay.orders.create(options);
    return NextResponse.json(order);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error creating order" }, { status: 500 });
  }
}
