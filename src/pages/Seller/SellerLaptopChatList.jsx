import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function SellerLaptopChatList() {
  const sellerUserId = Number(localStorage.getItem("sellerUserId"));
  const [list, setList] = useState([]);

  const loadRequests = async () => {
    if (!sellerUserId) {
      toast.error("No seller profile found. Please login again.");
      return;
    }

    try {
      const res = await axios.get("http://localhost:8087/api/laptops/getAll");
      const laptops = res.data || [];

      // Filter laptops belonging to seller user
      const sellerLaptops = laptops.filter(
        (l) => l.seller?.user?.id === sellerUserId
      );

      // Collect all booking records
      const requests = sellerLaptops.flatMap((laptop) =>
        (laptop.bookings || []).map((b) => ({
          bookingId: b.laptopBookingId,
          laptopId: laptop.id,
          buyerName:
            (b.buyer?.user &&
              `${b.buyer.user.firstName} ${b.buyer.user.lastName || ""}`.trim()) ||
            b.buyer?.user?.email ||
            "Unknown",
          status: b.pendingStatus,
        }))
      );

      setList(requests);
    } catch (err) {
      console.error("Failed to load seller laptop requests", err);
      toast.error("Failed to load buyer requests");
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Buyer Requests</h2>

      {list.length === 0 && (
        <p className="text-gray-500">No buyer requests yet.</p>
      )}

      {list.map((req) => (
        <Link
          key={req.bookingId}
          to={`/seller/chat/laptop/${req.bookingId}`}
          className="block bg-white shadow p-4 rounded-lg mb-3"
        >
          <p className="font-semibold">{req.buyerName}</p>
          <p className="text-sm">Laptop ID: {req.laptopId}</p>
          <p className="text-sm text-gray-600">Status: {req.status}</p>
        </Link>
      ))}
    </div>
  );
}
