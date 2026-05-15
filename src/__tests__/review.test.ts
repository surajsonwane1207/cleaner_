import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../app/api/reviews/route';
import { prisma } from '../lib/prisma';
import { auth } from '../auth';
import { NextResponse } from 'next/server';

vi.mock('../lib/prisma', () => ({
  prisma: {
    booking: {
      findUnique: vi.fn(),
    },
    review: {
      create: vi.fn(),
    },
  },
}));

vi.mock('../auth', () => ({
  auth: vi.fn(),
}));

describe('Review API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if user is not authenticated', async () => {
    (auth as any).mockResolvedValue(null);
    const req = new Request('http://localhost:3000/api/reviews', {
      method: 'POST',
      body: JSON.stringify({ bookingId: '1', rating: 5 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('should return 400 if bookingId or rating is missing', async () => {
    (auth as any).mockResolvedValue({ user: { id: 'user1' } });
    const req = new Request('http://localhost:3000/api/reviews', {
      method: 'POST',
      body: JSON.stringify({ rating: 5 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('should create a review if all conditions are met', async () => {
    (auth as any).mockResolvedValue({ user: { id: 'user1' } });
    (prisma.booking.findUnique as any).mockResolvedValue({
      id: 'booking1',
      customerId: 'user1',
      status: 'COMPLETED',
    });
    (prisma.review.create as any).mockResolvedValue({ id: 'review1' });

    const req = new Request('http://localhost:3000/api/reviews', {
      method: 'POST',
      body: JSON.stringify({ bookingId: 'booking1', rating: 5, comment: 'Great!' }),
    });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(prisma.review.create).toHaveBeenCalledWith({
      data: {
        bookingId: 'booking1',
        userId: 'user1',
        rating: 5,
        comment: 'Great!',
      },
    });
  });

  it('should return 400 if booking is not completed', async () => {
    (auth as any).mockResolvedValue({ user: { id: 'user1' } });
    (prisma.booking.findUnique as any).mockResolvedValue({
      id: 'booking1',
      customerId: 'user1',
      status: 'PENDING',
    });

    const req = new Request('http://localhost:3000/api/reviews', {
      method: 'POST',
      body: JSON.stringify({ bookingId: 'booking1', rating: 5 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
