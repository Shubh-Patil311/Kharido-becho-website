import React from "react";
import { MdArrowBack } from "react-icons/md";
import ChatModal from "../../components/Chat/ChatModal";

const BuyerChatThread = ({
  bookingId,
  chatType = "CAR",
  chatTitle,
  chatSubtitle,
  onBack,
}) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* HEADER */}
      <div className="bg-white border-b border-border px-4 py-3 flex items-center relative z-50">
        <button onClick={onBack} className="mr-4 p-2" type="button">
          <MdArrowBack className="text-2xl text-text-primary" />
        </button>

        <h1 className="text-xl font-bold text-text-primary">Chat</h1>
      </div>

      {/* CHAT */}
      <ChatModal
        isOpen={true} // Always open in thread view
        onClose={onBack} // Close maps to back
        bookingId={bookingId}
        senderType="BUYER"
        chatType={chatType}
        chatTitle={chatTitle}
        chatSubtitle={chatSubtitle}
      />
    </div>
  );
};

export default BuyerChatThread;
