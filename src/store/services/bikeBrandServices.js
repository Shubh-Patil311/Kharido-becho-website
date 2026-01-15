import apiClient from "./apiClient";

// 📌 GET ONLY BRANDS
export const getBikeBrands = async () => {
  const res = await apiClient.get("/bikes/brands/brands/Only-brands");
  return res.data;
};

// 📌 GET MODELS BY BRAND (Query Param)
export const getBikeModels = async (brand) => {
  const res = await apiClient.get("/bikes/brands/models", {
    params: { brand },
  });
  return res.data;
};

// 📌 GET VARIANTS BY BRAND + MODEL (Query Params)
export const getBikeVariants = async (brand, model) => {
  const res = await apiClient.get("/bikes/brands/variants", {
    params: { brand, model },
  });
  return res.data;
};



// 🔧 Get Engine CC by Brand, Model, Variant
export const getBikeEngineCC = async (brand, model, variant) => {
  const response = await apiClient.get(
    `/bikes/brands/engine-cc`,
    {
      params: { brand, model, variant },
    }
  );
  return response.data;
};

// 📌 GET STATES
export const getLocationStates = async () => {
  const res = await apiClient.get("/bikes/location/states");
  return res.data;
};

// 📌 GET CITIES BY STATE
export const getLocationCities = async (state) => {
  const res = await apiClient.get("/bikes/location/cities", {
    params: { state },
  });
  return res.data;
};

// 📌 GET LOCALITIES BY STATE + CITY
export const getLocationLocalities = async (state, city) => {
  const res = await apiClient.get("/bikes/location/localities", {
    params: { state, city },
  });
  return res.data;
};
