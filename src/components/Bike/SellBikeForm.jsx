// import React, { useState, useEffect } from "react";
// import ImageUploader from "../common/ImageUploader";
// import { useNavigate, useLocation, useParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import useSellerId from "../../pages/useSellerId";
// import {
//   addBike as addBikeService,
//   updateBike,
//   getBikeById,
//   uploadBikeImage as uploadBikeImageService,
// } from "../../store/services/bikeServices";

// import {
//   getBikeBrands,
//   getBikeModels,
//   getBikeVariants,
//   getBikeEngineCC,
//   getLocationStates,
//   getLocationCities,
//   getLocationLocalities,
// } from "../../store/services/bikeBrandServices";

// const initialForm = {
//   title: "",
//   description: "",
//   price: "",
//   brand: "",
//   model: "",
//   variant: "",
//   manufactureYear: "",
//   engineCC: "",
//   kilometersDriven: "",
//   fuelType: "",
//   color: "",
//   registrationNumber: "",
//   status: "ACTIVE",
//   state: "",
//   city: "",
//   neighborhood: "",
// };

// // ✅ FIX: Moved Input component ABOVE usage
// function Input({ label, type = "text", error, ...props }) {
//   return (
//     <div>
//       <label className="block mb-1 text-sm font-medium">{label}</label>
//       <input
//         type={type}
//         {...props}
//         className={`w-full border p-2 rounded-md text-sm ${error ? "border-red-500" : "border-gray-300"
//           }`}
//       />
//       {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
//     </div>
//   );
// }

// function SellerInfoBanner({ sellerId, loading, error }) {
//   return (
//     <div className="p-3 bg-gray-50 rounded text-sm border border-gray-200">
//       <p>
//         <strong>Seller ID:</strong>{" "}
//         {loading ? "Resolving…" : sellerId ?? "Not available"}
//       </p>
//       {!sellerId && !loading && (
//         <p className="text-red-600 mt-1 text-xs">
//           {error || "You must login as seller."}
//         </p>
//       )}
//     </div>
//   );
// }

// export default function SellBikeForm({ productId: propProductId }) {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { id: paramId } = useParams();
//   const bikeIdToUse = propProductId || paramId;

//   const { sellerId, loading: sellerLoading, error: sellerError } = useSellerId();

//   const isEditMode = !!bikeIdToUse || location.state?.mode === "edit";
//   const editItem = location.state?.item;

//   const [form, setForm] = useState(initialForm);
//   const [errors, setErrors] = useState({});
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [bikeId, setBikeId] = useState(bikeIdToUse || null);
//   const [loading, setLoading] = useState(false);
//   const [showUploadStep, setShowUploadStep] = useState(false);

//   const [brands, setBrands] = useState([]);
//   const [models, setModels] = useState([]);
//   const [variants, setVariants] = useState([]);

//   // Location dropdown data
//   const [states, setStates] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [localities, setLocalities] = useState([]);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const res = await getBikeBrands();
//         if (res?.status === "success") {
//           setBrands(res.data.map((b) => b.brand));
//         }
//       } catch {
//         toast.error("Failed to load brands");
//       }
//     };
//     load();

//     // Load States
//     const loadStates = async () => {
//       try {
//         const res = await getLocationStates();
//         // Handle if response is array or object
//         if (Array.isArray(res)) {
//           setStates(res);
//         } else if (res?.status === "success") {
//           setStates(res.data);
//         }
//       } catch (err) {
//         console.error("Failed to load states", err);
//       }
//     }
//     loadStates();
//   }, []);

//   useEffect(() => {
//     if (!isEditMode) return;

//     if (editItem) {
//       setForm({
//         price: editItem.price || editItem.prize || "",
//         brand: editItem.brand || "",
//         model: editItem.model || "",
//         variant: editItem.variant || "",
//         manufactureYear: editItem.manufactureYear || "",
//         engineCC: editItem.engineCC || "",
//         kilometersDriven: editItem.kilometersDriven || "",
//         fuelType: editItem.fuelType || "PETROL",
//         color: editItem.color || "",
//         registrationNumber: editItem.registrationNumber || "",
//         description: editItem.description || "",
//         status: editItem.status || "ACTIVE",
//         title: editItem.title || "",
//       });

//       const id = editItem.bike_id || editItem.id || editItem.bikeId;
//       if (id) setBikeId(id);
//       return;
//     }

//     const loadBike = async () => {
//       try {
//         setLoading(true);
//         const res = await getBikeById(bikeIdToUse);
//         if (res) {
//           setForm({
//             price: res.price || res.prize || "",
//             brand: res.brand || "",
//             model: res.model || "",
//             variant: res.variant || "",
//             manufactureYear: res.manufactureYear || "",
//             engineCC: res.engineCC || "",
//             kilometersDriven: res.kilometersDriven || "",
//             fuelType: res.fuelType || "PETROL",
//             color: res.color || "",
//             registrationNumber: res.registrationNumber || "",
//             description: res.description || "",
//             status: res.status || "ACTIVE",
//             title: res.title || "",
//             state: res.state || "",
//             city: res.city || "",
//             neighborhood: res.neighborhood || res.address || "",
//           });
//           setBikeId(bikeIdToUse);
//         }
//       } catch (err) {
//         toast.error("Failed to load bike: " + err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadBike();
//   }, [isEditMode, bikeIdToUse, editItem]);

//   const handleBrandChange = async (brand) => {
//     setForm((p) => ({ ...p, brand, model: "", variant: "" }));
//     setModels([]);
//     setVariants([]);

//     try {
//       const res = await getBikeModels(brand);
//       if (res?.status === "success") setModels(res.data);
//     } catch {
//       toast.error("Failed to load models");
//     }
//   };

//   const handleModelChange = async (model) => {
//     setForm((p) => ({ ...p, model, variant: "" }));
//     setVariants([]);

//     try {
//       const res = await getBikeVariants(form.brand, model);
//       if (res?.status === "success") setVariants(res.data);
//     } catch {
//       toast.error("Failed to load variants");
//     }
//   };

//   const handleVariantChange = async (variant) => {
//     handleChange("variant", variant);
//     if (!variant) return;

//     try {
//       const res = await getBikeEngineCC(form.brand, form.model, variant);

//       // Handle response format: { status: "success", getData: 155, ... } based on user request
//       // User said response is: { "status": "success", "message": "...", "data": 155 }
//       if (res?.status === "success" && res?.data) {
//         setForm((prev) => ({ ...prev, engineCC: res.data }));
//       }
//     } catch (err) {
//       console.error("Failed to load engine CC", err);
//     }
//   };

//   const handleStateChange = async (state) => {
//     setForm(p => ({ ...p, state, city: "", neighborhood: "" }));
//     setCities([]);
//     setLocalities([]);
//     try {
//       const res = await getLocationCities(state);
//       if (Array.isArray(res)) setCities(res);
//       else if (res?.status === "success") setCities(res.data);
//     } catch (err) {
//       toast.error("Failed to load cities");
//     }
//   }

//   const handleCityChange = async (city) => {
//     setForm(p => ({ ...p, city, neighborhood: "" }));
//     setLocalities([]);
//     try {
//       const res = await getLocationLocalities(form.state, city);
//       if (Array.isArray(res)) setLocalities(res);
//       else if (res?.status === "success") setLocalities(res.data);
//     } catch (err) {
//       toast.error("Failed to load localities");
//     }
//   }

//   const handleChange = (field, value) => {
//     setForm((p) => ({
//       ...p,
//       [field]: ["price", "manufactureYear", "engineCC", "kilometersDriven"].includes(field)
//         ? Number(value)
//         : value,
//     }));
//     if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));


//   };

//   const validateForm = () => {
//     const e = {};
//     const year = new Date().getFullYear();

//     if (!form.brand) e.brand = "Brand required";
//     if (!form.model) e.model = "Model required";
//     if (!form.variant) e.variant = "Variant required";
//     if (!form.manufactureYear) e.manufactureYear = "Year required";
//     else if (form.manufactureYear < 1900 || form.manufactureYear > year + 1)
//       e.manufactureYear = "Invalid year";
//     if (form.engineCC < 0)
//       e.engineCC = "Engine CC cannot be negative";
//     if (form.kilometersDriven === "" || form.kilometersDriven < 0)
//       e.kilometersDriven = "KM cannot be negative";
//     if (form.price < 0) e.price = "Price cannot be negative";
//     if (!form.color) e.color = "Color required";
//     if (!form.registrationNumber) e.registrationNumber = "Registration required";


//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setMessage("");

//     if (!sellerId) {
//       setError("Seller profile missing. Please login again.");
//       return;
//     }

//     if (!validateForm()) {
//       toast.error("Please fix the validation errors");
//       return;
//     }

//     try {
//       setIsLoading(true);
//       const payload = {
//         ...form,
//         prize: Number(form.price || 0),
//         sellerId,
//         address: form.neighborhood, // Map neighborhood to address
//       };
//       delete payload.neighborhood; // Remove the unknown field


//       // Check if we are in edit mode OR if we just created a bike (bikeId exists)
//       const activeBikeId = isEditMode ? bikeIdToUse : bikeId;

//       if (activeBikeId) {
//         // UPDATE Existing Bike (either from edit mode or draft created)
//         await updateBike(activeBikeId, payload);
//         toast.success("Bike updated successfully!");

//         if (isEditMode) {
//           // If strictly edit mode, navigate away
//           navigate("/dashboard", { state: { tab: "BIKES" } });
//         } else {
//           // If draft mode, go to upload step
//           setMessage("Bike updated! Now upload images.");
//           setShowUploadStep(true);
//         }

//       } else {
//         // CREATE New Bike
//         const res = await addBikeService(payload);
//         console.log("Bike creation response details:", res);

//         // Robust ID extraction
//         const newId =
//           res?.bikeId ||
//           res?.id ||
//           res?.bike_id ||
//           res?.data?.bikeId ||
//           res?.data?.id ||
//           res?.data?.bike_id;

//         if (!newId) {
//           console.error("Failed to extract bike ID. Response:", res);
//           toast.error("Ad posted, but failed to capture ID. Please refresh page.");
//           return;
//         }

//         setBikeId(newId);
//         setMessage("Bike added successfully! Now upload images.");
//         setShowUploadStep(true);
//       }
//     } catch (err) {
//       console.error("Submit Error:", err);
//       const msg = err?.response?.data?.message || err.message;

//       if (err?.response?.status === 409) {
//         setError("This ad is already posted. Please check your dashboard.");
//         toast.error("Duplicate entry detected.");
//       } else {
//         setError(msg);
//         toast.error(msg);
//       }
//     } finally {
//       setLoading(false);
//       setIsLoading(false);
//     }
//   };

//   if (loading) return <p className="text-center mt-4">Loading bike data...</p>;

//   return (
//     <div className="max-w-3xl mx-auto bg-white border border-gray-200 mt-5 rounded shadow-sm">
//       <div className="border-b p-4">
//         <h1 className="text-xl text-center font-bold text-gray-800">ADD YOUR BIKE </h1>
//       </div>

//       {showUploadStep && bikeId ? (
//         <div className="p-6">
//           <button
//             onClick={() => setShowUploadStep(false)}
//             className="mb-4 text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
//           >
//             ← Back to Form
//           </button>
//           <ImageUploader
//             idValue={bikeId}
//             idKey="bikeId"
//             uploadService={uploadBikeImageService}
//             onSuccess={() => {
//               toast.success("Images uploaded successfully!");
//               navigate("/dashboard", { state: { tab: "BIKES" } });
//             }}
//           />
//         </div>
//       ) : (
//         <>
//           {/* <div className="p-4 border-b">
//             <h2 className="text-sm font-bold uppercase mb-2 text-gray-700">Selected Category</h2>
//             <div className="text-sm">
//               <span className="text-gray-500">Bikes</span>
//               <span className="mx-2 text-gray-300">|</span>
//               <button type="button" className="text-blue-600 font-semibold hover:underline">Change</button>
//             </div>
//           </div> */}

//           <form onSubmit={handleSubmit} className="p-6 space-y-6" noValidate>
//             <SellerInfoBanner sellerId={sellerId} loading={sellerLoading} error={sellerError} />

//             <div className="border-b pb-6 space-y-6">
//               <h2 className="text-lg font-bold text-gray-800 uppercase">Include Some Details</h2>

//               {/* Brand */}
//               <div>
//                 <label className="block mb-1 text-sm font-semibold text-gray-700">Brand *</label>
//                 <select
//                   value={form.brand}
//                   onChange={(e) => handleBrandChange(e.target.value)}
//                   className={`w-full border rounded px-3 py-2 text-sm h-11 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none ${errors.brand ? "border-red-500" : "border-gray-300"}`}
//                 >
//                   <option value="">Select Brand</option>
//                   {brands.map((b) => <option key={b} value={b}>{b}</option>)}
//                 </select>
//                 {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand}</p>}
//               </div>

//               {/* Year */}
//               <div>
//                 <label className="block mb-1 text-sm font-semibold text-gray-700">Year *</label>
//                 <select
//                   value={form.manufactureYear}
//                   onChange={(e) => handleChange("manufactureYear", e.target.value)}
//                   className={`w-full border rounded px-3 py-2 text-sm h-11 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none ${errors.manufactureYear ? "border-red-500" : "border-gray-300"}`}
//                 >
//                   <option value="">Select Year</option>
//                   {Array.from({ length: new Date().getFullYear() - 1990 + 1 }, (_, i) => new Date().getFullYear() - i).map(
//                     (year) => (
//                       <option key={year} value={year}>
//                         {year}
//                       </option>
//                     )
//                   )}
//                 </select>
//                 {errors.manufactureYear && <p className="text-red-500 text-xs mt-1">{errors.manufactureYear}</p>}
//               </div>

//               {/* Model  */}
//               <div>
//                 <label className="block mb-1 text-sm font-semibold text-gray-700">Model *</label>
//                 <select
//                   value={form.model}
//                   onChange={(e) => handleModelChange(e.target.value)}
//                   disabled={!form.brand}
//                   className={`w-full border rounded px-3 py-2 text-sm h-11 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100 ${errors.model ? "border-red-500" : "border-gray-300"}`}
//                 >
//                   <option value="">Select Model</option>
//                   {models.map((m) => <option key={m} value={m}>{m}</option>)}
//                 </select>
//                 {errors.model && <p className="text-red-500 text-xs mt-1">{errors.model}</p>}
//               </div>

//               {/* Variant */}
//               <div>
//                 <label className="block mb-1 text-sm font-semibold text-gray-700">Variant *</label>
//                 <select
//                   value={form.variant}
//                   onChange={(e) => handleVariantChange(e.target.value)}
//                   disabled={!form.brand || !form.model}
//                   className={`w-full border rounded px-3 py-2 text-sm h-11 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100 ${errors.variant ? "border-red-500" : "border-gray-300"}`}
//                 >
//                   <option value="">Select Variant</option>
//                   {variants.map((v) => <option key={v} value={v}>{v}</option>)}
//                 </select>
//                 {errors.variant && <p className="text-red-500 text-xs mt-1">{errors.variant}</p>}
//               </div>
//               <Input label="Engine CC *" type="number" value={form.engineCC}
//                 onChange={(e) => handleChange("engineCC", e.target.value)} error={errors.engineCC} />



//               {/* Fuel - Chips */}
//               <div>
//                 <label className="block mb-2 text-sm font-semibold text-gray-700">Fuel *</label>
//                 <div className="flex flex-wrap gap-2">
//                   {["PETROL", "ELECTRIC", "HYBRID", "OTHERS"].map((type) => (
//                     <button
//                       key={type}
//                       type="button"
//                       onClick={() => handleChange("fuelType", type)}
//                       className={`px-4 py-2 border rounded text-sm transition-colors ${form.fuelType === type
//                         ? "bg-blue-100 border-blue-500 text-blue-700 font-semibold"
//                         : "bg-white border-gray-300 text-gray-700 hover:border-gray-400"
//                         }`}
//                     >
//                       {type.charAt(0) + type.slice(1).toLowerCase()}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* KM Driven */}
//               <div className="relative">
//                 <Input
//                   label="KM driven *"
//                   type="number"
//                   value={form.kilometersDriven}
//                   onChange={(e) => handleChange("kilometersDriven", e.target.value)}
//                   error={errors.kilometersDriven}
//                 />
//                 {/* <span className="absolute right-0 -bottom-5 text-xs text-gray-400">0 / 6</span> */}
//               </div>


//               {/* Ad Title */}
//               <div>
//                 <label className="block mb-1 text-sm font-semibold text-gray-700">Ad title *</label>
//                 <input
//                   type="text"
//                   value={form.title}
//                   onChange={(e) => handleChange("title", e.target.value)}
//                   maxLength={70}
//                   className={`w-full border rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none ${errors.title ? "border-red-500" : "border-gray-300"}`}
//                 />
//                 <div className="flex justify-between mt-1">
//                   <p className="text-xs text-gray-500">Mention the key features of your item (e.g. brand, model, age, type)</p>
//                   <p className="text-xs text-gray-400">{form.title?.length || 0} / 70</p>
//                 </div>
//                 {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
//               </div>

//               {/* Description */}
//               <div>
//                 <label className="block mb-1 text-sm font-semibold text-gray-700">Description *</label>
//                 <textarea
//                   value={form.description}
//                   onChange={(e) => handleChange("description", e.target.value)}
//                   className={`w-full border rounded px-3 py-2 text-sm h-32 resize-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none ${errors.description ? "border-red-500" : "border-gray-300"}`}
//                   maxLength={200}
//                 />
//                 <div className="flex justify-between mt-1">
//                   <p className="text-xs text-gray-500">Include condition, features and reason for selling</p>
//                   <p className="text-xs text-gray-400">{form.description.length} / 200</p>
//                 </div>
//                 {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
//               </div>

//               {/* Other Required Fields Hidden/Visible based on need. 
//                The image doesn't explicitly show Color, EngineCC, Registration No, but they are required by validation.
//                I will keep them here to ensure form validity, but maybe group them or keep them at the end of details?
//                The user said "no other chanes add fuel type same as it select it and year field".
//                So I should KEEP them. I will put them before Description or after.
//                To behave safely, I will put them before Title to keep the visual flow of "Vehicle Details" -> "Ad Details".
//             */}

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div className="flex flex-col">
//                   <label className="block mb-1 text-sm font-semibold text-gray-700">Color *</label>
//                   <select
//                     value={form.color}
//                     onChange={(e) => handleChange("color", e.target.value)}
//                     className={`w-full border rounded px-3 py-2 text-sm h-11 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none ${errors.color ? "border-red-500" : "border-gray-300"}`}
//                   >
//                     <option value="">Select Color</option>
//                     {["Black", "White", "Red", "Blue", "Silver", "Grey", "Matt Black", "Orange", "Yellow", "Green", "Purple", "Brown", "Gold", "Other"]
//                       .map(c => <option key={c} value={c}>{c}</option>)}
//                   </select>
//                   {errors.color && <p className="text-red-500 text-xs mt-1">{errors.color}</p>}
//                 </div>

//                 <Input label="Registration Number *" value={form.registrationNumber}
//                   onChange={(e) => handleChange("registrationNumber", e.target.value)} error={errors.registrationNumber} />
//               </div>

//             </div>

//             {/* PRICE SECTION */}
//             <div className="pt-2">
//               <h2 className="text-lg font-bold text-gray-800 uppercase mb-4">Set a Price</h2>
//               <div className="max-w-md">
//                 <label className="block mb-1 text-sm font-semibold text-gray-700">Price *</label>
//                 <div className="relative">
//                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
//                   <input
//                     type="number"
//                     value={form.price}
//                     onChange={(e) => handleChange("price", e.target.value)}
//                     className={`w-full border rounded pl-8 pr-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none ${errors.price ? "border-red-500" : "border-gray-300"}`}
//                   />
//                 </div>
//                 {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
//               </div>
//             </div>

//             {/* LOCATION SECTION (Static) */}
//             <div className="pt-6 border-t border-gray-200 mt-6">
//               <h2 className="text-lg font-bold text-gray-800 uppercase mb-4">Confirm Your Location</h2>

//               {/* Tabs */}
//               <div className="flex border-b border-gray-300 mb-4">
//                 <button type="button" className="px-4 py-2 text-sm font-bold border-b-2 border-blue-900 text-blue-900 focus:outline-none">LIST</button>
//                 <button type="button" className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 focus:outline-none">CURRENT LOCATION</button>
//               </div>

//               {/* Fields */}
//               <div className="space-y-4 max-w-md">
//                 <div>
//                   <label className="block mb-1 text-sm font-semibold text-gray-700">State *</label>
//                   <select
//                     value={form.state}
//                     onChange={(e) => handleStateChange(e.target.value)}
//                     className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-11 focus:outline-none bg-white"
//                   >
//                     <option value="">Select State</option>
//                     {states.map((s) => <option key={s} value={s}>{s}</option>)}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block mb-1 text-sm font-semibold text-gray-700">City *</label>
//                   <select
//                     value={form.city}
//                     onChange={(e) => handleCityChange(e.target.value)}
//                     disabled={!form.state}
//                     className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-11 focus:outline-none bg-white disabled:bg-gray-100"
//                   >
//                     <option value="">Select City</option>
//                     {cities.map((c) => <option key={c} value={c}>{c}</option>)}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block mb-1 text-sm font-semibold text-gray-700">Neighbourhood *</label>
//                   <select
//                     value={form.neighborhood}
//                     onChange={(e) => handleChange("neighborhood", e.target.value)}
//                     disabled={!form.city}
//                     className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-11 focus:outline-none bg-white disabled:bg-gray-100"
//                   >
//                     <option value="">Select Neighbourhood</option>
//                     {localities.map((l) => <option key={l} value={l}>{l}</option>)}
//                   </select>
//                   {errors.neighborhood && <p className="text-red-500 text-xs mt-1">{errors.neighborhood}</p>}
//                 </div>
//               </div>
//             </div>

//             <div className="border-t pt-6">
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 rounded shadow transition-all duration-300 disabled:opacity-50"
//               >
//                 {isLoading ? "Post now..." : "Post now"}
//               </button>
//             </div>

//             {message && <p className="text-center text-green-600 text-sm">{message}</p>}
//             {error && <p className="text-center text-red-600 text-sm">{error}</p>}
//           </form>
//         </>
//       )}
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import ImageUploader from "../common/ImageUploader";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useSellerId from "../../pages/useSellerId";
import {
  addBike as addBikeService,
  updateBike,
  getBikeById,
  uploadBikeImage as uploadBikeImageService,
} from "../../store/services/bikeServices";

import {
  getBikeBrands,
  getBikeModels,
  getBikeVariants,
  getBikeEngineCC,
  getLocationStates,
  getLocationCities,
  getLocationLocalities,
} from "../../store/services/bikeBrandServices";

const initialForm = {
  title: "",
  description: "",
  price: "",
  brand: "",
  model: "",
  variant: "",
  manufactureYear: "",
  engineCC: "",
  kilometersDriven: "",
  fuelType: "",
  color: "",
  registrationNumber: "",
  status: "ACTIVE",
  state: "",
  city: "",
  neighborhood: "",
};

//  FIX: Moved Input component ABOVE usage
function Input({ label, type = "text", error, ...props }) {
  return (
    <div>
      <label className="block mb-1 text-sm font-medium">{label}</label>
      <input
        type={type}
        {...props}
        className={`w-full border p-2 rounded-md text-sm ${error ? "border-red-500" : "border-gray-300"
          }`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

function SellerInfoBanner({ sellerId, loading, error }) {
  return (
    <div className="p-3 bg-gray-50 rounded text-sm border border-gray-200">
      <p>
        <strong>Seller ID:</strong>{" "}
        {loading ? "Resolving…" : sellerId ?? "Not available"}
      </p>
      {!sellerId && !loading && (
        <p className="text-red-600 mt-1 text-xs">
          {error || "You must login as seller."}
        </p>
      )}
    </div>
  );
}

export default function SellBikeForm({ productId: propProductId }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: paramId } = useParams();
  const bikeIdToUse = propProductId || paramId;

  const { sellerId, loading: sellerLoading, error: sellerError } = useSellerId();

  const isEditMode = !!bikeIdToUse || location.state?.mode === "edit";
  const editItem = location.state?.item;

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [bikeId, setBikeId] = useState(bikeIdToUse || null);
  const [loading, setLoading] = useState(false);
  const [showUploadStep, setShowUploadStep] = useState(false);

  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [variants, setVariants] = useState([]);

  // Location dropdown data
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [localities, setLocalities] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getBikeBrands();
        if (res?.status === "success") {
          setBrands(res.data.map((b) => b.brand));
        }
      } catch {
        toast.error("Failed to load brands");
      }
    };
    load();

    // Load States
    const loadStates = async () => {
      try {
        const res = await getLocationStates();
        // Handle if response is array or object
        if (Array.isArray(res)) {
          setStates(res);
        } else if (res?.status === "success") {
          setStates(res.data);
        }
      } catch (err) {
        console.error("Failed to load states", err);
      }
    }
    loadStates();
  }, []);

  useEffect(() => {
    if (!isEditMode) return;

    if (editItem) {
      setForm({
        price: editItem.price || editItem.prize || "",
        brand: editItem.brand || "",
        model: editItem.model || "",
        variant: editItem.variant || "",
        manufactureYear: editItem.manufactureYear || "",
        engineCC: editItem.engineCC || "",
        kilometersDriven: editItem.kilometersDriven || "",
        fuelType: editItem.fuelType || "PETROL",
        color: editItem.color || "",
        registrationNumber: editItem.registrationNumber || "",
        description: editItem.description || "",
        status: editItem.status || "ACTIVE",
        title: editItem.title || "",
      });

      const id = editItem.bike_id || editItem.id || editItem.bikeId;
      if (id) setBikeId(id);
      return;
    }

    const loadBike = async () => {
      try {
        setLoading(true);
        const res = await getBikeById(bikeIdToUse);
        if (res) {
          setForm({
            price: res.price || res.prize || "",
            brand: res.brand || "",
            model: res.model || "",
            variant: res.variant || "",
            manufactureYear: res.manufactureYear || "",
            engineCC: res.engineCC || "",
            kilometersDriven: res.kilometersDriven || "",
            fuelType: res.fuelType || "PETROL",
            color: res.color || "",
            registrationNumber: res.registrationNumber || "",
            description: res.description || "",
            status: res.status || "ACTIVE",
            title: res.title || "",
            state: res.state || "",
            city: res.city || "",
            neighborhood: res.neighborhood || res.address || "",
          });
          setBikeId(bikeIdToUse);
        }
      } catch (err) {
        toast.error("Failed to load bike: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    loadBike();
  }, [isEditMode, bikeIdToUse, editItem]);

  const handleBrandChange = async (brand) => {
    setForm((p) => ({ ...p, brand, model: "", variant: "" }));
    setModels([]);
    setVariants([]);

    try {
      const res = await getBikeModels(brand);
      if (res?.status === "success") setModels(res.data);
    } catch {
      toast.error("Failed to load models");
    }
  };

  const handleModelChange = async (model) => {
    setForm((p) => ({ ...p, model, variant: "" }));
    setVariants([]);

    try {
      const res = await getBikeVariants(form.brand, model);
      if (res?.status === "success") setVariants(res.data);
    } catch {
      toast.error("Failed to load variants");
    }
  };

  const handleVariantChange = async (variant) => {
    handleChange("variant", variant);
    if (!variant) return;

    try {
      const res = await getBikeEngineCC(form.brand, form.model, variant);

      // Handle response format: { status: "success", getData: 155, ... } based on user request
      // User said response is: { "status": "success", "message": "...", "data": 155 }
      if (res?.status === "success" && res?.data) {
        setForm((prev) => ({ ...prev, engineCC: res.data }));
      }
    } catch (err) {
      console.error("Failed to load engine CC", err);
    }
  };

  const handleStateChange = async (state) => {
    setForm(p => ({ ...p, state, city: "", neighborhood: "" }));
    setCities([]);
    setLocalities([]);
    try {
      const res = await getLocationCities(state);
      if (Array.isArray(res)) setCities(res);
      else if (res?.status === "success") setCities(res.data);
    } catch (err) {
      toast.error("Failed to load cities");
    }
  }

  const handleCityChange = async (city) => {
    setForm(p => ({ ...p, city, neighborhood: "" }));
    setLocalities([]);
    try {
      const res = await getLocationLocalities(form.state, city);
      if (Array.isArray(res)) setLocalities(res);
      else if (res?.status === "success") setLocalities(res.data);
    } catch (err) {
      toast.error("Failed to load localities");
    }
  }

  const handleChange = (field, value) => {
    setForm((p) => ({
      ...p,
      [field]: ["price", "manufactureYear", "engineCC", "kilometersDriven"].includes(field)
        ? (value === "" ? "" : Number(value))
        : value,
    }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
  };

  const validateForm = () => {
    const e = {};
    if (form.description && form.description.length > 200) {
      e.description = "Description cannot exceed 200 characters";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!sellerId) {
      setError("Seller profile missing. Please login again.");
      return;
    }

    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }

    try {
      setIsLoading(true);
      const payload = {
        ...form,
        prize: Number(form.price || 0),
        sellerId,
        address: form.neighborhood, // Map neighborhood to address
      };
      delete payload.neighborhood; // Remove the unknown field


      // Check if we are in edit mode OR if we just created a bike (bikeId exists)
      const activeBikeId = isEditMode ? bikeIdToUse : bikeId;

      if (activeBikeId) {
        // UPDATE Existing Bike (either from edit mode or draft created)
        await updateBike(activeBikeId, payload);
        toast.success("Bike updated successfully!");

        if (isEditMode) {
          // If strictly edit mode, navigate away
          navigate("/dashboard", { state: { tab: "BIKES" } });
        } else {
          // If draft mode, go to upload step
          setMessage("Bike updated! Now upload images.");
          setShowUploadStep(true);
        }

      } else {
        // CREATE New Bike
        const res = await addBikeService(payload);
        console.log("Bike creation response details:", res);

        // Robust ID extraction
        const newId =
          res?.bikeId ||
          res?.id ||
          res?.bike_id ||
          res?.data?.bikeId ||
          res?.data?.id ||
          res?.data?.bike_id;

        if (!newId) {
          console.error("Failed to extract bike ID. Response:", res);
          toast.error("Ad posted, but failed to capture ID. Please refresh page.");
          return;
        }

        setBikeId(newId);
        setMessage("Bike added successfully! Now upload images.");
        setShowUploadStep(true);
      }
    } catch (err) {
      console.error("Submit Error:", err);
      const msg = err?.response?.data?.message || err.message;

      if (err?.response?.status === 409) {
        setError("This ad is already posted. Please check your dashboard.");
        toast.error("Duplicate entry detected.");
      } else {
        setError(msg);
        toast.error(msg);
      }
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-4">Loading bike data...</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white border border-gray-200 mt-5 rounded shadow-sm">
      <div className="border-b p-4">
        <h1 className="text-xl text-center font-bold text-gray-800">ADD YOUR BIKE </h1>
      </div>

      {showUploadStep && bikeId ? (
        <div className="p-6">
          <button
            onClick={() => setShowUploadStep(false)}
            className="mb-4 text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
          >
            ← Back to Form
          </button>
          <ImageUploader
            idValue={bikeId}
            idKey="bikeId"
            uploadService={uploadBikeImageService}
            onSuccess={() => {
              toast.success("Images uploaded successfully!");
              navigate("/dashboard", { state: { tab: "BIKES" } });
            }}
          />
        </div>
      ) : (
        <>
          {/* <div className="p-4 border-b">
            <h2 className="text-sm font-bold uppercase mb-2 text-gray-700">Selected Category</h2>
            <div className="text-sm">
              <span className="text-gray-500">Bikes</span>
              <span className="mx-2 text-gray-300">|</span>
              <button type="button" className="text-blue-600 font-semibold hover:underline">Change</button>
            </div>
          </div> */}

          <form onSubmit={handleSubmit} className="p-6 space-y-6" noValidate>
            <SellerInfoBanner sellerId={sellerId} loading={sellerLoading} error={sellerError} />

            <div className="border-b pb-6 space-y-6">
              <h2 className="text-lg font-bold text-gray-800 uppercase">Include Some Details</h2>

              {/* Brand */}
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Brand</label>
                <select
                  value={form.brand}
                  onChange={(e) => handleBrandChange(e.target.value)}
                  className={`w-full border rounded px-3 py-2 text-sm h-11 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none ${errors.brand ? "border-red-500" : "border-gray-300"}`}
                >
                  <option value="">Select Brand</option>
                  {brands.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
                {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand}</p>}
              </div>

              {/* Year */}
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Year</label>
                <select
                  value={form.manufactureYear}
                  onChange={(e) => handleChange("manufactureYear", e.target.value)}
                  className={`w-full border rounded px-3 py-2 text-sm h-11 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none ${errors.manufactureYear ? "border-red-500" : "border-gray-300"}`}
                >
                  <option value="">Select Year</option>
                  {Array.from({ length: new Date().getFullYear() - 1990 + 1 }, (_, i) => new Date().getFullYear() - i).map(
                    (year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    )
                  )}
                </select>
                {errors.manufactureYear && <p className="text-red-500 text-xs mt-1">{errors.manufactureYear}</p>}
              </div>

              {/* Model  */}
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Model</label>
                <select
                  value={form.model}
                  onChange={(e) => handleModelChange(e.target.value)}
                  disabled={!form.brand}
                  className={`w-full border rounded px-3 py-2 text-sm h-11 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100 ${errors.model ? "border-red-500" : "border-gray-300"}`}
                >
                  <option value="">Select Model</option>
                  {models.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
                {errors.model && <p className="text-red-500 text-xs mt-1">{errors.model}</p>}
              </div>

              {/* Variant */}
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Variant</label>
                <select
                  value={form.variant}
                  onChange={(e) => handleVariantChange(e.target.value)}
                  disabled={!form.brand || !form.model}
                  className={`w-full border rounded px-3 py-2 text-sm h-11 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100 ${errors.variant ? "border-red-500" : "border-gray-300"}`}
                >
                  <option value="">Select Variant</option>
                  {variants.map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
                {errors.variant && <p className="text-red-500 text-xs mt-1">{errors.variant}</p>}
              </div>
              <Input label="Engine CC" type="number" value={form.engineCC}
                onChange={(e) => handleChange("engineCC", e.target.value)} error={errors.engineCC} />



              {/* Fuel - Chips */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Fuel</label>
                <div className="flex flex-wrap gap-2">
                  {["PETROL", "ELECTRIC", "HYBRID", "OTHERS"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleChange("fuelType", type)}
                      className={`px-4 py-2 border rounded text-sm transition-colors ${form.fuelType === type
                        ? "bg-blue-100 border-blue-500 text-blue-700 font-semibold"
                        : "bg-white border-gray-300 text-gray-700 hover:border-gray-400"
                        }`}
                    >
                      {type.charAt(0) + type.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* KM Driven */}
              <div className="relative">
                <Input
                  label="KM driven"
                  type="number"
                  value={form.kilometersDriven}
                  onChange={(e) => handleChange("kilometersDriven", e.target.value)}
                  error={errors.kilometersDriven}
                />
                {/* <span className="absolute right-0 -bottom-5 text-xs text-gray-400">0 / 6</span> */}
              </div>


              {/* Ad Title */}
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Ad title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  maxLength={70}
                  className={`w-full border rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none ${errors.title ? "border-red-500" : "border-gray-300"}`}
                />
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-gray-500">Mention the key features of your item (e.g. brand, model, age, type)</p>
                  <p className="text-xs text-gray-400">{form.title?.length || 0} / 70</p>
                </div>
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className={`w-full border rounded px-3 py-2 text-sm h-32 resize-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none ${errors.description ? "border-red-500" : "border-gray-300"}`}
                  maxLength={200}
                />
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-gray-500">Include condition, features and reason for selling</p>
                  <p className="text-xs text-gray-400">{form.description.length} / 200</p>
                </div>
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>

              {/* Other Required Fields Hidden/Visible based on need. 
               The image doesn't explicitly show Color, EngineCC, Registration No, but they are required by validation.
               I will keep them here to ensure form validity, but maybe group them or keep them at the end of details?
               The user said "no other chanes add fuel type same as it select it and year field".
               So I should KEEP them. I will put them before Description or after.
               To behave safely, I will put them before Title to keep the visual flow of "Vehicle Details" -> "Ad Details".
            */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="block mb-1 text-sm font-semibold text-gray-700">Color</label>
                  <select
                    value={form.color}
                    onChange={(e) => handleChange("color", e.target.value)}
                    className={`w-full border rounded px-3 py-2 text-sm h-11 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none ${errors.color ? "border-red-500" : "border-gray-300"}`}
                  >
                    <option value="">Select Color</option>
                    {["Black", "White", "Red", "Blue", "Silver", "Grey", "Matt Black", "Orange", "Yellow", "Green", "Purple", "Brown", "Gold", "Other"]
                      .map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.color && <p className="text-red-500 text-xs mt-1">{errors.color}</p>}
                </div>

                <Input label="Registration Number" value={form.registrationNumber}
                  onChange={(e) => handleChange("registrationNumber", e.target.value)} error={errors.registrationNumber} />
              </div>

            </div>

            {/* PRICE SECTION */}
            <div className="pt-2">
              <h2 className="text-lg font-bold text-gray-800 uppercase mb-4">Set a Price</h2>
              <div className="max-w-md">
                <label className="block mb-1 text-sm font-semibold text-gray-700">Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    className={`w-full border rounded pl-8 pr-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none ${errors.price ? "border-red-500" : "border-gray-300"}`}
                  />
                </div>
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
              </div>
            </div>

            {/* LOCATION SECTION (Static) */}
            <div className="pt-6 border-t border-gray-200 mt-6">
              <h2 className="text-lg font-bold text-gray-800 uppercase mb-4">Confirm Your Location</h2>

              {/* Tabs */}
              <div className="flex border-b border-gray-300 mb-4">
                <button type="button" className="px-4 py-2 text-sm font-bold border-b-2 border-blue-900 text-blue-900 focus:outline-none">LIST</button>
                <button type="button" className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 focus:outline-none">CURRENT LOCATION</button>
              </div>

              {/* Fields */}
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block mb-1 text-sm font-semibold text-gray-700">State</label>
                  <select
                    value={form.state}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-11 focus:outline-none bg-white"
                  >
                    <option value="">Select State</option>
                    {states.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-semibold text-gray-700">City</label>
                  <select
                    value={form.city}
                    onChange={(e) => handleCityChange(e.target.value)}
                    disabled={!form.state}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-11 focus:outline-none bg-white disabled:bg-gray-100"
                  >
                    <option value="">Select City</option>
                    {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-semibold text-gray-700">Neighbourhood</label>
                  <select
                    value={form.neighborhood}
                    onChange={(e) => handleChange("neighborhood", e.target.value)}
                    disabled={!form.city}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-11 focus:outline-none bg-white disabled:bg-gray-100"
                  >
                    <option value="">Select Neighbourhood</option>
                    {localities.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                  {errors.neighborhood && <p className="text-red-500 text-xs mt-1">{errors.neighborhood}</p>}
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 rounded shadow transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? "Post now..." : "Post now"}
              </button>
            </div>

            {message && <p className="text-center text-green-600 text-sm">{message}</p>}
            {error && <p className="text-center text-red-600 text-sm">{error}</p>}
          </form>
        </>
      )}
    </div>
  );
}

