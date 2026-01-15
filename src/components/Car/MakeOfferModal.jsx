// import React, { useState } from "react";
// import { createBooking } from "../../store/services/carBookingServices";

// import { toast } from "react-toastify";

// export default function MakeOfferModal({ open, onClose, carId }) {
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   if (!open) return null;

//   const handleSubmit = async () => {
//     const buyerId = Number(localStorage.getItem("buyerId"));
//     const userId = Number(localStorage.getItem("buyerUserId"));

//     if (!buyerId || !userId) {
//       toast.error("Login again — buyer account not detected");
//       return;
//     }

//     const payload = {
//       carId: Number(carId),
//       buyerId,
//       userId,
//       message,
//     };

//     try {
//       setLoading(true);
//       const res = await createBooking(payload);
//       toast.success("Offer sent successfully");
//       onClose();
//     } catch (err) {
//       const msg =
//         err?.response?.data?.errorMessage ||
//         err?.response?.data?.message ||
//         err?.message ||
//         "Request failed";
//       toast.error(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//       <div className="bg-white w-full max-w-md rounded-lg p-6 shadow-lg">
//         <h2 className="text-xl font-semibold mb-4">Make an Offer</h2>

//         <textarea
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           placeholder="Write a message for the seller"
//           className="w-full border p-3 rounded-md h-28"
//         />

//         <div className="mt-5 flex gap-3">
//           <button
//             onClick={onClose}
//             className="flex-1 py-3 bg-gray-300 rounded-md"
//           >
//             Cancel
//           </button>

//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             className="flex-1 py-3 bg-blue-600 text-white rounded-md"
//           >
//             {loading ? "Sending..." : "Send Offer"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// import React, { useState } from "react";
// import { toast } from "react-toastify";

// import { createBooking } from "../../store/services/carBookingServices";
// import { createBikeBooking } from "../../store/services/bikeBookingServices";

// export default function MakeOfferModal({
//   open,
//   onClose,
//   carId,
//   bikeId,
//   type, // "car" | "bike"
// }) {
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   if (!open) return null;

//   const handleSubmit = async () => {
//     const buyerId = Number(localStorage.getItem("buyerId"));
//     const userId = Number(localStorage.getItem("buyerUserId"));
//     const offerType = (type || "").toLowerCase();

//     /* ================= VALIDATION ================= */
//     if (!buyerId || !userId) {
//       toast.error("Login again — buyer account not detected");
//       return;
//     }

//     if (offerType === "car" && !carId) {
//       toast.error("Invalid car selected");
//       return;
//     }

//     if (offerType === "bike" && !bikeId) {
//       toast.error("Invalid bike selected");
//       return;
//     }

//     if (!message.trim()) {
//       toast.error("Please enter a message");
//       return;
//     }

//     /* ================= DEBUG ================= */
//     console.log("🚀 MakeOffer payload:", {
//       type: offerType,
//       buyerId,
//       userId,
//       carId,
//       bikeId,
//       message,
//     });

//     try {
//       setLoading(true);

//       if (offerType === "car") {
//         await createBooking({
//           carId: Number(carId),
//           buyerId,
//           userId,
//           message,
//         });
//       } else if (offerType === "bike") {
//         // ✅ FIX: userId added
//         await createBikeBooking(Number(bikeId), buyerId, userId, message);
//       } else {
//         toast.error("Invalid offer type");
//         return;
//       }

//       toast.success("Offer sent successfully");
//       onClose();
//     } catch (err) {
//       const backendMessage = err?.response?.data?.message;

//       if (
//         backendMessage &&
//         backendMessage.includes("already created a booking")
//       ) {
//         toast.info("Offer already sent. Opening chat...");
//         onClose();
//         return;
//       }

//       toast.error(
//         backendMessage || err?.response?.data?.errorMessage || "Request failed"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//       <div className="bg-white w-full max-w-md rounded-lg p-6 shadow-lg">
//         <h2 className="text-xl font-semibold mb-4">Make an Offer</h2>

//         <textarea
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           placeholder="Write a message for the seller"
//           className="w-full border p-3 rounded-md h-28"
//         />

//         <div className="mt-5 flex gap-3">
//           <button
//             onClick={onClose}
//             className="flex-1 py-3 bg-gray-300 rounded-md"
//           >
//             Cancel
//           </button>

//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             className="flex-1 py-3 bg-blue-600 text-white rounded-md"
//           >
//             {loading ? "Sending..." : "Send Offer"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState } from "react";
import { toast } from "react-toastify";

import { sendBikeBookingMessage } from "../../store/services/bikeBookingServices";

export default function MakeOfferModal({
  open,
  onClose,
  bookingId, // ✅ REQUIRED
}) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!bookingId) {
      toast.error("Booking not found. Please try again.");
      return;
    }

    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    try {
      setLoading(true);

      // ✅ SEND MESSAGE API
      await sendBikeBookingMessage(bookingId, {
        message,
      });

      toast.success("Message sent successfully");
      setMessage("");
      onClose();
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
        err?.response?.data?.errorMessage ||
        "Failed to send message"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Send Message</h2>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write a message for the seller"
          className="w-full border p-3 rounded-md h-28"
        />

        <div className="mt-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-300 rounded-md"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-3 bg-blue-600 text-white rounded-md"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </div>
      </div>
    </div>
  );
}
