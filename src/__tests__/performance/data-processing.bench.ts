import { describe, bench } from "vitest";

// Simulating some data processing logic that might exist in a dashboard
function processBookings(bookings: any[]) {
  return bookings.map(b => ({
    ...b,
    isUpcoming: new Date(b.date) > new Date(),
    formattedDate: new Date(b.date).toLocaleDateString(),
  })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

describe("Performance Benchmarks", () => {
  const largeData = Array.from({ length: 1000 }, (_, i) => ({
    id: `id-${i}`,
    date: new Date(Date.now() + (Math.random() - 0.5) * 1000000000).toISOString(),
    status: i % 3 === 0 ? "COMPLETED" : "PENDING",
  }));

  bench("processBookings with 1000 items", () => {
    processBookings(largeData);
  });

  bench("Date parsing and comparison", () => {
    const d1 = new Date();
    const d2 = new Date(Date.now() + 1000);
    return d1 < d2;
  });
});
