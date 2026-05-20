import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { reviewSchema } from "@/lib/validation";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = reviewSchema.safeParse(await req.json());

    if (!result.success) {
      return NextResponse.json({ error: "Invalid review input" }, { status: 400 });
    }

    const { bookingId, rating, comment } = result.data;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking || booking.customerId !== session.user.id) {
      return NextResponse.json({ error: "Booking not found or not yours" }, { status: 404 });
    }

    if (booking.status !== "COMPLETED") {
      return NextResponse.json({ error: "Can only review completed bookings" }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        bookingId,
        userId: session.user.id,
        rating,
        comment,
      },
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error("Review API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
