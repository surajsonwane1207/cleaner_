import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
}));

// Mock NextAuth
vi.mock("next-auth/react", () => ({
  signIn: vi.fn(),
  signOut: vi.fn(),
  useSession: vi.fn(() => ({ data: null, status: "unauthenticated" })),
}));

// Mock Lucide icons to avoid rendering issues in tests
vi.mock("lucide-react", async () => {
  const actual = await vi.importActual("lucide-react");
  return {
    ...actual,
    Sparkles: () => "SparklesIcon",
    CheckCircle2: () => "CheckCircle2Icon",
    ShieldCheck: () => "ShieldCheckIcon",
    Clock: () => "ClockIcon",
    Star: () => "StarIcon",
  };
});

// Mock Razorpay global
global.window.Razorpay = vi.fn().mockImplementation(() => ({
  open: vi.fn(),
}));
