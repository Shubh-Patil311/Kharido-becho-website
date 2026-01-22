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

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { getAllBikes } from "../../store/services/bikeServices";
// import { MdStar, MdStarBorder, MdCalendarToday, MdSpeed } from "react-icons/md";
// import { FaTachometerAlt, FaGasPump } from "react-icons/fa";

// export default function BuyBikes() {
//   const [bikes, setBikes] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   // FETCH ALL BIKES
//   const fetchBikes = async () => {
//     setLoading(true);
//     setError("");

//     try {
//       const data = await getAllBikes();
//       setBikes(data);
//     } catch (err) {
//       setError("Failed to fetch bikes");
//       toast.error("Unable to load bikes. Please try again.");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBikes();
//   }, []);

//   // Format price
//   const formatPrice = (price) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 0,
//     }).format(price);
//   };

//   // Generate rating stars
//   const renderRating = (rating = 4) => {
//     const stars = [];
//     for (let i = 1; i <= 5; i++) {
//       stars.push(
//         i <= rating ? (
//           <MdStar key={i} className="text-yellow-500 text-sm" />
//         ) : (
//           <MdStarBorder key={i} className="text-gray-300 text-sm" />
//         )
//       );
//     }
//     return stars;
//   };

//   // Handle navigation to bike detail page
//   const handleViewDetails = (e, bike) => {
//     e.stopPropagation();
//     console.log("Bike data:", bike);
//     console.log("Bike ID:", bike.bike_id);
//     console.log("Attempting to navigate...");

//     // Try different route patterns - ONE OF THESE SHOULD WORK
//     const routesToTry = [
//       `/bike/${bike.bike_id}`,
//       `/bikes/${bike.bike_id}`,
//       `/buy/bike/${bike.bike_id}`,
//       `/bike-details/${bike.bike_id}`,
//       `/bike/${bike.id}`,
//       `/bikes/${bike.id}`,
//     ];

//     // Try each route and see which one works
//     for (const route of routesToTry) {
//       console.log("Trying route:", route);
//       navigate(route);
//       break; // Remove this break to try all routes, but usually first one works
//     }
//   };

//   // Handle card click
//   const handleCardClick = (bike) => {
//     console.log("Card clicked for bike:", bike.bike_id);
//     navigate(`/bike/${bike.bike_id}`);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Hero Header */}
//       <div className="bg-gradient-to-r from-blue-600 to-teal-500 text-white py-8 px-4">
//         <div className="container mx-auto">
//           <h1 className="text-3xl md:text-4xl font-bold mb-3">Browse Bikes</h1>
//           <p className="text-lg text-blue-100">
//             Find pre-owned and new bikes with verified quality
//           </p>
//           <div className="mt-4 text-blue-100 text-sm bg-white/20 inline-block px-4 py-1 rounded-full">
//             {bikes.length} bikes available
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="container mx-auto px-4 py-8">
//         {/* Loading State */}
//         {loading && (
//           <div className="text-center py-12">
//             <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
//             <p className="text-gray-600 text-lg">Loading bikes...</p>
//           </div>
//         )}

//         {/* Error State */}
//         {error && !loading && (
//           <div className="text-center py-12">
//             <div className="text-red-500 text-5xl mb-4">⚠️</div>
//             <p className="text-gray-600 text-lg mb-3">{error}</p>
//             <button
//               onClick={fetchBikes}
//               className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
//             >
//               Try Again
//             </button>
//           </div>
//         )}

//         {/* Empty State */}
//         {!loading && bikes.length === 0 && (
//           <div className="text-center py-12">
//             <div className="text-gray-400 text-6xl mb-4">🏍️</div>
//             <h3 className="text-xl font-semibold text-gray-700 mb-2">
//               No bikes available
//             </h3>
//             <p className="text-gray-500">Check back later for new listings</p>
//           </div>
//         )}

//         {/* Bikes Grid */}
//         {!loading && bikes.length > 0 && (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {bikes.map((bike) => {
//               const firstPhoto =
//                 bike?.bikePhotos?.length > 0
//                   ? bike.bikePhotos[0].photo_link ||
//                     bike.bikePhotos[0].image_link
//                   : "https://images.unsplash.com/photo-1558981001-792f6c0d5068?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80";

//               const price = bike.prize ?? bike.price ?? 0;

//               return (
//                 <div
//                   key={bike.bike_id}
//                   className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer border border-gray-100"
//                   onClick={() => handleCardClick(bike)}
//                 >
//                   {/* Image Container */}
//                   <div className="relative h-48 overflow-hidden bg-gray-100">
//                     <img
//                       src={firstPhoto}
//                       alt={`${bike.brand} ${bike.model}`}
//                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                     />
//                     {/* Status Badge */}
//                     {bike.status && (
//                       <div className="absolute top-3 left-3">
//                         <span
//                           className={`px-3 py-1 rounded-full text-xs font-medium ${
//                             bike.status === "SOLD"
//                               ? "bg-red-100 text-red-800"
//                               : bike.status === "PENDING"
//                               ? "bg-yellow-100 text-yellow-800"
//                               : "bg-green-100 text-green-800"
//                           }`}
//                         >
//                           {bike.status}
//                         </span>
//                       </div>
//                     )}
//                     {/* Owner Type Badge */}
//                     {bike.ownerType && (
//                       <div className="absolute top-3 right-3">
//                         <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
//                           {bike.ownerType}
//                         </span>
//                       </div>
//                     )}
//                   </div>

//                   {/* Content */}
//                   <div className="p-4">
//                     {/* Brand & Model */}
//                     <h3 className="font-bold text-gray-800 text-lg mb-1 truncate">
//                       {bike.brand} {bike.model}
//                     </h3>

//                     {/* Specs */}
//                     <div className="space-y-2 mb-4">
//                       {bike.manufactureYear && (
//                         <div className="flex items-center text-gray-600 text-sm">
//                           <MdCalendarToday className="mr-2 text-gray-400" />
//                           <span>{bike.manufactureYear}</span>
//                         </div>
//                       )}

//                       {bike.kilometersDriven && (
//                         <div className="flex items-center text-gray-600 text-sm">
//                           <FaTachometerAlt className="mr-2 text-gray-400" />
//                           <span>{bike.kilometersDriven} km</span>
//                         </div>
//                       )}

//                       {bike.fuelType && (
//                         <div className="flex items-center text-gray-600 text-sm">
//                           <FaGasPump className="mr-2 text-gray-400" />
//                           <span>{bike.fuelType}</span>
//                         </div>
//                       )}

//                       {bike.engineCapacity && (
//                         <div className="flex items-center text-gray-600 text-sm">
//                           <MdSpeed className="mr-2 text-gray-400" />
//                           <span>{bike.engineCapacity} CC</span>
//                         </div>
//                       )}
//                     </div>

//                     {/* Price & Rating */}
//                     <div className="flex items-center justify-between pt-3 border-t border-gray-100">
//                       <div>
//                         <p className="text-2xl font-bold text-blue-600">
//                           {formatPrice(price)}
//                         </p>
//                         {bike.originalPrice && (
//                           <p className="text-sm text-gray-500 line-through">
//                             {formatPrice(bike.originalPrice)}
//                           </p>
//                         )}
//                       </div>

//                       {/* Rating */}
//                       <div className="flex items-center">
//                         {renderRating()}
//                         <span className="ml-1 text-sm text-gray-500">
//                           (4.0)
//                         </span>
//                       </div>
//                     </div>

//                     {/* View Button - Only this button */}
//                     <button
//                       onClick={(e) => handleViewDetails(e, bike)}
//                       className="mt-4 w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
//                     >
//                       View Details
//                     </button>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {/* Stats Bar */}
//         {!loading && bikes.length > 0 && (
//           <div className="mt-10 pt-6 border-t border-gray-200">
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
//               <div className="bg-white p-4 rounded-lg shadow-sm">
//                 <div className="text-2xl font-bold text-blue-600">
//                   {bikes.length}
//                 </div>
//                 <div className="text-gray-600 text-sm">Total Bikes</div>
//               </div>
//               <div className="bg-white p-4 rounded-lg shadow-sm">
//                 <div className="text-2xl font-bold text-blue-600">
//                   {bikes.filter((b) => b.fuelType === "PETROL").length}
//                 </div>
//                 <div className="text-gray-600 text-sm">Petrol Bikes</div>
//               </div>
//               <div className="bg-white p-4 rounded-lg shadow-sm">
//                 <div className="text-2xl font-bold text-blue-600">
//                   {bikes.filter((b) => b.fuelType === "ELECTRIC").length}
//                 </div>
//                 <div className="text-gray-600 text-sm">Electric Bikes</div>
//               </div>
//               <div className="bg-white p-4 rounded-lg shadow-sm">
//                 <div className="text-2xl font-bold text-blue-600">
//                   {Math.round(
//                     bikes.reduce(
//                       (sum, bike) => sum + (bike.prize ?? bike.price ?? 0),
//                       0
//                     ) / bikes.length || 0
//                   ).toLocaleString("en-IN")}
//                 </div>
//                 <div className="text-gray-600 text-sm">Average Price</div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
