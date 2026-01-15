import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

import { getBikeById } from "../../../store/services/bikeServices";
import {
  fetchBuyerInfo,
  fetchSellerInfo,
} from "../../../store/services/authServices";
import { createBikeBooking } from "../../../store/services/bikeBookingServices";

import MakeOfferModal from "../../../components/Car/MakeOfferModal";
import ChatModal from "../../Chat/ChatModal";

import {
  FaMotorcycle,
  FaMapMarkerAlt,
  FaRegCalendarAlt,
  FaTachometerAlt,
  FaGasPump,
  FaPalette,
} from "react-icons/fa";

export default function BikeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);


  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [offerOpen, setOfferOpen] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [isBooked, setIsBooked] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [mainPhoto, setMainPhoto] = useState(null);

  useEffect(() => {
    loadBike();
    ensureIdsSaved();
  }, [id]);

  const loadBike = async () => {
    try {
      setLoading(true);
      const data = await getBikeById(id);
      setBike(data || null);

      // set first photo as main
      const photos = data?.bikePhotos || data?.images || [];
      if (photos.length > 0) setMainPhoto(photos[0].image_link || photos[0].photo_link);
    } catch {
      toast.error("Failed to load bike");
    } finally {
      setLoading(false);
    }
  };

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
        return Array.isArray(u.authorities)
          ? u.authorities
          : [u.authorities];
      return [];
    } catch {
      return [];
    }
  };

  const ensureIdsSaved = async () => {
    try {
      const u = readUserFromLocal();
      const baseUserId =
        u?.userId || u?.user?.id || u?.id || localStorage.getItem("userId");

      if (!baseUserId) return;

      const roles = getRolesFromStorage(u).map((r) => r.toUpperCase());

      if (!localStorage.getItem("buyerId")) {
        try {
          const buyer = await fetchBuyerInfo(baseUserId);
          if (buyer?.buyerId) {
            localStorage.setItem("buyerId", buyer.buyerId);
            localStorage.setItem(
              "buyerUserId",
              buyer.user?.id || baseUserId
            );
          }
        } catch { }
      }

      if (roles.includes("SELLER") && !localStorage.getItem("sellerId")) {
        try {
          const seller = await fetchSellerInfo(baseUserId);
          if (seller?.sellerId) {
            localStorage.setItem("sellerId", seller.sellerId);
            localStorage.setItem(
              "sellerUserId",
              seller.user?.id || baseUserId
            );
          }
        } catch { }
      }
    } catch { }
  };

  const handleMakeOffer = async () => {
    const buyerId = Number(localStorage.getItem("buyerId"));
    const userId = Number(localStorage.getItem("buyerUserId"));

    if (!buyerId || !userId) {
      toast.error("Please login as buyer");
      return;
    }

    try {
      setRequesting(true);
      const res = await createBikeBooking(
        id || bike.bikeId || bike.id,
        buyerId,
        userId,
        "Interested in this bike"
      );

      setBookingId(res.bookingId);
      localStorage.setItem("bikeBookingId", res.bookingId);
      toast.success("Offer sent successfully");
      setIsBooked(true);
      setOfferOpen(true);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        "You already created a booking for this bike";
      toast.error(msg);
    } finally {
      setRequesting(false);
    }
  };

  // const openChat = () => {
  //   const storedBooking = bookingId || localStorage.getItem("bikeBookingId");
  //   if (!storedBooking) {
  //     toast.error("Please make an offer first");
  //     return;
  //   }
  //   navigate(`/buyer/chat/${storedBooking}`);
  // };
  const openChat = () => {
    const storedBooking = bookingId || localStorage.getItem("bikeBookingId");
    if (!storedBooking) {
      toast.error("Please make an offer first");
      return;
    }

    setIsChatOpen(true); // open modal
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!bike) return <div className="p-6">Bike not found</div>;

  const photos = bike.bikePhotos || bike.images || [];
  const price = bike.prize ?? bike.price ?? 0;

  const status = (bike.status || "").toUpperCase();
  const isPending = status === "PENDING";
  const isSold = status === "SOLD";

  const disabled = requesting || isPending || isSold || isBooked;

  const buttonLabel = isSold
    ? "Sold"
    : isPending
      ? "Pending"
      : isBooked
        ? "Offer Sent"
        : requesting
          ? "Sending..."
          : "Send Offer";

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Back Button & Breadcrumb */}
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded transition"
        >
          ← Back
        </button>
        <div className="text-sm text-gray-500">
          <Link to="/">Home</Link> /{" "}
          <Link to="/buy/bikes">Bikes</Link> / {bike.brand} {bike.model}
        </div>
      </div>

      <div className="lg:flex lg:gap-8">
        {/* MAIN IMAGE */}
        <div className="lg:w-1/2">
          {mainPhoto ? (
            <img
              src={mainPhoto}
              alt="Main Bike"
              className="w-full h-80 object-cover rounded-lg shadow"
            />
          ) : (
            <div className="w-full h-80 bg-gray-200 flex items-center justify-center text-gray-500 rounded-lg">
              No Image
            </div>
          )}

          {/* THUMBNAILS */}
          {photos.length > 1 && (
            <div className="grid grid-cols-4 gap-3 mt-4">
              {photos.map((p, i) => {
                const src = p.image_link || p.photo_link;
                return (
                  <img
                    key={i}
                    src={src}
                    alt={`Bike ${i + 1}`}
                    className="h-20 w-full object-cover rounded cursor-pointer border-2 border-gray-300 hover:border-blue-500"
                    onClick={() => setMainPhoto(src)}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* IMPORTANT INFO */}
        <div className="lg:w-1/2 mt-6 lg:mt-0">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FaMotorcycle className="text-blue-600" />
            {bike.brand} {bike.model}
          </h1>

          <p className="text-green-600 font-bold text-2xl mt-2">
            ₹ {Number(price).toLocaleString()}
          </p>

          {/* SHORT SPECS */}
          <div className="flex flex-wrap gap-4 text-gray-700 mt-4">
            <SpecBox icon={<FaRegCalendarAlt />} value={bike.manufactureYear} />
            <SpecBox
              icon={<FaTachometerAlt />}
              value={`${bike.kilometersDriven} km`}
            />
            <SpecBox icon={<FaGasPump />} value={bike.fuelType} />
          </div>

          {/* BUTTONS */}
          <div className="mt-6 space-y-3">
            <button
              disabled={disabled}
              onClick={handleMakeOffer}
              className="w-full py-3 bg-blue-600 text-white rounded-md disabled:opacity-60"
            >
              {buttonLabel}
            </button>
            <button
              onClick={openChat}
              className="w-full py-3 bg-green-600 text-white rounded-md"
            >
              Chat With Seller
            </button>
            <ChatModal
              isOpen={isChatOpen}
              onClose={() => setIsChatOpen(false)}
              bookingId={bookingId || localStorage.getItem("bikeBookingId")}
              senderType="BUYER"
              chatType="BIKE" // or "CAR" depending on context
            />
          </div>
        </div>
      </div>

      {/* ADDITIONAL DETAILS SECTION */}
      <div className="mt-8 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Additional Details</h2>

        <div className="grid md:grid-cols-2 gap-4 text-gray-700">
          <Detail icon={<FaRegCalendarAlt />} label="Year" value={bike.manufactureYear} />
          <Detail icon={<FaTachometerAlt />} label="Driven" value={`${bike.kilometersDriven} km`} />
          <Detail icon={<FaGasPump />} label="Fuel Type" value={bike.fuelType} />
          <Detail icon={<FaPalette />} label="Color" value={bike.color} />
          <Detail icon={<FaMapMarkerAlt />} label="Location" value={bike.address || bike.city || bike.location || "N/A"} />
          <Detail icon={<FaMotorcycle />} label="Status" value={bike.status} />
        </div>
      </div>

      {/* DESCRIPTION */}
      {bike.description && (
        <div className="mt-6 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-3">Description</h2>
          <p className="text-gray-700">{bike.description}</p>
        </div>
      )}

      {/* OFFER MODAL */}
      <MakeOfferModal
        open={offerOpen}
        onClose={() => setOfferOpen(false)}
        bikeId={bike.bikeId || bike.id}
        type="bike"
        bookingId={bookingId}
      />
    </div>
  );
}

function Detail({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2 border-b py-2">
      <span className="text-blue-600">{icon}</span>
      <span className="font-semibold">{label}:</span>
      <span>{value || "N/A"}</span>
    </div>
  );
}

function SpecBox({ icon, value }) {
  return (
    <div className="flex flex-col items-center">
      <p className="text-blue-600 text-2xl">{icon}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}
