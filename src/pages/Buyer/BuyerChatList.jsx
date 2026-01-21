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
import BuyerChatInterface from "../../components/Chat/BuyerChatInterface";

import { getBookingsForBuyer } from "../../store/services/bikeBookingServices";
import { getMobileRequestsByBuyer } from "../../store/services/mobileRequestServices";
import { getLaptopBookingsByBuyer } from "../../store/services/laptopBookingServices";

import ChatListItem from "../../components/Chat/ChatListItem";

const BuyerChatList = () => {
  const navigate = useNavigate();

  const [selectedChat, setSelectedChat] = useState(null);
  const [activeTab, setActiveTab] = useState("BIKE"); // Default to BIKE since CAR has dummy data

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

  // Reset selection when tab changes or scroll to top on selection
  useEffect(() => {
    if (selectedChat) {
      window.scrollTo(0, 0);
    }
  }, [selectedChat]);

  useEffect(() => {
    setSelectedChat(null);
  }, [activeTab]);

  // ---------------- LOAD CHATS ----------------
  useEffect(() => {
    const buyerId = Number(localStorage.getItem("buyerId"));
    if (!buyerId) return;

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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Group Title and Tabs in one sticky container */}
      <div className="sticky top-16 md:top-[4.5rem] lg:top-20 z-30 bg-gray-50 px-4 pt-4 shadow-sm transition-all duration-300">
        <h1 className="text-2xl font-bold mb-4">My Requests</h1>

        {/* Product Buttons */}
        <div className="flex gap-4 pb-4 border-b border-gray-200 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {["CAR", "BIKE", "MOBILE", "LAPTOP"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 px-6 py-2 rounded-full font-bold transition-all duration-200 ${activeTab === tab
                ? "bg-blue-600 text-white shadow-lg scale-105"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 container mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT SIDE: LIST */}
          <div className={`lg:col-span-5 xl:col-span-4 space-y-4 ${selectedChat ? 'hidden lg:block' : 'block'}`}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                <h2 className="font-bold text-gray-700 uppercase tracking-wider text-sm">
                  {activeTab} Chats
                </h2>
              </div>

              <div className="max-h-[calc(100vh-320px)] overflow-y-auto custom-scrollbar p-2 space-y-2">
                {loading ? (
                  <div className="text-center py-12 text-gray-400">Loading...</div>
                ) : chats.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <p>No requests yet</p>
                  </div>
                ) : (
                  chats.map((chat) => (
                    <div
                      key={chat.bookingId}
                      onClick={() => setSelectedChat(chat)}
                      className={`transition-all duration-200 ${selectedChat?.bookingId === chat.bookingId
                        ? "ring-2 ring-blue-500 rounded-lg"
                        : ""
                        }`}
                    >
                      <ChatListItem
                        title={chat.title}
                        subtitle={`Seller: ${chat.sellerName}`}
                        status={chat.status}
                        tag={activeTab}
                        onClick={() => setSelectedChat(chat)}
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: CHAT */}
          <div className={`lg:col-span-7 xl:col-span-8 sticky top-[16rem] md:top-[12.5rem] lg:top-[14rem] h-[calc(100vh-240px)] ${!selectedChat ? 'hidden lg:flex' : 'flex'} flex-col`}>
            {selectedChat ? (
              <div className="flex-1 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden flex flex-col">
                <BuyerChatInterface
                  bookingId={selectedChat.bookingId}
                  chatType={activeTab}
                  bookingStatus={selectedChat.status}
                  onClose={() => setSelectedChat(null)}
                  isEmbedded={true}
                />
              </div>
            ) : (
              <div className="flex-1 bg-white rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-12 text-center text-gray-400">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-600 mb-2">Select a Conversation</h3>
                <p className="max-w-xs text-sm">
                  Click on any request on the left to view the messages and chat with the seller.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerChatList;
