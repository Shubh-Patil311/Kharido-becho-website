import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import MobileChatInterface from "../components/Chat/MobileChatInterface";

/**
 * Mobile Chat Page
 * For both buyer and seller mobile chat
 */
const MobileChat = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { roles } = useAuth();

  // Determine sender type based on user role
  const isSeller = roles && roles.includes("SELLER") && !roles.includes("BUYER");
  const senderType = isSeller ? "SELLER" : "BUYER";

  const handleBack = () => {
    if (isSeller) {
      navigate("/seller/requests", { replace: true });
    } else {
      navigate("/buyer/chat", { replace: true });
    }
  };

  if (!requestId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Invalid request ID</p>
          <button
            onClick={handleBack}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* HEADER */}
      <div className="bg-white border-b px-4 py-3 flex items-center relative z-50 shadow-sm">
        <button onClick={handleBack} className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors" type="button">
          <MdArrowBack className="text-2xl text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Mobile Chat</h1>
      </div>

      {/* CHAT INTERFACE */}
      <div className="flex-1 overflow-hidden">
        <MobileChatInterface
          requestId={requestId}
          senderType={senderType}
          onClose={handleBack}
          useSocketIO={true}
        />
      </div>
    </div>
  );
};

export default MobileChat;
