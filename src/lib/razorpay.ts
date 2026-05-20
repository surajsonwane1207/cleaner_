import Razorpay from "razorpay";

export function isRazorpayConfigured() {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_build_placeholder",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "build_placeholder",
});
