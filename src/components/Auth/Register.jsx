import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  MdOutlineEmail,
  MdOutlineLock,
  MdArrowForward,
  MdStorefront,
  MdPerson,
  MdPhone,
  MdHome,
  MdAssignment,
} from "react-icons/md";
import { toast } from "react-toastify";
import { registerUser } from "../../store/services/authServices";

const ROLES = ["USER", "BUYER", "SELLER"];

const Registration = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    address: "",
    firstName: "",
    lastName: "",
    mobileNumber: "",
    role: "BUYER",
  });

  const [focusedField, setFocusedField] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.email ||
      !formData.password ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.mobileNumber ||
      !formData.address ||
      !formData.role
    ) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setIsLoading(true);
      await registerUser(formData);
      toast.success("Account created successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error("Registration Error:", err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.data?.message ||
        err?.message ||
        "Registration failed";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4">
      {/* Main Container - Even More Compact */}
      <div
        className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row"
        style={{ maxHeight: "580px" }}
      >
        {/* LEFT SIDE - Brand/Visual (Very Compact) */}
        <div className="md:w-2/5 bg-gradient-to-br from-blue-600 to-teal-500 p-4 flex flex-col text-white">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center mr-2">
              <MdStorefront className="text-lg" />
            </div>
            <div>
              <h1 className="text-lg font-bold">
                Kharido<span className="text-blue-100">Becho</span>
              </h1>
              <p className="text-xs text-blue-100">Join Us</p>
            </div>
          </div>

          <h2 className="text-lg font-bold mb-2">Join Our Community!</h2>
          <p className="text-xs text-blue-100 mb-4">
            Create an account to start buying and selling.
          </p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center mr-2 text-xs">
                ✓
              </div>
              <span className="text-xs">Secure Registration</span>
            </div>
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center mr-2 text-xs">
                ✓
              </div>
              <span className="text-xs">Quick Verification</span>
            </div>
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center mr-2 text-xs">
                ✓
              </div>
              <span className="text-xs">Start Trading Now</span>
            </div>
          </div>

          <div className="mt-auto pt-3 border-t border-white/20">
            <p className="text-xs text-blue-100">
              Already registered?{" "}
              <Link to="/login" className="font-semibold underline text-white">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* RIGHT SIDE - Registration Form (Ultra Compact) */}
        <div className="md:w-3/5 p-4">
          <div className="max-w-sm mx-auto h-full flex flex-col">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Create Account
              </h2>
              <p className="text-gray-600 text-xs mt-1">
                Fill in your details below
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 flex-grow">
              {/* Name Fields - Side by Side */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <div
                    className={`relative flex items-center border rounded-lg px-2 py-1.5 transition-all duration-200 ${
                      focusedField === "firstName"
                        ? "border-blue-500 ring-1 ring-blue-100 bg-white"
                        : "border-gray-300 hover:border-gray-300 bg-gray-50"
                    }`}
                  >
                    <MdPerson
                      className={`text-base mr-1 ${
                        focusedField === "firstName"
                          ? "text-blue-500"
                          : "text-gray-400"
                      }`}
                    />
                    <input
                      type="text"
                      name="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("firstName")}
                      onBlur={() => setFocusedField("")}
                      className="flex-1 bg-transparent outline-none text-gray-800 text-xs placeholder-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <div
                    className={`relative flex items-center border rounded-lg px-2 py-1.5 transition-all duration-200 ${
                      focusedField === "lastName"
                        ? "border-blue-500 ring-1 ring-blue-100 bg-white"
                        : "border-gray-300 hover:border-gray-300 bg-gray-50"
                    }`}
                  >
                    <MdPerson
                      className={`text-base mr-1 ${
                        focusedField === "lastName"
                          ? "text-blue-500"
                          : "text-gray-400"
                      }`}
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("lastName")}
                      onBlur={() => setFocusedField("")}
                      className="flex-1 bg-transparent outline-none text-gray-800 text-xs placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div
                  className={`relative flex items-center border rounded-lg px-2 py-1.5 transition-all duration-200 ${
                    focusedField === "email"
                      ? "border-blue-500 ring-1 ring-blue-100 bg-white"
                      : "border-gray-300 hover:border-gray-300 bg-gray-50"
                  }`}
                >
                  <MdOutlineEmail
                    className={`text-base mr-1 ${
                      focusedField === "email"
                        ? "text-blue-500"
                        : "text-gray-400"
                    }`}
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField("")}
                    className="flex-1 bg-transparent outline-none text-gray-800 text-xs placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div
                  className={`relative flex items-center border rounded-lg px-2 py-1.5 transition-all duration-200 ${
                    focusedField === "password"
                      ? "border-blue-500 ring-1 ring-blue-100 bg-white"
                      : "border-gray-300 hover:border-gray-300 bg-gray-50"
                  }`}
                >
                  <MdOutlineLock
                    className={`text-base mr-1 ${
                      focusedField === "password"
                        ? "text-blue-500"
                        : "text-gray-400"
                    }`}
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Create password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField("")}
                    className="flex-1 bg-transparent outline-none text-gray-800 text-xs placeholder-gray-400"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Min. 8 characters
                </p>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Mobile Number
                </label>
                <div
                  className={`relative flex items-center border rounded-lg px-2 py-1.5 transition-all duration-200 ${
                    focusedField === "mobileNumber"
                      ? "border-blue-500 ring-1 ring-blue-100 bg-white"
                      : "border-gray-300 hover:border-gray-300 bg-gray-50"
                  }`}
                >
                  <MdPhone
                    className={`text-base mr-1 ${
                      focusedField === "mobileNumber"
                        ? "text-blue-500"
                        : "text-gray-400"
                    }`}
                  />
                  <input
                    type="text"
                    name="mobileNumber"
                    placeholder="9876543210"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("mobileNumber")}
                    onBlur={() => setFocusedField("")}
                    className="flex-1 bg-transparent outline-none text-gray-800 text-xs placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Address
                </label>
                <div
                  className={`relative flex items-center border rounded-lg px-2 py-1.5 transition-all duration-200 ${
                    focusedField === "address"
                      ? "border-blue-500 ring-1 ring-blue-100 bg-white"
                      : "border-gray-300 hover:border-gray-300 bg-gray-50"
                  }`}
                >
                  <MdHome
                    className={`text-base mr-1 ${
                      focusedField === "address"
                        ? "text-blue-500"
                        : "text-gray-400"
                    }`}
                  />
                  <textarea
                    name="address"
                    placeholder="Your address"
                    value={formData.address}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("address")}
                    onBlur={() => setFocusedField("")}
                    rows="2"
                    className="flex-1 bg-transparent outline-none text-gray-800 text-xs placeholder-gray-400 resize-none"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Register as:
                </label>
                <div
                  className={`relative flex items-center border rounded-lg px-2 py-1.5 transition-all duration-200 ${
                    focusedField === "role"
                      ? "border-blue-500 ring-1 ring-blue-100 bg-white"
                      : "border-gray-300 hover:border-gray-300 bg-gray-50"
                  }`}
                >
                  <MdAssignment
                    className={`text-base mr-1 ${
                      focusedField === "role"
                        ? "text-blue-500"
                        : "text-gray-400"
                    }`}
                  />
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("role")}
                    onBlur={() => setFocusedField("")}
                    className="flex-1 bg-transparent outline-none text-gray-800 text-xs appearance-none cursor-pointer"
                  >
                    {ROLES.map((roleOption) => (
                      <option
                        key={roleOption}
                        value={roleOption}
                        className="bg-white"
                      >
                        {roleOption.charAt(0) +
                          roleOption.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-3 w-3"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-start">
                <input
                  id="terms"
                  type="checkbox"
                  className="mt-0.5 w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="terms" className="ml-1 text-xs text-gray-600">
                  I agree to{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Terms
                  </a>
                </label>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2 px-4 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center mt-2 ${
                  isLoading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 shadow hover:shadow-md"
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    Create Account
                    <MdArrowForward className="ml-2 text-sm" />
                  </>
                )}
              </button>
            </form>

            {/* Sign In Link */}
            <div className="text-center pt-2 mt-2 border-t border-gray-100">
              <p className="text-xs text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-blue-600 hover:text-blue-800"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 shadow-xl max-w-xs text-center">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <h3 className="text-xs font-semibold text-gray-800 mb-0.5">
              Creating Account
            </h3>
            <p className="text-xs text-gray-600">Please wait...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Registration;

// import React, { useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import logo from "../../assets/Images/kharidobecho-logo.svg";
// import { toast } from "react-toastify";
// import { registerUser } from "../../store/services/authServices";

// const ROLES = ["BUYER", "SELLER"];

// const Registration = () => {
//   const navigate = useNavigate();

//   const [isLoading, setIsLoading] = useState(false);
//   const [focused, setFocused] = useState(null);

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPass, setShowConfirmPass] = useState(false);

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     confirmPassword: "",
//     firstName: "",
//     lastName: "",
//     mobileNumber: "",
//     address: "",
//     role: "BUYER",
//   });

//   const refs = {
//     firstName: useRef(),
//     lastName: useRef(),
//     email: useRef(),
//     password: useRef(),
//     confirmPassword: useRef(),
//     mobileNumber: useRef(),
//     address: useRef(),
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const validate = () => {
//     const { firstName, lastName, email, password, confirmPassword, mobileNumber, address } =
//       formData;

//     if (!firstName || !lastName || !email || !password || !confirmPassword || !mobileNumber || !address) {
//       toast.error("Please fill all fields");
//       return false;
//     }

//     if (!/^\d{10}$/.test(mobileNumber)) {
//       toast.error("Mobile number must be 10 digits");
//       return false;
//     }

//     if (!/^[\w.+\-]+@gmail\.com$/.test(email)) {
//       toast.error("Email must be a valid Gmail (@gmail.com)");
//       return false;
//     }

//     if (!/^(?=.*[!@#$%^&*(),.?\":{}|<>]).{8,}$/.test(password)) {
//       toast.error("Password must be 8+ chars & contain 1 special symbol");
//       return false;
//     }

//     if (password !== confirmPassword) {
//       toast.error("Passwords do not match");
//       return false;
//     }

//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validate()) return;

//     try {
//       setIsLoading(true);

//       const payload = {
//         email: formData.email,
//         password: formData.password,
//         firstName: formData.firstName,
//         lastName: formData.lastName,
//         mobileNumber: Number(formData.mobileNumber),
//         address: formData.address,
//         role: formData.role,
//       };

//       await registerUser(payload);

//       toast.success("Account created successfully!");
//       navigate("/login");
//     } catch (err) {
//       toast.error(
//         err?.response?.data?.message ||
//         err?.message ||
//         "Registration failed"
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const RenderInput = ({
//     label,
//     name,
//     type = "text",
//     placeholder,
//     next,
//     isPassword,
//     toggle,
//     showPass,
//   }) => {
//     const inputType = isPassword ? (showPass ? "text" : "password") : type;

//     return (
//       <div>
//         <label className="block text-gray-700 font-medium mb-1">{label}</label>

//         <div
//           onClick={() => refs[name]?.current?.focus()}
//           className={`flex items-center border rounded-xl bg-gray-50 px-4 py-3 transition-all ${
//             focused === name ? "border-blue-500 shadow" : "border-gray-300"
//           }`}
//         >
//           <input
//             ref={refs[name]}
//             type={inputType}
//             name={name}
//             value={formData[name]}
//             placeholder={placeholder}
//             onChange={handleChange}
//             onFocus={() => setFocused(name)}
//             onBlur={() => setFocused(null)}
//             onKeyUp={(e) => {             // ✅ FIXED (keyUp instead of keyDown)
//               if (e.key === "Enter" && next) refs[next].current?.focus();
//             }}
//             className="w-full bg-transparent outline-none"
//           />

//           {isPassword && (
//             <button
//               type="button"
//               onClick={toggle}
//               className="text-gray-500 hover:text-gray-700 ml-2"
//             >
//               {showPass ? "🙈" : "👁️"}
//             </button>
//           )}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen flex">
//       <div className="hidden md:flex w-1/2 bg-white items-center justify-center">
//         <img src={logo} alt="Logo" className="w-72 object-contain" />
//       </div>

//       <div className="w-full md:w-1/2 flex flex-col items-center px-8 py-10">
//         <h1 className="text-3xl font-semibold text-center">Create Account</h1>
//         <p className="text-gray-500 text-center text-sm mt-3 mb-10 max-w-xs">
//           Start your journey with KharidoBecho. Join our marketplace today!
//         </p>

//         <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">

//           <RenderInput label="First Name" name="firstName" placeholder="Enter first name" next="lastName" />

//           <RenderInput label="Last Name" name="lastName" placeholder="Enter last name" next="email" />

//           <RenderInput label="Email Address" name="email" type="email" placeholder="Enter email" next="password" />

//           <RenderInput
//             label="Password"
//             name="password"
//             isPassword
//             showPass={showPassword}
//             toggle={() => setShowPassword(!showPassword)}
//             placeholder="Enter password"
//             next="confirmPassword"
//           />

//           <RenderInput
//             label="Confirm Password"
//             name="confirmPassword"
//             isPassword
//             showPass={showConfirmPass}
//             toggle={() => setShowConfirmPass(!showConfirmPass)}
//             placeholder="Re-enter password"
//             next="mobileNumber"   // correct
//           />

//           <RenderInput
//             label="Mobile Number"
//             name="mobileNumber"
//             placeholder="Enter mobile number"
//             next="address"
//           />

//           <div>
//             <label className="block text-gray-700 font-medium mb-1">Address</label>
//             <textarea
//               name="address"
//               ref={refs.address}
//               placeholder="Enter address"
//               value={formData.address}
//               onChange={handleChange}
//               onFocus={() => setFocused("address")}
//               onBlur={() => setFocused(null)}
//               className={`w-full p-3 border rounded-xl bg-gray-50 outline-none ${
//                 focused === "address" ? "border-blue-500 shadow" : "border-gray-300"
//               }`}
//             />
//           </div>

//           <div>
//             <label className="block text-gray-700 font-medium mb-1">Register as</label>
//             <select
//               name="role"
//               value={formData.role}
//               onChange={handleChange}
//               className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50"
//             >
//               {ROLES.map((role) => (
//                 <option key={role} value={role}>
//                   {role}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <button
//             id="register-btn"
//             type="submit"
//             disabled={isLoading}
//             className="w-full bg-[#0A2533] text-white py-4 rounded-xl mt-2 text-lg font-medium disabled:opacity-50"
//           >
//             {isLoading ? "Registering..." : "Register"}
//           </button>
//         </form>

//         <p className="text-gray-600 text-sm mt-6">
//           Already have an account?{" "}
//           <span
//             className="text-blue-600 font-semibold cursor-pointer"
//             onClick={() => navigate("/login")}
//           >
//             Login
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Registration;
