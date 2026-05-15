import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST as createBooking, GET as getBookings } from "@/app/api/bookings/route";
import { PATCH as updateBooking } from "@/app/api/bookings/[id]/route";
import { POST as createReview } from "@/app/api/reviews/route";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findFirst: vi.fn(),
    },
    booking: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    review: {
      create: vi.fn(),
    },
  },
}));

vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

describe("API Workflow Tests (End-to-End API Flow)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should complete a full booking lifecycle from request to review", async () => {
    // 1. Customer creates a booking
    const customerSession = { user: { id: "cust_1", role: "CUSTOMER" } };
    (auth as any).mockResolvedValue(customerSession);
    (prisma.user.findFirst as any).mockResolvedValue({ id: "cleaner_1" });
    (prisma.booking.create as any).mockResolvedValue({
      id: "book_workflow",
      customerId: "cust_1",
      cleanerId: "cleaner_1",
      status: "PENDING",
    });

    const createReq = new Request("http://localhost/api/bookings", {
      method: "POST",
      body: JSON.stringify({
        date: "2026-06-01",
        time: "10:00",
        address: "123 Workflow Way",
      }),
    });
    const createRes = await createBooking(createReq);
    expect(createRes.status).toBe(200);

    // 2. Admin assigns/confirms the cleaner (simulated by PATCH)
    const adminSession = { user: { id: "admin_1", role: "ADMIN" } };
    (auth as any).mockResolvedValue(adminSession);
    (prisma.booking.findUnique as any).mockResolvedValue({
      id: "book_workflow",
      customerId: "cust_1",
      cleanerId: "cleaner_1",
    });
    (prisma.booking.update as any).mockResolvedValue({
      id: "book_workflow",
      status: "CONFIRMED",
    });

    const adminPatchReq = new Request("http://localhost/api/bookings/book_workflow", {
      method: "PATCH",
      body: JSON.stringify({ status: "CONFIRMED", cleanerId: "cleaner_2" }), // Admin re-assigns
    });
    const adminPatchRes = await updateBooking(adminPatchReq, { params: { id: "book_workflow" } });
    expect(adminPatchRes.status).toBe(200);

    // 3. Cleaner fetches their schedule and completes the job
    const cleanerSession = { user: { id: "cleaner_2", role: "CLEANER" } };
    (auth as any).mockResolvedValue(cleanerSession);
    (prisma.booking.findMany as any).mockResolvedValue([{ id: "book_workflow" }]);
    
    const cleanerGetRes = await getBookings();
    expect(cleanerGetRes.status).toBe(200);

    (prisma.booking.findUnique as any).mockResolvedValue({
      id: "book_workflow",
      cleanerId: "cleaner_2",
    });
    (prisma.booking.update as any).mockResolvedValue({
      id: "book_workflow",
      status: "COMPLETED",
    });

    const cleanerPatchReq = new Request("http://localhost/api/bookings/book_workflow", {
      method: "PATCH",
      body: JSON.stringify({ status: "COMPLETED" }),
    });
    const cleanerPatchRes = await updateBooking(cleanerPatchReq, { params: { id: "book_workflow" } });
    expect(cleanerPatchRes.status).toBe(200);

    // 4. Customer reviews the completed job
    (auth as any).mockResolvedValue(customerSession);
    (prisma.booking.findUnique as any).mockResolvedValue({
      id: "book_workflow",
      customerId: "cust_1",
      status: "COMPLETED",
    });
    (prisma.review.create as any).mockResolvedValue({ id: "rev_workflow" });

    const reviewReq = new Request("http://localhost/api/reviews", {
      method: "POST",
      body: JSON.stringify({
        bookingId: "book_workflow",
        rating: 5,
        comment: "Excellent service!",
      }),
    });
    const reviewRes = await createReview(reviewReq);
    expect(reviewRes.status).toBe(200);
    const reviewData = await reviewRes.json();
    expect(reviewData.success).toBe(true);
  });
});
