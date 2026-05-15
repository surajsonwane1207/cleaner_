import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PaymentButton from "@/components/PaymentButton";
import { vi, expect, describe, it, beforeEach } from "vitest";

// Mock fetch
global.fetch = vi.fn();

describe("PaymentButton Component", () => {
  const defaultProps = {
    planId: "plan_123",
    planName: "Pro Plan",
    amount: 999,
    userName: "Test User",
    userEmail: "test@example.com",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the payment button with correct amount", () => {
    render(<PaymentButton {...defaultProps} />);
    expect(screen.getByText("Pay ₹999 & Subscribe")).toBeInTheDocument();
  });

  it("opens Razorpay checkout when clicked", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => ({ id: "order_123", amount: 99900, currency: "INR" }),
    });

    render(<PaymentButton {...defaultProps} />);
    const button = screen.getByText("Pay ₹999 & Subscribe");
    
    fireEvent.click(button);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/payments/create-order", expect.any(Object));
    });

    await waitFor(() => {
      expect(global.window.Razorpay).toHaveBeenCalled();
    });
  });

  it("simulates a successful payment directly in development", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => ({ success: true }),
    });

    // Ensure we are in development for this test
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";

    render(<PaymentButton {...defaultProps} />);
    const simulateButton = screen.getByText("Simulate Success");
    
    fireEvent.click(simulateButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/payments/verify", expect.objectContaining({
        body: expect.stringContaining('"isTest":true'),
      }));
    });

    process.env.NODE_ENV = originalEnv;
  });
});
