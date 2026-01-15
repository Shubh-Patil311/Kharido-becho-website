
import apiClient from "./apiClient";

// 📌 CREATE BIKE (JSON)
export const addBike = async (payload) => {
  // TODO: Remove this after backend is updated
  payload = {
    ...payload,
    prize: payload.price,
  };
  delete payload.price;
  const response = await apiClient.post("/bikes/post", payload);
  return response.data;
};

// 📌 UPLOAD BIKE IMAGES (MULTIPART)
export const uploadBikeImage = async (formData) => {
  const response = await apiClient.post("/bikes/image/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// 📌 GET IMAGES OF BIKE
export const getBikeImages = async (bikeId) => {
  const response = await apiClient.get(`/bikes/image/get?bikeId=${bikeId}`);
  return response.data;
};

// 📌 DELETE BIKE IMAGE
export const deleteBikeImage = async (imageId) => {
  const response = await apiClient.delete(
    `/bikes/image/delete?imageId=${imageId}`
  );
  return response.data;
};

/**
 * Get bikes for a seller filtered by status.
 * Backend endpoint pattern already used for ACTIVE, we reuse it for other statuses.
 */
export const getBikesByStatus = async (sellerId, status) => {
  try {
    const res = await apiClient.get(
      `/bikes/seller/${sellerId}/status/${status}/page/0/size/50`
    );
    return res.data?.content || [];
  } catch (err) {
    console.warn(`Failed to fetch bikes with status ${status}:`, err);
    return [];
  }
};

/**
 * Backwards‑compatible helper – keeps existing behaviour (ACTIVE only).
 */
export const getBikesBySeller = async (sellerId) => {
  return getBikesByStatus(sellerId, "ACTIVE");
};

// GET BIKE BY ID
export const getBikeById = async (bikeId) => {
  const res = await apiClient.get(`/bikes/get/${bikeId}`);
  return res.data;
};

// EDIT bike
export const updateBike = async (bikeId, payload) => {
  const res = await apiClient.patch(`/bikes/patch/${bikeId}`, payload);
  return res.data;
};

// Update status specifically
export const updateBikeStatus = async (bikeId, status) => {
  return updateBike(bikeId, { status });
};

// Alternative: If your backend expects full object update (PUT instead of PATCH)
export const updateBikeFull = async (bikeId, payload) => {
  const res = await apiClient.put(`/bikes/put/${bikeId}`, payload);
  return res.data;
};

// DELETE bike
export const deleteBike = async (bikeId) => {
  const res = await apiClient.delete(`/bikes/delete/${bikeId}`);
  return res.data;
};

// GET ALL BIKES (for buyers) – show only ACTIVE bikes on client side
export const getAllBikes = async () => {
  const res = await apiClient.get("/bikes/get");
  const list = Array.isArray(res.data) ? res.data : [];
  return list.filter(
    (bike) => (bike.status || "").toString().toUpperCase() === "ACTIVE"
  );
};

// Fallback: Fetch ALL bikes and filter by seller client-side
// This is robust against 400 errors on specific status endpoints
export const getSellerBikesRaw = async (sellerId) => {
  const res = await apiClient.get("/bikes/get");
  const allBikes = Array.isArray(res.data) ? res.data : [];
  // Filter by sellerId (ensure type match)
  return allBikes.filter(b => Number(b.sellerId) === Number(sellerId));
};
