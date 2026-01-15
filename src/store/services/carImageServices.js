import apiClient from "./apiClient";

// export const uploadCarImage = async (carId, file) => {
//   const formData = new FormData();
//   formData.append("files", file);

//   const response = await apiClient.post(
//     `/api/v1/car-images/${carId}/upload`,
//     formData,
//     {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     }
//   );

//   return response.data;
// };

export const uploadCarImage = async (carId, formData) => {
  const response = await apiClient.post(
    `/api/v1/car-images/${carId}/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const deleteCarImage = async (imageId) => {
  const response = await apiClient.delete(
    `/api/v1/car-images/delete/${imageId}`
  );
  return response.data;
};
