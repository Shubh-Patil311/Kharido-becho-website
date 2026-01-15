import React, { useEffect, useState } from "react";
import { getLaptopBookingsByBuyer } from "../../store/services/laptopBookingServices";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function BuyerLaptopChatList() {
  const buyerId = Number(localStorage.getItem("buyerId"));
  const [chatList, setChatList] = useState([]);

  const loadChats = async () => {
    if (!buyerId) {
      toast.error("No buyer profile found. Please login and make an offer.");
      return;
    }

    try {
      const result = await getLaptopBookingsByBuyer(buyerId);

      const list = Array.isArray(result) ? result : result ? [result] : [];

      setChatList(list);
    } catch (err) {
      console.error("Failed to load buyer laptop chats", err);
      toast.error("Failed to load chat list");
    }
  };

  useEffect(() => {
    loadChats();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Laptop Chats</h2>

      {chatList.length === 0 && <p className="text-gray-500">No chats yet.</p>}

      {chatList.map((chat) => (
        <Link
          key={chat.laptopBookingId}
          to={`/chat/laptop/${chat.laptopBookingId}`}
          className="block bg-white shadow p-4 rounded-lg mb-3"
        >
          <p className="font-semibold text-gray-800">
            Laptop ID: {chat.laptopId}
          </p>
          <p className="text-sm text-gray-600">Status: {chat.status}</p>
        </Link>
      ))}
    </div>
  );
}
