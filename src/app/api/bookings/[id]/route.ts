import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { bookingUpdateSchema } from "@/lib/validation";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: userId, role } = session.user;
    const { id: bookingId } = await params;
    const result = bookingUpdateSchema.safeParse(await req.json());

    if (!result.success) {
      return NextResponse.json({ error: "Invalid booking update input" }, { status: 400 });
    }

    const { status, cleanerId } = result.data;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (role === "CLEANER") {
      if (booking.cleanerId !== userId) {
        return NextResponse.json({ error: "Forbidden: Not assigned to this job" }, { status: 403 });
      }
      if (status && status !== "COMPLETED" && status !== "CONFIRMED") {
         return NextResponse.json({ error: "Forbidden: Cleaner can only confirm or complete jobs" }, { status: 403 });
      }
    } else if (role === "CUSTOMER") {
        if (booking.customerId !== userId) {
            return NextResponse.json({ error: "Forbidden: Not your booking" }, { status: 403 });
        }
        if (status && status !== "CANCELLED") {
            return NextResponse.json({ error: "Forbidden: Customer can only cancel jobs" }, { status: 403 });
        }
    } else if (role !== "ADMIN") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: status || undefined,
        cleanerId: role === "ADMIN" ? (cleanerId || undefined) : undefined,
      },
    });

    return NextResponse.json({ success: true, booking: updatedBooking });
  } catch (error) {
    console.error("Update Booking Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
