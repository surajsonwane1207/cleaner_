"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { bookingSchema } from "@/lib/validation";

export async function createBooking(formData: FormData) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return { error: "Unauthorized" };
  }

  if (!formData.get("date") || !formData.get("time") || !formData.get("address")) {
    return { error: "Missing required fields" };
  }

  const result = bookingSchema.safeParse({
    date: formData.get("date"),
    time: formData.get("time"),
    address: formData.get("address"),
    notes: formData.get("notes") || undefined,
  });

  if (!result.success) {
    return { error: "Invalid booking input" };
  }

  const { address, notes, bookingDate } = result.data;

  // Find an available cleaner (simple logic for now: pick the first one with fewest bookings)
  const cleaner = await prisma.user.findFirst({
    where: { role: "CLEANER" },
  });

  try {
    await prisma.booking.create({
      data: {
        customerId: session.user.id,
        cleanerId: cleaner?.id || null,
        date: bookingDate,
        address,
        notes: notes || null,
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
