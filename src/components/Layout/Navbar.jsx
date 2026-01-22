<<<<<<< HEAD

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
=======
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaMapMarkerAlt, FaChevronDown, FaSearch } from "react-icons/fa";
>>>>>>> 06152030be7f64af445bd3d34f6645d718696d47
import { useAuth } from "../../context/AuthContext";
import { logoutUser } from "../../store/services/authServices";
import { toast } from "react-toastify";
import axios from "axios";
import logo from "../../assets/logo.png";

import { getLocationStates } from "../../store/services/bikeBrandServices";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // ONLY use values that exist in AuthContext
  const { isSignedIn, roles, signOut } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
<<<<<<< HEAD
  const [userLocation, setUserLocation] = useState("India");
=======
  const [location, setLocation] = useState("India");
  const [states, setStates] = useState([]);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await getLocationStates();
        if (Array.isArray(res)) {
          setStates(res);
        } else if (res?.status === "success") {
          setStates(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch states", error);
      }
    };
    fetchStates();
  }, []);
>>>>>>> 06152030be7f64af445bd3d34f6645d718696d47

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
        {/* SEARCH BOX - DESKTOP */}
        <div className="hidden md:flex flex-1 items-center mx-6 gap-4">

          {/* Location Dropdown - Pill Shape */}
          <div className="relative flex items-center w-64">
            {/* Icon */}
            <div className="absolute left-3 z-10 text-blue-600 text-lg">
              <FaMapMarkerAlt />
            </div>

            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full h-12 pl-10 pr-10 border-2 border-gray-200 rounded-full text-base focus:outline-none focus:border-blue-400 bg-white text-gray-800 cursor-pointer appearance-none font-semibold truncate"
            >
              <option value="India">India</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>

            {/* Custom Chevron */}
            <div className="absolute right-4 pointer-events-none text-gray-400">
              <FaChevronDown />
            </div>
          </div>

          {/* Search Bar - Pill Shape */}
          <div className="flex flex-1 items-center border-2 border-gray-200 rounded-full bg-white h-12 pr-1 focus-within:border-blue-400 w-full overflow-hidden">
            <input
              type="text"
              placeholder="Find Cars, Mobile Phones and more..."
              className="flex-1 px-5 h-full outline-none text-base text-gray-700 bg-transparent placeholder-gray-500"
            />
            <button className="bg-[#002f34] hover:bg-blue-900 text-white h-10 w-10 rounded-full flex items-center justify-center transition-colors">
              <FaSearch className="text-lg" />
            </button>
          </div>

        </div>

        {/* RIGHT SIDE - DESKTOP */}
        <div className="hidden sm:flex items-center space-x-4 ml-4">
          {/* Wishlist */}
          <button className="text-gray-600 hover:text-gray-800 text-lg">
            ♡
          </button>

          {/* SELL BUTTON */}
          {!isSeller && (
            <Link
              to="/login"
              className="flex items-center justify-center bg-white border-t-4 border-t-cyan-400 border-r-4 border-r-blue-700 border-b-4 border-b-blue-700 border-l-4 border-l-yellow-400 rounded-full px-5 py-1 shadow-md hover:shadow-lg transition-shadow active:scale-95"
            >
              <span className="font-extrabold text-black mr-1 text-lg">+</span>
              <span className="font-bold text-blue-800 tracking-wide text-sm">SELL</span>
            </Link>
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
          {!isSeller && (
            <Link
              to="/login"
              className="flex items-center justify-center bg-white border-t-[3px] border-t-cyan-400 border-r-[3px] border-r-blue-700 border-b-[3px] border-b-blue-700 border-l-[3px] border-l-yellow-400 rounded-full px-3 py-0.5 shadow-sm active:scale-95"
            >
              <span className="font-extrabold text-black mr-0.5 text-sm">+</span>
              <span className="font-bold text-blue-800 text-xs">SELL</span>
            </Link>
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
                <option value="India">India</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
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
