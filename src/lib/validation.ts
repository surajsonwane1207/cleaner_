import { z } from "zod";

const trimmedString = (min = 1, max = 500) =>
  z.string().trim().min(min).max(max);

export const registerSchema = z.object({
  name: trimmedString(2, 100),
  email: z.email().max(255),
  password: z.string().min(6).max(128),
});

export const bookingSchema = z
  .object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    time: z.string().regex(/^\d{2}:\d{2}$/),
    address: trimmedString(5, 500),
    notes: z.string().trim().max(1000).optional().default(""),
  })
  .transform((data, ctx) => {
    const bookingDate = new Date(`${data.date}T${data.time}`);

    if (Number.isNaN(bookingDate.getTime())) {
      ctx.addIssue({
        code: "custom",
        path: ["date"],
        message: "Invalid booking date or time",
      });
      return z.NEVER;
    }

    return {
      ...data,
      bookingDate,
    };
  });

export const bookingUpdateSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"]).optional(),
  cleanerId: z.string().trim().min(1).optional(),
});

export const reviewSchema = z.object({
  bookingId: z.string().trim().min(1),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().max(1000).optional(),
});

export const supportTicketSchema = z.object({
  name: trimmedString(2, 100),
  email: z.email().max(255),
  subject: trimmedString(3, 150),
  message: trimmedString(10, 2000),
});

export const supportTicketUpdateSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "CLOSED"]),
});

export const createOrderSchema = z.object({
  planId: z.string().trim().min(1),
});

export const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string().trim().min(1),
  razorpay_payment_id: z.string().trim().min(1),
  razorpay_signature: z.string().trim().min(1),
  planId: z.string().trim().min(1),
  isTest: z.boolean().optional(),
});
