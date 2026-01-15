import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  getLaptopBookingById,
  sendLaptopMessage,
  updateLaptopBookingStatus,
} from "../../store/services/laptopBookingServices";

export default function SellerLaptopChat() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const sellerUserId = Number(localStorage.getItem("sellerUserId"));

  const [booking, setBooking] = useState(null);
  const [message, setMessage] = useState("");
  const chatRef = useRef(null);

  /* ================= LOAD CHAT ================= */
  const loadChat = async () => {
    try {
      const response = await getLaptopBookingById(bookingId);
      const data = Array.isArray(response) ? response[0] : response;
      if (!data) return;

      setBooking({
        ...data,
        conversation: Array.isArray(data.conversation)
          ? [...data.conversation]
          : [],
      });

      requestAnimationFrame(() => {
        if (chatRef.current) {
          chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
      });
    } catch {
      toast.error("Failed to load chat");
    }
  };

  useEffect(() => {
    loadChat();
    const t = setInterval(loadChat, 3000);
    return () => clearInterval(t);
  }, []);

  /* ================= SEND MESSAGE ================= */
  const handleSend = async () => {
    if (!message.trim()) return;

    if (!sellerUserId) {
      toast.error("Please login again");
      return;
    }

    try {
      await sendLaptopMessage(bookingId, sellerUserId, message.trim());
      setMessage("");

      if (booking.status === "ACCEPTED") {
        await updateLaptopBookingStatus(bookingId, "IN_NEGOTIATION");
      }

      loadChat();
    } catch {
      toast.error("Message failed");
    }
  };

  /* ================= ACTIONS ================= */
  const handleAccept = async () => {
    await updateLaptopBookingStatus(bookingId, "ACCEPTED");
    toast.success("Request accepted");
    loadChat();
  };

  const handleReject = async () => {
    await updateLaptopBookingStatus(bookingId, "REJECTED");
    toast.success("Request rejected");
    navigate("/seller/requests");
  };

  const handleComplete = async () => {
    await updateLaptopBookingStatus(bookingId, "COMPLETED");
    toast.success("Deal completed");
    navigate("/seller/requests");
  };

  if (!booking) return <p className="p-4 text-center">Loading chat...</p>;

  const canChat = ["ACCEPTED", "IN_NEGOTIATION"].includes(booking.status);

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-gray-100">
      {/* HEADER */}
      <div className="bg-green-600 text-white p-4 shadow-md flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white text-green-600 rounded-full flex items-center justify-center font-bold">
            {booking.buyerName?.charAt(0) || "B"}
          </div>
          <div>
            <h2 className="text-lg font-semibold">{booking.buyerName}</h2>
            <p className="text-xs opacity-90">
              Laptop #{booking.laptopId} • Status: {booking.status}
            </p>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-2">
          {booking.status === "PENDING" && (
            <button
              onClick={handleAccept}
              className="bg-white text-green-600 px-3 py-1 rounded"
            >
              Accept
            </button>
          )}

          {["PENDING", "ACCEPTED", "IN_NEGOTIATION"].includes(
            booking.status
          ) && (
            <button
              onClick={handleReject}
              className="bg-red-500 px-3 py-1 rounded"
            >
              Reject
            </button>
          )}

          {["ACCEPTED", "IN_NEGOTIATION"].includes(booking.status) && (
            <button
              onClick={handleComplete}
              className="bg-gray-800 px-3 py-1 rounded"
            >
              Complete
            </button>
          )}
        </div>
      </div>

      {/* CHAT BODY */}
      <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {booking.conversation.map((msg, i) => {
          const isSeller = msg.senderId === sellerUserId;

          return (
            <div
              key={i}
              className={`flex ${isSeller ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs p-3 rounded-xl text-sm shadow ${
                  isSeller
                    ? "bg-green-600 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none"
                }`}
              >
                {msg.message}
                <p className="text-[10px] opacity-70 mt-1 text-right">
                  {formatTimestamp(msg.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* INPUT */}
      <div className="p-4 bg-white shadow-lg flex gap-2">
        <input
          className="flex-1 border rounded-lg p-3 outline-none"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={!canChat}
        />
        <button
          onClick={handleSend}
          disabled={!canChat}
          className="bg-green-600 hover:bg-green-700 text-white px-5 rounded-lg disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}

/* =============== TIME FORMATTER =============== */
function formatTimestamp(ts) {
  const d = new Date(ts);
  const h = d.getHours();
  const m = d.getMinutes();
  return `${h % 12 || 12}:${m.toString().padStart(2, "0")} ${
    h >= 12 ? "PM" : "AM"
  }`;
}
