import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST as createBooking, GET as getBookings } from "@/app/api/bookings/route";
import { PATCH as updateBooking } from "@/app/api/bookings/[id]/route";
import { POST as createReview } from "@/app/api/reviews/route";
import { GET as getSupportTickets } from "@/app/api/support/route";
import { POST as createOrder } from "@/app/api/payments/create-order/route";
import { POST as verifyPayment } from "@/app/api/payments/verify/route";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { razorpay } from "@/lib/razorpay";

// Mock prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
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
    supportTicket: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    subscriptionPlan: {
      findUnique: vi.fn(),
    },
    userSubscription: {
      create: vi.fn(),
    },
  },
}));

// Mock auth
vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

// Mock razorpay
vi.mock("@/lib/razorpay", () => ({
  razorpay: {
    orders: {
      create: vi.fn(),
    },
  },
}));

describe("API Unit Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Customer Role", () => {
    const customerSession = { user: { id: "cust_1", role: "CUSTOMER" } };

    it("should allow customer to create a booking", async () => {
      (auth as any).mockResolvedValue(customerSession);
      (prisma.user.findFirst as any).mockResolvedValue({ id: "cleaner_1" });
      (prisma.booking.create as any).mockResolvedValue({ id: "book_1" });

      const req = new Request("http://localhost/api/bookings", {
        method: "POST",
        body: JSON.stringify({
          date: "2026-06-01",
          time: "10:00",
          address: "123 Test St",
          notes: "Be careful",
        }),
      });

      const res = await createBooking(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(prisma.booking.create).toHaveBeenCalled();
    });

    it("should return customer's own bookings only", async () => {
      (auth as any).mockResolvedValue(customerSession);
      (prisma.booking.findMany as any).mockResolvedValue([{ id: "book_1", customerId: "cust_1" }]);

      const res = await getBookings();
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(prisma.booking.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: { customerId: "cust_1" }
      }));
    });
  });

  describe("Cleaner Role", () => {
    const cleanerSession = { user: { id: "cleaner_1", role: "CLEANER" } };

    it("should return cleaner's assigned bookings", async () => {
      (auth as any).mockResolvedValue(cleanerSession);
      (prisma.booking.findMany as any).mockResolvedValue([{ id: "book_1", cleanerId: "cleaner_1" }]);

      const res = await getBookings();
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(prisma.booking.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: { cleanerId: "cleaner_1" }
      }));
    });

    it("should allow cleaner to complete assigned job", async () => {
      (auth as any).mockResolvedValue(cleanerSession);
      (prisma.booking.findUnique as any).mockResolvedValue({ id: "book_1", cleanerId: "cleaner_1" });
      (prisma.booking.update as any).mockResolvedValue({ id: "book_1", status: "COMPLETED" });

      const req = new Request("http://localhost/api/bookings/book_1", {
        method: "PATCH",
        body: JSON.stringify({ status: "COMPLETED" }),
      });

      const res = await updateBooking(req, { params: { id: "book_1" } });
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(prisma.booking.update).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: "book_1" },
        data: { status: "COMPLETED" }
      }));
    });

    it("should not allow cleaner to complete someone else's job", async () => {
      (auth as any).mockResolvedValue(cleanerSession);
      (prisma.booking.findUnique as any).mockResolvedValue({ id: "book_2", cleanerId: "cleaner_2" });

      const req = new Request("http://localhost/api/bookings/book_2", {
        method: "PATCH",
        body: JSON.stringify({ status: "COMPLETED" }),
      });

      const res = await updateBooking(req, { params: { id: "book_2" } });
      expect(res.status).toBe(403);
    });
  });

  describe("Admin Role", () => {
    const adminSession = { user: { id: "admin_1", role: "ADMIN" } };

    it("should return all bookings for admin", async () => {
      (auth as any).mockResolvedValue(adminSession);
      (prisma.booking.findMany as any).mockResolvedValue([]);

      const res = await getBookings();
      expect(res.status).toBe(200);
      expect(prisma.booking.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: {}
      }));
    });

    it("should allow admin to fetch support tickets", async () => {
      (auth as any).mockResolvedValue(adminSession);
      (prisma.supportTicket.findMany as any).mockResolvedValue([]);

      const res = await getSupportTickets();
      expect(res.status).toBe(200);
      expect(prisma.supportTicket.findMany).toHaveBeenCalled();
    });
  });

  describe("Payment API", () => {
    const userSession = { user: { id: "user_1" } };

    it("should create razorpay order", async () => {
      (auth as any).mockResolvedValue(userSession);
      (prisma.subscriptionPlan.findUnique as any).mockResolvedValue({ id: "plan_1", price: 500 });
      (razorpay.orders.create as any).mockResolvedValue({ id: "order_1" });

      const req = new Request("http://localhost/api/payments/create-order", {
        method: "POST",
        body: JSON.stringify({ planId: "plan_1" }),
      });

      const res = await createOrder(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.id).toBe("order_1");
    });

    it("should verify payment and create subscription", async () => {
      (auth as any).mockResolvedValue(userSession);
      (prisma.subscriptionPlan.findUnique as any).mockResolvedValue({ id: "plan_1", duration: 30 });
      (prisma.userSubscription.create as any).mockResolvedValue({ id: "sub_1" });

      const req = new Request("http://localhost/api/payments/verify", {
        method: "POST",
        body: JSON.stringify({
          razorpay_order_id: "order_1",
          razorpay_payment_id: "pay_1",
          razorpay_signature: "sig_1",
          planId: "plan_1",
          isTest: true,
        }),
      });

      // isTest: true bypasses signature check in dev mode according to route implementation
      process.env.NODE_ENV = "development";
      const res = await verifyPayment(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(prisma.userSubscription.create).toHaveBeenCalled();
    });
  });
});
