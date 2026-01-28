import React, { useState, useEffect } from "react";

import SellerBikeRequests from "../../components/Bike/SellerBikeRequests";
import SellerCarRequest from "../../components/Car/seller/SellerCarRequest";
import SellerLaptopRequests from "../../components/Laptop/SellerLaptopRequests";
import SellerMobileRequestList from "../../components/Mobile/Seller/SellerMobileRequestList";
 
 
 

const SellerRequestsPage = () => {
  const [activeProduct, setActiveProduct] = useState("bike");
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Reset selected booking when switching tabs or scroll to top on selection
  useEffect(() => {
    if (selectedBooking) {
      window.scrollTo(0, 0);
    }
  }, [selectedBooking]);

  useEffect(() => {
    setSelectedBooking(null);
  }, [activeProduct]);

  // Listen for mobile request updates
  useEffect(() => {
    const handleRequestUpdate = () => {
      // Refresh the selected booking if it's a mobile request
      if (activeProduct === "mobile" && selectedBooking) {
        // The SellerMobileRequestList will refresh automatically
        // We just need to update the selected booking status if needed
      }
    };

    window.addEventListener("mobile-request-updated", handleRequestUpdate);
    return () => {
      window.removeEventListener("mobile-request-updated", handleRequestUpdate);
    };
  }, [activeProduct, selectedBooking]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Group Title and Tabs in one sticky container */}
      <div className="sticky top-16 md:top-[4.5rem] lg:top-20 z-30 bg-gray-50 px-4 pt-4 shadow-sm transition-all duration-300">
        <h1 className="text-2xl font-bold mb-4">SELLER REQUESTS</h1>

        {/* Product Buttons */}
        <div className="flex gap-4 pb-4 border-b border-gray-200 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {["car", "bike", "laptop", "mobile"].map((type) => (
            <button
              key={type}
              className={`flex-shrink-0 px-6 py-2 rounded-full font-bold transition-all duration-200 ${activeProduct === type
                ? "bg-blue-600 text-white shadow-lg scale-105"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              onClick={() => setActiveProduct(type)}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 container mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT SIDE: LIST */}
          <div className={`lg:col-span-5 xl:col-span-4 space-y-4 ${selectedBooking ? 'hidden lg:block' : 'block'}`}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                <h2 className="font-bold text-gray-700 uppercase tracking-wider text-sm">
                  {activeProduct} Requests
                </h2>
              </div>
 
 
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
