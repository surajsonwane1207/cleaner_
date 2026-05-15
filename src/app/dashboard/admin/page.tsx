import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Users, Calendar, MessageSquare, Shield } from "lucide-react";

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const [tickets, users, bookings, plans] = await Promise.all([
    prisma.supportTicket.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.user.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.booking.findMany({ 
      include: { customer: true, cleaner: true },
      orderBy: { date: "desc" } 
    }),
    prisma.subscriptionPlan.findMany(),
  ]);

  const stats = [
    { title: "Total Users", value: users.length, icon: Users, color: "text-blue-600" },
    { title: "Total Bookings", value: bookings.length, icon: Calendar, color: "text-green-600" },
    { title: "Open Tickets", value: tickets.filter(t => t.status === "OPEN").length, icon: MessageSquare, color: "text-yellow-600" },
    { title: "Active Plans", value: plans.length, icon: Shield, color: "text-purple-600" },
  ];

  return (
    <div className="container mx-auto px-4 py-10 space-y-10">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">System-wide overview and management.</p>
      </div>
      
      {/* Stats Overview */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-10">
        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage platform users and their roles.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 font-medium border-b">Name</th>
                    <th className="px-4 py-3 font-medium border-b">Email</th>
                    <th className="px-4 py-3 font-medium border-b">Role</th>
                    <th className="px-4 py-3 font-medium border-b">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 border-b font-medium">{u.name}</td>
                      <td className="px-4 py-3 border-b text-muted-foreground">{u.email}</td>
                      <td className="px-4 py-3 border-b">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          u.role === "ADMIN" ? "bg-purple-100 text-purple-700" : 
                          u.role === "CLEANER" ? "bg-blue-100 text-blue-700" : 
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 border-b text-muted-foreground">
                        {u.createdAt.toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Booking Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Global Bookings</CardTitle>
            <CardDescription>Monitor all cleaning schedules across the platform.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 font-medium border-b">Customer</th>
                    <th className="px-4 py-3 font-medium border-b">Cleaner</th>
                    <th className="px-4 py-3 font-medium border-b">Date & Time</th>
                    <th className="px-4 py-3 font-medium border-b">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 border-b">
                        <div className="font-medium">{b.customer.name}</div>
                        <div className="text-[10px] text-muted-foreground">{b.customer.email}</div>
                      </td>
                      <td className="px-4 py-3 border-b">
                        {b.cleaner ? (
                          <>
                            <div className="font-medium">{b.cleaner.name}</div>
                            <div className="text-[10px] text-muted-foreground">{b.cleaner.email}</div>
                          </>
                        ) : (
                          <span className="text-muted-foreground italic text-xs">Unassigned</span>
                        )}
                      </td>
                      <td className="px-4 py-3 border-b text-muted-foreground">
                        <div>{b.date.toLocaleDateString()}</div>
                        <div className="text-xs">{b.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </td>
                      <td className="px-4 py-3 border-b">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          b.status === "COMPLETED" ? "bg-green-100 text-green-700" : 
                          b.status === "PENDING" ? "bg-yellow-100 text-yellow-700" : 
                          "bg-blue-100 text-blue-700"
                        }`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Support Tickets */}
        <Card>
          <CardHeader>
            <CardTitle>Support Tickets ({tickets.length})</CardTitle>
            <CardDescription>Review and respond to customer inquiries.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 font-medium border-b">User</th>
                    <th className="px-4 py-3 font-medium border-b">Subject</th>
                    <th className="px-4 py-3 font-medium border-b">Message</th>
                    <th className="px-4 py-3 font-medium border-b">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 border-b">
                        <div className="font-medium">{ticket.name}</div>
                        <div className="text-[10px] text-muted-foreground">{ticket.email}</div>
                      </td>
                      <td className="px-4 py-3 border-b">{ticket.subject}</td>
                      <td className="px-4 py-3 border-b truncate max-w-xs">{ticket.message}</td>
                      <td className="px-4 py-3 border-b">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                          ticket.status === "OPEN" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                        }`}>
                          {ticket.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {tickets.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">No tickets found.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
