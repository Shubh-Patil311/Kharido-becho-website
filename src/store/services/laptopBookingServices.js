import apiClient from "./apiClient";

/* ----------------------- HELPERS ----------------------- */

const extractList = (res) => res?.data?.data || res?.data || [];

const extractData = (res) => res?.data?.data || res?.data;

/* ------------------ CREATE REQUEST ------------------ */

// POST /api/laptopBookings/create
export const createLaptopBooking = async (payload) => {
  const res = await apiClient.post("/api/laptopBookings/create", payload);
  return extractData(res);
};

/* ------------------ FETCH REQUESTS ------------------ */

// GET /api/laptopBookings/{laptopId}
export const getLaptopBookingsByLaptop = async (laptopId) => {
  const res = await apiClient.get(`/api/laptopBookings/${laptopId}`);
  return extractList(res);
};

// GET /api/laptopBookings/buyer/{buyerId}
export const getLaptopBookingsByBuyer = async (buyerId) => {
  const res = await apiClient.get(`/api/laptopBookings/buyer/${buyerId}`);
  return extractList(res);
};

// GET /api/laptopBookings/seller/{sellerId}
export const getLaptopBookingsBySeller = async (sellerId) => {
  const res = await apiClient.get(`/api/laptopBookings/seller/${sellerId}`);
  return extractList(res);
};

// GET /api/laptopBookings/laptop-bookings/{bookingId}
export const getLaptopBookingById = async (bookingId) => {
  const res = await apiClient.get(
    `/api/laptopBookings/laptop-bookings/${bookingId}`
  );

  const data = res.data;

  // 🔥 Normalize here so all components get correct object
  if (Array.isArray(data)) {
    return data[0] || null;
  }

  return data;
};

/* ------------------ UPDATE STATUS ------------------ */

// PATCH /api/laptopBookings/{laptopBookingId}/status?status=ACCEPTED
export const updateLaptopBookingStatus = async (bookingId, status) => {
  const res = await apiClient.patch(
    `/api/laptopBookings/${bookingId}/status?status=${status}`
  );
  return extractData(res);
};

/* ------------------ CHAT MESSAGE ------------------ */

// POST /api/laptopBookings/{id}/message?senderUserId=1&message=Hello
export const sendLaptopMessage = async (bookingId, senderUserId, message) => {
  const res = await apiClient.post(
    `/api/laptopBookings/${bookingId}/message`,
    null,
    {
      params: { senderUserId, message },
    }
  );
  return extractData(res);
};

/* ------------------ COMPLETE BOOKING ------------------ */

// POST /api/laptopBookings/{id}/complete
export const completeLaptopBooking = async (bookingId) => {
  const res = await apiClient.post(`/api/laptopBookings/${bookingId}/complete`);
  return extractData(res);
};
