import axiosClient from "./axios";

export const authFeatures = {
  register: (data: Record<string, unknown>) => axiosClient.post("/register", data),
  login: (data: Record<string, unknown>) => axiosClient.post("/auth/callback/credentials", data), // Standard next-auth but we can use axios if we want
};

export const bookingFeatures = {
  create: (data: Record<string, unknown>) => axiosClient.post("/bookings", data),
  getAll: () => axiosClient.get("/bookings"),
};

export const supportFeatures = {
  submitTicket: (data: Record<string, unknown>) => axiosClient.post("/support", data),
};
