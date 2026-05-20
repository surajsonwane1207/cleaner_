import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { supportTicketSchema } from "@/lib/validation";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = supportTicketSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid support ticket input" },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = result.data;

    const ticket = await prisma.supportTicket.create({
      data: {
        name,
        email,
        subject,
        message,
      },
    });

    return NextResponse.json({ success: true, ticket });
  } catch (error) {
    console.error("Support API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tickets = await prisma.supportTicket.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, tickets });
  } catch (error) {
    console.error("Fetch Support Tickets Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
