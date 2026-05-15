import { describe, it, expect, vi, beforeEach } from "vitest";
import { registerUser } from "@/app/register/actions";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Mock prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

// Mock bcrypt
vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn().mockResolvedValue("hashed_password"),
  },
}));

describe("registerUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return error if user already exists", async () => {
    const formData = new FormData();
    formData.append("name", "Test User");
    formData.append("email", "existing@example.com");
    formData.append("password", "password123");

    (prisma.user.findUnique as any).mockResolvedValue({ id: "1", email: "existing@example.com" });

    const result = await registerUser(formData);

    expect(result).toEqual({ error: "User already exists" });
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it("should create user if details are valid", async () => {
    const formData = new FormData();
    formData.append("name", "New User");
    formData.append("email", "new@example.com");
    formData.append("password", "password123");

    (prisma.user.findUnique as any).mockResolvedValue(null);
    (prisma.user.create as any).mockResolvedValue({ id: "2", email: "new@example.com" });

    const result = await registerUser(formData);

    expect(result).toEqual({ success: true });
    expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        name: "New User",
        email: "new@example.com",
        password: "hashed_password",
        role: "CUSTOMER",
      },
    });
  });

  it("should return error if input is invalid", async () => {
    const formData = new FormData();
    formData.append("name", "U"); // Too short
    formData.append("email", "invalid-email");
    formData.append("password", "123"); // Too short

    const result = await registerUser(formData);

    expect(result).toEqual({ error: "Invalid input" });
  });
});
