import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 10);

  // Create Subscription Plans
  const plans = [
    {
      name: "Basic Weekly",
      description: "Ideal for small apartments. Once a week cleaning.",
      price: 1999,
      duration: 30,
      features: "4 Cleanings per month;General dusting;Mopping;Bathroom cleaning",
    },
    {
      name: "Standard Bi-Weekly",
      description: "Perfect for busy households. Twice a week cleaning.",
      price: 3499,
      duration: 30,
      features: "8 Cleanings per month;Deep kitchen cleaning;Window cleaning;All Basic features",
    },
    {
      name: "Premium Daily",
      description: "Full service for large homes/offices. Daily cleaning.",
      price: 8999,
      duration: 30,
      features: "Daily cleaning (Mon-Sat);Full house deep clean once a month;Laundry support;All Standard features",
    },
  ];

  for (const plan of plans) {
    await prisma.subscriptionPlan.upsert({
      where: { id: plan.name.toLowerCase().replace(/ /g, "-") },
      update: {},
      create: {
        id: plan.name.toLowerCase().replace(/ /g, "-"),
        ...plan,
      },
    });
  }

  // Create an Admin and a Cleaner for testing
  await prisma.user.upsert({
    where: { email: "admin@cleaners.com" },
    update: {
      password: hashedPassword,
    },
    create: {
      email: "admin@cleaners.com",
      name: "Admin User",
      role: "ADMIN",
      password: hashedPassword,
    },
  });

  await prisma.user.upsert({
    where: { email: "cleaner1@cleaners.com" },
    update: {
      password: hashedPassword,
    },
    create: {
      email: "cleaner1@cleaners.com",
      name: "John Cleaner",
      role: "CLEANER",
      password: hashedPassword,
    },
  });

  console.log("Seed data created successfully with hashed passwords");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
