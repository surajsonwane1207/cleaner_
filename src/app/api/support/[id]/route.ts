import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { supportTicketUpdateSchema } from "@/lib/validation";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = supportTicketUpdateSchema.safeParse(await req.json());
    const { id: ticketId } = await params;

    if (!result.success) {
      return NextResponse.json({ error: "Invalid ticket status" }, { status: 400 });
    }

    const { status } = result.data;

    const ticket = await prisma.supportTicket.update({
      where: { id: ticketId },
      data: { status },
    });

    return NextResponse.json({ success: true, ticket });
  } catch (error) {
    console.error("Update Ticket Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
