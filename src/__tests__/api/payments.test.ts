import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST as createOrder } from "@/app/api/payments/create-order/route";
import { POST as verifyPayment } from "@/app/api/payments/verify/route";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// Use vi.hoisted to define variables used in vi.mock
const { razorpayMock } = vi.hoisted(() => ({
  razorpayMock: {
    orders: {
      create: vi.fn(),
    },
    payments: {
      fetch: vi.fn(),
      capture: vi.fn(),
    },
  }
}));

// Mock the library directly in the test file
vi.mock("@/lib/razorpay", () => ({
  isRazorpayConfigured: vi.fn(() => true),
  razorpay: razorpayMock,
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    subscriptionPlan: {
      findUnique: vi.fn(),
    },
    userSubscription: {
      create: vi.fn(),
    },
  },
}));

vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

describe("Payments API Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /api/payments/create-order", () => {
    it("should return 401 if unauthorized", async () => {
      (auth as any).mockResolvedValue(null);
      const req = new Request("http://localhost/api/payments/create-order", {
        method: "POST",
        body: JSON.stringify({ planId: "plan_1" }),
      });
      const res = await createOrder(req);
      expect(res.status).toBe(401);
    });

    it("should create a razorpay order and return it", async () => {
      (auth as any).mockResolvedValue({ user: { id: "user_1" } });
      (prisma.subscriptionPlan.findUnique as any).mockResolvedValue({
        id: "plan_1",
        price: 999,
      });
      razorpayMock.orders.create.mockResolvedValue({ id: "order_mock_123", amount: 99900 });

      const req = new Request("http://localhost/api/payments/create-order", {
        method: "POST",
        body: JSON.stringify({ planId: "plan_1" }),
      });
      const res = await createOrder(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.id).toBe("order_mock_123");
      expect(razorpayMock.orders.create).toHaveBeenCalledWith(expect.objectContaining({
        amount: 99900,
      }));
    });
  });

  describe("POST /api/payments/verify", () => {
    it("should verify payment and create subscription in development (test mode)", async () => {
      (auth as any).mockResolvedValue({ user: { id: "user_1" } });
      (prisma.subscriptionPlan.findUnique as any).mockResolvedValue({
        id: "plan_1",
        duration: 30,
      });

      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "development";

      const req = new Request("http://localhost/api/payments/verify", {
        method: "POST",
        body: JSON.stringify({
          planId: "plan_1",
          isTest: true,
          razorpay_order_id: "test_order",
          razorpay_payment_id: "test_pay",
          razorpay_signature: "test_sig",
        }),
      });
      
      const res = await verifyPayment(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(prisma.userSubscription.create).toHaveBeenCalled();

      process.env.NODE_ENV = originalEnv;
    });
  });
});
