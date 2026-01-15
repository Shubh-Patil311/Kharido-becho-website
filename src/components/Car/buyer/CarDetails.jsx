import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAllCars, getCarById } from "../../../store/services/carServices";
import {
  fetchBuyerInfo,
  fetchSellerInfo,
} from "../../../store/services/authServices";
import { getBookingsForBuyer } from "../../../store/services/carBookingServices";
import MakeOfferModal from "../MakeOfferModal";

export default function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [offerOpen, setOfferOpen] = useState(false);

  useEffect(() => {
    loadCar();
    ensureIdsSaved();
  }, [id]);

  // ---------------- LOAD CAR ----------------
  const loadCar = async () => {
    try {
      setLoading(true);
      try {
        const one = await getCarById(id);
        if (one) {
          setCar(one);
          return;
        }
      } catch {}

      const list = await getAllCars(0, 200);
      const found = list.find((c) => String(c.carId) === String(id));
      setCar(found || null);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- USER HELPERS ----------------
  const readUserFromLocal = () => {
    try {
      const raw =
        localStorage.getItem("user") || localStorage.getItem("authUser");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const getRolesFromStorage = (u) => {
    try {
      const fromLocal = localStorage.getItem("roles");
      if (fromLocal) {
        const parsed = JSON.parse(fromLocal);
        return Array.isArray(parsed) ? parsed : [parsed];
      }
      if (u?.roles) return Array.isArray(u.roles) ? u.roles : [u.roles];
      if (u?.authorities)
        return Array.isArray(u.authorities) ? u.authorities : [u.authorities];
      return [];
    } catch {
      return [];
    }
  };

  // ---------------- ENSURE IDS ----------------
  const ensureIdsSaved = async () => {
    try {
      const u = readUserFromLocal();
      let baseUserId =
        u?.userId || u?.user?.id || u?.id || localStorage.getItem("userId");

      if (!baseUserId) return;

      const roles = getRolesFromStorage(u).map((r) => r.toUpperCase());

      if (!localStorage.getItem("buyerId")) {
        try {
          const buyer = await fetchBuyerInfo(baseUserId);
          if (buyer?.buyerId) {
            localStorage.setItem("buyerId", buyer.buyerId);
            localStorage.setItem("buyerUserId", buyer.user?.id || baseUserId);
          }
        } catch {}
      }

      if (roles.includes("SELLER") && !localStorage.getItem("sellerId")) {
        try {
          const seller = await fetchSellerInfo(baseUserId);
          if (seller?.sellerId) {
            localStorage.setItem("sellerId", seller.sellerId);
            localStorage.setItem("sellerUserId", seller.user?.id || baseUserId);
          }
        } catch {}
      }
    } catch {}
  };

  // ---------------- MAKE OFFER ----------------
  const openOffer = async () => {
    await ensureIdsSaved();

    const buyerId = Number(localStorage.getItem("buyerId"));
    const userId =
      Number(localStorage.getItem("buyerUserId")) ||
      Number(localStorage.getItem("userId"));

    if (!buyerId || !userId) {
      alert("Please login as buyer");
      return;
    }

    setOfferOpen(true);
  };

  // ---------------- CHAT HANDLER ----------------
  const openChat = async () => {
    try {
      const buyerId = Number(localStorage.getItem("buyerId"));
      if (!buyerId) {
        alert("Please login as buyer");
        return;
      }

      const bookings = await getBookingsForBuyer(buyerId);

      const booking = bookings.find((b) => b.car?.carId === car.carId);

      if (!booking) {
        alert("Please make an offer first to start chat");
        return;
      }

      navigate(`/buyer/chat/${booking.bookingId}`);
    } catch (err) {
      console.error(err);
      alert("Unable to open chat");
    }
  };

  // ---------------- UI ----------------
  if (loading) return <div className="p-6">Loading...</div>;
  if (!car) return <div className="p-6">Car not found</div>;

  const image =
    car.images && car.images.length > 0 ? car.images[0] : "/placeholder.png";

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-sm text-gray-500 mb-4">
        Home / Cars / {car.brand} {car.model}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <img
          src={image}
          alt={car.title}
          className="w-full h-96 object-cover rounded-lg shadow"
          onError={(e) => (e.currentTarget.src = "/placeholder.png")}
        />

        <div>
          <h1 className="text-3xl font-bold">{car.title}</h1>

          <p className="text-green-600 font-bold text-2xl mt-2">
            ₹ {Number(car.price || 0).toLocaleString()}
          </p>

          <div className="bg-white rounded-md shadow mt-6 p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <Spec label="Fuel" value={car.fuelType} />
              <Spec label="Year" value={car.yearOfPurchase} />
              <Spec label="Kms" value={car.kmDriven} />
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button
              onClick={openOffer}
              className="w-full py-3 bg-blue-600 text-white rounded-md"
            >
              Make Offer
            </button>

            <button
              onClick={openChat}
              className="w-full py-3 bg-green-600 text-white rounded-md"
            >
              Chat With Seller
            </button>

            <MakeOfferModal
              open={offerOpen}
              onClose={() => setOfferOpen(false)}
              carId={car.carId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------- HELPERS ----------------
function Spec({ label, value }) {
  return (
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="font-medium">{value || "-"}</div>
    </div>
  );
}
