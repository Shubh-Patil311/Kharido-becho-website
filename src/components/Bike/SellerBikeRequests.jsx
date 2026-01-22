import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { getBikeBookingsForSeller } from "../../store/services/bikeBookingServices";
import { bookingStatuses, statusStyles } from "../../constants/bookingConstants";
import SellerChatModal from "../Chat/SellerChatModal";

const SellerChatList = ({ onSelect, selectedId }) => {
  const sellerId = Number(localStorage.getItem("sellerId"));

  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadPending = async () => {
      try {
        setLoading(true);

        const data = await getBikeBookingsForSeller(sellerId);

        const formatted = data.map((b) => ({
          bookingId: b.bookingId ?? b.id,
          title: `${b.bike?.brand || ""} ${b.bike?.model || ""}`.trim(),
          buyerName: `${b.buyer?.user?.firstName || ""} ${b.buyer?.user?.lastName || ""
            }`.trim(),
          status: b.status || b.bookingStatus || "PENDING",
        }));

        setChats(formatted);
      } catch (err) {
        console.error("Failed to load pending bike chats", err);
        toast.error("Failed to load pending bike chats");
      } finally {
        setLoading(false);
      }
    };

    if (sellerId) loadPending();
    else setLoading(false);
  }, [sellerId]);

  const openChat = (booking) => {
    if (onSelect) {
      onSelect(booking);
    } else {
      setSelectedBooking(booking);
      setIsModalOpen(true);
    }
  };

  const closeChat = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };
  return (
    <div className="min-h-screen ">
      <div className="bg-white border-b px-4 py-3">
        <h1 className="text-xl font-bold">PENDING BIKE REQUESTS</h1>
      </div>

      <div className="p-4">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : chats.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>No pending bike requests</p>
          </div>
        ) : (
          <div className="space-y-3">
            {chats.map((c) => (
              <div
                key={c.bookingId}
                onClick={() => openChat(c)}
                className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${selectedId === c.bookingId
                    ? "bg-blue-50 border-blue-500 shadow-md ring-1 ring-blue-500"
                    : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                  }`}
              >
                <div className="flex justify-between items-start">
                  <h2 className="font-semibold text-gray-900">{c.title}</h2>
                  {selectedId === c.bookingId && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Buyer: {c.buyerName}
                </p>
                <div className="mt-2 text-right">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusStyles[c.status] ||
                      "bg-gray-100 text-gray-600 border-gray-200"
                      }`}
                  >
                    {bookingStatuses[c.status] || c.status || "Unknown"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <SellerChatModal
          isOpen={isModalOpen}
          onClose={closeChat}
          bookingId={selectedBooking.bookingId}
          chatType="BIKE"
          bookingStatus={selectedBooking.status}
        />
      )}
    </div>
  );
};

export default SellerChatList;
