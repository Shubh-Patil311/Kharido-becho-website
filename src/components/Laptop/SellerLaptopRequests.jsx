// import React, { useEffect, useState } from "react";
// import { toast } from "react-toastify";

// import useSellerId from "../../pages/useSellerId";
// import {
//   getLaptopBookingsBySeller,
//   updateLaptopBookingStatus,
//   completeLaptopBooking,
// } from "../../store/services/laptopBookingServices";

// const SellerLaptopRequests = () => {
//   const { sellerId } = useSellerId();

//   const [sellerLaptopBookings, setSellerLaptopBookings] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const loadRequests = async () => {
//       if (!sellerId) return;

//       setLoading(true);
//       try {
//         const res = await getLaptopBookingsBySeller(sellerId);

//         const list = Array.isArray(res) ? res : [];
//         setSellerLaptopBookings(list);
//       } catch (err) {
//         console.error("Failed to load seller laptop requests:", err);
//         toast.error("Failed to load laptop requests");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadRequests();
//   }, [sellerId]);

//   return (
//     <div>
//       {loading ? (
//         <p>Loading...</p>
//       ) : sellerLaptopBookings.length === 0 ? (
//         <p className="text-red-400">No laptop requests</p>
//       ) : (
//         sellerLaptopBookings.map((booking) => (
//           <div
//             key={booking.laptopBookingId}
//             className="bg-white p-4 rounded shadow mb-4"
//           >
//             <h3 className="font-semibold">
//               Laptop Request #{booking.laptopBookingId}
//             </h3>

//             <p className="text-sm">Laptop ID: {booking.laptopId}</p>
//             <p className="text-sm">Buyer ID: {booking.buyerId}</p>
//             <p className="text-sm">Status: {booking.status}</p>

//             <div className="flex gap-2 mt-3">
//               <button
//                 className="px-3 py-1 border rounded hover:bg-red-100"
//                 onClick={async () => {
//                   try {
//                     await updateLaptopBookingStatus(
//                       booking.laptopBookingId,
//                       "REJECTED"
//                     );

//                     toast.success("Laptop rejected");

//                     setSellerLaptopBookings((prev) =>
//                       prev.map((b) =>
//                         b.laptopBookingId === booking.laptopBookingId
//                           ? { ...b, status: "REJECTED" }
//                           : b
//                       )
//                     );
//                   } catch {
//                     toast.error("Failed to reject laptop");
//                   }
//                 }}
//               >
//                 Reject
//               </button>

//               <button
//                 className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
//                 onClick={async () => {
//                   try {
//                     await completeLaptopBooking(booking.laptopBookingId);

//                     toast.success("Laptop marked SOLD");

//                     setSellerLaptopBookings((prev) =>
//                       prev.map((b) =>
//                         b.laptopBookingId === booking.laptopBookingId
//                           ? { ...b, status: "COMPLETED" }
//                           : b
//                       )
//                     );
//                   } catch {
//                     toast.error("Failed to complete booking");
//                   }
//                 }}
//               >
//                 Mark Sold
//               </button>
//             </div>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default SellerLaptopRequests;

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useSellerId from "../../pages/useSellerId";
import { getLaptopBookingsBySeller } from "../../store/services/laptopBookingServices";

const SellerLaptopRequests = () => {
  const { sellerId } = useSellerId();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!sellerId) return;

    const load = async () => {
      try {
        setLoading(true);
        const data = await getLaptopBookingsBySeller(sellerId);
        setRequests(data || []);
      } catch {
        toast.error("Failed to load requests");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [sellerId]);

  if (loading) return <p>Loading...</p>;
  if (!requests.length) return <p className="text-red-400">No requests</p>;

  return (
    <div className="space-y-4">
      {requests.map((r) => (
        <div key={r.laptopBookingId} className="bg-white p-4 rounded shadow">
          <p>
            <b>Buyer:</b> {r.buyerName}
          </p>
          <p>
            <b>Status:</b> {r.status}
          </p>

          <div className="flex justify-end mt-3">
            <button
              onClick={() =>
                navigate(`/seller/chat/laptop/${r.laptopBookingId}`)
              }
              className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Chat
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SellerLaptopRequests;
