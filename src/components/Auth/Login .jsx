// // // import React, { useState } from "react";
// // // import { useNavigate } from "react-router-dom";
// // // import { toast } from "react-toastify";
// // // import { useDispatch } from "react-redux";

// // // import { setAuthState } from "../../store/authSlice";
// // // import logo from "../../assets/Images/kharidobecho-logo.svg";
// // // import {
// // //   loginUser,
// // //   fetchBuyerInfo,
// // //   fetchSellerInfo,
// // // } from "../../store/services/authServices";

// // // const Login = () => {
// // //   const navigate = useNavigate();
// // //   const dispatch = useDispatch();

// // //   const [loginLoading, setLoginLoading] = useState(false);

// // //   const [formData, setFormData] = useState({
// // //     email: "",
// // //     password: "",
// // //   });

// // //   const handleChange = (e) => {
// // //     setFormData((prev) => ({
// // //       ...prev,
// // //       [e.target.name]: e.target.value,
// // //     }));
// // //   };

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();

// // //     if (!formData.email || !formData.password) {
// // //       toast.error("Please fill all fields");
// // //       return;
// // //     }

// // //     try {
// // //       setLoginLoading(true);
// // //       const payload = {
// // //         username: formData.email,
// // //         password: formData.password,
// // //       };

// // //       const response = await loginUser(payload);
// // //       console.log("Login Response:", response);

// // //       const token =
// // //         response.accessToken || response.token || response.data?.token || null;

// // //       if (token) {
// // //         localStorage.setItem("token", token);
// // //       }

// // //       // ✅ FIX: Read roles from backend (authorities)
// // //       const roles =
// // //         response.authorities || response.roles || response.data?.roles || [];

// // //       console.log("User Roles:", roles);

// // //       localStorage.setItem("roles", JSON.stringify(roles));

// // //       // ROLE CHECK FIX ✔
// // //       const isBuyer = roles.includes("BUYER");
// // //       const isSeller = roles.includes("SELLER");

// // //       const baseUserId = response.userId;
// // //       if (baseUserId) {
// // //         localStorage.setItem("userId", baseUserId);
// // //       }

// // //       // ========================
// // //       // BUYER LOGIN FLOW
// // //       // ========================
// // //       if (isBuyer) {
// // //         console.log("Hitting Buyer API...");
// // //         const buyerData = await fetchBuyerInfo(baseUserId);

// // //         if (!buyerData) {
// // //           toast.error("Buyer info fetch failed");
// // //           return;
// // //         }

// // //         const buyerUserId = buyerData.userId;
// // //         localStorage.setItem("buyerUserId", buyerUserId);

// // //         dispatch(
// // //           setAuthState({
// // //             token,
// // //             sellerId: null,
// // //             sellerProfile: {
// // //               roles,
// // //               expiresIn: response.expiresIn,
// // //               tokenType: response.tokenType,
// // //               userId: baseUserId,
// // //             },
// // //           })
// // //         );

// // //         toast.success("Login successful");
// // //         navigate("/");
// // //         return;
// // //       }

// // //       // ========================
// // //       // SELLER LOGIN FLOW
// // //       // ========================
// // //       if (isSeller) {
// // //         console.log("Hitting Seller API...");
// // //         const sellerData = await fetchSellerInfo(baseUserId);

// // //         if (!sellerData) {
// // //           toast.error("Seller info fetch failed");
// // //           return;
// // //         }

// // //         const sellerId = sellerData.sellerId;
// // //         localStorage.setItem("sellerId", sellerId);

// // //         dispatch(
// // //           setAuthState({
// // //             token,
// // //             sellerId,
// // //             sellerProfile: {
// // //               roles,
// // //               expiresIn: response.expiresIn,
// // //               tokenType: response.tokenType,
// // //               userId: baseUserId,
// // //             },
// // //           })
// // //         );

// // //         toast.success("Login successful");
// // //         navigate("/dashboard");
// // //         return;
// // //       }

// // //       // NO ROLE FOUND
// // //       toast.error("Unauthorized: No valid role assigned");
// // //     } catch (err) {
// // //       console.error("Login Error:", err);
// // //       const message =
// // //         err?.response?.data?.message ||
// // //         err?.data?.message ||
// // //         err?.message ||
// // //         "Invalid credentials or server error";
// // //       toast.error(message);
// // //     } finally {
// // //       setLoginLoading(false);
// // //     }
// // //   };

// // //   return (
// // //     <div className="min-h-screen flex">
// // //       {/* LEFT LOGO SIDE */}
// // //       <div className="hidden md:flex w-1/2 bg-white items-center justify-center">
// // //         <img src={logo} alt="Logo" className="w-150 h-100 object-contain" />
// // //       </div>

// // //       {/* RIGHT FORM SIDE */}
// // //       <div className="w-full md:w-1/2 flex flex-col items-center px-8 py-10">
// // //         <h1 className="text-3xl font-semibold text-center">Login</h1>

// // //         <p className="text-gray-500 text-center text-sm mt-3 mb-10 max-w-xs">
// // //           Lorem ipsum dolor sit amet consectetur. Ipsum massa turpis morbi
// // //           platea. Vitae habitant duis.
// // //         </p>

// // //         <form onSubmit={handleSubmit} className="w-full max-w-sm">
// // //           <label className="block text-gray-700 font-medium mb-1">
// // //             Email address
// // //           </label>
// // //           <input
// // //             type="email"
// // //             name="email"
// // //             placeholder="Enter email address"
// // //             value={formData.email}
// // //             onChange={handleChange}
// // //             className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //           />

// // //           <div className="mt-5">
// // //             <label className="block text-gray-700 font-medium mb-1">
// // //               Password
// // //             </label>
// // //             <input
// // //               type="password"
// // //               name="password"
// // //               placeholder="Enter password"
// // //               value={formData.password}
// // //               onChange={handleChange}
// // //               className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //             />
// // //           </div>

// // //           <div className="text-right mt-2">
// // //             <button
// // //               type="button"
// // //               className="text-[#033047] text-sm font-semibold cursor-pointer"
// // //               onClick={() => navigate("/forget-password")}
// // //             >
// // //               Forgot Password?
// // //             </button>
// // //           </div>

// // //           <button
// // //             id="login-btn"
// // //             type="submit"
// // //             disabled={loginLoading}
// // //             className="w-full bg-[#0A2533] text-white py-4 rounded-xl mt-8 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
// // //           >
// // //             {loginLoading ? "Logging in..." : "Login"}
// // //           </button>
// // //         </form>

// // //         <p className="text-gray-600 text-sm mt-6">
// // //           Don’t have an account?{" "}
// // //           <span
// // //             className="text-blue-600 font-semibold cursor-pointer"
// // //             onClick={() => navigate("/register")}
// // //           >
// // //             Sign up
// // //           </span>
// // //         </p>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default Login;

// // import React, { useState, useRef } from "react";
// // import { useNavigate } from "react-router-dom";
// // import {
// //   MdOutlineEmail,
// //   MdOutlineLock,
// //   MdVisibility,
// //   MdVisibilityOff,
// //   MdArrowForward,
// //   MdStorefront,
// // } from "react-icons/md";
// // import { toast } from "react-toastify";
// // import { useDispatch } from "react-redux";

// // import logo from "../../assets/Images/kharidobecho-logo.svg";
// // import { setAuthState } from "../../store/authSlice";
// // import {
// //   loginUser,
// //   fetchBuyerInfo,
// //   fetchSellerInfo,
// // } from "../../store/services/authServices";
// // import { useAuth } from "../../context/AuthContext";

// // const Login = () => {
// //   const navigate = useNavigate();
// //   const dispatch = useDispatch();
// //   const { refreshAuthState, setAuthenticating, clearAuthenticating } =
// //     useAuth();

// //   const [loading, setLoading] = useState(false);

// //   const [emailFocused, setEmailFocused] = useState(false);
// //   const [passwordFocused, setPasswordFocused] = useState(false);

// //   const [showPassword, setShowPassword] = useState(false);

// //   const emailRef = useRef(null);
// //   const passwordRef = useRef(null);

// //   const [formData, setFormData] = useState({
// //     email: "",
// //     password: "",
// //   });

// //   // Handle Input Change
// //   const handleChange = (e) => {
// //     setFormData((prev) => ({
// //       ...prev,
// //       [e.target.name]: e.target.value,
// //     }));
// //   };

// //   // Press Enter → Go to next input or login
// //   const handleEnter = (e, next) => {
// //     if (e.key === "Enter") {
// //       next();
// //     }
// //   };

// //   // MAIN LOGIN LOGIC MERGED ✔
// //   const handleLogin = async () => {
// //     if (!formData.email || !formData.password) {
// //       toast.error("Please fill all fields");
// //       return;
// //     }

// //     try {
// //       if (loading) return;

// //       setLoading(true);
// //       setAuthenticating(true);

// //       const payload = {
// //         username: formData.email,
// //         password: formData.password,
// //       };

// //       const response = await loginUser(payload);
// //       console.log("Login Response:", response);

// //       // TOKEN
// //       const token =
// //         response.accessToken || response.token || response.data?.token || null;

// //       if (token) {
// //         localStorage.setItem("token", token);
// //       }

// //       // ROLES
// //       const roles =
// //         response.authorities || response.roles || response.data?.roles || [];

// //       console.log("User Roles:", roles);
// //       localStorage.setItem("roles", JSON.stringify(roles));

// //       const baseUserId = response.userId;
// //       if (baseUserId) {
// //         localStorage.setItem("userId", baseUserId);
// //       }

// //       const isBuyer = roles.includes("BUYER");
// //       const isSeller = roles.includes("SELLER");

// //       // ======================
// //       // BUYER LOGIN FLOW
// //       // ======================
// //       if (isBuyer) {
// //         const buyerData = await fetchBuyerInfo(baseUserId);
// //         if (!buyerData) return toast.error("Failed to fetch buyer info");

// //         // ⭐ FIXED
// //         localStorage.setItem("buyerId", buyerData.buyerId);
// //         localStorage.setItem("buyerUserId", buyerData.userId);

// //         dispatch(
// //           setAuthState({
// //             token,
// //             sellerId: null,
// //             sellerProfile: {
// //               roles,
// //               expiresIn: response.expiresIn,
// //               tokenType: response.tokenType,
// //               userId: baseUserId,
// //             },
// //           })
// //         );

// //         toast.success("Login successful");
// //         refreshAuthState();
// //         window.dispatchEvent(new Event("auth-state-changed"));
// //         navigate("/");
// //         return;
// //       }

// //       // ======================
// //       // SELLER LOGIN FLOW
// //       // ======================
// //       if (isSeller) {
// //         const sellerData = await fetchSellerInfo(baseUserId);
// //         if (!sellerData) return toast.error("Failed to fetch seller info");

// //         const sellerId = sellerData.sellerId;
// //         localStorage.setItem("sellerId", sellerId);

// //         dispatch(
// //           setAuthState({
// //             token,
// //             sellerId,
// //             sellerProfile: {
// //               roles,
// //               expiresIn: response.expiresIn,
// //               tokenType: response.tokenType,
// //               userId: baseUserId,
// //             },
// //           })
// //         );

// //         toast.success("Login successful");
// //         refreshAuthState();
// //         window.dispatchEvent(new Event("auth-state-changed"));
// //         navigate("/dashboard");
// //         return;
// //       }

// //       toast.error("Unauthorized: No valid role assigned");
// //     } catch (err) {
// //       console.error("Login Error:", err);
// //       toast.error(
// //         err?.response?.data?.message ||
// //           err?.data?.message ||
// //           err?.message ||
// //           "Invalid credentials"
// //       );
// //     } finally {
// //       setLoading(false);
// //       clearAuthenticating();
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-background flex">
// //       {/* LEFT SIDE LOGO */}
// //       <div className="hidden md:flex w-1/2 items-center justify-center bg-white">
// //         <img src={logo} alt="Logo" className="w-150 h-100 object-contain" />
// //       </div>

// //       {/* RIGHT SIDE LOGIN UI (THEMED LIKE REFER COMPONENT) */}
// //       <div className="w-full md:w-1/2 flex flex-col items-center px-8 py-10">
// //         <div className="w-full max-w-md">
// //           {/* BRAND HEADER */}
// //           <div className="text-center mb-8">
// //             <div className="flex flex-col items-center">
// //               <div className="w-18 h-18 rounded-full bg-brand-badge-background flex items-center justify-center mb-6 shadow-sm">
// //                 <MdStorefront className="text-primary text-3xl" />
// //               </div>

// //               <h1 className="text-3xl font-extrabold text-text-primary">
// //                 Kharido<span className="text-secondary">Becho</span>
// //               </h1>
// //               <p className="text-base text-text-tertiary mt-2">
// //                 Buy & Sell Marketplace
// //               </p>
// //             </div>
// //           </div>

// //           {/* WELCOME TEXT */}
// //           <div className="text-center mb-8">
// //             <h2 className="text-xl font-extrabold text-text-primary">
// //               Welcome Back 👋
// //             </h2>
// //             <p className="text-base text-text-tertiary">
// //               Login to continue your journey
// //             </p>
// //           </div>

// //           {/* LOGIN CARD */}
// //           <div className="bg-surface rounded-xl p-6 shadow-card">
// //             {/* EMAIL */}
// //             <div className="mb-6">
// //               <label className="block text-sm font-semibold text-text-secondary mb-2">
// //                 Email address
// //               </label>
// //               <div
// //                 onClick={() => emailRef.current?.focus()}
// //                 className={`flex items-center bg-search-background rounded-full px-4 py-3 border-2 transition-all cursor-text
// //                 ${
// //                   emailFocused
// //                     ? "bg-surface border-primary shadow-xs"
// //                     : "border-transparent"
// //                 }
// //               `}
// //               >
// //                 <MdOutlineEmail
// //                   className={`text-xl mr-3 ${
// //                     emailFocused ? "text-primary" : "text-text-tertiary"
// //                   }`}
// //                 />
// //                 <input
// //                   ref={emailRef}
// //                   type="email"
// //                   name="email"
// //                   placeholder="Enter your email"
// //                   value={formData.email}
// //                   onChange={handleChange}
// //                   onFocus={() => setEmailFocused(true)}
// //                   onBlur={() => setEmailFocused(false)}
// //                   onKeyDown={(e) =>
// //                     handleEnter(e, () => passwordRef.current.focus())
// //                   }
// //                   className="flex-1 bg-transparent text-lg font-medium outline-none"
// //                 />
// //               </div>
// //             </div>

// //             {/* PASSWORD */}
// //             <div className="mb-6">
// //               <label className="block text-sm font-semibold text-text-secondary mb-2">
// //                 Password
// //               </label>

// //               <div
// //                 onClick={() => passwordRef.current?.focus()}
// //                 className={`flex items-center bg-search-background rounded-full px-4 py-3 border-2 transition-all cursor-text
// //                 ${
// //                   passwordFocused
// //                     ? "bg-surface border-primary shadow-xs"
// //                     : "border-transparent"
// //                 }
// //               `}
// //               >
// //                 <MdOutlineLock
// //                   className={`text-xl mr-3 ${
// //                     passwordFocused ? "text-primary" : "text-text-tertiary"
// //                   }`}
// //                 />

// //                 <input
// //                   ref={passwordRef}
// //                   type={showPassword ? "text" : "password"}
// //                   name="password"
// //                   placeholder="Enter your password"
// //                   value={formData.password}
// //                   onChange={handleChange}
// //                   onFocus={() => setPasswordFocused(true)}
// //                   onBlur={() => setPasswordFocused(false)}
// //                   onKeyDown={(e) => handleEnter(e, handleLogin)}
// //                   className="flex-1 bg-transparent text-lg font-medium outline-none"
// //                 />

// //                 <button
// //                   type="button"
// //                   onClick={(e) => {
// //                     e.stopPropagation();
// //                     setShowPassword(!showPassword);
// //                   }}
// //                   className="ml-2 p-1 text-text-tertiary hover:text-text-secondary"
// //                 >
// //                   {showPassword ? (
// //                     <MdVisibilityOff className="text-xl" />
// //                   ) : (
// //                     <MdVisibility className="text-xl" />
// //                   )}
// //                 </button>
// //               </div>
// //             </div>

// //             {/* FORGOT PASSWORD */}
// //             <div className="flex justify-end mb-6">
// //               <button
// //                 className="text-sm font-semibold text-link hover:text-link-hover"
// //                 type="button"
// //                 onClick={() => navigate("/forget-password")}
// //               >
// //                 Forgot password?
// //               </button>
// //             </div>

// //             {/* LOGIN BUTTON */}
// //             <button
// //               disabled={loading}
// //               onClick={handleLogin}
// //               className={`w-full bg-secondary rounded-full py-4 px-5 flex items-center justify-center transition-opacity shadow-brand-button
// //               ${loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"}
// //             `}
// //             >
// //               {loading ? (
// //                 <div className="w-5 h-5 border-2 border-text-inverse border-t-transparent rounded-full animate-spin" />
// //               ) : (
// //                 <>
// //                   <span className="text-lg font-bold text-text-inverse mr-2">
// //                     Login
// //                   </span>
// //                   <MdArrowForward className="text-text-inverse text-xl" />
// //                 </>
// //               )}
// //             </button>
// //           </div>

// //           {/* SIGN UP LINK */}
// //           <div className="flex justify-center items-center mt-8">
// //             <span className="text-base text-text-secondary">
// //               Don’t have an account?
// //             </span>
// //             <button
// //               className="text-base font-semibold text-link hover:text-link-hover ml-1"
// //               onClick={() => navigate("/register")}
// //             >
// //               Sign up
// //             </button>
// //           </div>
// //         </div>
// //       </div>

// //       {/* LOADING OVERLAY */}
// //       {loading && (
// //         <div className="fixed inset-0 bg-overlay-light flex items-center justify-center z-50">
// //           <div className="bg-surface rounded-xl p-8 shadow-xl min-w-[200px] text-center">
// //             <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
// //             <p className="text-base text-text-primary font-semibold">
// //               Signing you in...
// //             </p>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default Login;
// import React, { useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   MdOutlineEmail,
//   MdOutlineLock,
//   MdVisibility,
//   MdVisibilityOff,
//   MdArrowForward,
//   MdStorefront,
// } from "react-icons/md";
// import { toast } from "react-toastify";
// import { useDispatch } from "react-redux";

// import logo from "../../assets/Images/kharidobecho-logo.svg";
// import { setAuthState } from "../../store/authSlice";
// import {
//   loginUser,
//   fetchBuyerInfo,
//   fetchSellerInfo,
// } from "../../store/services/authServices";
// import { useAuth } from "../../context/AuthContext";

// const Login = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { refreshAuthState, setAuthenticating, clearAuthenticating } =
//     useAuth();

//   const [loading, setLoading] = useState(false);

//   const [emailFocused, setEmailFocused] = useState(false);
//   const [passwordFocused, setPasswordFocused] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const emailRef = useRef(null);
//   const passwordRef = useRef(null);

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   // Handle Input Change
//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   // Press Enter → Next
//   const handleEnter = (e, next) => {
//     if (e.key === "Enter") next();
//   };

//   // LOGIN HANDLER
//   const handleLogin = async () => {
//     if (!formData.email || !formData.password) {
//       toast.error("Please fill all fields");
//       return;
//     }

//     try {
//       if (loading) return;

//       setLoading(true);
//       setAuthenticating(true);

//       const payload = {
//         username: formData.email,
//         password: formData.password,
//       };

//       const response = await loginUser(payload);
//       console.log("Login Response:", response);

//       // TOKEN
//       const token =
//         response.accessToken || response.token || response?.data?.token || null;

//       if (token) localStorage.setItem("token", token);

//       // ROLES
//       const roles =
//         response.authorities || response.roles || response?.data?.roles || [];

//       localStorage.setItem("roles", JSON.stringify(roles));

//       const baseUserId = response.userId;
//       if (baseUserId) localStorage.setItem("userId", baseUserId);

//       const isBuyer = roles.includes("BUYER");
//       const isSeller = roles.includes("SELLER");

//       // ================================
//       // BUYER LOGIN FLOW
//       // ================================
//       if (isBuyer) {
//         const buyerData = await fetchBuyerInfo(baseUserId);

//         if (!buyerData) {
//           toast.error("Buyer info fetch failed");
//           return;
//         }

//         const buyerId = buyerData.buyerId;
//         const buyerUserId = buyerData.user.id;

//         if (!buyerUserId || !buyerId) {
//           toast.error("Error: Invalid buyer data from server");
//           return;
//         }

//         localStorage.setItem("buyerId", buyerId);
//         localStorage.setItem("buyerUserId", buyerUserId);

//         dispatch(
//           setAuthState({
//             token,
//             sellerId: null,
//             sellerProfile: {
//               roles,
//               expiresIn: response.expiresIn,
//               tokenType: response.tokenType,
//               userId: baseUserId,
//             },
//           })
//         );

//         toast.success("Login successful");
//         refreshAuthState();
//         window.dispatchEvent(new Event("auth-state-changed"));
//         navigate("/");
//         return;
//       }

//       // ================================
//       // SELLER LOGIN FLOW (UPDATED ⭐)
//       // ================================
//       if (isSeller) {
//         const sellerData = await fetchSellerInfo(baseUserId);

//         if (!sellerData) {
//           toast.error("Seller info fetch failed");
//           return;
//         }

//         const sellerId = sellerData.sellerId;
//         const sellerUserId = sellerData.user.id; // ⭐ REQUIRED FOR CHAT

//         // Store in localStorage
//         localStorage.setItem("sellerId", sellerId);
//         localStorage.setItem("sellerUserId", sellerUserId); // ⭐ MUST BE STORED

//         dispatch(
//           setAuthState({
//             token,
//             sellerId,
//             sellerProfile: {
//               roles,
//               expiresIn: response.expiresIn,
//               tokenType: response.tokenType,
//               userId: baseUserId,
//             },
//           })
//         );

//         toast.success("Login successful");
//         refreshAuthState();
//         window.dispatchEvent(new Event("auth-state-changed"));
//         navigate("/dashboard");
//         return;
//       }

//       toast.error("Unauthorized: No valid role assigned");
//     } catch (err) {
//       console.error("Login Error:", err);
//       toast.error(
//         err?.response?.data?.message ||
//           err?.data?.message ||
//           err?.message ||
//           "Invalid credentials"
//       );
//     } finally {
//       setLoading(false);
//       clearAuthenticating();
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background flex">
//       {/* LEFT SIDE LOGO */}
//       <div className="hidden md:flex w-1/2 items-center justify-center bg-white">
//         <img src={logo} alt="Logo" className="w-150 h-100 object-contain" />
//       </div>

//       {/* RIGHT SIDE LOGIN UI */}
//       <div className="w-full md:w-1/2 flex flex-col items-center px-8 py-10">
//         <div className="w-full max-w-md">
//           {/* BRAND HEADER */}
//           <div className="text-center mb-8">
//             <div className="flex flex-col items-center">
//               <div className="w-18 h-18 rounded-full bg-brand-badge-background flex items-center justify-center mb-6 shadow-sm">
//                 <MdStorefront className="text-primary text-3xl" />
//               </div>

//               <h1 className="text-3xl font-extrabold text-text-primary">
//                 Kharido<span className="text-secondary">Becho</span>
//               </h1>
//               <p className="text-base text-text-tertiary mt-2">
//                 Buy & Sell Marketplace
//               </p>
//             </div>
//           </div>

//           {/* WELCOME */}
//           <div className="text-center mb-8">
//             <h2 className="text-xl font-extrabold text-text-primary">
//               Welcome Back 👋
//             </h2>
//             <p className="text-base text-text-tertiary">
//               Login to continue your journey
//             </p>
//           </div>

//           {/* LOGIN CARD */}
//           <div className="bg-surface rounded-xl p-6 shadow-card">
//             {/* EMAIL */}
//             <div className="mb-6">
//               <label className="block text-sm font-semibold text-text-secondary mb-2">
//                 Email address
//               </label>
//               <div
//                 onClick={() => emailRef.current?.focus()}
//                 className={`flex items-center bg-search-background rounded-full px-4 py-3 border-2 transition-all cursor-text ${
//                   emailFocused
//                     ? "bg-surface border-primary shadow-xs"
//                     : "border-transparent"
//                 }`}
//               >
//                 <MdOutlineEmail
//                   className={`text-xl mr-3 ${
//                     emailFocused ? "text-primary" : "text-text-tertiary"
//                   }`}
//                 />
//                 <input
//                   ref={emailRef}
//                   type="email"
//                   name="email"
//                   placeholder="Enter your email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   onFocus={() => setEmailFocused(true)}
//                   onBlur={() => setEmailFocused(false)}
//                   onKeyDown={(e) =>
//                     handleEnter(e, () => passwordRef.current.focus())
//                   }
//                   className="flex-1 bg-transparent text-lg font-medium outline-none"
//                 />
//               </div>
//             </div>

//             {/* PASSWORD */}
//             <div className="mb-6">
//               <label className="block text-sm font-semibold text-text-secondary mb-2">
//                 Password
//               </label>

//               <div
//                 onClick={() => passwordRef.current?.focus()}
//                 className={`flex items-center bg-search-background rounded-full px-4 py-3 border-2 transition-all cursor-text ${
//                   passwordFocused
//                     ? "bg-surface border-primary shadow-xs"
//                     : "border-transparent"
//                 }`}
//               >
//                 <MdOutlineLock
//                   className={`text-xl mr-3 ${
//                     passwordFocused ? "text-primary" : "text-text-tertiary"
//                   }`}
//                 />

//                 <input
//                   ref={passwordRef}
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   placeholder="Enter your password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   onFocus={() => setPasswordFocused(true)}
//                   onBlur={() => setPasswordFocused(false)}
//                   onKeyDown={(e) => handleEnter(e, handleLogin)}
//                   className="flex-1 bg-transparent text-lg font-medium outline-none"
//                 />

//                 <button
//                   type="button"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setShowPassword(!showPassword);
//                   }}
//                   className="ml-2 p-1 text-text-tertiary hover:text-text-secondary"
//                 >
//                   {showPassword ? (
//                     <MdVisibilityOff className="text-xl" />
//                   ) : (
//                     <MdVisibility className="text-xl" />
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* FORGOT */}
//             <div className="flex justify-end mb-6">
//               <button
//                 className="text-sm font-semibold text-link hover:text-link-hover"
//                 type="button"
//                 onClick={() => navigate("/forget-password")}
//               >
//                 Forgot password?
//               </button>
//             </div>

//             {/* LOGIN BUTTON */}
//             <button
//               disabled={loading}
//               onClick={handleLogin}
//               className={`w-full bg-secondary rounded-full py-4 px-5 flex items-center justify-center transition-opacity shadow-brand-button ${
//                 loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
//               }`}
//             >
//               {loading ? (
//                 <div className="w-5 h-5 border-2 border-text-inverse border-t-transparent rounded-full animate-spin" />
//               ) : (
//                 <>
//                   <span className="text-lg font-bold text-text-inverse mr-2">
//                     Login
//                   </span>
//                   <MdArrowForward className="text-text-inverse text-xl" />
//                 </>
//               )}
//             </button>
//           </div>

//           {/* SIGNUP */}
//           <div className="flex justify-center items-center mt-8">
//             <span className="text-base text-text-secondary">
//               Don’t have an account?
//             </span>
//             <button
//               className="text-base font-semibold text-link hover:text-link-hover ml-1"
//               onClick={() => navigate("/register")}
//             >
//               Sign up
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* LOADING OVERLAY */}
//       {loading && (
//         <div className="fixed inset-0 bg-overlay-light flex items-center justify-center z-50">
//           <div className="bg-surface rounded-xl p-8 shadow-xl min-w-[200px] text-center">
//             <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
//             <p className="text-base text-text-primary font-semibold">
//               Signing you in...
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Login;

import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  MdOutlineEmail,
  MdOutlineLock,
  MdVisibility,
  MdVisibilityOff,
  MdArrowForward,
  MdStorefront,
} from "react-icons/md";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

import logo from "../../assets/Images/kharidobecho-logo.svg";
import { setAuthState } from "../../store/authSlice";
import {
  loginUser,
  fetchBuyerInfo,
  fetchSellerInfo,
} from "../../store/services/authServices";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { refreshAuthState, setAuthenticating, clearAuthenticating } =
    useAuth();

  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Handle Input Change
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Press Enter → Next
  const handleEnter = (e, next) => {
    if (e.key === "Enter") next();
  };

  // LOGIN HANDLER
  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      if (loading) return;

      setLoading(true);
      setAuthenticating(true);

      const payload = {
        username: formData.email,
        password: formData.password,
      };

      const response = await loginUser(payload);
      console.log("Login Response:", response);

      // TOKEN
      const token =
        response.accessToken || response.token || response?.data?.token || null;

      if (token) localStorage.setItem("token", token);

      // ROLES
      const roles =
        response.authorities || response.roles || response?.data?.roles || [];

      localStorage.setItem("roles", JSON.stringify(roles));

      const baseUserId = response.userId;
      if (baseUserId) localStorage.setItem("userId", baseUserId);

      const isBuyer = roles.includes("BUYER");
      const isSeller = roles.includes("SELLER");

      // BUYER LOGIN FLOW
      if (isBuyer) {
        const buyerData = await fetchBuyerInfo(baseUserId);

        if (!buyerData) {
          toast.error("Buyer info fetch failed");
          return;
        }

        const buyerId = buyerData.buyerId;
        const buyerUserId = buyerData.user.id;

        if (!buyerUserId || !buyerId) {
          toast.error("Error: Invalid buyer data from server");
          return;
        }

        localStorage.setItem("buyerId", buyerId);
        localStorage.setItem("buyerUserId", buyerUserId);

        dispatch(
          setAuthState({
            token,
            sellerId: null,
            sellerProfile: {
              roles,
              expiresIn: response.expiresIn,
              tokenType: response.tokenType,
              userId: baseUserId,
            },
          })
        );

        toast.success("Login successful");
        refreshAuthState();
        window.dispatchEvent(new Event("auth-state-changed"));
        navigate("/");
        return;
      }

      // SELLER LOGIN FLOW
      if (isSeller) {
        const sellerData = await fetchSellerInfo(baseUserId);

        if (!sellerData) {
          toast.error("Seller info fetch failed");
          return;
        }

        const sellerId = sellerData.sellerId;
        const sellerUserId = sellerData.user.id;

        localStorage.setItem("sellerId", sellerId);
        localStorage.setItem("sellerUserId", sellerUserId);

        dispatch(
          setAuthState({
            token,
            sellerId,
            sellerProfile: {
              roles,
              expiresIn: response.expiresIn,
              tokenType: response.tokenType,
              userId: baseUserId,
            },
          })
        );

        toast.success("Login successful");
        refreshAuthState();
        window.dispatchEvent(new Event("auth-state-changed"));
        navigate("/dashboard");
        return;
      }

      toast.error("Unauthorized: No valid role assigned");
    } catch (err) {
      console.error("Login Error:", err);
      toast.error(
        err?.response?.data?.message ||
          err?.data?.message ||
          err?.message ||
          "Invalid credentials"
      );
    } finally {
      setLoading(false);
      clearAuthenticating();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4">
      {/* Main Container - Compact Side-by-Side */}
      <div
        className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row"
        style={{ maxHeight: "620px" }}
      >
        {/* LEFT SIDE - Brand/Visual (Compact) */}
        <div className="md:w-2/5 bg-gradient-to-br from-blue-600 to-teal-500 p-6 flex flex-col text-white">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center mr-3">
              <MdStorefront className="text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold">
                Kharido<span className="text-blue-100">Becho</span>
              </h1>
              <p className="text-xs text-blue-100">Marketplace</p>
            </div>
          </div>

          <h2 className="text-xl font-bold mb-3">Welcome Back!</h2>
          <p className="text-sm text-blue-100 mb-6">
            Sign in to access your dashboard and manage your marketplace
            activities.
          </p>

          <div className="space-y-3 mb-6">
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-2 text-xs">
                ✓
              </div>
              <span className="text-sm">Secure Login</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-2 text-xs">
                ✓
              </div>
              <span className="text-sm">Real-time Updates</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-2 text-xs">
                ✓
              </div>
              <span className="text-sm">24/7 Support</span>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-white/20">
            <p className="text-xs text-blue-100">© 2024 KharidoBecho</p>
          </div>
        </div>

        {/* RIGHT SIDE - Login Form (Compact) */}
        <div className="md:w-3/5 p-6 overflow-y-auto">
          <div className="max-w-sm mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Sign In</h2>
              <p className="text-gray-600 text-sm mt-1">
                Enter your credentials to continue
              </p>
            </div>

            <div className="space-y-5">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div
                  className={`relative flex items-center border rounded-lg px-3 py-2.5 transition-all duration-200 ${
                    emailFocused
                      ? "border-blue-500 ring-1 ring-blue-200 bg-white"
                      : "border-gray-300 hover:border-gray-400 bg-gray-50"
                  }`}
                >
                  <MdOutlineEmail
                    className={`text-lg mr-2 ${
                      emailFocused ? "text-blue-500" : "text-gray-400"
                    }`}
                  />
                  <input
                    ref={emailRef}
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    onKeyDown={(e) =>
                      handleEnter(e, () => passwordRef.current.focus())
                    }
                    className="flex-1 bg-transparent outline-none text-gray-800 text-sm placeholder-gray-400"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Link
                    to="/forget-password"
                    className="text-xs font-medium text-blue-600 hover:text-blue-800"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div
                  className={`relative flex items-center border rounded-lg px-3 py-2.5 transition-all duration-200 ${
                    passwordFocused
                      ? "border-blue-500 ring-1 ring-blue-200 bg-white"
                      : "border-gray-300 hover:border-gray-400 bg-gray-50"
                  }`}
                >
                  <MdOutlineLock
                    className={`text-lg mr-2 ${
                      passwordFocused ? "text-blue-500" : "text-gray-400"
                    }`}
                  />
                  <input
                    ref={passwordRef}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    onKeyDown={(e) => handleEnter(e, handleLogin)}
                    className="flex-1 bg-transparent outline-none text-gray-800 text-sm placeholder-gray-400"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="ml-1 text-gray-400 hover:text-gray-600 p-1"
                  >
                    {showPassword ? (
                      <MdVisibilityOff className="text-lg" />
                    ) : (
                      <MdVisibility className="text-lg" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 text-sm text-gray-600"
                >
                  Remember me
                </label>
              </div>

              {/* Login Button */}
              <button
                onClick={handleLogin}
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 shadow hover:shadow-md"
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <MdArrowForward className="ml-2 text-base" />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Social Login */}
              <div className="flex gap-3">
                <button className="flex-1 py-2.5 px-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center text-sm">
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </button>
                <button className="flex-1 py-2.5 px-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center text-sm">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="#1877F2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </button>
              </div>

              {/* Sign Up Link */}
              <div className="text-center pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="font-semibold text-blue-600 hover:text-blue-800"
                  >
                    Sign up now
                  </Link>
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  By signing in, you agree to our{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Terms
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-xl max-w-xs text-center">
            <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <h3 className="text-sm font-semibold text-gray-800 mb-1">
              Authenticating
            </h3>
            <p className="text-xs text-gray-600">Please wait...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
