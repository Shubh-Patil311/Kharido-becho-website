import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  getLaptopBookingById,
  sendLaptopMessage,
} from "../store/services/laptopBookingServices";
import { toast } from "react-toastify";

export default function LaptopChat() {
  const { bookingId } = useParams();
  const buyerUserId = Number(localStorage.getItem("buyerUserId"));
  const [booking, setBooking] = useState(null);
  const [message, setMessage] = useState("");
  const chatRef = useRef(null);

  /* ===========================
     LOAD CHAT
  ============================== */
  const loadChat = async () => {
    if (!bookingId) return;

    try {
      const res = await getLaptopBookingById(bookingId);

      // 🔥 CRITICAL FIX: unwrap array
      const data = Array.isArray(res) ? res[0] : res;

      if (!data) return;

      const conversationArray = Array.isArray(data.conversation)
        ? data.conversation
        : [];

      setBooking({
        ...data,
        conversationJson: conversationArray,
      });

      // Auto scroll
      setTimeout(() => {
        if (chatRef.current) {
          chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
      }, 150);
    } catch (err) {
      console.error("Failed to load laptop chat", err);
      toast.error("Failed to load messages");
    }
  };

  useEffect(() => {
    loadChat();
    const interval = setInterval(loadChat, 3000);
    return () => clearInterval(interval);
  }, []);

  /* ===========================
     SEND MESSAGE
  ============================== */
  const handleSend = async () => {
    if (!message.trim()) return;

    if (!buyerUserId) {
      toast.error("Please login as buyer again to send messages.");
      return;
    }

    try {
      await sendLaptopMessage(bookingId, buyerUserId, message.trim());
      setMessage("");
      loadChat();
    } catch (err) {
      console.error("Failed to send laptop chat message", err);
      toast.error("Failed to send message");
    }
  };

  if (!booking) return <p className="p-4 text-center">Loading chat...</p>;

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-gray-100">
      {/* HEADER */}
      <div className="bg-blue-600 text-white p-4 shadow-md flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold">
          {booking.sellerName?.charAt(0) || "S"}
        </div>

        <div>
          <h2 className="text-lg font-semibold">{booking.sellerName}</h2>
          <p className="text-xs opacity-90">Laptop Seller</p>
        </div>
      </div>

      {/* CHAT BODY */}
      <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {booking.conversationJson.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            No messages yet. Start the conversation!
          </p>
        )}

        {booking.conversationJson.map((msg, index) => {
          const isBuyer = msg.senderId === buyerUserId;

          return (
            <div
              key={index}
              className={`flex ${isBuyer ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs p-3 rounded-xl text-sm shadow ${
                  isBuyer
                    ? "bg-blue-600 text-white rounded-br-none"
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
          type="text"
          className="flex-1 border rounded-lg p-3 outline-none"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          onClick={handleSend}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}

/* ===========================
     FORMAT TIME
=============================== */
function formatTimestamp(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  const h = d.getHours();
  const m = d.getMinutes();
  return `${h % 12 || 12}:${m.toString().padStart(2, "0")} ${
    h >= 12 ? "PM" : "AM"
  }`;
}
