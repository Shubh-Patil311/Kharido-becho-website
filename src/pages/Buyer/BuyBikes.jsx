
// import React, { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import { getAllBikes } from "../../store/services/bikeServices";
// import { createBikeBooking } from "../../store/services/bikeBookingServices";

// export default function BuyBikes() {
//   const [bikes, setBikes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [requestingId, setRequestingId] = useState(null);
//   const [bookedBikeIds, setBookedBikeIds] = useState(() => new Set());

//   useEffect(() => {
//     loadBikes();
//   }, []);

//   const loadBikes = async () => {
//     try {
//       setLoading(true);
//       const data = await getAllBikes();
//       setBikes(data);
//     } catch (err) {
//       console.error("Failed to load bikes", err);
//       toast.error("Failed to load bikes.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSendRequest = async (bike) => {
//     if (!bike?.bike_id) return;

//     const token = localStorage.getItem("token");
//     if (!token) {
//       toast.info("Please login to send a request to the seller.");
//       return;
//     }

//     // ⭐ FIXED BUYER ID (Corrected)
//     const buyerId =
//       Number(localStorage.getItem("buyerUserId")) ||
//       Number(localStorage.getItem("userId")) ||
//       Number(localStorage.getItem("buyerId"));

//     if (!buyerId) {
//       toast.info("Buyer profile not found. Please login again.");
//       return;
//     }

//     try {
//       setRequestingId(bike.bike_id);

//       await createBikeBooking(
//         bike.bike_id,
//         buyerId,
//         "Hi, I am interested in this bike."
//       );

//       toast.success("Booking request sent successfully.");

//       setBookedBikeIds((prev) => new Set(prev).add(bike.bike_id));
//     } catch (err) {
//       console.error("Booking Error:", err);

//       const msg = err?.response?.data?.message || err?.message || "";

//       if (msg.toLowerCase().includes("already created a booking")) {
//         toast.info("You already created a booking for this bike.");
//         setBookedBikeIds((prev) => new Set(prev).add(bike.bike_id));
//         return;
//       }

//       toast.error(msg);
//     } finally {
//       setRequestingId(null);
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h2 className="text-3xl font-bold mb-2">Browse Bikes</h2>
//       <p className="text-gray-600 mb-6">
//         Find your next bike from our wide selection of listings.
//       </p>

//       {loading ? (
//         <p className="text-gray-700 text-lg">Loading bikes...</p>
//       ) : bikes.length === 0 ? (
//         <p className="text-gray-600">No bikes found.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {bikes.map((bike) => (
//             <BikeCard
//               key={bike.bike_id}
//               bike={bike}
//               onRequest={handleSendRequest}
//               requesting={requestingId === bike.bike_id}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// /* -------------------------
//         BIKE CARD UI
// -------------------------- */
// function BikeCard({ bike, onRequest, requesting }) {
//   const imageUrl =
//     bike.images?.[0]?.image_link ||
//     "https://via.placeholder.com/300x200?text=No+Image";

//   const normalizedStatus = (bike.status || "").toString().toUpperCase();
//   const isPending = normalizedStatus === "PENDING";
//   const isSold = normalizedStatus === "SOLD";

//   return (
//     <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition p-3">
//       <div className="w-full h-44 overflow-hidden rounded-md relative">
//         <img
//           src={imageUrl}
//           alt={bike.brand}
//           className="w-full h-full object-cover"
//         />

//         {(isPending || isSold) && (
//           <span
//             className={`absolute top-2 left-2 text-xs font-semibold px-2 py-1 rounded ${
//               isSold ? "bg-red-600 text-white" : "bg-yellow-400 text-gray-900"
//             }`}
//           >
//             {isSold ? "Sold" : "Pending"}
//           </span>
//         )}
//       </div>

//       <div className="mt-3 space-y-1">
//         <h3 className="text-lg font-semibold">
//           {bike.brand} {bike.model}
//         </h3>

//         <p className="text-gray-600 text-sm">
//           Variant: <span className="font-medium">{bike.variant}</span>
//         </p>

//         <p className="text-gray-600 text-sm">
//           Year: <span className="font-medium">{bike.manufactureYear}</span>
//         </p>

//         <p className="text-green-600 font-bold text-lg">
//           ₹ {bike.prize?.toLocaleString()}
//         </p>
//       </div>

//       <button
//         className="w-full mt-3 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:opacity-60"
//         onClick={() => onRequest?.(bike)}
//         disabled={requesting || isPending || isSold}
//       >
//         {isSold
//           ? "Sold"
//           : isPending
//           ? "Request Pending"
//           : requesting
//           ? "Sending Request..."
//           : "Send Request to Seller"}
//       </button>
//     </div>
//   );
// }





// src/pages/bikes/BuyBikes.jsx
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAllBikes } from "../../store/services/bikeServices";
import BikeCard from "../../components/Bike/buyer/BikeCard";

export default function BuyBikes() {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestingId, setRequestingId] = useState(null);
  const [bookedBikeIds, setBookedBikeIds] = useState(() => new Set());

  useEffect(() => {
    loadBikes();
  }, []);

  const loadBikes = async () => {
    try {
      setLoading(true);
      const data = await getAllBikes();
      setBikes(data);
    } catch (err) {
      toast.error("Failed to load bikes.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED handleSendRequest — uses buyerId only
  const handleSendRequest = async (bike) => {
    if (!bike?.bike_id) return;

    // Correct buyerId (buyer table PK)
    const buyerId = Number(localStorage.getItem("buyerId"));

    if (!buyerId) {
      toast.error("Buyer ID not found. Please login again.");
      return;
    }

    const payload = {
      bikeId: bike.bike_id,
      buyerId: buyerId, // ✔ correct ID
      message: "Hi, I am interested in this bike.",
    };

    setRequestingId(bike.bike_id);

    try {
      const resp = await fetch("http://localhost:8087/bikes/bookings/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await resp.json();

      if (!resp.ok) {
        const errorMessage = data.message || "Failed to send request";

        toast.error(errorMessage);

        // SPECIAL HANDLING: Already created booking
        if (errorMessage.includes("already created a booking")) {
          setBookedBikeIds((prev) => {
            const next = new Set(prev);
            next.add(bike.bike_id);
            return next;
          });
        }

        return;
      }

      toast.success("Request sent successfully!");

      setBookedBikeIds((prev) => {
        const next = new Set(prev);
        next.add(bike.bike_id);
        return next;
      });
    } catch (err) {
      toast.error("Network error while sending request.");
    } finally {
      setRequestingId(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-2">Bikes</h2>
      <p className="text-gray-600 mb-6">
        Find your next bike from our listings.
      </p>

      {loading ? (
        <p>Loading bikes...</p>
      ) : bikes.length === 0 ? (
        <p>No bikes found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {bikes.map((bike) => (
            <BikeCard
              key={bike.bike_id}
              bike={bike}
              onRequest={handleSendRequest}
              requesting={requestingId === bike.bike_id}
              isBooked={bookedBikeIds.has(bike.bike_id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
