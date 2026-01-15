//
import apiClient from "./apiClient";

// ----------------------
// Helpers
// ----------------------
const extractList = (response) =>
  response?.data?.data?.content ||
  response?.data?.content ||
  response?.data?.data ||
  response?.data ||
  [];

const extractData = (response) => response?.data?.data || response?.data;

// ----------------------
// Laptops
// ----------------------
export const getAllLaptops = async () => {
  const res = await apiClient.get("/api/laptops/getAll");
  return extractList(res);
};

export const getLaptopsByStatus = async (sellerId, status) => {
  let page = 0;
  const size = 50;
  let all = [];
  let hasMore = true;

  while (hasMore) {
    const res = await apiClient.get("/api/laptops/getByDealerIdAndStatus", {
      params: { sellerId, status, page, size },
    });

    const data = extractList(res);
    all = all.concat(data);

    if (data.length < size) hasMore = false;
    else page++;
  }

  return all;
};

export const getLaptopById = async (id) => {
  const res = await apiClient.get("/api/laptops/getById", {
    params: { laptop_id: id },
  });
  return extractData(res);
};

export const createLaptop = async (payload) => {
  const res = await apiClient.post("/api/laptops/create", payload);
  return res.data;
};

export const updateLaptop = async (laptopId, payload) => {
  const res = await apiClient.patch("/api/laptops/update", payload, {
    params: { laptopId },
  });
  return res.data;
};

export const deleteLaptop = async (laptopId) => {
  const res = await apiClient.delete("/api/laptops/delete", {
    params: { laptopId },
  });
  return res.data;
};

// ----------------------
// Laptop Photos (Upload Only — Photos are loaded via getById)
// ----------------------
export const uploadLaptopPhotos = async (laptopId, files) => {
  const formData = new FormData();

  files.forEach((file) => formData.append("files", file));
  formData.append("laptopId", laptopId);

  const res = await apiClient.post("/api/laptop-photo/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

// import apiClient from "./apiClient";

// // ----------------------
// //  Base response helpers
// // ----------------------
// const extractList = (response) =>
//   response?.data?.data?.content ||
//   response?.data?.content ||
//   response?.data?.data ||
//   response?.data ||
//   [];

// const extractData = (response) => response?.data?.data || response?.data;

// // ----------------------
// //  GET LAPTOPS
// // ----------------------
// export const getAllLaptops = async () => {
//   const res = await apiClient.get("/api/laptops/getAll");
//   return extractList(res);
// };

// export const getLaptopsByStatus = async (sellerId, status) => {
//   const res = await apiClient.get("/api/laptops/getByDealerIdAndStatus", {
//     params: { sellerId, status },
//   });
//   return extractList(res);
// };

// export const getLaptopById = async (id) => {
//   const res = await apiClient.get("/api/laptops/getById", {
//     params: { laptop_id: id },
//   });
//   return extractData(res);
// };

// // ----------------------
// //  CREATE / UPDATE / DELETE
// // ----------------------
// export const createLaptop = async (payload) => {
//   const res = await apiClient.post("/api/laptops/create", payload);
//   return res.data;
// };

// // alias for compatibility with your form
// export const addLaptop = createLaptop;

// export const updateLaptop = async (laptopId, payload) => {
//   const res = await apiClient.patch("/api/laptops/update", payload, {
//     params: { laptopId },
//   });
//   return res.data;
// };

// export const deleteLaptop = async (laptopId) => {
//   const res = await apiClient.delete("/api/laptops/delete", {
//     params: { laptopId },
//   });
//   return res.data;
// };

// // ----------------------
// //  IMAGE UPLOAD
// // ----------------------
// export const uploadLaptopPhoto = async (laptopId, file) => {
//   const formData = new FormData();
//   formData.append("files", file);
//   formData.append("laptopId", laptopId);

//   const res = await apiClient.post("/api/laptop-photo/upload", formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });

//   return res.data;
// };
