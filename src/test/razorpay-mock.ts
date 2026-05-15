import { vi } from "vitest";

export const razorpayMock = {
  orders: {
    create: vi.fn(),
  },
  payments: {
    fetch: vi.fn(),
    capture: vi.fn(),
  },
};

vi.mock("@/lib/razorpay", () => ({
  razorpay: razorpayMock,
}));

export { razorpayMock as default };
