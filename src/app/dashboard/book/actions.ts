"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createBooking(formData: FormData) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return { error: "Unauthorized" };
  }

  const dateStr = formData.get("date") as string;
  const timeStr = formData.get("time") as string;
  const address = formData.get("address") as string;
  const notes = formData.get("notes") as string;

  if (!dateStr || !timeStr || !address) {
    return { error: "Missing required fields" };
  }

  const date = new Date(`${dateStr}T${timeStr}`);

  // Find an available cleaner (simple logic for now: pick the first one with fewest bookings)
  const cleaner = await prisma.user.findFirst({
    where: { role: "CLEANER" },
  });

  try {
    await prisma.booking.create({
      data: {
        customerId: session.user.id,
        cleanerId: cleaner?.id || null,
        date,
        address,
        notes,
        status: "PENDING",
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to create booking" };
  }
}
