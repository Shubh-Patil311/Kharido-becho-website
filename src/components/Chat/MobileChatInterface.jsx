import React, { useEffect, useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";
import { useMobileSocketChat } from "../../socketio/useMobileSocketChat";
import { 
  acceptMobileRequest,
  rejectMobileRequest,
  completeMobileRequest
} from "../../store/services/mobileRequestServices";
import { bookingStatuses, statusStyles } from "../../constants/bookingConstants";

/**
 * Mobile Chat Interface Component
 * Uses Socket.IO for real-time messaging with ConversationMessageEntity structure
 */
const MobileChatInterface = ({
  requestId,
  senderType = "BUYER",
  bookingStatus,
  onClose,
  isEmbedded = false,
  useSocketIO = true,
  onStatusUpdate, // Callback to notify parent of status changes
}) => {
  const [inputValue, setInputValue] = useState("");
  const [status, setStatus] = useState(bookingStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  // Use Socket.IO chat hook for mobile
  const { messages, loading, sending, error, sendMessage, connected, requestStatus, refreshMessages } = 
    useMobileSocketChat(requestId, senderType);

  // Update status when bookingStatus or requestStatus changes
  useEffect(() => {
    const newStatus = bookingStatus || requestStatus;
    if (newStatus && newStatus !== status) {
      setStatus(newStatus);
    }
  }, [bookingStatus, requestStatus]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    try {
      await sendMessage(inputValue);
      setInputValue("");
    } catch (err) {
      console.error("Send failed:", err);
    }
  };

  // Accept request (Seller only) - Changes status to IN_NEGOTIATION
  const handleAccept = async () => {
    if (window.confirm("Are you sure you want to accept this request? This will enable chat.")) {
      try {
        setIsUpdating(true);
        const response = await acceptMobileRequest(Number(requestId));
        // Update status from API response
        const newStatus = response?.status || "IN_NEGOTIATION";
        setStatus(newStatus);
        toast.success("Request accepted! Chat is now enabled.");
        
        // Notify parent component of status change
        if (onStatusUpdate) {
          onStatusUpdate(newStatus);
        }
        
        // Refresh messages
        if (refreshMessages) {
          refreshMessages();
        }
        
        // Notify parent to refresh request list
        window.dispatchEvent(new Event("mobile-request-updated"));
      } catch (err) {
        const errorMsg = err?.response?.data?.message || err?.message || "Failed to accept request";
        toast.error(errorMsg);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  // Reject request (Seller only) - No chat allowed after rejection
  const handleReject = async () => {
    if (window.confirm("Are you sure you want to reject this request? Chat will be disabled.")) {
      try {
        setIsUpdating(true);
        const response = await rejectMobileRequest(Number(requestId));
        // Update status from API response
        const newStatus = response?.status || "REJECTED";
        setStatus(newStatus);
        toast.success("Request rejected");
        
        // Notify parent component of status change
        if (onStatusUpdate) {
          onStatusUpdate(newStatus);
        }
        
        // Notify parent to refresh request list
        window.dispatchEvent(new Event("mobile-request-updated"));
      } catch (err) {
        const errorMsg = err?.response?.data?.message || err?.message || "Failed to reject request";
        toast.error(errorMsg);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  // Complete request (Seller only) - Deal completed
  const handleComplete = async () => {
    if (window.confirm("Mark this deal as completed?")) {
      try {
        setIsUpdating(true);
        await completeMobileRequest(Number(requestId));
        const newStatus = "COMPLETED";
        setStatus(newStatus);
        toast.success("Deal completed successfully!");
        
        // Notify parent component of status change
        if (onStatusUpdate) {
          onStatusUpdate(newStatus);
        }
        
        // Notify parent to refresh request list
        window.dispatchEvent(new Event("mobile-request-updated"));
      } catch (err) {
        const errorMsg = err?.response?.data?.message || err?.message || "Failed to complete request";
        toast.error(errorMsg);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  return (
    <div className={`flex flex-col h-full bg-white ${!isEmbedded ? "rounded-2xl shadow-2xl overflow-hidden" : ""}`}>
      {/* HEADER */}
      <div className="bg-white px-4 py-4 border-b flex items-center justify-between shadow-sm z-10">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Mobile Chat</h2>
          <p className="text-xs text-gray-500">Request ID: {requestId}</p>
          {useSocketIO && (
            <p className="text-xs text-gray-400 flex items-center gap-1">
              {connected ? (
                <>
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Real-time
                </>
              ) : (
                <>
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  API Mode
                </>
              )}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {senderType === "SELLER" && (
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border ${
                statusStyles[status] ||
                "bg-gray-100 text-gray-600 border-gray-200 capitalize"
              }`}
            >
              {bookingStatuses[status] || status || "Unknown"}
            </span>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
            >
              <MdClose size={24} />
            </button>
          )}
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 min-h-[400px]">
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

        {(messages || []).map((msg) => {
          const isMe = msg.senderType === senderType;
          const messageKey = msg.messageId || msg.id || `msg-${msg.tempId}`;
          return (
            <div key={messageKey} className={`flex ${isMe ? "justify-end" : "justify-start"} animate-fadeIn`}>
              <div
                className={`px-4 py-2.5 rounded-2xl text-[15px] leading-relaxed max-w-[80%] shadow-sm
                  ${
                    isMe
                      ? "bg-green-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                  }
                  ${msg.optimistic ? "opacity-70" : ""}
                  ${msg.failed ? "opacity-50 border-red-300" : ""}
                `}
              >
                {msg?.content || msg?.content === "" ? msg.content : "Invalid message"}
                {msg.optimistic && (
                  <span className="ml-2 text-xs opacity-60">⏳</span>
                )}
                {msg.failed && (
                  <span className="ml-2 text-xs opacity-60">⚠️</span>
                )}
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
      {/* Chat only allowed when status is IN_NEGOTIATION */}
      {status !== "IN_NEGOTIATION" ? (
        <div className="bg-gray-100 px-4 py-4 border-t flex items-center justify-center">
          <p className={`text-sm font-bold ${
            status === "COMPLETED"
              ? "text-green-600"
              : status === "REJECTED"
              ? "text-red-600"
              : "text-orange-600"
          }`}>
            {status === "COMPLETED"
              ? "Deal completed successfully!"
              : status === "REJECTED"
              ? "This request has been rejected. Chat is not available."
              : status === "PENDING"
              ? "Waiting for seller to accept the request. Chat will be enabled once accepted."
              : "Chat is not available for this request."}
          </p>
        </div>
      ) : (
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
              ${
                sending || !inputValue.trim()
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg"
              }
            `}
          >
            {sending ? "..." : "Send"}
          </button>
        </form>
      )}

      {/* BOTTOM ACTIONS (Accept/Reject/Complete) - Seller only */}
      {senderType === "SELLER" && (
        <div className="bg-gray-50 px-4 py-3 border-t">
          {status === "PENDING" && (
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={handleAccept}
                disabled={isUpdating}
                className={`flex-1 bg-white border border-green-600 text-green-700 hover:bg-green-50 text-sm py-2.5 rounded-xl font-semibold transition-colors shadow-sm ${
                  isUpdating ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isUpdating ? "Accepting..." : "Accept Request (Enable Chat)"}
              </button>
              <button
                onClick={handleReject}
                disabled={isUpdating}
                className={`flex-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-sm py-2.5 rounded-xl font-semibold transition-colors shadow-sm ${
                  isUpdating ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isUpdating ? "Rejecting..." : "Reject"}
              </button>
            </div>
          )}
          {status === "IN_NEGOTIATION" && (
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={handleComplete}
                disabled={isUpdating}
                className={`flex-1 bg-green-600 text-white hover:bg-green-700 text-sm py-2.5 rounded-xl font-semibold transition-colors shadow-sm ${
                  isUpdating ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isUpdating ? "Completing..." : "Complete Deal"}
              </button>
              <button
                onClick={handleReject}
                disabled={isUpdating}
                className={`flex-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-sm py-2.5 rounded-xl font-semibold transition-colors shadow-sm ${
                  isUpdating ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isUpdating ? "Rejecting..." : "Reject"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MobileChatInterface;
