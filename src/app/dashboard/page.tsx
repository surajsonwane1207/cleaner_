import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, Clock, Plus } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      subscriptions: {
        include: { plan: true },
        where: { status: "ACTIVE" },
        take: 1,
      },
      bookingsAsCustomer: {
        orderBy: { date: "desc" },
        take: 5,
        include: { cleaner: true, review: true },
      },
    },
  });

  if (!user) redirect("/login");

  if (user.role === "CLEANER") {
    redirect("/dashboard/cleaner");
  }

  const activeSubscription = user.subscriptions[0];

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
          <p className="text-muted-foreground">Manage your cleanings and subscriptions.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/book">
            <Plus className="mr-2 h-4 w-4" /> Book a Cleaning
          </Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-10">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Subscription</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {activeSubscription ? (
              <>
                <div className="text-2xl font-bold">{activeSubscription.plan.name}</div>
                <p className="text-xs text-muted-foreground">
                  Renews on {activeSubscription.endDate.toLocaleDateString()}
                </p>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">No Active Plan</div>
                <Button variant="link" className="px-0 h-auto" asChild>
                  <Link href="/#pricing">Browse Plans</Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Next Cleaning</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {user.bookingsAsCustomer.find(b => b.status === "PENDING" || b.status === "CONFIRMED") ? (
              <>
                <div className="text-2xl font-bold">
                  {user.bookingsAsCustomer.find(b => b.status === "PENDING" || b.status === "CONFIRMED")?.date.toLocaleDateString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Status: {user.bookingsAsCustomer.find(b => b.status === "PENDING" || b.status === "CONFIRMED")?.status}
                </p>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">None Scheduled</div>
                <p className="text-xs text-muted-foreground">Book your next session</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Past Cleanings</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user.bookingsAsCustomer.filter(b => b.status === "COMPLETED").length}
            </div>
            <p className="text-xs text-muted-foreground">Total completed sessions</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-bold mb-4">Recent Bookings</h2>
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {user.bookingsAsCustomer.length > 0 ? (
              user.bookingsAsCustomer.map((booking) => (
                <div key={booking.id} className="p-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{booking.date.toLocaleDateString()}</div>
                    <div className="text-sm text-muted-foreground">{booking.address}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      booking.status === "COMPLETED" ? "bg-green-100 text-green-700" : 
                      booking.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                      "bg-blue-100 text-blue-700"
                    }`}>
                      {booking.status}
                    </div>
                    {booking.status === "COMPLETED" && !booking.review && (
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/dashboard/rate/${booking.id}`}>Rate</Link>
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                No bookings found. Start by scheduling your first cleaning!
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
