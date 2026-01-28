import React from "react";
import SellerChatInterface from "./SellerChatInterface";

const SellerChatModal = ({
  isOpen,
  onClose,
  bookingId,
  chatType = "BIKE",
  bookingStatus,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-0">
      <div className="bg-white w-full h-full sm:h-[85vh] sm:max-w-lg sm:rounded-2xl shadow-2xl overflow-hidden transition-all duration-300">
        <SellerChatInterface
          bookingId={bookingId}
          chatType={chatType}
          bookingStatus={bookingStatus}
          onClose={onClose}
        />
      </div>
    </div>
  );
};

export default SellerChatModal;
