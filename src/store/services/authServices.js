import apiClient from "./apiClient";

/* ======================================================
   1. LOGIN USER
   ====================================================== */
export const loginUser = async (credentials) => {
  const response = await apiClient.post("/jwt/login", credentials, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

/* ======================================================
   2. REGISTER USER
   ====================================================== */
export const registerUser = async (payload) => {
  const response = await apiClient.post("/api/v1/users/register", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

/* ======================================================
   3. FETCH BUYER INFO
   ====================================================== */
export const fetchBuyerInfo = async (userId) => {
  const response = await apiClient.get(`/api/v1/buyers/${userId}`);
  return response.data;
};

/* ======================================================
   4. FETCH SELLER INFO
   ====================================================== */
export const fetchSellerInfo = async (userId) => {
  const response = await apiClient.get(`/api/v1/sellers/${userId}`);
  return response.data;
};

/* ======================================================
   5. SEND FORGOT PASSWORD EMAIL
   ====================================================== */
export const sendForgotPasswordEmail = async (email) => {
  const response = await apiClient.post(
    `/api/v1/users/password/forgot?email=${email}`
  );
  return response.data;
};

/* ======================================================
   6. VERIFY RESET TOKEN (GET)
   ====================================================== */
export const verifyResetToken = async (token) => {
  const response = await apiClient.get(
    `/api/v1/users/password/reset?token=${token}`
  );
  return response.data;
};

/* ======================================================
   7. RESET PASSWORD (POST)
   ====================================================== */
export const resetPassword = async (payload) => {
  const response = await apiClient.post(
    "/api/v1/users/password/reset",
    payload,
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data;
};

export const logoutUser = async () => {
  const response = await apiClient.post("/api/v1/auth/logout");
  return response.data;
};
