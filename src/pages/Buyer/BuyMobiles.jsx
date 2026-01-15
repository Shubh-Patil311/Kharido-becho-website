// import React, { useEffect, useState } from "react";
// import { getAllMobiles } from "../../store/services/mobileServices";

// export default function BuyMobiles() {
//   const [mobiles, setMobiles] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadMobiles();
//   }, []);

//   const loadMobiles = async () => {
//     try {
//       setLoading(true);

//       const data = await getAllMobiles(0, 100); // returns data.content
//       setMobiles(data);
//     } catch (err) {
//       console.error("Failed to load mobiles", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       {/* TITLE */}
//       <h2 className="text-3xl font-bold mb-2">Browse Mobiles</h2>
//       <p className="text-gray-600 mb-6">
//         Find your next smartphone from verified sellers.
//       </p>

//       {loading ? (
//         <p className="text-gray-700 text-lg">Loading mobiles...</p>
//       ) : mobiles.length === 0 ? (
//         <p className="text-gray-600">No mobiles available right now.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {mobiles.map((mobile) => (
//             <MobileCard key={mobile.mobileId} mobile={mobile} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// /* ----------------------------------------------------
//                   MOBILE CARD COMPONENT
// ----------------------------------------------------- */

// function MobileCard({ mobile }) {
//   const imageUrl =
//     mobile.images?.[0] || "https://via.placeholder.com/350x230?text=No+Image";

//   return (
//     <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition p-3">
//       {/* IMAGE */}
//       <div className="w-full h-44 rounded-md overflow-hidden">
//         <img
//           src={imageUrl}
//           alt={mobile.title}
//           className="w-full h-full object-cover"
//         />
//       </div>

//       {/* DETAILS */}
//       <div className="mt-3 space-y-1">
//         <h3 className="text-lg font-semibold">
//           {mobile.brand} {mobile.model}
//         </h3>

//         <p className="text-gray-600 text-sm">
//           {mobile.yearOfPurchase
//             ? `Purchased: ${mobile.yearOfPurchase}`
//             : "Year N/A"}
//         </p>

//         <p className="text-gray-600 text-sm">Condition: {mobile.condition}</p>

//         <p className="text-green-600 font-bold text-lg">
//           ₹ {Number(mobile.price).toLocaleString()}
//         </p>
//       </div>

//       {/* BUTTON */}
//       <button
//         className="w-full mt-3 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700"
//         onClick={() => alert("Mobile details page coming soon")}
//       >
//         View Details
//       </button>
//     </div>
//   );
// }






// src/pages/mobiles/BuyMobiles.jsx
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAllMobiles } from "../../store/services/mobileServices";
import MobileCard from "../../components/Mobile/Buyer/MobileCard";

export default function BuyMobiles() {
  const [mobiles, setMobiles] = useState([]);
  const [filteredMobiles, setFilteredMobiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestingId, setRequestingId] = useState(null);
  const [bookedMobileIds, setBookedMobileIds] = useState(() => new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCondition, setFilterCondition] = useState("All");

  useEffect(() => {
    loadMobiles();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [mobiles, searchTerm, filterCondition]);

  const loadMobiles = async () => {
    try {
      setLoading(true);
      const data = await getAllMobiles();
      setMobiles(data);
    } catch (err) {
      toast.error("Failed to load mobiles.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ SEND REQUEST (MOBILE)
  const handleSendRequest = async (mobile) => {
    if (!mobile?.id) return;

    const buyerId = Number(localStorage.getItem("buyerId"));

    if (!buyerId) {
      toast.error("Buyer ID not found. Please login again.");
      return;
    }

    const payload = {
      mobileId: mobile.id,
      buyerId,
      message: "Hi, I am interested in this mobile.",
    };

    setRequestingId(mobile.id);

    try {
      const resp = await fetch(
        "http://localhost:8087/mobiles/bookings/post",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await resp.json();

      if (!resp.ok) {
        const errorMessage = data.message || "Failed to send request";
        toast.error(errorMessage);

        if (errorMessage.includes("already created")) {
          setBookedMobileIds((prev) => new Set(prev).add(mobile.id));
        }
        return;
      }

      toast.success("Request sent successfully!");
      setBookedMobileIds((prev) => new Set(prev).add(mobile.id));
    } catch {
      toast.error("Network error while sending request.");
    } finally {
      setRequestingId(null);
    }
  };

  // ================= FILTER & SEARCH =================
  const applyFilters = () => {
    let filtered = [...mobiles];

    // Search by brand, model, or location
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.brand?.toLowerCase().includes(term) ||
          m.model?.toLowerCase().includes(term) ||
          m.location?.toLowerCase().includes(term)
      );
    }

    // Filter by condition
    if (filterCondition !== "All") {
      filtered = filtered.filter((m) => m.condition === filterCondition);
    }

    setFilteredMobiles(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ================= HERO HEADER ================= */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-500 text-white py-8 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Browse Mobiles
          </h1>

          <p className="text-lg text-indigo-100">
            Buy verified new & used smartphones from trusted sellers
          </p>

          <div className="mt-4 text-indigo-100 text-sm bg-white/20 inline-block px-4 py-1 rounded-full">
            {mobiles.length} mobiles available
          </div>

          {/* ================= SEARCH & FILTER ================= */}
          <div className="mt-6 flex flex-col md:flex-row md:items-center md:gap-4">
            <input
              type="text"
              placeholder="Search by brand, model, location..."
              className="w-full md:w-1/2 px-4 py-3 rounded-xl text-gray-800 shadow mb-4 md:mb-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

          </div>
        </div>
      </div>

      {/* ================= MOBILE LIST ================= */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <p>Loading mobiles...</p>
        ) : filteredMobiles.length === 0 ? (
          <p>No mobiles found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMobiles.map((mobile) => (
              <MobileCard
                key={mobile.id}
                mobile={mobile}
                onRequest={handleSendRequest}
                requesting={requestingId === mobile.id}
                isBooked={bookedMobileIds.has(mobile.id)}
              />
            ))}
          </div>
        )}

        {/* ================= STATS BAR (BOTTOM) ================= */}
        {!loading && mobiles.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <Stat title="Total Mobiles" value={mobiles.length} />

              <Stat
                title="Lowest Price"
                value={Math.min(...mobiles.map((m) => m.price))}
              />

              <Stat
                title="Highest Price"
                value={Math.max(...mobiles.map((m) => m.price))}
              />

              <Stat
                title="Average Price"
                value={Math.round(
                  mobiles.reduce((sum, m) => sum + m.price, 0) / mobiles.length
                )}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= STAT COMPONENT ================= */
function Stat({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-5 text-center">
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <p className="text-2xl font-bold text-indigo-600">
        ₹ {value.toLocaleString()}
      </p>
    </div>
  );
}

