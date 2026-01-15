// /**
//  * BottomBar Component
//  *
//  * Bottom navigation bar that appears for GUEST and BUYER users.
//  * Hidden for SELLER users.
//  *
//  * Uses AuthContext to determine user role and conditionally render.
//  */

// import { Link, useLocation } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";

// export default function BottomBar() {
//   const location = useLocation();
//   const { roles } = useAuth();

//   // Check if user is a seller
//   const isSeller = roles.includes("SELLER");

//   // Hide bottom bar for sellers
//   if (isSeller) {
//     return null;
//   }

//   // Determine if current route is active
//   const isActive = (path) => location.pathname === path;

//   return (
//     <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 md:hidden">
//       <div className="flex items-center justify-around h-16">
//         {/* Home */}
//         <Link
//           to="/"
//           className={`flex flex-col items-center justify-center flex-1 h-full ${
//             isActive("/") ? "text-blue-600" : "text-gray-600"
//           }`}
//         >
//           <svg
//             className="w-6 h-6 mb-1"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
//             />
//           </svg>
//           <span className="text-xs font-medium">Home</span>
//         </Link>

//         {/* Products */}
//         <Link
//           to="/buy/products"
//           className={`flex flex-col items-center justify-center flex-1 h-full ${
//             isActive("/buy/products") ? "text-blue-600" : "text-gray-600"
//           }`}
//         >
//           <svg
//             className="w-6 h-6 mb-1"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
//             />
//           </svg>
//           <span className="text-xs font-medium">Products</span>
//         </Link>

//         {/* Chat (only for authenticated buyers) */}
//         {roles.includes("BUYER") && (
//           <Link
//             to="/buyer/chat"
//             className={`flex flex-col items-center justify-center flex-1 h-full ${
//               isActive("/buyer/chat") ? "text-blue-600" : "text-gray-600"
//             }`}
//           >
//             <svg
//               className="w-6 h-6 mb-1"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
//               />
//             </svg>
//             <span className="text-xs font-medium">Chat</span>
//           </Link>
//         )}

//         {/* Profile / Login */}
//         <Link
//           to={roles.includes("BUYER") ? "/profile" : "/login"}
//           className={`flex flex-col items-center justify-center flex-1 h-full ${
//             isActive("/profile") || isActive("/login")
//               ? "text-blue-600"
//               : "text-gray-600"
//           }`}
//         >
//           <svg
//             className="w-6 h-6 mb-1"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//             />
//           </svg>
//           <span className="text-xs font-medium">
//             {roles.includes("BUYER") ? "Profile" : "Login"}
//           </span>
//         </Link>
//       </div>
//     </nav>
//   );
// }
