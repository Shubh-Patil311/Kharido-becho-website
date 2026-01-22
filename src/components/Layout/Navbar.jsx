
// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { FaUserCircle } from "react-icons/fa";
// import { useAuth } from "../../context/AuthContext";
// import { logoutUser } from "../../store/services/authServices";
// import { toast } from "react-toastify";
// import axios from "axios";
// import logo from "../../assets/logo.png";

// export default function Navbar() {
//   const navigate = useNavigate();

//   // ONLY use values that exist in AuthContext
//   const { isSignedIn, roles, signOut } = useAuth();

//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [location, setLocation] = useState("India");

//   const isSeller = roles.includes("SELLER");
//   const isBuyer = roles.includes("BUYER") || roles.includes("USER");

//   const handleNavigate = (path) => {
//     navigate(path);
//     setMobileMenuOpen(false);
//   };

//   // ✅ FIXED LOGOUT HANDLER
//   // const handleLogout = async () => {
//   //   try {
//   //     await logoutUser(); // API call

//   //     delete axios.defaults.headers.common["Authorization"];

//   //     await signOut(); // IMPORTANT — resets AuthContext correctly

//   //     toast.success("Logged out successfully");
//   //     navigate("/login", { replace: true });
//   //   } catch (error) {
//   //     toast.error("Logout failed");
//   //   }
//   // };
//   const handleLogout = async () => {
//     try {
//       await logoutUser(); // API logout
//       await signOut(); // Context logout

//       toast.success("Logged out successfully");

//       navigate("/", { replace: true }); //  Go to Home instead of Login
//     } catch (err) {
//       toast.error("Logout failed");
//     }
//   };

//   return (
//     <nav className="bg-white shadow sticky top-0 z-50">
//       {/* TOP BAR */}
//       <div className="container mx-auto px-4 flex items-center h-16 md:h-18 lg:h-20">
//         {/* LOGO */}
//         <Link to="/" className="flex items-center mr-2 md:mr-4">
//           <img
//             src={logo}
//             alt="KharidoBhecho Logo"
//             className="h-7 w-auto md:h-8 lg:h-9"
//           />
//         </Link>

//         {/* SEARCH BOX - DESKTOP */}
//         <div className="hidden md:flex flex-1 items-center">
//           <input
//             type="text"
//             placeholder="Search"
//             className="flex-1 border rounded-l-md py-2 px-3 text-sm outline-none"
//           />
//           <button className="bg-blue-300 hover:bg-blue-700 text-white py-2 px-4 rounded-r-md text-sm">
//             🔍
//           </button>
//         </div>

//         {/* RIGHT SIDE - DESKTOP */}
//         <div className="hidden sm:flex items-center space-x-4 ml-4">
//           {/* Wishlist */}
//           <button className="text-gray-600 hover:text-gray-800 text-lg">
//             ♡
//           </button>

//           {/* SELL BUTTON */}
//           {isSeller ? (
//             <Link
//               to="/dashboard"
//               className="bg-yellow-200 hover:bg-yellow-500 text-gray-900 font-semibold py-2 px-4 rounded-md text-sm"
//             >
//               + SELL
//             </Link>
//           ) : (
//             <button
//               className="bg-yellow-100 text-gray-400 font-semibold py-2 px-4 rounded-md text-sm cursor-not-allowed"
//               disabled
//             >
//               + SELL
//             </button>
//           )}

//           {/* PROFILE + LOGOUT */}
//           {isSignedIn ? (
//             <>
//               <button
//                 onClick={() => navigate(isSeller ? "/dashboard" : "/profile")}
//                 className="text-gray-700 hover:text-gray-900 text-3xl"
//               >
//                 <FaUserCircle />
//               </button>

//               <button
//                 onClick={handleLogout}
//                 className="text-red-600 font-semibold hover:underline ml-2"
//               >
//                 Logout
//               </button>
//             </>
//           ) : (
//             <button
//               onClick={() => navigate("/login")}
//               className="text-blue-600 font-semibold hover:underline"
//             >
//               Login
//             </button>
//           )}
//         </div>

//         {/* MOBILE MENU BUTTONS */}
//         <div className="flex sm:hidden items-center gap-3 ml-auto">
//           {/* SELL - MOBILE */}
//           {isSeller ? (
//             <Link
//               to="/dashboard"
//               className="bg-yellow-200 hover:bg-yellow-500 text-gray-900 font-semibold py-1.5 px-3 rounded-md text-xs"
//             >
//               SELL
//             </Link>
//           ) : (
//             <button
//               className="bg-yellow-100 text-gray-400 font-semibold py-1.5 px-3 rounded-md text-xs cursor-not-allowed"
//               disabled
//             >
//               SELL
//             </button>
//           )}

//           {/* PROFILE - MOBILE */}
//           {isSignedIn && (
//             <button
//               onClick={() => navigate(isSeller ? "/dashboard" : "/profile")}
//               className="text-gray-700 text-2xl"
//             >
//               <FaUserCircle />
//             </button>
//           )}

//           {/* MENU TOGGLE */}
//           <button
//             onClick={() => setMobileMenuOpen((prev) => !prev)}
//             className="p-2 rounded-md border border-gray-200 text-gray-700"
//           >
//             {mobileMenuOpen ? "✕" : "☰"}
//           </button>
//         </div>
//       </div>

//       {/* MOBILE SEARCH */}
//       <div className="container mx-auto px-4 pb-2 md:hidden">
//         <div className="flex">
//           <input
//             type="text"
//             placeholder="Search products"
//             className="flex-1 border rounded-l-md py-2 px-3 text-sm outline-none"
//           />
//           <button className="bg-blue-300 hover:bg-blue-700 text-white py-2 px-3 rounded-r-md text-sm">
//             🔍
//           </button>
//         </div>
//       </div>

//       {/* DESKTOP CATEGORY LINKS */}
//       <div className="bg-gray-50 border-t hidden md:block">
//         <div className="container mx-auto px-4 h-12 flex items-center space-x-6 text-sm">
//           {/* BUYER LINKS */}
//           {!isSeller && (
//             <>
//               <button
//                 onClick={() => handleNavigate("/buy/cars")}
//                 className="hover:text-blue-600"
//               >
//                 Cars
//               </button>

//               <button
//                 onClick={() => handleNavigate("/buy/bikes")}
//                 className="hover:text-blue-600"
//               >
//                 Bikes
//               </button>

//               <button
//                 onClick={() => handleNavigate("/buy/mobiles")}
//                 className="hover:text-blue-600"
//               >
//                 Mobiles
//               </button>

//               <button
//                 onClick={() => handleNavigate("/buy/laptops")}
//                 className="hover:text-blue-600"
//               >
//                 Laptops
//               </button>

//               {/* ✅ ADD THIS LINE */}
//               <button
//                 onClick={() => handleNavigate("/buyer/chat")}
//                 className="hover:text-blue-600"
//               >
//                 Chat
//               </button>
//             </>
//           )}

//           {/* SELLER LINKS */}
//           {isSeller && (
//             <>
//               <button
//                 onClick={() => handleNavigate("/dashboard")}
//                 className="hover:text-blue-600"
//               >
//                 Dashboard
//               </button>
//               <button
//                 onClick={() => handleNavigate("/seller/requests")}
//                 className="hover:text-blue-600"
//               >
//                 Requests
//               </button>
//               <button
//                 onClick={() => handleNavigate("/seller/chat")}
//                 className="hover:text-blue-600"
//               >
//                 Chat
//               </button>
//             </>
//           )}

//           <span className="ml-auto text-gray-500 text-sm">
//             {new Date().toLocaleDateString("en-GB", {
//               day: "2-digit",
//               month: "short",
//               year: "numeric",
//             })}
//           </span>
//         </div>
//       </div>

//       {/* MOBILE MENU */}
//       {mobileMenuOpen && (
//         <div className="md:hidden border-t bg-white">
//           <div className="container mx-auto px-4 py-3 space-y-3 text-sm">
//             <div>
//               <label className="text-xs text-gray-500">Location</label>
//               <select
//                 value={location}
//                 onChange={(e) => setLocation(e.target.value)}
//                 className="border rounded-md py-1.5 px-2 text-xs w-full"
//               >
//                 <option>India</option>
//                 <option>Mumbai</option>
//                 <option>Delhi</option>
//               </select>
//             </div>

//             <div className="flex flex-col space-y-2">
//               {!isSeller && (
//                 <>
//                   <button onClick={() => handleNavigate("/buy/cars")}>
//                     Cars
//                   </button>
//                   <button onClick={() => handleNavigate("/buy/bikes")}>
//                     Bikes
//                   </button>
//                   <button onClick={() => handleNavigate("/buy/mobiles")}>
//                     Mobiles
//                   </button>
//                   <button onClick={() => handleNavigate("/buy/laptops")}>
//                     Laptops
//                   </button>
//                 </>
//               )}

//               {isSeller && (
//                 <>
//                   <button onClick={() => handleNavigate("/dashboard")}>
//                     Dashboard
//                   </button>
//                   <button onClick={() => handleNavigate("/seller/requests")}>
//                     Requests
//                   </button>
//                   <button onClick={() => handleNavigate("/seller/chat")}>
//                     Chat
//                   </button>
//                 </>
//               )}
//             </div>

//             {/* LOGOUT MOBILE */}
//             {isSignedIn && (
//               <button
//                 onClick={() => {
//                   handleLogout();
//                   setMobileMenuOpen(false);
//                 }}
//                 className="text-left text-red-600 font-semibold"
//               >
//                 Logout
//               </button>
//             )}

//             <div className="flex justify-between text-xs text-gray-500 pt-2 border-t">
//               <span>{new Date().toLocaleDateString("en-GB")}</span>
//               <span>KharidoBhecho</span>
//             </div>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// }



import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { MdArrowBack } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import { logoutUser } from "../../store/services/authServices";
import { toast } from "react-toastify";
import axios from "axios";
import logo from "../../assets/logo.png";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // ONLY use values that exist in AuthContext
  const { isSignedIn, roles, signOut } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userLocation, setUserLocation] = useState("India");

  const isSeller = roles.includes("SELLER");
  const isBuyer = roles.includes("BUYER") || roles.includes("USER");
  
  // Check if we can go back (not on home page)
  const canGoBack = location.pathname !== "/";

  const handleNavigate = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logoutUser(); // API logout
      await signOut(); // Context logout

      toast.success("Logged out successfully");

      navigate("/", { replace: true }); // Go to Home instead of Login
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      {/* TOP BAR */}
      <div className="container mx-auto px-4 flex items-center h-16 md:h-18 lg:h-20">
        {/* LOGO */}
        <Link to="/" className="flex items-center mr-2 md:mr-4">
          <img
            src={logo}
            alt="KharidoBhecho Logo"
            className="h-7 w-auto md:h-8 lg:h-9"
          />
        </Link>

        {/* SEARCH BOX - DESKTOP */}
        <div className="hidden md:flex flex-1 items-center">
          <input
            type="text"
            placeholder="Search"
            className="flex-1 border rounded-l-md py-2 px-3 text-sm outline-none"
          />
          <button className="bg-blue-300 hover:bg-blue-700 text-white py-2 px-4 rounded-r-md text-sm">
            🔍
          </button>
        </div>

        {/* RIGHT SIDE - DESKTOP */}
        <div className="hidden sm:flex items-center space-x-4 ml-4">
          {/* Wishlist */}
          <button className="text-gray-600 hover:text-gray-800 text-lg">
            ♡
          </button>

          {/* SELL BUTTON */}
          {isSeller ? (
            <Link
              to="/dashboard"
              className="bg-yellow-200 hover:bg-yellow-500 text-gray-900 font-semibold py-2 px-4 rounded-md text-sm"
            >
              + SELL
            </Link>
          ) : (
            <button
              className="bg-yellow-100 text-gray-400 font-semibold py-2 px-4 rounded-md text-sm cursor-not-allowed"
              disabled
            >
              + SELL
            </button>
          )}

          {/* REQUEST BUTTON - BUYERS ONLY */}
          {isBuyer && (
            <button
              onClick={() => {
                window.scrollTo(0, 0);
                navigate("/buyer/chat");
              }}
              className="bg-green-200 hover:bg-green-500 text-gray-900 font-semibold py-2 px-4 rounded-md text-sm"
            >
              Requests
            </button>
          )}

          {/* PROFILE + LOGOUT */}
          {isSignedIn ? (
            <>
              <button
                onClick={() => navigate(isSeller ? "/dashboard" : "/profile")}
                className="text-gray-700 hover:text-gray-900 text-3xl"
              >
                <FaUserCircle />
              </button>

              <button
                onClick={handleLogout}
                className="text-red-600 font-semibold hover:underline ml-2"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="text-blue-600 font-semibold hover:underline"
            >
              Login
            </button>
          )}
        </div>

        {/* MOBILE MENU BUTTONS */}
        <div className="flex sm:hidden items-center gap-3 ml-auto">
          {/* SELL - MOBILE */}
          {isSeller ? (
            <Link
              to="/dashboard"
              className="bg-yellow-200 hover:bg-yellow-500 text-gray-900 font-semibold py-1.5 px-3 rounded-md text-xs"
            >
              SELL
            </Link>
          ) : (
            <button
              className="bg-yellow-100 text-gray-400 font-semibold py-1.5 px-3 rounded-md text-xs cursor-not-allowed"
              disabled
            >
              SELL
            </button>
          )}

          {/* REQUEST - MOBILE (Buyers only) */}
          {isBuyer && (
            <button
              onClick={() => {
                window.scrollTo(0, 0);
                handleNavigate("/buyer/chat");
              }}
              className="bg-green-200 hover:bg-green-500 text-gray-900 font-semibold py-1.5 px-3 rounded-md text-xs"
            >
              Requests
            </button>
          )}

          {/* PROFILE - MOBILE */}
          {isSignedIn && (
            <button
              onClick={() => navigate(isSeller ? "/dashboard" : "/profile")}
              className="text-gray-700 text-2xl"
            >
              <FaUserCircle />
            </button>
          )}

          {/* MENU TOGGLE */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="p-2 rounded-md border border-gray-200 text-gray-700"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* MOBILE SEARCH */}
      <div className="container mx-auto px-4 pb-2 md:hidden">
        <div className="flex">
          <input
            type="text"
            placeholder="Search products"
            className="flex-1 border rounded-l-md py-2 px-3 text-sm outline-none"
          />
          <button className="bg-blue-300 hover:bg-blue-700 text-white py-2 px-3 rounded-r-md text-sm">
            🔍
          </button>
        </div>
      </div>

      {/* DESKTOP CATEGORY LINKS */}
      <div className="bg-gray-50 border-t hidden md:block">
        <div className="container mx-auto px-4 h-12 flex items-center space-x-6 text-sm">
          {/* BACK BUTTON - Red circular with arrow */}
          {canGoBack && (
            <button
              onClick={() => navigate(-1)}
              className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all shadow-md hover:shadow-lg"
              title="Go Back"
            >
              <MdArrowBack className="text-lg" />
            </button>
          )}

          {/* BUYER LINKS */}
          {!isSeller && (
            <>
              <button
                onClick={() => handleNavigate("/buy/cars")}
                className="hover:text-blue-600 font-bold"
              >
                CARS
              </button>

              <button
                onClick={() => handleNavigate("/buy/bikes")}
                className="hover:text-blue-600 font-bold"
              >
                BIKES
              </button>

              <button
                onClick={() => handleNavigate("/buy/mobiles")}
                className="hover:text-blue-600 font-bold"
              >
                MOBILES
              </button>

              <button
                onClick={() => handleNavigate("/buy/laptops")}
                className="hover:text-blue-600 font-bold"
              >
                LAPTOPS
              </button>

              <button
                onClick={() => handleNavigate("/buy/products")}
                className="hover:text-red-600 font-bold text-red-500"
              >
                🔴 LIVE AUCTIONS
              </button>
            </>
          )}

          {/* SELLER LINKS */}
          {isSeller && (
            <>
              <button
                onClick={() => handleNavigate("/dashboard")}
                className="hover:text-blue-500 font-bold"
              >
                DASHBOARD
              </button>
              <button
                onClick={() => handleNavigate("/seller/requests")}
                className="hover:text-blue-500 font-bold"
              >
                REQUEST
              </button>
              {/* <button
                onClick={() => handleNavigate("/seller/chat")}
                className="hover:text-blue-600"
              >
                Chat
              </button> */}
            </>
          )}

          <span className="ml-auto text-gray-500 text-sm">
            {new Date().toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="container mx-auto px-4 py-3 space-y-3 text-sm">
            <div>
              <label className="text-xs text-gray-500">Location</label>
              <select
                value={userLocation}
                onChange={(e) => setUserLocation(e.target.value)}
                className="border rounded-md py-1.5 px-2 text-xs w-full"
              >
                <option>India</option>
                <option>Mumbai</option>
                <option>Delhi</option>
              </select>
            </div>
            
            {/* BACK BUTTON - MOBILE */}
            {canGoBack && (
              <button
                onClick={() => navigate(-1)}
                className="w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all shadow-md"
                title="Go Back"
              >
                <MdArrowBack className="text-xl" />
              </button>
            )}

            <div className="flex flex-col space-y-2">
              {!isSeller && (
                <>
                  <button onClick={() => handleNavigate("/buy/cars")}>
                    Cars
                  </button>
                  <button onClick={() => handleNavigate("/buy/bikes")}>
                    Bikes
                  </button>
                  <button onClick={() => handleNavigate("/buy/mobiles")}>
                    Mobiles
                  </button>
                  <button onClick={() => handleNavigate("/buy/laptops")}>
                    Laptops
                  </button>
                  <button 
                    onClick={() => handleNavigate("/buy/products")}
                    className="text-red-600 font-semibold"
                  >
                    🔴 Live Auctions
                  </button>
                  <button onClick={() => handleNavigate("/buyer/chat")}>
                    Requests
                  </button>
                  <button onClick={() => handleNavigate("/buyer/chat")}>
                    Chat
                  </button>
                </>
              )}

              {isSeller && (
                <>
                  <button onClick={() => handleNavigate("/dashboard")}>
                    Dashboard
                  </button>
                  <button onClick={() => handleNavigate("/seller/requests")}>
                    Requests
                  </button>
                  <button onClick={() => handleNavigate("/seller/chat")}>
                    Chat
                  </button>
                </>
              )}
            </div>

            {/* LOGOUT MOBILE */}
            {isSignedIn && (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="text-left text-red-600 font-semibold"
              >
                Logout
              </button>
            )}

            <div className="flex justify-between text-xs text-gray-500 pt-2 border-t">
              <span>{new Date().toLocaleDateString("en-GB")}</span>
              <span>KharidoBhecho</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
