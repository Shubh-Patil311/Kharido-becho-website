import React, { useState } from "react";

import SellerBikeRequests from "../../components/Bike/SellerBikeRequests";
import SellerCarRequest from "../../components/Car/seller/SellerCarRequest";
import SellerLaptopRequests from "../../components/Laptop/SellerLaptopRequests";
import SellerMobileRequestList from "../../components/Mobile/Seller/SellerMobileRequestList";

const SellerRequestsPage = () => {
  const [activeProduct, setActiveProduct] = useState("bike");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-16 md:top-[4.5rem] lg:top-20 z-30 bg-gray-50 px-4 pt-4 shadow-sm transition-all duration-300">
        <h1 className="text-2xl font-bold mb-4">SELLER REQUESTS</h1>

        {/* Product Buttons */}
        <div className="flex gap-4 pb-4 border-b border-gray-200 overflow-x-auto whitespace-nowrap">
          <button
            className={`flex-shrink-0 px-4 py-2 rounded transition-colors duration-200 ${activeProduct === "car"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            onClick={() => setActiveProduct("car")}
          >
            Car
          </button>

          <button
            className={`flex-shrink-0 px-4 py-2 rounded transition-colors duration-200 ${activeProduct === "bike"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            onClick={() => setActiveProduct("bike")}
          >
            Bike
          </button>

          <button
            className={`flex-shrink-0 px-4 py-2 rounded transition-colors duration-200 ${activeProduct === "laptop"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            onClick={() => setActiveProduct("laptop")}
          >
            Laptop
          </button>

          <button
            className={`flex-shrink-0 px-4 py-2 rounded transition-colors duration-200 ${activeProduct === "mobile"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            onClick={() => setActiveProduct("mobile")}
          >
            Mobile
          </button>
        </div>
      </div>

      {/* Render Request Component Based on Active Product */}
      {/* Render Request Component Based on Active Product */}
      <div className="mt-4 p-4 pt-0 md:p-6 md:pt-0">
        {activeProduct === "car" && (
          <>
            <h2 className="text-xl font-semibold mb-4">Car Requests</h2>
            <SellerCarRequest />
          </>
        )}

        {activeProduct === "bike" && (
          <>
            <h2 className="text-xl font-semibold mb-4">Bike Requests</h2>
            <SellerBikeRequests />
          </>
        )}

        {activeProduct === "laptop" && (
          <>
            <h2 className="text-xl font-semibold mb-4">Laptop Requests</h2>
            <SellerLaptopRequests />
          </>
        )}

        {activeProduct === "mobile" && (
          <>
            <h2 className="text-xl font-semibold mb-4">Mobile Requests</h2>
            <SellerMobileRequestList />
          </>
        )}
      </div>
    </div>
  );
};

export default SellerRequestsPage;
