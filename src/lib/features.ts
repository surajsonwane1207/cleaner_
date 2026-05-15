import axiosClient from "./axios";

export const authFeatures = {
  register: (data: any) => axiosClient.post("/register", data),
  login: (data: any) => axiosClient.post("/auth/callback/credentials", data), // Standard next-auth but we can use axios if we want
};

export const bookingFeatures = {
  create: (data: any) => axiosClient.post("/bookings", data),
  getAll: () => axiosClient.get("/bookings"),
};

export const supportFeatures = {
  submitTicket: (data: any) => axiosClient.post("/support", data),
};
