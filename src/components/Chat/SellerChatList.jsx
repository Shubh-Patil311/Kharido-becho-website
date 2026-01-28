// import React, { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import SellerChatThread from "./SellerChatThread";
// import { getPendingBikeBookings } from "../../store/services/bikeBookingServices";

// import ChatListItem from "./ChatListItem";

// const SellerChatList = () => {
//   const sellerId = Number(localStorage.getItem("sellerId"));

//   const [chats, setChats] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedChat, setSelectedChat] = useState(null);
//   console.log(selectedChat, "selectedChat");
//   useEffect(() => {
//     const loadPending = async () => {
//       try {
//         setLoading(true);

//         const data = await getPendingBikeBookings();

//         const formatted = data.map((b) => ({
//           bookingId: b.bookingId || b.id,
//           title: `${b.bike?.brand || ""} ${b.bike?.model || ""}`,
//           buyerName: `${b.buyer?.user?.firstName || ""} ${b.buyer?.user?.lastName || ""
//             }`,
//           status: b.status || b.bookingStatus || "PENDING",
//         }));

//         setChats(formatted);
//       } catch (err) {
//         console.error("Failed to load pending bike chats", err);
//         toast.error("Failed to load pending bike chats");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadPending();
//   }, [sellerId]);

//   console.log(selectedChat, "selectedChat");
//   // Inline thread rendering
//   if (selectedChat) {
//     return (
//       <SellerChatThread
//         bookingId={selectedChat.bookingId}
//         bookingStatus={selectedChat.status}
//         chatType="BIKE" // or whatever tab you are on
//         chatTitle={selectedChat.title}
//         chatSubtitle={selectedChat.buyerName}
//         onBack={() => setSelectedChat(null)}
//       />
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="bg-white border-b px-4 py-3">
//         <h1 className="text-xl font-bold">PENDING BIKE REQUESTS</h1>
//       </div>

//       <div className="p-4">
//         {loading ? (
//           <p className="text-center text-gray-500">Loading...</p>
//         ) : chats.length === 0 ? (
//           <div className="text-center py-12 text-gray-400">
//             <p>No pending bike requests</p>
//           </div>
//         ) : (
//           <div className="space-y-3">
//             {(chats || []).map((chat) => (
//               <ChatListItem
//                 key={chat.bookingId}
//                 title={chat.title}
//                 subtitle={`Buyer: ${chat.buyerName}`}
//                 status={chat.status}
//                 onClick={() => setSelectedChat(chat)}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SellerChatList;



import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import SellerChatThread from "./SellerChatThread";
import { getPendingBikeBookings } from "../../store/services/bikeBookingServices";

import ChatListItem from "./ChatListItem";

const SellerChatList = () => {
  const sellerId = Number(localStorage.getItem("sellerId"));

  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);
  console.log(selectedChat, "selectedChat");
  useEffect(() => {
    const loadPending = async () => {
      try {
        setLoading(true);

        const data = await getPendingBikeBookings();

        const formatted = data.map((b) => ({
          bookingId: b.bookingId || b.id,
          title: `${b.bike?.brand || ""} ${b.bike?.model || ""}`,
          buyerName: `${b.buyer?.user?.firstName || ""} ${b.buyer?.user?.lastName || ""
            }`,
          status: b.status || b.bookingStatus || "PENDING",
        }));

        setChats(formatted);
      } catch (err) {
        console.error("Failed to load pending bike chats", err);
        toast.error("Failed to load pending bike chats");
      } finally {
        setLoading(false);
      }
    };

    loadPending();
  }, [sellerId]);

  console.log(selectedChat, "selectedChat");
  // Inline thread rendering
  if (selectedChat) {
    return (
      <SellerChatThread
        bookingId={selectedChat.bookingId}
        bookingStatus={selectedChat.status}
        chatType="BIKE" // or whatever tab you are on
        chatTitle={selectedChat.title}
        chatSubtitle={selectedChat.buyerName}
        onBack={() => setSelectedChat(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-white border-b px-4 py-3">
        <h1 className="text-xl font-bold">PENDING BIKE REQUESTS</h1>
      </div>

      <div className="p-4">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : chats.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>No pending bike requests</p>
          </div>
        ) : (
          <div className="space-y-3">
            {(chats || []).map((chat) => (
              <ChatListItem
                key={chat.bookingId}
                title={chat.title}
                subtitle={`Buyer: ${chat.buyerName}`}
                status={chat.status}
                onClick={() => setSelectedChat(chat)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerChatList;
