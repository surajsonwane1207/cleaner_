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
import { Button } from "@/components/ui/button";
import { CheckCircle, MapPin } from "lucide-react";
import { revalidatePath } from "next/cache";

async function completeJob(bookingId: string) {
  "use server";
  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "COMPLETED" },
  });
  revalidatePath("/dashboard/cleaner");
}

export default async function CleanerDashboardPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || user.role !== "CLEANER") {
    redirect("/dashboard");
  }

  const assignedJobs = await prisma.booking.findMany({
    where: { cleanerId: user.id },
    include: { customer: true },
    orderBy: { date: "asc" },
  });

  const pendingJobs = assignedJobs.filter(j => j.status !== "COMPLETED" && j.status !== "CANCELLED");
  const completedJobs = assignedJobs.filter(j => j.status === "COMPLETED");

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Cleaner Portal</h1>
      <p className="text-muted-foreground mb-10">Manage your assigned cleaning jobs.</p>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4">Upcoming Jobs ({pendingJobs.length})</h2>
          <div className="space-y-4">
            {pendingJobs.length > 0 ? (
              pendingJobs.map((job) => (
                <Card key={job.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{job.date.toLocaleDateString()} at {job.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</CardTitle>
                        <CardDescription>Customer: {job.customer.name}</CardDescription>
                      </div>
                      <div className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold uppercase">
                        {job.status}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <span>{job.address}</span>
                    </div>
                    {job.notes && (
                      <div className="p-3 bg-muted rounded text-sm italic">
                        &quot;{job.notes}&quot;
                      </div>
                    )}
                    <form action={completeJob.bind(null, job.id)}>
                      <Button className="w-full">
                        <CheckCircle className="mr-2 h-4 w-4" /> Mark as Completed
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground italic">No pending jobs assigned.</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Job History ({completedJobs.length})</h2>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {completedJobs.length > 0 ? (
                  completedJobs.map((job) => (
                    <div key={job.id} className="p-4 flex justify-between items-center">
                      <div>
                        <div className="font-medium">{job.date.toLocaleDateString()}</div>
                        <div className="text-sm text-muted-foreground">{job.customer.name}</div>
                      </div>
                      <div className="text-sm font-bold text-green-600">
                        COMPLETED
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="p-8 text-center text-muted-foreground italic">No completed jobs yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
