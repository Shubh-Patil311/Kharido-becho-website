import React, { useEffect, useRef, useState } from "react";
import { MdClose } from "react-icons/md";

// ✅ Seller hook
import useChatSeller from "../../hook/useChatSeller";
import { bookingStatuses, statusStyles } from "../../constants/bookingConstants";

const SellerChatModal = ({
  isOpen,
  onClose,
  bookingId,
  chatType = "BIKE",
  bookingStatus,
}) => {
  const [inputValue, setInputValue] = useState("");

  // 🔥 Seller chat hook
  const { messages, loading, sending, error, sendMessage, acceptBooking, rejectBooking } =
    useChatSeller(bookingId);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    try {
      await sendMessage(inputValue); // seller handled inside hook
      setInputValue("");
    } catch (err) {
      console.error("Seller send failed:", err);
    }
  };

  const handleAccept = async () => {
    if (window.confirm("Are you sure you want to accept this booking?")) {
      await acceptBooking();
      onClose();
    }
  };

  const handleReject = async () => {
    if (window.confirm("Are you sure you want to reject this booking?")) {
      await rejectBooking();
      onClose();
    }
  };
  // console.log(messages, "MESSAGES ====");
  console.log(bookingStatus, "aaaaaaaa Booking ");

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      {/* 
        Responsive Container:
        - Mobile: w-full h-full rounded-none
        - Tablet/Desktop: max-w-lg w-full h-[85vh] rounded-2xl shadow-2xl
      */}
      <div className="bg-white w-full h-full sm:h-[85vh] sm:max-w-lg sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300">

        {/* HEADER */}
        <div className="bg-white px-4 py-4 border-b flex items-center justify-between shadow-sm z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Chat</h2>
            <p className="text-xs text-gray-500">Booking ID: {bookingId}</p>
          </div>
          <div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border ${statusStyles[bookingStatus] ||
                "bg-gray-100 text-gray-600 border-gray-200 capitalize"
                }`}
            >
              {bookingStatuses[bookingStatus] || bookingStatus || "Unknown"}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
          >
            <MdClose size={24} />
          </button>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300">

          {loading && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
            </div>
          )}

          {!loading && (messages || []).length === 0 && (
            <div className="text-center text-gray-400 py-10 text-sm">
              No messages yet. Start the conversation!
            </div>
          )}

          {(messages || []).map((msg, i) => {
            const isMe = msg.senderType === "SELLER";
            return (
              <div key={i} className={`flex ${isMe ? "justify-end" : "justify-start"} animate-fadeIn`}>
                <div
                  className={`px-4 py-2.5 rounded-2xl text-[15px] leading-relaxed max-w-[80%] shadow-sm
                    ${isMe
                      ? "bg-green-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"}
                  `}
                >
                  {msg?.content || msg?.content === "" ? msg.content : "Invalid message"}
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-xs px-4 py-2 text-center border-t border-red-100">
            Connection issue: {error}
          </div>
        )}

        {/* INPUT AREA */}
        <form
          onSubmit={handleSubmit}
          className="bg-white px-4 py-3 border-t flex gap-3 items-center"
        >
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 bg-gray-100 border-transparent focus:border-green-500 focus:bg-white focus:ring-0 rounded-full px-4 py-2.5 text-sm transition-all outline-none"
            placeholder="Type your message..."
          />
          <button
            disabled={sending || !inputValue.trim()}
            className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all transform active:scale-95
                ${sending || !inputValue.trim()
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg"}
            `}
          >
            {sending ? "..." : "Send"}
          </button>
        </form>

        {/* BOTTOM ACTIONS (Accept/Reject) */}
        <div className="bg-gray-50 px-4 py-3 border-t flex items-center justify-between gap-3">
          <button
            onClick={handleAccept}
            className="flex-1 bg-white border border-green-600 text-green-700 hover:bg-green-50 text-sm py-2.5 rounded-xl font-semibold transition-colors shadow-sm"
          >
            Accept Request
          </button>
          <button
            onClick={handleReject}
            className="flex-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-sm py-2.5 rounded-xl font-semibold transition-colors shadow-sm"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerChatModal;
