import React, { useState, useEffect } from "react";
import { useLiveAuction } from "../../socketio/useLiveAuction";
import LiveProductCard from "./LiveProductCard";
import { MdDirectionsCar, MdTwoWheeler, MdPhoneIphone, MdLaptop } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";

/**
 * Live Products Section Component
 * Displays live auction products organized by category
 */
export default function LiveProductsSection() {
  const { roles } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  
  // Check if user is seller
  const isSeller = roles && roles.includes("SELLER") && !roles.includes("BUYER");

  const categories = [
    { id: "ALL", label: "All Products", icon: null },
    { id: "CAR", label: "Cars", icon: <MdDirectionsCar /> },
    { id: "BIKE", label: "Bikes", icon: <MdTwoWheeler /> },
    { id: "MOBILE", label: "Mobiles", icon: <MdPhoneIphone /> },
    { id: "LAPTOP", label: "Laptops", icon: <MdLaptop /> },
  ];

  // Use live auction hook for each category
  const carAuction = useLiveAuction("CAR");
  const bikeAuction = useLiveAuction("BIKE");
  const mobileAuction = useLiveAuction("MOBILE");
  const laptopAuction = useLiveAuction("LAPTOP");

  // Get products based on selected category
  const getProducts = () => {
    switch (selectedCategory) {
      case "CAR":
        return carAuction.liveProducts;
      case "BIKE":
        return bikeAuction.liveProducts;
      case "MOBILE":
        return mobileAuction.liveProducts;
      case "LAPTOP":
        return laptopAuction.liveProducts;
      default:
        return [
          ...carAuction.liveProducts,
          ...bikeAuction.liveProducts,
          ...mobileAuction.liveProducts,
          ...laptopAuction.liveProducts,
        ];
    }
  };

  // Get place bid function based on category
  const getPlaceBidFunction = (productType) => {
    switch (productType) {
      case "CAR":
        return carAuction.placeBid;
      case "BIKE":
        return bikeAuction.placeBid;
      case "MOBILE":
        return mobileAuction.placeBid;
      case "LAPTOP":
        return laptopAuction.placeBid;
      default:
        return () => {};
    }
  };

  // Get top bids function based on category
  const getTopBidsFunction = (productType) => {
    switch (productType) {
      case "CAR":
        return carAuction.getTopBids;
      case "BIKE":
        return bikeAuction.getTopBids;
      case "MOBILE":
        return mobileAuction.getTopBids;
      case "LAPTOP":
        return laptopAuction.getTopBids;
      default:
        return () => [];
    }
  };

  // Get winner function based on category
  const getWinnerFunction = (productType) => {
    switch (productType) {
      case "CAR":
        return carAuction.getWinner;
      case "BIKE":
        return bikeAuction.getWinner;
      case "MOBILE":
        return mobileAuction.getWinner;
      case "LAPTOP":
        return laptopAuction.getWinner;
      default:
        return () => null;
    }
  };

  // Determine product type from product object
  const getProductType = (product) => {
    if (product.carId) return "CAR";
    if (product.bike_id || product.bikeId) return "BIKE";
    if (product.mobileId) return "MOBILE";
    if (product.laptopId) return "LAPTOP";
    return product.productType || "ALL";
  };

  // Get product ID
  const getProductId = (product) => {
    if (product.carId) return product.carId;
    if (product.bike_id || product.bikeId) return product.bike_id || product.bikeId;
    if (product.mobileId) return product.mobileId;
    if (product.laptopId) return product.laptopId;
    return product.id;
  };

  const products = getProducts();
  const isLoading =
    carAuction.loading ||
    bikeAuction.loading ||
    mobileAuction.loading ||
    laptopAuction.loading;
  const isConnected =
    carAuction.connected ||
    bikeAuction.connected ||
    mobileAuction.connected ||
    laptopAuction.connected;

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          🔴 Live Auctions
        </h2>
        <p className="text-gray-600">
          Bid on live products in real-time. Watch top bids and winners!
        </p>
      </div>

      {/* Connection Status */}
      <div className="mb-4">
        {isConnected ? (
          <div className="flex items-center gap-2 text-green-600">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-semibold">Connected to Live Auctions</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-orange-600">
            <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
            <span className="text-sm font-semibold">
              {isLoading ? "Connecting to Live Auctions..." : "Live Auctions Unavailable (Backend may not be running)"}
            </span>
          </div>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-3 mb-6">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg font-semibold transition-all ${
              selectedCategory === category.id
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {category.icon && <span>{category.icon}</span>}
            {category.label}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Products Grid */}
      {!isLoading && products.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-xl text-gray-600 mb-2">No live auctions at the moment</p>
          <p className="text-sm text-gray-500">
            Check back later for exciting auction opportunities!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const productType = getProductType(product);
            const productId = getProductId(product);
            const topBids = getTopBidsFunction(productType)(productId);
            const winner = getWinnerFunction(productType)(productId);

            return (
              <LiveProductCard
                key={`${productType}-${productId}`}
                product={product}
                productType={productType}
                onPlaceBid={getPlaceBidFunction(productType)}
                topBids={topBids}
                winner={winner}
                isSeller={isSeller}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

