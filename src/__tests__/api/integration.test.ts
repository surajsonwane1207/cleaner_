import { describe, it, expect, vi, beforeEach } from "vitest";
import { PATCH as updateTicket } from "@/app/api/support/[id]/route";
import { POST as createReview } from "@/app/api/reviews/route";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    booking: {
      findUnique: vi.fn(),
    },
    review: {
      create: vi.fn(),
    },
    supportTicket: {
      update: vi.fn(),
    },
  },
}));

vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

describe("API Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Support Ticket Status Update", () => {
    it("should allow Admin to update ticket status", async () => {
      (auth as any).mockResolvedValue({ user: { role: "ADMIN" } });
      (prisma.supportTicket.update as any).mockResolvedValue({ id: "ticket_1", status: "CLOSED" });

      const req = new Request("http://localhost/api/support/ticket_1", {
        method: "PATCH",
        body: JSON.stringify({ status: "CLOSED" }),
      });

      const res = await updateTicket(req, { params: { id: "ticket_1" } });
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(prisma.supportTicket.update).toHaveBeenCalledWith({
        where: { id: "ticket_1" },
        data: { status: "CLOSED" },
      });
    });

    it("should reject non-Admin status update", async () => {
      (auth as any).mockResolvedValue({ user: { role: "CUSTOMER" } });

      const req = new Request("http://localhost/api/support/ticket_1", {
        method: "PATCH",
        body: JSON.stringify({ status: "CLOSED" }),
      });

      const res = await updateTicket(req, { params: { id: "ticket_1" } });
      expect(res.status).toBe(401);
    });
  });

  describe("Review Submission", () => {
    it("should allow Customer to review COMPLETED booking", async () => {
      (auth as any).mockResolvedValue({ user: { id: "cust_1" } });
      (prisma.booking.findUnique as any).mockResolvedValue({
        id: "book_1",
        customerId: "cust_1",
        status: "COMPLETED",
      });
      (prisma.review.create as any).mockResolvedValue({ id: "rev_1" });

      const req = new Request("http://localhost/api/reviews", {
        method: "POST",
        body: JSON.stringify({
          bookingId: "book_1",
          rating: 5,
          comment: "Great job!",
        }),
      });

      const res = await createReview(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(prisma.review.create).toHaveBeenCalled();
    });

    it("should reject review for non-COMPLETED booking", async () => {
        (auth as any).mockResolvedValue({ user: { id: "cust_1" } });
        (prisma.booking.findUnique as any).mockResolvedValue({
          id: "book_1",
          customerId: "cust_1",
          status: "PENDING",
        });
  
        const req = new Request("http://localhost/api/reviews", {
          method: "POST",
          body: JSON.stringify({
            bookingId: "book_1",
            rating: 5,
          }),
        });
  
        const res = await createReview(req);
        expect(res.status).toBe(400);
        const data = await res.json();
        expect(data.error).toBe("Can only review completed bookings");
      });
  });
});
