// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import BuyerChatThread from "./BuyerChatThread";

// import { getBookingsForBuyer } from "../../store/services/bikeBookingServices";
// import { getMobileRequestsByBuyer } from "../../store/services/mobileRequestServices";

// import ChatListItem from "../../components/Chat/ChatListItem";

// const BuyerChatList = () => {
//   // State for inline master-detail view
//   const [selectedChat, setSelectedChat] = useState(null);

//   const [activeTab, setActiveTab] = useState("CAR");
//   const [bikeChats, setBikeChats] = useState([]);
//   const [mobileChats, setMobileChats] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // 🔹 Static dummy data (unchanged)
//   const chatsByType = {
//     CAR: [
//       {
//         bookingId: 1,
//         title: "Honda City",
//         sellerName: "Rahul",
//         status: "PENDING",
//       },
//     ],
//     MOBILE: [],
//     LAPTOP: [
//       {
//         bookingId: 4,
//         title: "MacBook Air",
//         sellerName: "Neha",
//         status: "APPROVED",
//       },
//     ],
//   };

//   // ---------------- LOAD BIKE BOOKINGS ----------------
//   useEffect(() => {
//     const loadBikeChats = async () => {
//       const buyerId = Number(localStorage.getItem("buyerId"));

//       if (!buyerId) {
//         toast.error("Buyer not logged in");
//         return;
//       }

//       try {
//         setLoading(true);
//         const data = await getBookingsForBuyer(buyerId);
//         console.log(data, "data =====");
//         // 🔁 Normalize backend response
//         const formatted = data.map((b) => ({
//           bookingId: b.bookingId || b.id,
//           title: `${b.bike?.brand || ""} ${b.bike?.model || ""}`,
//           sellerName: b?.bike?.seller?.user?.firstName || "Seller",
//           status: b.status || "PENDING",
//         }));
//         console.log(formatted, "formatted =====");
//         setBikeChats(formatted);
//       } catch (err) {
//         toast.error("Failed to load bike chats");
//       } finally {
//         setLoading(false);
//       }
//     };

//     const loadMobileChats = async () => {
//       const buyerId = Number(localStorage.getItem("buyerId"));

//       if (!buyerId) {
//         // toast.error("Buyer not logged in");
//         return;
//       }

//       try {
//         setLoading(true);
//         const data = await getMobileRequestsByBuyer(buyerId);
//         console.log(data, "mobile data =====");

//         // 🔁 Normalize backend response
//         const formatted = data.map((m) => ({
//           bookingId: m.requestId || m.id,
//           title: `${m.mobile?.brand || ""} ${m.mobile?.model || ""}`,
//           sellerName: m?.mobile?.seller?.firstName || "Seller",
//           status: m.status || "PENDING",
//         }));
//         setMobileChats(formatted);
//       } catch (err) {
//         toast.error("Failed to load mobile chats");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (activeTab === "BIKE") {
//       loadBikeChats();
//     } else if (activeTab === "MOBILE") {
//       loadMobileChats();
//     }
//   }, [activeTab]);

//   const chats =
//     activeTab === "BIKE"
//       ? bikeChats
//       : activeTab === "MOBILE"
//         ? mobileChats
//         : chatsByType[activeTab];

//   // Master-Detail View
//   if (selectedChat) {
//     return (
//       <BuyerChatThread
//         bookingId={selectedChat.bookingId}
//         chatType={activeTab}
//         chatTitle={selectedChat.title}
//         chatSubtitle={selectedChat.sellerName}
//         onBack={() => setSelectedChat(null)}
//       />
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Header */}
//       <div className="bg-white border-b px-4 py-3">
//         <h1 className="text-xl font-bold">Requests</h1>
//       </div>

//       {/* Tabs */}
//       <div className="bg-white border-b px-4">
//         <div className="flex space-x-6 text-sm font-semibold">
//           {["CAR", "BIKE", "MOBILE", "LAPTOP"].map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`py-3 border-b-2 ${activeTab === tab
//                 ? "border-blue-600 text-blue-600"
//                 : "border-transparent text-gray-500 hover:text-gray-700"
//                 }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Content */}
//       <div className="p-4">
//         {loading ? (
//           <div className="text-center py-12 text-gray-400">
//             Loading...
//           </div>
//         ) : chats.length === 0 ? (
//           <div className="text-center py-12 text-gray-400">
//             <p>No requests yet</p>
//           </div>
//         ) : (
//           <div className="space-y-3">
//             {chats.map((chat) => (
//               <ChatListItem
//                 key={chat.bookingId}
//                 title={chat.title}
//                 subtitle={`Seller: ${chat.sellerName}`}
//                 status={chat.status}
//                 tag={activeTab}
//                 onClick={() => setSelectedChat(chat)}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BuyerChatList;

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
 
import BuyerChatThread from "./BuyerChatThread";
 

import { getBookingsForBuyer } from "../../store/services/bikeBookingServices";
import { getMobileRequestsByBuyer } from "../../store/services/mobileRequestServices";
import { getLaptopBookingsByBuyer } from "../../store/services/laptopBookingServices";

import ChatListItem from "../../components/Chat/ChatListItem";

const BuyerChatList = () => {
  const navigate = useNavigate();

  const [selectedChat, setSelectedChat] = useState(null);
  const [activeTab, setActiveTab] = useState("CAR");

  const [bikeChats, setBikeChats] = useState([]);
  const [mobileChats, setMobileChats] = useState([]);
  const [laptopChats, setLaptopChats] = useState([]);

  const [loading, setLoading] = useState(false);

  // Dummy CAR data
  const chatsByType = {
    CAR: [
      {
        bookingId: 1,
        title: "Honda City",
        sellerName: "Rahul",
        status: "PENDING",
      },
    ],
  };

  // ---------------- LOAD CHATS ----------------
  useEffect(() => {
    const buyerId = Number(localStorage.getItem("buyerId"));
    if (!buyerId) return toast.error("Buyer not logged in");

    const loadBikeChats = async () => {
      const data = await getBookingsForBuyer(buyerId);
      setBikeChats(
        data.map((b) => ({
          bookingId: b.bookingId || b.id,
          title: `${b.bike?.brand || ""} ${b.bike?.model || ""}`,
          sellerName: b?.bike?.seller?.user?.firstName || "Seller",
          status: b.status || "PENDING",
        }))
      );
    };

    const loadMobileChats = async () => {
      const data = await getMobileRequestsByBuyer(buyerId);
      setMobileChats(
        data.map((m) => ({
          bookingId: m.requestId || m.id,
          title: `${m.mobile?.brand || ""} ${m.mobile?.model || ""}`,
          sellerName: m?.mobile?.seller?.firstName || "Seller",
          status: m.status || "PENDING",
        }))
      );
    };

    const loadLaptopChats = async () => {
      const data = await getLaptopBookingsByBuyer(buyerId);
      setLaptopChats(
        data.map((l) => ({
          bookingId: l.laptopBookingId || l.id,
          title: `${l.laptop?.brand || ""} ${l.laptop?.model || "Laptop"}`,
          sellerName: l?.seller?.user?.firstName || "Seller",
          status: l.status || "PENDING",
        }))
      );
    };

    const load = async () => {
      try {
        setLoading(true);
        if (activeTab === "BIKE") await loadBikeChats();
        if (activeTab === "MOBILE") await loadMobileChats();
        if (activeTab === "LAPTOP") await loadLaptopChats();
      } catch {
        toast.error("Failed to load chats");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [activeTab]);

  const chats =
    activeTab === "BIKE"
      ? bikeChats
      : activeTab === "MOBILE"
      ? mobileChats
      : activeTab === "LAPTOP"
      ? laptopChats
      : chatsByType[activeTab];

  // ---------------- MASTER → DETAIL VIEW ----------------
  if (selectedChat) {
    return (
      <BuyerChatThread
        bookingId={selectedChat.bookingId}
        chatType={activeTab}
        chatTitle={selectedChat.title}
        chatSubtitle={selectedChat.sellerName}
        onBack={() => setSelectedChat(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border-b px-4 py-3">
        <h1 className="text-xl font-bold">Requests</h1>
      </div>

      <div className="bg-white border-b px-4">
        <div className="flex space-x-6 text-sm font-semibold">
          {["CAR", "BIKE", "MOBILE", "LAPTOP"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 border-b-2 ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : chats.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>No requests yet</p>
          </div>
 
        ) : (
          <div className="space-y-3">
            {chats.map((chat) => (
              <ChatListItem
                key={chat.bookingId}
                title={chat.title}
                subtitle={`Seller: ${chat.sellerName}`}
                status={chat.status}
                tag={activeTab}
                onClick={() => {
                  if (activeTab === "LAPTOP") {
                    navigate(`/chat/laptop/${chat.bookingId}`);
                  } else {
                    setSelectedChat(chat);
                  }
                }}
              />
            ))} 
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerChatList;
