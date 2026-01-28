import apiClient from "./apiClient";

/**
 * Get all live auction products
 */
export const getLiveProducts = async (productType = null) => {
  const params = productType ? { productType } : {};
  const response = await apiClient.get("/api/v1/auctions/live", { params });
  return response.data || [];
};

/**
 * Get live product by ID
 */
export const getLiveProductById = async (productId, productType) => {
  const response = await apiClient.get(
    `/api/v1/auctions/live/${productId}`,
    { params: { productType } }
  );
  return response.data;
};

/**
 * Place a bid on a live product
 */
export const placeBid = async (productId, productType, bidAmount) => {
  const buyerId = localStorage.getItem("buyerUserId") || localStorage.getItem("userId");
  
  const response = await apiClient.post("/api/v1/auctions/bid", {
    productId,
    productType,
    buyerId: Number(buyerId),
    bidAmount: Number(bidAmount),
  });
  return response.data;
};

/**
 * Get top bids for a product
 */
export const getTopBids = async (productId, productType, limit = 3) => {
  const response = await apiClient.get(
    `/api/v1/auctions/bids/top/${productId}`,
    { params: { productType, limit } }
  );
  return response.data || [];
};

/**
 * Get auction winner
 */
export const getAuctionWinner = async (productId, productType) => {
  const response = await apiClient.get(
    `/api/v1/auctions/winner/${productId}`,
    { params: { productType } }
  );
  return response.data;
};

/**
 * Set product as live auction
 */
export const setProductLive = async (productId, productType, auctionData) => {
  const response = await apiClient.post("/api/v1/auctions/set-live", {
    productId,
    productType,
    ...auctionData,
  });
  return response.data;
};

