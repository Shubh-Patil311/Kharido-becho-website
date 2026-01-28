import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getBookingsForSeller } from "../../../store/services/carBookingServices";

export default function SellerCarRequest({ onSelect, selectedId }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const sellerId = Number(localStorage.getItem("sellerId"));

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      if (!sellerId) {
        setBookings([]);
        setLoading(false);
        return;
      }
      try {
        const data = await getBookingsForSeller(sellerId);
        if (!mounted) return;
        setBookings(Array.isArray(data) ? data : []);
        console.log("DEBUG: getBookingsForSeller response:", data);
      } catch (err) {
        console.error("Failed to load car bookings", err);
        toast.error(err?.response?.data?.message || err?.message || "Failed");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [sellerId]);

  if (loading) return <div className="p-6">Loading seller requests...</div>;
  if (!bookings || bookings.length === 0)
    return <div className="p-6">No requests found</div>;

  return (
    <div className="p-4 space-y-4">
      <div className="text-sm text-gray-600">
        Total requests: {bookings.length}
      </div>
      {bookings.map((b) => {
        const car = b.car || {};
        const buyer = b.buyer || {};
        const buyerName =
          buyer?.user?.firstName ||
          buyer?.user?.email ||
          `Buyer ${buyer?.buyerId || ""}`;
        const img =
          (car.images && car.images.length && car.images[0].imageUrl) ||
          "/placeholder.png";

        const bookingId = b.bookingId || b.id;

        return (
          <div
            key={bookingId}
            onClick={() => onSelect && onSelect({
              bookingId,
              title: car.title || "Car",
              status: b.bookingStatus || b.status || "PENDING",
              buyerName
            })}
            className={`cursor-pointer transition-all duration-200 p-4 border rounded-lg shadow-sm ${selectedId === bookingId
                ? "bg-blue-50 border-blue-500 ring-1 ring-blue-500"
                : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
              }`}
          >
            <div className="flex gap-4">
              <img
                src={img}
                alt="car"
                className="w-20 h-20 object-cover rounded shadow-sm"
                onError={(e) => (e.currentTarget.src = "/placeholder.png")}
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-gray-900 leading-tight">
                    {car.title}
                    {car.variant ? ` - ${car.variant}` : ""}
                  </h3>
                  {selectedId === bookingId && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  )}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Buyer: {buyerName}
                </div>
                <div className="flex justify-between items-end mt-2">
                  <div className="font-bold text-blue-700">
                    ₹ {Number(car.price || 0).toLocaleString()}
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] uppercase font-bold bg-gray-100 text-gray-600 border border-gray-200">
                      {b.bookingStatus || b.status || "PENDING"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
