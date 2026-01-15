// import apiClient from "./apiClient";

// export const addCar = async (payload) => {
//   const response = await apiClient.post("/api/v1/cars/add", payload);
//   return response.data;
// };

// export const updateCar = async (id, payload) => {
//   const response = await apiClient.patch(`/api/v1/cars/update/${id}`, payload);
//   return response.data;
// };

// export const getCarById = async (id) => {
//   const response = await apiClient.get(`/api/v1/cars/${id}`);
//   return response.data;
// };

// export const getAllCars = async () => {
//   const response = await apiClient.get("/api/v1/cars/getAllCars");
//   return response.data;
// };

// export const deleteCar = async (id) => {
//   const response = await apiClient.delete(`/api/v1/cars/delete/${id}`);
//   return response.data;
// };

// export const getCarsBySeller = async (sellerId) => {
//   const res = await apiClient.get(`/api/v1/cars/${sellerId}`);
//   return Array.isArray(res.data) ? res.data : [];
// };
import apiClient from "./apiClient";

// CREATE CAR
export const addCar = async (payload) => {
  const response = await apiClient.post("/api/v1/cars/add", payload);
  return response.data; // -> CarCreateResponseDTO { code, message, carId }
};

// UPDATE CAR
export const updateCar = async (id, payload) => {
  const response = await apiClient.patch(`/api/v1/cars/update/${id}`, payload);
  return response.data; // -> CarResponseDTO
};

// GET CAR BY ID
export const getCarById = async (id) => {
  const response = await apiClient.get(`/api/v1/cars/${id}`);
  return response.data; // -> CarResponseDTO
};

// GET ALL CARS (for buyer pages)
// export const getAllCars = async (page = 0, size = 20) => {
//   const response = await apiClient.get(
//     `/api/v1/cars/getAllCars?page=${page}&size=${size}`
//   );
//   return response.data?.content || []; // return only list
// };
export const getAllCars = async (page = 0, size = 50) => {
  const response = await apiClient.get("/api/v1/cars/getAllCars", {
    params: { page, size },
  });

  return response.data.content || [];
};

// GET CARS BY SELLER
export const getCarsBySeller = async (sellerId, page = 0, size = 20) => {
  const response = await apiClient.get(
    `/api/v1/cars/getAllCars?page=${page}&size=${size}&sellerId=${sellerId}`
  );
  return response.data?.content || [];
};

// GET CARS BY STATUS
export const getCarsByStatus = async (sellerId, status, page = 0, size = 50) => {
  // Attempting to use the same pattern as getAllCars but with status
  const response = await apiClient.get(
    `/api/v1/cars/getAllCars?page=${page}&size=${size}&sellerId=${sellerId}&status=${status}`
  );
  return response.data?.content || [];
};

// DELETE CAR (soft delete)
export const deleteCar = async (id) => {
  const response = await apiClient.delete(`/api/v1/cars/delete/${id}`);
  return response.data;
};
