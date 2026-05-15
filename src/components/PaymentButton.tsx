"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

interface PaymentButtonProps {
  planId: string;
  planName: string;
  amount: number;
  userName: string;
  userEmail: string;
}

export default function PaymentButton({
  planId,
  planName,
  amount,
  userName,
  userEmail,
}: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    setLoading(true);

    try {
      // 1. Create order on the server
      const response = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      const order = await response.json();

      if (order.error) {
        alert(order.error);
        setLoading(false);
        return;
      }

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "BharatClean",
        description: `Subscription for ${planName}`,
        order_id: order.id,
        handler: async function (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
          // 3. Verify payment on the server
          const verifyRes = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planId,
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            router.push("/dashboard?subscribed=true");
          } else {
            alert("Payment verification failed");
          }
        },
        prefill: {
          name: userName,
          email: userEmail,
        },
        theme: {
          color: "#0f172a",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const simulateSuccess = async () => {
    setLoading(true);
    try {
      const verifyRes = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: "order_test_123",
          razorpay_payment_id: "pay_test_123",
          razorpay_signature: "test_sig",
          planId,
          isTest: true, // We'll handle this on server
        }),
      });
      const verifyData = await verifyRes.json();
      if (verifyData.success) {
        router.push("/dashboard?subscribed=true");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button size="lg" className="w-full h-14 text-lg" onClick={handlePayment} disabled={loading}>
        {loading ? "Processing..." : `Pay ₹${amount} & Subscribe`}
      </Button>
      {process.env.NODE_ENV === "development" && (
        <Button variant="outline" className="w-full" onClick={simulateSuccess} disabled={loading}>
          Simulate Success
        </Button>
      )}
    </div>
  );
}
