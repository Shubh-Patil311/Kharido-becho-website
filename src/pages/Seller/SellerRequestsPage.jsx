import React, { useState } from "react";

import SellerBikeRequests from "../../components/Bike/SellerBikeRequests";
import SellerCarRequest from "../../components/Car/seller/SellerCarRequest";
import SellerLaptopRequests from "../../components/Laptop/SellerLaptopRequests";
import SellerMobileRequestList from "../../components/Mobile/Seller/SellerMobileRequestList";
<<<<<<< Updated upstream
=======
import SellerChatInterface from "../../components/Chat/SellerChatInterface";
import MobileChatInterface from "../../components/Chat/MobileChatInterface";
>>>>>>> Stashed changes

const SellerRequestsPage = () => {
  const [activeProduct, setActiveProduct] = useState("bike");

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
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-4">SELLER REQUESTS</h1>

      {/* Product Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${activeProduct === "car"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700"
            }`}
          onClick={() => setActiveProduct("car")}
        >
          Car
        </button>

        <button
          className={`px-4 py-2 rounded ${activeProduct === "bike"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700"
            }`}
          onClick={() => setActiveProduct("bike")}
        >
          Bike
        </button>

        <button
          className={`px-4 py-2 rounded ${activeProduct === "laptop"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700"
            }`}
          onClick={() => setActiveProduct("laptop")}
        >
          Laptop
        </button>

        <button
          className={`px-4 py-2 rounded ${activeProduct === "mobile"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700"
            }`}
          onClick={() => setActiveProduct("mobile")}
        >
          Mobile
        </button>
      </div>

      {/* Render Request Component Based on Active Product */}
      <div className="mt-4">
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

<<<<<<< Updated upstream
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
=======
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
>>>>>>> Stashed changes
      </div>
    </div>
  );
};

export default SellerRequestsPage;
