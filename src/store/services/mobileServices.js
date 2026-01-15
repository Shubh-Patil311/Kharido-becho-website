
import apiClient from "./apiClient";

/* -----------------------------------------
   CREATE MOBILE
------------------------------------------ */
export const addMobile = async (payload) => {
  const res = await apiClient.post("/api/v1/mobiles/add", payload);
  return res.data;
};

/* -----------------------------------------
   UPDATE MOBILE
------------------------------------------ */
export const updateMobile = async (id, payload) => {
  const res = await apiClient.patch(`/api/v1/mobiles/update/${id}`, payload);
  return res.data;
};

/* -----------------------------------------
   GET MOBILE BY ID
------------------------------------------ */
export const getMobileById = async (id) => {
  const res = await apiClient.get(`/api/v1/mobiles/${id}`);
  return res.data;
};

/* -----------------------------------------
   GET ALL MOBILES (Client listing)
------------------------------------------ */
// export const getAllMobiles = async (page = 0, size = 100) => {
//   const res = await apiClient.get(
//     `/api/v1/mobiles/getAllMobiles?page=${page}&size=${size}`
//   );

//   return res.data?.content || [];
// };
export const getAllMobiles = async (page = 0, size = 100) => {
  const res = await apiClient.get(
    `/api/v1/mobiles/getAllMobiles?page=${page}&size=${size}`
  );
  return res.data?.content || [];
};

/* -----------------------------------------
   GET MOBILES BY SELLER (Dashboard)
------------------------------------------ */
export const getMobilesBySeller = async (sellerId) => {
  const res = await apiClient.get(
    `/api/v1/mobiles/getAllMobiles?sellerId=${sellerId}&page=0&size=100`
  );

  return res.data?.content || [];
};

export const getMobilesByStatus = async (sellerId, status) => {
  const res = await apiClient.get(
    `/api/v1/mobiles/getAllMobiles?sellerId=${sellerId}&status=${status}&page=0&size=100`
  );

  return res.data?.content || [];
};

/* -----------------------------------------
   DELETE MOBILE
------------------------------------------ */
export const deleteMobile = async (id) => {
  const res = await apiClient.delete(`/api/v1/mobiles/delete/${id}`);
  return res.data;
};
