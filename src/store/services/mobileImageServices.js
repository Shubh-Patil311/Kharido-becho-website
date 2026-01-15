// src/store/services/mobileImageServices.js
import apiClient from "./apiClient";

// ➤ Upload Images for Mobile
export const uploadMobileImage = async (mobileId, formData) => {
  const response = await apiClient.post(
    `/api/v1/mobile-images/${mobileId}/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// ➤ Delete Mobile Image by Image ID
export const deleteMobileImage = async (imageId) => {
  const response = await apiClient.delete(
    `/api/v1/mobile-images/delete/${imageId}`
  );

  return response.data;
};
