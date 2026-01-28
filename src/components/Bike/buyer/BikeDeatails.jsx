// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import { toast } from "react-toastify";

// import { getBikeById } from "../../../store/services/bikeServices";
// import {
//   fetchBuyerInfo,
//   fetchSellerInfo,
// } from "../../../store/services/authServices";
// import { createBikeBooking } from "../../../store/services/bikeBookingServices";

// import MakeOfferModal from "../../../components/Car/MakeOfferModal";
// import ChatModal from "../../Chat/ChatModal";

// import {
//   FaMotorcycle,
//   FaMapMarkerAlt,
//   FaRegCalendarAlt,
//   FaTachometerAlt,
//   FaGasPump,
//   FaPalette,
// } from "react-icons/fa";

// export default function BikeDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [isChatOpen, setIsChatOpen] = useState(false);

//   const [bike, setBike] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [offerOpen, setOfferOpen] = useState(false);
//   const [bookingId, setBookingId] = useState(null);
//   const [isBooked, setIsBooked] = useState(false);
//   const [requesting, setRequesting] = useState(false);
//   const [mainPhoto, setMainPhoto] = useState(null);

//   useEffect(() => {
//     loadBike();
//     ensureIdsSaved();
//   }, [id]);

//   const loadBike = async () => {
//     try {
//       setLoading(true);
//       const data = await getBikeById(id);
//       setBike(data || null);

//       // set first photo as main
//       const photos = data?.bikePhotos || data?.images || [];
//       if (photos.length > 0)
//         setMainPhoto(photos[0].image_link || photos[0].photo_link);
//     } catch {
//       toast.error("Failed to load bike");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const readUserFromLocal = () => {
//     try {
//       const raw =
//         localStorage.getItem("user") || localStorage.getItem("authUser");
//       return raw ? JSON.parse(raw) : null;
//     } catch {
//       return null;
//     }
//   };

//   const getRolesFromStorage = (u) => {
//     try {
//       const fromLocal = localStorage.getItem("roles");
//       if (fromLocal) {
//         const parsed = JSON.parse(fromLocal);
//         return Array.isArray(parsed) ? parsed : [parsed];
//       }
//       if (u?.roles) return Array.isArray(u.roles) ? u.roles : [u.roles];
//       if (u?.authorities)
//         return Array.isArray(u.authorities) ? u.authorities : [u.authorities];
//       return [];
//     } catch {
//       return [];
//     }
//   };

//   const ensureIdsSaved = async () => {
//     try {
//       const u = readUserFromLocal();
//       const baseUserId =
//         u?.userId || u?.user?.id || u?.id || localStorage.getItem("userId");

//       if (!baseUserId) return;

//       const roles = getRolesFromStorage(u).map((r) => r.toUpperCase());

//       if (!localStorage.getItem("buyerId")) {
//         try {
//           const buyer = await fetchBuyerInfo(baseUserId);
//           if (buyer?.buyerId) {
//             localStorage.setItem("buyerId", buyer.buyerId);
//             localStorage.setItem("buyerUserId", buyer.user?.id || baseUserId);
//           }
//         } catch {}
//       }

//       if (roles.includes("SELLER") && !localStorage.getItem("sellerId")) {
//         try {
//           const seller = await fetchSellerInfo(baseUserId);
//           if (seller?.sellerId) {
//             localStorage.setItem("sellerId", seller.sellerId);
//             localStorage.setItem("sellerUserId", seller.user?.id || baseUserId);
//           }
//         } catch {}
//       }
//     } catch {}
//   };

//   const handleMakeOffer = async () => {
//     const buyerId = Number(localStorage.getItem("buyerId"));
//     const userId = Number(localStorage.getItem("buyerUserId"));

//     if (!buyerId || !userId) {
//       toast.error("Please login as buyer");
//       return;
//     }

//     try {
//       setRequesting(true);
//       const res = await createBikeBooking(
//         id || bike.bikeId || bike.id,
//         buyerId,
//         userId,
//         "Interested in this bike"
//       );

//       setBookingId(res.bookingId);
//       localStorage.setItem("bikeBookingId", res.bookingId);
//       toast.success("Offer sent successfully");
//       setIsBooked(true);
//       setOfferOpen(true);
//     } catch (err) {
//       const msg =
//         err?.response?.data?.message ||
//         "You already created a booking for this bike";
//       toast.error(msg);
//     } finally {
//       setRequesting(false);
//     }
//   };

//   // const openChat = () => {
//   //   const storedBooking = bookingId || localStorage.getItem("bikeBookingId");
//   //   if (!storedBooking) {
//   //     toast.error("Please make an offer first");
//   //     return;
//   //   }
//   //   navigate(`/buyer/chat/${storedBooking}`);
//   // };
//   const openChat = () => {
//     const storedBooking = bookingId || localStorage.getItem("bikeBookingId");
//     if (!storedBooking) {
//       toast.error("Please make an offer first");
//       return;
//     }

//     setIsChatOpen(true); // open modal
//   };

//   if (loading) return <div className="p-6">Loading...</div>;
//   if (!bike) return <div className="p-6">Bike not found</div>;

//   const photos = bike.bikePhotos || bike.images || [];
//   const price = bike.prize ?? bike.price ?? 0;

//   const status = (bike.status || "").toUpperCase();
//   const isPending = status === "PENDING";
//   const isSold = status === "SOLD";

//   const disabled = requesting || isPending || isSold || isBooked;

//   const buttonLabel = isSold
//     ? "Sold"
//     : isPending
//     ? "Pending"
//     : isBooked
//     ? "Offer Sent"
//     : requesting
//     ? "Sending..."
//     : "Send Offer";

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       {/* Back Button & Breadcrumb */}
//       <div className="flex items-center gap-4 mb-4">
//         <button
//           onClick={() => navigate(-1)}
//           className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded transition"
//         >
//           ← Back
//         </button>
//         <div className="text-sm text-gray-500">
//           <Link to="/">Home</Link> / <Link to="/buy/bikes">Bikes</Link> /{" "}
//           {bike.brand} {bike.model}
//         </div>
//       </div>

//       <div className="lg:flex lg:gap-8">
//         {/* MAIN IMAGE */}
//         <div className="lg:w-1/2">
//           {mainPhoto ? (
//             <img
//               src={mainPhoto}
//               alt="Main Bike"
//               className="w-full h-80 object-cover rounded-lg shadow"
//             />
//           ) : (
//             <div className="w-full h-80 bg-gray-200 flex items-center justify-center text-gray-500 rounded-lg">
//               No Image
//             </div>
//           )}

//           {/* THUMBNAILS */}
//           {photos.length > 1 && (
//             <div className="grid grid-cols-4 gap-3 mt-4">
//               {photos.map((p, i) => {
//                 const src = p.image_link || p.photo_link;
//                 return (
//                   <img
//                     key={i}
//                     src={src}
//                     alt={`Bike ${i + 1}`}
//                     className="h-20 w-full object-cover rounded cursor-pointer border-2 border-gray-300 hover:border-blue-500"
//                     onClick={() => setMainPhoto(src)}
//                   />
//                 );
//               })}
//             </div>
//           )}
//         </div>

//         {/* IMPORTANT INFO */}
//         <div className="lg:w-1/2 mt-6 lg:mt-0">
//           <h1 className="text-3xl font-bold flex items-center gap-2">
//             <FaMotorcycle className="text-blue-600" />
//             {bike.brand} {bike.model}
//           </h1>

//           <p className="text-green-600 font-bold text-2xl mt-2">
//             ₹ {Number(price).toLocaleString()}
//           </p>

//           {/* SHORT SPECS */}
//           <div className="flex flex-wrap gap-4 text-gray-700 mt-4">
//             <SpecBox icon={<FaRegCalendarAlt />} value={bike.manufactureYear} />
//             <SpecBox
//               icon={<FaTachometerAlt />}
//               value={`${bike.kilometersDriven} km`}
//             />
//             <SpecBox icon={<FaGasPump />} value={bike.fuelType} />
//           </div>

//           {/* BUTTONS */}
//           <div className="mt-6 space-y-3">
//             <button
//               disabled={disabled}
//               onClick={handleMakeOffer}
//               className="w-full py-3 bg-blue-600 text-white rounded-md disabled:opacity-60"
//             >
//               {buttonLabel}
//             </button>
//             <button
//               disabled={isSold}
//               onClick={openChat}
//               className={`w-full py-3 text-white rounded-md ${
//                 isSold
//                   ? "bg-gray-400 cursor-not-allowed"
//                   : "bg-green-600 hover:bg-green-700"
//               }`}
//             >
//               {isSold ? "Sold Out" : "Chat With Seller"}
//             </button>
//             <ChatModal
//               isOpen={isChatOpen}
//               onClose={() => setIsChatOpen(false)}
//               bookingId={bookingId || localStorage.getItem("bikeBookingId")}
//               senderType="BUYER"
//               chatType="BIKE"
//               bookingStatus={bike.status}
//             />
//           </div>
//         </div>
//       </div>

//       {/* ADDITIONAL DETAILS SECTION */}
//       <div className="mt-8 bg-white shadow-md rounded-lg p-6">
//         <h2 className="text-2xl font-bold mb-4">Additional Details</h2>

//         <div className="grid md:grid-cols-2 gap-4 text-gray-700">
//           <Detail
//             icon={<FaRegCalendarAlt />}
//             label="Year"
//             value={bike.manufactureYear}
//           />
//           <Detail
//             icon={<FaTachometerAlt />}
//             label="Driven"
//             value={`${bike.kilometersDriven} km`}
//           />
//           <Detail
//             icon={<FaGasPump />}
//             label="Fuel Type"
//             value={bike.fuelType}
//           />
//           <Detail icon={<FaPalette />} label="Color" value={bike.color} />
//           <Detail
//             icon={<FaMapMarkerAlt />}
//             label="Location"
//             value={bike.address || bike.city || bike.location || "N/A"}
//           />
//           <Detail icon={<FaMotorcycle />} label="Status" value={bike.status} />
//         </div>
//       </div>

//       {/* DESCRIPTION */}
//       {bike.description && (
//         <div className="mt-6 bg-white shadow-md rounded-lg p-6">
//           <h2 className="text-2xl font-bold mb-3">Description</h2>
//           <p className="text-gray-700">{bike.description}</p>
//         </div>
//       )}

//       {/* OFFER MODAL */}
//       <MakeOfferModal
//         open={offerOpen}
//         onClose={() => setOfferOpen(false)}
//         bikeId={bike.bikeId || bike.id}
//         type="bike"
//         bookingId={bookingId}
//       />
//     </div>
//   );
// }

// function Detail({ icon, label, value }) {
//   return (
//     <div className="flex items-center gap-2 border-b py-2">
//       <span className="text-blue-600">{icon}</span>
//       <span className="font-semibold">{label}:</span>
//       <span>{value || "N/A"}</span>
//     </div>
//   );
// }

// function SpecBox({ icon, value }) {
//   return (
//     <div className="flex flex-col items-center">
//       <p className="text-blue-600 text-2xl">{icon}</p>
//       <p className="font-semibold">{value}</p>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";

import { getBikeById } from "../../../store/services/bikeServices";
import {
  fetchBuyerInfo,
  fetchSellerInfo,
} from "../../../store/services/authServices";
import { createBikeBooking } from "../../../store/services/bikeBookingServices";

import MakeOfferModal from "../../../components/Car/MakeOfferModal";
import ChatModal from "../../Chat/ChatModal";

// Icons
import {
  FaMotorcycle,
  FaMapMarkerAlt,
  FaRegCalendarAlt,
  FaTachometerAlt,
  FaGasPump,
  FaPalette,
  FaWeightHanging,
  FaIndustry,
  FaUsb,
  FaCogs,
  FaUser,
  FaChevronLeft,
  FaChevronRight,
  FaRupeeSign,
  FaTag,
  FaShieldAlt,
  FaStar,
  FaCheckCircle,
  FaPhoneAlt,
  FaWhatsapp,
  FaCalendarAlt,
  FaCar,
  FaCog,
  FaBolt,
} from "react-icons/fa";

export default function BikeDetails() {
  const { id } = useParams();
  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [offerOpen, setOfferOpen] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [isBooked, setIsBooked] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    loadBike();
    ensureIdsSaved();

    // Check if already booked
    const storedBooking = localStorage.getItem("bikeBookingId");
    if (storedBooking) {
      setIsBooked(true);
      setBookingId(storedBooking);
    }
  }, [id]);

  const loadBike = async () => {
    setLoading(true);
    try {
      const data = await getBikeById(id);
      setBike(data || null);
    } catch (err) {
      toast.error("Failed to load bike details");
      console.error(err);
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
        return Array.isArray(u.authorities) ? u.authorities : [u.authorities];
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
            localStorage.setItem("buyerUserId", buyer.user?.id || baseUserId);
          }
        } catch (error) {
          console.log("Error fetching buyer info:", error);
        }
      }

      if (roles.includes("SELLER") && !localStorage.getItem("sellerId")) {
        try {
          const seller = await fetchSellerInfo(baseUserId);
          if (seller?.sellerId) {
            localStorage.setItem("sellerId", seller.sellerId);
            localStorage.setItem("sellerUserId", seller.user?.id || baseUserId);
          }
        } catch (error) {
          console.log("Error fetching seller info:", error);
        }
      }
    } catch (error) {
      console.log("Error ensuring IDs:", error);
    }
  };

  // ===============================
  // ORIGINAL MAKE OFFER HANDLER
  // ===============================
  const handleMakeOffer = async () => {
    const buyerId = Number(localStorage.getItem("buyerId"));
    const userId = Number(localStorage.getItem("buyerUserId"));

    if (!buyerId || !userId) {
      toast.error("Please login as buyer to make an offer");
      return;
    }

    try {
      setRequesting(true);

      // Use the original createBikeBooking function signature
      const res = await createBikeBooking(
        id || bike?.bikeId || bike?.id, // bikeId
        buyerId, // buyerId
        userId, // userId
        "Interested in this bike" // message
      );

      if (res && res.bookingId) {
        setBookingId(res.bookingId);
        localStorage.setItem("bikeBookingId", res.bookingId);
        toast.success("Offer sent successfully!");
        setIsBooked(true);
        setOfferOpen(true); // Open the offer modal
      } else {
        throw new Error("Failed to create booking");
      }
    } catch (err) {
      console.error("Offer error:", err);
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        "You already created a booking for this bike or an error occurred";
      toast.error(errorMsg);

      // If already booked, just open the offer modal
      if (errorMsg.includes("already")) {
        setIsBooked(true);
        setOfferOpen(true);
      }
    } finally {
      setRequesting(false);
    }
  };

  // ===============================
  // ORIGINAL CHAT HANDLER
  // ===============================
  const handleChat = () => {
    const storedBooking = bookingId || localStorage.getItem("bikeBookingId");

    if (!storedBooking) {
      toast.error("Please make an offer first to start chatting");
      return;
    }

    // Check if bike is sold
    const status = (bike?.status || "").toUpperCase();
    const isSold = status === "SOLD";

    if (isSold) {
      toast.error("This bike is already sold");
      return;
    }

    setIsChatOpen(true);
  };

  const prevImage = () => {
    const photos = bike?.bikePhotos || bike?.images || [];
    if (photos.length > 0) {
      setActiveIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
    }
  };

  const nextImage = () => {
    const photos = bike?.bikePhotos || bike?.images || [];
    if (photos.length > 0) {
      setActiveIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
    }
  };

  if (loading) return <LoadingSkeleton />;
  if (!bike) return <NotFoundMessage />;

  const photos = bike.bikePhotos || bike.images || [];
  const price = bike.prize ?? bike.price ?? 0;
  const status = (bike.status || "").toUpperCase();
  const isPending = status === "PENDING";
  const isSold = status === "SOLD";

  // Button state logic
  const disabled = requesting || isPending || isSold || isBooked;

  const makeOfferButtonLabel = isSold
    ? "Sold"
    : isPending
    ? "Pending Approval"
    : isBooked
    ? "Offer Sent"
    : requesting
    ? "Sending Offer..."
    : "Make an Offer";

  const chatButtonLabel = isSold ? "Sold Out" : "Chat with Seller";

  const rating = 4.5;
  const condition = bike.condition || "Good";

  // Seller info - adjust based on your data structure
  const sellerName = bike.seller?.user?.firstName
    ? `${bike.seller.user.firstName} ${bike.seller.user.lastName || ""}`.trim()
    : "Seller";

  const sellerContact = bike.seller?.user?.mobileNumber || "Not Available";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* HEADER */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link
                to="/buy/bikes"
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <FaChevronLeft className="mr-2" />
                Back to Bikes
              </Link>
            </div>
            <div className="hidden md:block">
              <span className="text-sm text-gray-500">Product ID:</span>
              <span className="ml-2 font-mono text-gray-700">#{id}</span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN - IMAGES */}
          <div className="lg:col-span-2">
            {/* IMAGE SLIDER */}
            <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
              <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-white">
                <img
                  src={
                    photos.length > 0
                      ? photos[activeIndex]?.image_link ||
                        photos[activeIndex]?.photo_link
                      : "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80"
                  }
                  alt={`${bike.brand} ${bike.model}`}
                  className="w-full h-[500px] object-contain transition-transform duration-500 hover:scale-105"
                />

                {photos.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
                    >
                      <FaChevronLeft className="text-lg" />
                    </button>

                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
                    >
                      <FaChevronRight className="text-lg" />
                    </button>
                  </>
                )}

                {/* Image counter */}
                {photos.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    {activeIndex + 1} / {photos.length}
                  </div>
                )}

                {/* Status badge */}
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold shadow-md ${
                      isSold
                        ? "bg-red-500"
                        : isPending
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    } text-white`}
                  >
                    {isSold ? "Sold" : isPending ? "Pending" : condition}
                  </span>
                </div>
              </div>

              {/* Thumbnail strip */}
              {photos.length > 1 && (
                <div className="grid grid-cols-6 gap-3 mt-6">
                  {photos.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveIndex(idx)}
                      className={`relative h-20 rounded-lg overflow-hidden border-3 transition-all duration-200 hover:scale-105 ${
                        idx === activeIndex
                          ? "border-blue-500 ring-2 ring-blue-200"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={p.image_link || p.photo_link}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* SPECIFICATIONS */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  📋 Full Specifications
                </h2>
                <div className="flex items-center space-x-2 text-blue-600">
                  <FaCogs />
                  <span className="text-sm font-medium">Vehicle Details</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SpecCard
                  icon={<FaMotorcycle className="text-blue-500" />}
                  title="General"
                  items={[
                    { label: "Brand", value: bike.brand },
                    { label: "Model", value: bike.model },
                    { label: "Color", value: bike.color },
                    { label: "Year", value: bike.manufactureYear },
                  ]}
                />

                <SpecCard
                  icon={<FaTachometerAlt className="text-purple-500" />}
                  title="Performance"
                  items={[
                    {
                      label: "Kilometers Driven",
                      value: `${bike.kilometersDriven || "N/A"} km`,
                    },
                    { label: "Fuel Type", value: bike.fuelType },
                    { label: "Engine CC", value: bike.engineCapacity || "N/A" },
                    {
                      label: "Mileage",
                      value: bike.mileage ? `${bike.mileage} kmpl` : "N/A",
                    },
                  ]}
                />

                <SpecCard
                  icon={<FaCog className="text-green-500" />}
                  title="Registration & Documents"
                  items={[
                    {
                      label: "Registration Number",
                      value: bike.registrationNumber || "N/A",
                    },
                    { label: "Owner Number", value: bike.ownerNumber || "N/A" },
                    {
                      label: "Insurance Valid Until",
                      value: bike.insuranceValidUpto || "N/A",
                    },
                    { label: "RC Status", value: bike.rcStatus || "N/A" },
                  ]}
                />

                <SpecCard
                  icon={<FaShieldAlt className="text-yellow-500" />}
                  title="Additional Info"
                  items={[
                    { label: "Status", value: bike.status || "Available" },
                    {
                      label: "Transmission",
                      value: bike.transmission || "N/A",
                    },
                    { label: "Owner Type", value: bike.ownerType || "N/A" },
                    {
                      label: "Location",
                      value: bike.address || bike.city || "N/A",
                    },
                  ]}
                />
              </div>
            </div>

            {/* DESCRIPTION */}
            {bike.description && (
              <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {bike.description}
                </p>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN - DETAILS & ACTIONS */}
          <div className="space-y-6">
            {/* PRODUCT CARD */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              {/* Title & Rating */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {bike.brand} {bike.model}
                  </h1>
                  <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                    <FaStar className="text-yellow-500 mr-1" />
                    <span className="font-semibold">{rating.toFixed(1)}</span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm">
                  {bike.ownerType || "Pre-Owned"} • {bike.fuelType || "Petrol"}{" "}
                  • {bike.city || ""}
                </p>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline mb-2">
                  <FaRupeeSign className="text-gray-400 mr-1" />
                  <span className="text-4xl font-bold text-gray-900">
                    {Number(price).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex items-center text-green-600">
                  <FaCheckCircle className="mr-2" />
                  <span className="text-sm font-medium">
                    {isSold ? "Sold Out" : "Price is negotiable"}
                  </span>
                </div>
              </div>

              {/* Key Specs */}
              <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <FaRegCalendarAlt className="text-2xl text-blue-600" />
                  </div>
                  <p className="font-bold text-gray-900">
                    {bike.manufactureYear || "N/A"}
                  </p>
                  <p className="text-xs text-gray-500">Year</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <FaTachometerAlt className="text-2xl text-purple-600" />
                  </div>
                  <p className="font-bold text-gray-900">
                    {bike.kilometersDriven || "N/A"} km
                  </p>
                  <p className="text-xs text-gray-500">Driven</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <FaGasPump className="text-2xl text-green-600" />
                  </div>
                  <p className="font-bold text-gray-900">
                    {bike.fuelType || "N/A"}
                  </p>
                  <p className="text-xs text-gray-500">Fuel Type</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <FaBolt className="text-2xl text-yellow-600" />
                  </div>
                  <p className="font-bold text-gray-900">
                    {bike.engineCapacity || "N/A"} CC
                  </p>
                  <p className="text-xs text-gray-500">Engine</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4 mb-8">
                <button
                  onClick={handleMakeOffer}
                  disabled={disabled}
                  className={`w-full font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center ${
                    disabled
                      ? "bg-gray-400 text-gray-700 cursor-not-allowed opacity-70"
                      : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:-translate-y-1"
                  }`}
                >
                  <FaTag className="mr-3" />
                  {makeOfferButtonLabel}
                </button>

                <button
                  onClick={handleChat}
                  disabled={isSold || !bookingId}
                  className={`w-full font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center ${
                    isSold || !bookingId
                      ? "bg-gray-400 text-gray-700 cursor-not-allowed opacity-70"
                      : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 hover:shadow-xl hover:-translate-y-1"
                  }`}
                >
                  <FaWhatsapp className="mr-3 text-lg" />
                  {chatButtonLabel}
                </button>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 mb-2">
                  ✨ Key Features
                </h3>
                <div className="flex items-center text-sm">
                  <FaCheckCircle className="text-green-500 mr-3" />
                  <span>All documents verified</span>
                </div>
                <div className="flex items-center text-sm">
                  <FaCheckCircle className="text-green-500 mr-3" />
                  <span>Test drive available</span>
                </div>
                <div className="flex items-center text-sm">
                  <FaCheckCircle className="text-green-500 mr-3" />
                  <span>No major accident history</span>
                </div>
                <div className="flex items-center text-sm">
                  <FaCheckCircle className="text-green-500 mr-3" />
                  <span>Well maintained condition</span>
                </div>
              </div>
            </div>

            {/* SELLER INFO */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-3 rounded-full">
                  <FaUser className="text-2xl text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-bold text-lg text-gray-900">
                    Seller Information
                  </h3>
                  <p className="text-sm text-gray-500">
                    {isSold ? "Previous Seller" : "Verified Seller"}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <FaUser className="text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-semibold">{sellerName}</p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <FaPhoneAlt className="text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Contact</p>
                    <p className="font-semibold">{sellerContact}</p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <FaMapMarkerAlt className="text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-semibold">
                      {bike.city || bike.address || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <button className="w-full mt-6 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-6 rounded-xl transition-all duration-200">
                View Seller Profile
              </button>
            </div>

            {/* SAFETY TIPS */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5">
              <h4 className="font-bold text-amber-800 mb-3">⚠️ Safety Tips</h4>
              <ul className="space-y-2 text-sm text-amber-700">
                <li>• Verify RC, Insurance, and PUC documents</li>
                <li>• Always take a test drive before buying</li>
                <li>• Check service history and maintenance records</li>
                <li>• Meet in safe public locations for inspection</li>
                <li>• Avoid advance payments without proper verification</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <MakeOfferModal
        open={offerOpen}
        onClose={() => setOfferOpen(false)}
        bikeId={bike?.bikeId || bike?.id}
        type="bike"
        bookingId={bookingId}
      />

      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        bookingId={bookingId}
        senderType="BUYER"
        chatType="BIKE"
        bookingStatus={bike?.status}
      />
    </div>
  );
}

/* COMPONENTS */

function SpecCard({ icon, title, items }) {
  return (
    <div className="border border-gray-200 rounded-xl p-5 hover:border-blue-200 hover:shadow-md transition-all duration-300">
      <div className="flex items-center mb-4">
        <div className="p-2 bg-gray-100 rounded-lg mr-3">{icon}</div>
        <h3 className="font-bold text-gray-900">{title}</h3>
      </div>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-center py-2">
            <span className="text-gray-500 text-sm">{item.label}</span>
            <span className="font-semibold text-gray-900">
              {item.value || "N/A"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-4 h-[500px] animate-pulse">
              <div className="h-full bg-gray-200 rounded-xl"></div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 h-96 animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-100 rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 h-[600px] animate-pulse">
              <div className="h-10 bg-gray-200 rounded mb-6"></div>
              <div className="h-16 bg-gray-200 rounded mb-8"></div>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-100 rounded-xl"></div>
                ))}
              </div>
              <div className="h-16 bg-gray-200 rounded mb-4"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotFoundMessage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
        <div className="text-6xl mb-4">🏍️</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Bike Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The bike you're looking for might have been sold or removed.
        </p>
        <Link
          to="/buy/bikes"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
        >
          Browse Other Bikes
        </Link>
      </div>
    </div>
  );
}
