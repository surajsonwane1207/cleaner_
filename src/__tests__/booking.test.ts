import { describe, it, expect, vi, beforeEach } from "vitest";
import { createBooking } from "@/app/dashboard/book/actions";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// Mock prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findFirst: vi.fn(),
    },
    booking: {
      create: vi.fn(),
    },
  },
}));

// Mock auth
vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

// Mock next/cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("createBooking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return error if not authenticated", async () => {
    (auth as any).mockResolvedValue(null);

    const formData = new FormData();
    const result = await createBooking(formData);

    expect(result).toEqual({ error: "Unauthorized" });
  });

  it("should create booking if authenticated and input is valid", async () => {
    (auth as any).mockResolvedValue({ user: { id: "user_1" } });
    (prisma.user.findFirst as any).mockResolvedValue({ id: "cleaner_1" });
    (prisma.booking.create as any).mockResolvedValue({ id: "booking_1" });

    const formData = new FormData();
    formData.append("date", "2026-06-01");
    formData.append("time", "10:00");
    formData.append("address", "123 Test St");
    formData.append("notes", "Please be careful");

    const result = await createBooking(formData);

    expect(result).toEqual({ success: true });
    expect(prisma.booking.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        customerId: "user_1",
        cleanerId: "cleaner_1",
        address: "123 Test St",
        notes: "Please be careful",
        status: "PENDING",
      }),
    });
  });

  it("should return error if required fields are missing", async () => {
    (auth as any).mockResolvedValue({ user: { id: "user_1" } });

    const formData = new FormData();
    formData.append("date", "2026-06-01");
    // missing time and address

    const result = await createBooking(formData);

    expect(result).toEqual({ error: "Missing required fields" });
  });
});
