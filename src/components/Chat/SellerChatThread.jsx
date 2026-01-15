import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import SellerChatModal from "../../components/Chat/SellerChatModal";

const SellerChatThread = ({
  bookingId: propBookingId,
  chatType: propChatType,
  chatTitle: propChatTitle,
  chatSubtitle: propCbSubtitle,
  onBack,
  bookingStatus,
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const bookingId = propBookingId || id;
  const chatType = propChatType || location.state?.chatType || "CAR";
  const chatTitle = propChatTitle || location.state?.chatTitle || "";
  const chatSubtitle = propCbSubtitle || location.state?.chatSubtitle || "";

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate("/seller/chat", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* HEADER */}
      <div className="bg-white border-b border-border px-4 py-3 flex items-center relative z-50">
        <button onClick={handleBack} className="mr-4 p-2" type="button">
          <MdArrowBack className="text-2xl text-text-primary" />
        </button>

        <div>
          <h1 className="text-xl font-bold text-text-primary">
            {chatTitle || "Chat"}
          </h1>
          {chatSubtitle && (
            <p className="text-sm text-text-secondary">{chatSubtitle}</p>
          )}
        </div>
      </div>

      {/* SELLER CHAT MODAL */}
      <SellerChatModal
        isOpen={true}                 // Always open in thread view
        onClose={handleBack}          // Back = close thread
        bookingId={bookingId}
        sellerId={Number(localStorage.getItem("sellerId"))}
        chatType={chatType}
        bookingStatus={bookingStatus}
        buyerId={location.state?.buyerId} // optional: if you want buyer context
      />
    </div>
  );
};

export default SellerChatThread;
