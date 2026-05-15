import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, ShieldCheck, Clock, Star } from "lucide-react";

export default async function Home() {
  const plans = await prisma.subscriptionPlan.findMany();

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-primary/5">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6">
              Professional Cleaning, <span className="text-primary">Simplified.</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              Join thousands of homes and offices in India that trust BharatClean for regular, reliable, and high-quality cleaning services. Subscription-based ease for a spotless life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-lg px-8 h-14" asChild>
                <Link href="#pricing">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 h-14" asChild>
                <Link href="#services">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-primary/5 rounded-full blur-2xl" />
      </section>

      {/* Features Section */}
      <section id="services" className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Why Choose BharatClean?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We bring professional standards and reliability to your doorstep with our specialized cleaning teams.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Verified Professionals",
              desc: "All our cleaners undergo rigorous background checks and training.",
              icon: ShieldCheck,
            },
            {
              title: "Flexible Scheduling",
              desc: "Choose intervals that work for you. Reschedule with a single click.",
              icon: Clock,
            },
            {
              title: "Quality Guaranteed",
              desc: "Not happy? We'll re-clean for free. Your satisfaction is our priority.",
              icon: Star,
            },
          ].map((feature, i) => (
            <Card key={i} className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Transparent pricing with no hidden costs. Select a subscription that fits your needs.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card key={plan.id} className="flex flex-col relative overflow-hidden">
                {plan.name === "Standard Bi-Weekly" && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-sm font-medium -rotate-0 rounded-bl-lg">
                    Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="mb-6">
                    <span className="text-4xl font-bold">₹{plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <ul className="space-y-3">
                    {plan.features?.split(";").map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant={plan.name === "Standard Bi-Weekly" ? "default" : "outline"} asChild>
                    <Link href={`/subscribe/${plan.id}`}>Subscribe Now</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="container mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold mb-8 italic text-muted-foreground">&quot;Making India Cleaner, One Home at a Time.&quot;</h2>
        <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale">
          {/* Mock partner logos or trust badges */}
          <div className="font-bold text-2xl">B2B TRUSTED</div>
          <div className="font-bold text-2xl">SAFE HANDS</div>
          <div className="font-bold text-2xl">ECO CLEAN</div>
          <div className="font-bold text-2xl">PRIME SERVICE</div>
        </div>
      </section>
    </div>
  );
}
