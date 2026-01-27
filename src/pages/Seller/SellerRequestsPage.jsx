import React, { useState, useEffect } from "react";

import SellerBikeRequests from "../../components/Bike/SellerBikeRequests";
import SellerCarRequest from "../../components/Car/seller/SellerCarRequest";
import SellerLaptopRequests from "../../components/Laptop/SellerLaptopRequests";
import SellerMobileRequestList from "../../components/Mobile/Seller/SellerMobileRequestList";
import SellerChatInterface from "../../components/Chat/SellerChatInterface";
import MobileChatInterface from "../../components/Chat/MobileChatInterface";

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

              <div className="max-h-[calc(100vh-320px)] overflow-y-auto custom-scrollbar">
                {activeProduct === "car" && (
                  <SellerCarRequest
                    onSelect={setSelectedBooking}
                    selectedId={selectedBooking?.bookingId}
                  />
                )}
                {activeProduct === "bike" && (
                  <SellerBikeRequests
                    onSelect={setSelectedBooking}
                    selectedId={selectedBooking?.bookingId}
                  />
                )}
                {activeProduct === "laptop" && (
                  <SellerLaptopRequests
                    onSelect={setSelectedBooking}
                    selectedId={selectedBooking?.bookingId}
                  />
                )}
                {activeProduct === "mobile" && (
                  <SellerMobileRequestList
                    onSelect={setSelectedBooking}
                    selectedId={selectedBooking?.bookingId}
                  />
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: CHAT */}
          <div className={`lg:col-span-7 xl:col-span-8 sticky top-[16rem] md:top-[12.5rem] lg:top-[14rem] h-[calc(100vh-240px)] ${!selectedBooking ? 'hidden lg:flex' : 'flex'} flex-col`}>
            {selectedBooking ? (
              <div className="flex-1 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden flex flex-col">
                {activeProduct === "mobile" ? (
                  <MobileChatInterface
                    requestId={selectedBooking.bookingId}
                    senderType="SELLER"
                    bookingStatus={selectedBooking.status}
                    onClose={() => setSelectedBooking(null)}
                    isEmbedded={true}
                    useSocketIO={true}
                    onStatusUpdate={(newStatus) => {
                      // Update the selected booking status
                      setSelectedBooking(prev => prev ? { ...prev, status: newStatus } : null);
                    }}
                  />
                ) : (
                  <SellerChatInterface
                    bookingId={selectedBooking.bookingId}
                    chatType={activeProduct.toUpperCase()}
                    bookingStatus={selectedBooking.status}
                    onClose={() => setSelectedBooking(null)}
                    isEmbedded={true}
                  />
                )}
              </div>
            ) : (
              <div className="flex-1 bg-white rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-12 text-center text-gray-400">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-600 mb-2">Select a Request</h3>
                <p className="max-w-xs text-sm">
                  Click on any request on the left to view the details and start chatting with the buyer.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerRequestsPage;
