import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { date, time, address, notes } = body;

    if (!date || !time || !address) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const bookingDate = new Date(`${date}T${time}`);

    const cleaner = await prisma.user.findFirst({
      where: { role: "CLEANER" },
    });

    const booking = await prisma.booking.create({
      data: {
        customerId: session.user.id,
        cleanerId: cleaner?.id || null,
        date: bookingDate,
        address,
        notes,
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error("Booking API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, role } = session.user;
    let whereClause = {};

    if (role === "CUSTOMER") {
      whereClause = { customerId: id };
    } else if (role === "CLEANER") {
      whereClause = { cleanerId: id };
    } else if (role === "ADMIN") {
      whereClause = {};
    } else {
      return NextResponse.json({ error: "Invalid role" }, { status: 403 });
    }

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        cleaner: {
          select: {
            name: true,
            email: true,
          },
        },
        customer: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json({ success: true, bookings });
  } catch (error) {
    console.error("Fetch Bookings Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
