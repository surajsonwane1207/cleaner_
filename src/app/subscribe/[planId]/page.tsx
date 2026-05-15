import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import PaymentButton from "@/components/PaymentButton";

export default async function SubscribePage(props: {
  params: Promise<{ planId: string }>;
}) {
  const params = await props.params;
  const session = await auth();

  if (!session || !session.user) {
    redirect(`/login?callbackUrl=/subscribe/${params.planId}`);
  }

  const plan = await prisma.subscriptionPlan.findUnique({
    where: { id: params.planId },
  });

  if (!plan) {
    redirect("/");
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
        <div>
          <h1 className="text-4xl font-bold mb-6">Complete Your Subscription</h1>
          <p className="text-muted-foreground mb-8 text-lg">
            You&apos;re just one step away from a cleaner space. Review your plan details and proceed to payment.
          </p>
          
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle>Plan Summary</CardTitle>
              <CardDescription>Selected: {plan.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-6">₹{plan.price} <span className="text-sm font-normal text-muted-foreground">/ month</span></div>
              <ul className="space-y-3">
                {plan.features?.split(";").map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col justify-center">
          <Card>
            <CardHeader>
              <CardTitle>Checkout</CardTitle>
              <CardDescription>Secure payment via Razorpay</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>₹{plan.price}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>GST (Included)</span>
                <span>₹0</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-bold text-lg">
                <span>Total Amount</span>
                <span>₹{plan.price}</span>
              </div>
              
              <PaymentButton
                planId={plan.id}
                planName={plan.name}
                amount={plan.price}
                userName={session.user.name || ""}
                userEmail={session.user.email || ""}
              />
              
              <p className="text-xs text-center text-muted-foreground">
                By subscribing, you agree to our Terms of Service and Privacy Policy. Your subscription will auto-renew every 30 days.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
