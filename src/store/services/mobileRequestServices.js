import apiClient from "./apiClient";

/**
 * Create a new mobile request (Buyer sends request)
 * POST /api/v1/mobile/requests/create
 * Status: PENDING
 */
export const createMobileRequest = async (payload) => {
  const response = await apiClient.post("/api/v1/mobile/requests/create", payload);
  return response.data;
};

/**
 * Accept request (Seller accepts - changes status to IN_NEGOTIATION)
 * POST /api/v1/mobile/requests/{requestId}/accept
 * Status: PENDING -> IN_NEGOTIATION (Socket.IO activates here)
 */
export const acceptMobileRequest = async (requestId) => {
  const response = await apiClient.post(
    `/api/v1/mobile/requests/${requestId}/accept`
  );
  return response.data;
};

/**
 * Reject request (Seller rejects - no chat allowed)
 * POST /api/v1/mobile/requests/{requestId}/reject
 * Status: PENDING/IN_NEGOTIATION -> REJECTED
 */
export const rejectMobileRequest = async (requestId) => {
  const response = await apiClient.post(
    `/api/v1/mobile/requests/${requestId}/reject`
  );
  return response.data;
};

/**
 * Complete request (Deal completed)
 * POST /api/v1/mobile/requests/{requestId}/complete
 * Status: IN_NEGOTIATION -> COMPLETED
 */
export const completeMobileRequest = async (requestId) => {
  const response = await apiClient.post(
    `/api/v1/mobile/requests/${requestId}/complete`
  );
  return response.data;
};

/**
 * Send message via HTTP (fallback when Socket.IO not available)
 * POST /api/v1/mobile/requests/{requestId}/message
 * Note: Only works when status is IN_NEGOTIATION
 */
export const postMobileRequestMessage = async (requestId, payload) => {
  const response = await apiClient.post(
    `/api/v1/mobile/requests/${requestId}/message?senderUserId=${payload.senderUserId}&message=${encodeURIComponent(payload.message)}`
  );
  return response.data;
};

/**
 * Get requests for a specific mobile
 */
export const getMobileRequestsByMobile = async (mobileId) => {
  const response = await apiClient.get(
    `/api/v1/mobile/requests/${mobileId}`
  );
  return response.data;
};

/**
 * Get all requests by buyer
 */
export const getMobileRequestsByBuyer = async (buyerId) => {
  const response = await apiClient.get(
    `/api/v1/mobile/requests/buyer/${buyerId}`
  );
  return response.data;
};

/**
 * Get all requests by seller
 */
export const getMobileRequestsBySeller = async (sellerId) => {
  const response = await apiClient.get(
    `/api/v1/mobile/requests/seller/${sellerId}`
  );
  return response.data;
};

/**
 * Get chat history via HTTP API
 * GET /api/chat/{requestId}
 */
export const getMobileChatHistory = async (requestId) => {
  const response = await apiClient.get(`/api/chat/${requestId}`);
  return response.data;
};


