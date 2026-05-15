import { describe, it, expect, vi } from "vitest";
import { resend } from "@/lib/resend";

// Mock the resend package
vi.mock("resend", () => {
  const MockResend = function() {
    return {
      emails: {
        send: vi.fn().mockResolvedValue({ id: "test-id" }),
      },
    };
  };
  return { Resend: MockResend };
});

describe("Resend Utility", () => {
  it("should be initialized", () => {
    expect(resend).toBeDefined();
  });

  it("should have an emails.send method", () => {
    expect(resend.emails.send).toBeDefined();
  });
});
