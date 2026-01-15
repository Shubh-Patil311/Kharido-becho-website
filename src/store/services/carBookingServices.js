import apiClient from "./apiClient";

export const createBooking = async (payload) => {
  const res = await apiClient.post("/api/carBookings/createBooking", payload);
  return res.data;
};

export const getBookingsForSeller = async (sellerId) => {
  const res = await apiClient.get(`/api/carBookings/seller/${sellerId}`);
  return Array.isArray(res.data) ? res.data : res.data || [];
};

export const getBookingsForBuyer = async (buyerId) => {
  const res = await apiClient.get(`/api/carBookings/buyer/${buyerId}`);
  return res.data?.data || [];
};
