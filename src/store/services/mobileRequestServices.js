import apiClient from "./apiClient";

export const postMobileRequestMessage = async (requestId, payload) => {
  const response = await apiClient.post(
    `/api/v1/mobile/requests/${requestId}/message`,
    payload
  );
  return response.data;
};

export const completeMobileRequest = async (requestId, payload) => {
  const response = await apiClient.post(
    `/api/v1/mobile/requests/${requestId}/complete`,
    payload
  );
  return response.data;
};

export const createMobileRequest = async (payload) => {
  const response = await apiClient.post("/api/v1/mobile/requests/create", payload);
  return response.data;
};

export const updateMobileRequestStatus = async (requestId, payload) => {
  const response = await apiClient.patch(
    `/api/v1/mobile/requests/${requestId}/status`,
    payload
  );
  return response.data;
};

export const getMobileRequestsByMobile = async (mobileId) => {
  const response = await apiClient.get(
    `/api/v1/mobile/requests/mobile/${mobileId}`
  );
  return response.data;
};

export const getMobileRequestsByBuyer = async (buyerId) => {
  const response = await apiClient.get(
    `/api/v1/mobile/requests/buyer/${buyerId}`
  );
  return response.data;
};

export const getMobileRequestsBySeller = async (sellerId) => {
  const response = await apiClient.get(
    `/api/v1/mobile/requests/seller/${sellerId}`
  );
  return response.data;
};


