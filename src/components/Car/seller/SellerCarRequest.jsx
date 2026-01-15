import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getBookingsForSeller } from "../../../store/services/carBookingServices";

export default function SellerCarRequest() {
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

        return (
          <div
            key={b.bookingId}
            className="bg-white rounded shadow p-4 grid grid-cols-1 md:grid-cols-6 gap-3 items-center"
          >
            <div className="md:col-span-1">
              <img
                src={img}
                alt="car"
                className="w-28 h-20 object-cover rounded"
                onError={(e) => (e.currentTarget.src = "/placeholder.png")}
              />
            </div>

            <div className="md:col-span-3">
              <div className="font-semibold">
                {car.title}
                {car.variant ? `- ${car.variant}` : ""}
              </div>
              <div className="text-xs text-gray-500">
                CarId: {car.carId} • SellerId:{" "}
                {car.seller?.sellerId ?? b.seller?.sellerId}
              </div>
              <div className="text-sm mt-1">{car.description || ""}</div>
            </div>

            <div className="md:col-span-1">
              <div className="text-sm">Buyer: {buyerName}</div>
              <div className="text-xs text-gray-500">
                BuyerId: {buyer.buyerId}
              </div>
            </div>

            <div className="md:col-span-1 text-right">
              <div className="font-medium">
                ₹ {Number(car.price || 0).toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">{b.bookingStatus}</div>
              <div className="text-xs text-gray-400 mt-1">
                {new Date(b.bookingDate || b.createdAt).toLocaleString()}
              </div>
              <div className="mt-2 text-xs text-gray-600">
                bookingId: {b.bookingId}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
