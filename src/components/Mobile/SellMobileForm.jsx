// import { useState } from "react";
// import { toast } from "react-toastify";

// import useSellerId from "../hooks/useSellerId";
// import { addMobile } from "../store/services/mobileServices";
// import { uploadMobileImage } from "../store/services/mobileImageServices";

// const initialMobileForm = {
//   title: "",
//   brand: "",
//   model: "",
//   storage: "",
//   ram: "",
//   color: "",
//   operatingSystem: "ANDROID",
//   batteryCapacity: "",
//   cameraDetails: "",
//   condition: "GOOD",
//   price: "",
//   description: "",
//   status: "AVAILABLE",
// };

// export default function SellMobileForm() {
//   const {
//     sellerId,
//     loading: sellerLoading,
//     error: sellerError,
//   } = useSellerId();

//   const [form, setForm] = useState(initialMobileForm);
//   const [photoFiles, setPhotoFiles] = useState([]);
//   const [createdMobileId, setCreatedMobileId] = useState(null);
//   const [submitting, setSubmitting] = useState(false);
//   const [uploading, setUploading] = useState(false);

//   const handleInput = (field, value) => {
//     setForm((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (!sellerId) {
//       toast.error(sellerError || "Seller ID missing. Please login again.");
//       return;
//     }

//     try {
//       setSubmitting(true);
//       const payload = {
//         ...form,
//         price: Number(form.price || 0),
//         storage: Number(form.storage || 0),
//         ram: Number(form.ram || 0),
//         batteryCapacity: Number(form.batteryCapacity || 0),
//         sellerId,
//       };

//       const response = await addMobile(payload);
//       toast.success(response?.message || "Mobile listed successfully!");

//       const newId =
//         response?.data?.id ||
//         response?.id ||
//         response?.mobileId ||
//         response?.data?.mobileId ||
//         response?.message?.match(/(\d+)/)?.[1];

//       if (newId) {
//         setCreatedMobileId(newId);
//       }

//       setForm(initialMobileForm);
//     } catch (error) {
//       console.error("Mobile creation failed", error);
//       toast.error(
//         error?.response?.data?.message ||
//           error?.message ||
//           "Failed to list mobile"
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handlePhotoUpload = async () => {
//     if (!createdMobileId) {
//       toast.error("Create a mobile listing before uploading images.");
//       return;
//     }

//     if (photoFiles.length === 0) {
//       toast.error("Select at least one image to upload.");
//       return;
//     }

//     try {
//       setUploading(true);
//       for (const file of photoFiles) {
//         await uploadMobileImage(createdMobileId, file);
//       }
//       toast.success("Images uploaded successfully!");
//     } catch (error) {
//       console.error("Mobile image upload failed", error);
//       toast.error("Failed to upload some images. Please retry.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div>
//       <h1 className="text-3xl font-bold mb-6">List a Mobile</h1>

//       <SellerNotice sellerId={sellerId} loading={sellerLoading} error={sellerError} />

//       <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <InputField
//           label="Listing Title"
//           value={form.title}
//           onChange={(e) => handleInput("title", e.target.value)}
//           required
//         />
//         <InputField
//           label="Brand"
//           value={form.brand}
//           onChange={(e) => handleInput("brand", e.target.value)}
//           required
//         />
//         <InputField
//           label="Model"
//           value={form.model}
//           onChange={(e) => handleInput("model", e.target.value)}
//           required
//         />
//         <InputField
//           label="Price (₹)"
//           type="number"
//           value={form.price}
//           onChange={(e) => handleInput("price", e.target.value)}
//           required
//         />
//         <InputField
//           label="Storage (GB)"
//           type="number"
//           value={form.storage}
//           onChange={(e) => handleInput("storage", e.target.value)}
//         />
//         <InputField
//           label="RAM (GB)"
//           type="number"
//           value={form.ram}
//           onChange={(e) => handleInput("ram", e.target.value)}
//         />
//         <InputField
//           label="Colour"
//           value={form.color}
//           onChange={(e) => handleInput("color", e.target.value)}
//         />
//         <InputField
//           label="Battery (mAh)"
//           type="number"
//           value={form.batteryCapacity}
//           onChange={(e) => handleInput("batteryCapacity", e.target.value)}
//         />
//         <InputField
//           label="Camera Details"
//           value={form.cameraDetails}
//           onChange={(e) => handleInput("cameraDetails", e.target.value)}
//         />
//         <div>
//           <label className="block font-semibold mb-1 text-sm">
//             Operating System
//           </label>
//           <select
//             value={form.operatingSystem}
//             onChange={(e) => handleInput("operatingSystem", e.target.value)}
//             className="w-full border rounded p-2 text-sm"
//           >
//             <option value="ANDROID">Android</option>
//             <option value="IOS">iOS</option>
//             <option value="HARMONY">Harmony</option>
//             <option value="OTHERS">Others</option>
//           </select>
//         </div>
//         <div>
//           <label className="block font-semibold mb-1 text-sm">Condition</label>
//           <select
//             value={form.condition}
//             onChange={(e) => handleInput("condition", e.target.value)}
//             className="w-full border rounded p-2 text-sm"
//           >
//             <option value="NEW">New</option>
//             <option value="LIKE_NEW">Like New</option>
//             <option value="GOOD">Good</option>
//             <option value="FAIR">Fair</option>
//           </select>
//         </div>
//         <div>
//           <label className="block font-semibold mb-1 text-sm">Status</label>
//           <select
//             value={form.status}
//             onChange={(e) => handleInput("status", e.target.value)}
//             className="w-full border rounded p-2 text-sm"
//           >
//             <option value="AVAILABLE">Available</option>
//             <option value="PENDING">Pending</option>
//             <option value="SOLD">Sold</option>
//           </select>
//         </div>
//         <div className="md:col-span-2">
//           <label className="block font-semibold mb-1 text-sm">Description</label>
//           <textarea
//             value={form.description}
//             onChange={(e) => handleInput("description", e.target.value)}
//             className="w-full border rounded p-2 text-sm h-24"
//             placeholder="Highlight condition, accessories, warranty, etc."
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={submitting || !sellerId || sellerLoading}
//           className="md:col-span-2 bg-green-600 text-white py-3 rounded font-semibold disabled:opacity-60"
//         >
//           {submitting
//             ? "Submitting…"
//             : sellerLoading
//               ? "Resolving seller…"
//               : "Create Listing"}
//         </button>
//       </form>

//       {createdMobileId && (
//         <div className="mt-10 border-t pt-6">
//           <h2 className="text-xl font-semibold mb-3">
//             Upload Mobile Images (ID: {createdMobileId})
//           </h2>
//           <input
//             type="file"
//             multiple
//             accept="image/*"
//             onChange={(e) => setPhotoFiles([...e.target.files])}
//             className="mb-3"
//           />
//           {photoFiles.length > 0 && (
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
//               {photoFiles.map((file, index) => (
//                 <img
//                   key={file.name + index}
//                   src={URL.createObjectURL(file)}
//                   alt="preview"
//                   className="w-full h-32 object-cover rounded border"
//                 />
//               ))}
//             </div>
//           )}
//           <button
//             type="button"
//             onClick={handlePhotoUpload}
//             disabled={uploading}
//             className="bg-blue-600 text-white px-5 py-2 rounded disabled:opacity-60"
//           >
//             {uploading ? "Uploading…" : "Upload Images"}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// function InputField({ label, type = "text", ...rest }) {
//   return (
//     <div>
//       <label className="block font-semibold mb-1 text-sm">{label}</label>
//       <input
//         type={type}
//         {...rest}
//         className="w-full border rounded p-2 text-sm"
//       />
//     </div>
//   );
// }

// function SellerNotice({ sellerId, loading, error }) {
//   return (
//     <div className="mb-4 rounded-md bg-gray-50 p-3 text-sm text-gray-700">
//       <p>
//         <span className="font-semibold">Seller ID:</span>{" "}
//         {loading ? "Resolving…" : sellerId ?? "Not available"}
//       </p>
//       {!sellerId && !loading && (
//         <p className="text-red-600 mt-1">
//           {error || "Login as a seller to list mobiles."}
//         </p>
//       )}
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

import useSellerId from "../../pages/useSellerId";
import {
  addMobile,
  updateMobile,
  getMobileById,
} from "../../store/services/mobileServices";
import { uploadMobileImage } from "../../store/services/mobileImageServices";

const initialMobileForm = {
  title: "",
  description: "",
  brand: "",
  model: "",
  color: "",
  yearOfPurchase: "",
  price: "",
  negotiable: false,
  condition: "USED", // NEW / USED / REFURBISHED from backend
};

export default function SellMobileForm({ productId }) {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    sellerId,
    loading: sellerLoading,
    error: sellerError,
  } = useSellerId();

  const isEditMode = !!productId || location.state?.mode === "edit";
  const editItem = location.state?.item;

  const [form, setForm] = useState(initialMobileForm);
  const [photoFiles, setPhotoFiles] = useState([]);
  const [createdMobileId, setCreatedMobileId] = useState(productId || null);
  const [creating, setCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch mobile data in edit mode
  useEffect(() => {
    const fetchMobileData = async () => {
      if (!isEditMode || !productId) return;

      try {
        setLoading(true);
        const mobile = await getMobileById(productId);

        if (mobile) {
          setForm({
            title: mobile.title || "",
            description: mobile.description || "",
            brand: mobile.brand || "",
            model: mobile.model || "",
            color: mobile.color || "",
            yearOfPurchase: mobile.yearOfPurchase || "",
            price: mobile.price || "",
            negotiable: mobile.negotiable || false,
            condition: mobile.condition || "USED",
          });
        }
      } catch (error) {
        console.error("Failed to fetch mobile:", error);
        toast.error("Failed to load mobile data");
      } finally {
        setLoading(false);
      }
    };

    // If editItem is provided in state, use it directly
    if (isEditMode && editItem) {
      setForm({
        title: editItem.title || "",
        description: editItem.description || "",
        brand: editItem.brand || "",
        model: editItem.model || "",
        color: editItem.color || "",
        yearOfPurchase: editItem.yearOfPurchase || "",
        price: editItem.price || "",
        negotiable: editItem.negotiable || false,
        condition: editItem.condition || "USED",
      });
    } else {
      fetchMobileData();
    }
  }, [isEditMode, productId, editItem]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  /** -------------------- CREATE/UPDATE MOBILE -------------------- **/
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!sellerId) {
      toast.error("Seller ID missing. Please login again.");
      return;
    }

    try {
      setCreating(true);

      const payload = {
        ...form,
        price: Number(form.price),
        yearOfPurchase: Number(form.yearOfPurchase),
        sellerId,
      };

      if (isEditMode && productId) {
        // UPDATE MODE
        await updateMobile(productId, payload);
        toast.success("Mobile updated successfully!");
        navigate("/dashboard");
      } else {
        // CREATE MODE
        const res = await addMobile(payload);

        const newId =
          res?.mobileId ||
          res?.data?.mobileId ||
          res?.id ||
          res?.data?.id ||
          res?.message?.match(/(\d+)/)?.[1];

        if (!newId) {
          toast.error("Mobile created but no ID found.");
          return;
        }

        setCreatedMobileId(newId);
        toast.success("Mobile created! Now upload images.");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          (isEditMode ? "Failed to update mobile" : "Failed to create mobile")
      );
    } finally {
      setCreating(false);
    }
  };

  /** -------------------- UPLOAD IMAGES -------------------- **/
  const handleUploadImages = async () => {
    if (!createdMobileId) {
      toast.error("Create mobile first");
      return;
    }

    if (photoFiles.length === 0) {
      toast.error("Select at least one image");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      photoFiles.forEach((file) => formData.append("files", file));

      await uploadMobileImage(createdMobileId, formData);

      toast.success("Images uploaded successfully!");

      navigate("/dashboard", { state: { tab: "MOBILES" } });
    } catch (error) {
      toast.error("Failed to upload images.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-5 py-6">
        <p>Loading mobile data...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-5 py-6">
      <h1 className="text-3xl font-bold mb-6">
        {isEditMode ? "Edit Mobile" : "Sell Your Mobile"}
      </h1>

      <SellerBanner
        sellerId={sellerId}
        loading={sellerLoading}
        error={sellerError}
      />

      {/* MOBILE DETAILS FORM */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        <Input
          label="Title"
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
          required
        />
        <Input
          label="Brand"
          value={form.brand}
          onChange={(e) => updateField("brand", e.target.value)}
          required
        />
        <Input
          label="Model"
          value={form.model}
          onChange={(e) => updateField("model", e.target.value)}
          required
        />
        <Input
          label="Color"
          value={form.color}
          onChange={(e) => updateField("color", e.target.value)}
        />
        <Input
          label="Year of Purchase"
          type="number"
          value={form.yearOfPurchase}
          onChange={(e) => updateField("yearOfPurchase", e.target.value)}
        />
        <Input
          label="Price (₹)"
          type="number"
          value={form.price}
          onChange={(e) => updateField("price", e.target.value)}
          required
        />

        <Input
          label="Condition"
          value={form.condition}
          onChange={(e) => updateField("condition", e.target.value)}
          placeholder="e.g. NEW, USED, REFURBISHED"
        />

        {/* Status */}
        {/* <Select
          label="Status"
          value={form.status}
          onChange={(e) => updateField("status", e.target.value)}
          options={["ACTIVE", "SOLD", "EXPIRED", "DELETED"]}
        /> */}

        <div className="md:col-span-2">
          <label className="font-semibold mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            className="w-full border rounded p-2"
            rows={4}
          />
        </div>

        <button
          type="submit"
          disabled={creating}
          className="md:col-span-2 bg-green-600 text-white py-3 rounded font-semibold disabled:opacity-60"
        >
          {creating
            ? isEditMode
              ? "Updating…"
              : "Creating…"
            : isEditMode
            ? "Update Mobile Listing"
            : "Create Mobile Listing"}
        </button>
      </form>

      {/* IMAGE UPLOAD */}
      {createdMobileId && !isEditMode && (
        <div className="mt-10 border-t pt-6">
          <h2 className="text-xl font-semibold mb-3">
            Upload Mobile Images (ID: {createdMobileId})
          </h2>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setPhotoFiles([...e.target.files])}
            className="mb-3"
          />

          {photoFiles.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {photoFiles.map((file, i) => (
                <img
                  key={i}
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="w-full h-32 object-cover rounded border"
                />
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={handleUploadImages}
            disabled={uploading}
            className="bg-blue-600 text-white px-5 py-2 rounded disabled:opacity-60"
          >
            {uploading ? "Uploading…" : "Upload Images"}
          </button>
        </div>
      )}
    </div>
  );
}

/* ------------ Components --------------- */

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block font-semibold mb-1 text-sm">{label}</label>
      <input {...props} className="w-full border rounded p-2 text-sm" />
    </div>
  );
}

function SellerBanner({ sellerId, loading, error }) {
  return (
    <div className="p-3 bg-gray-100 rounded mb-5 text-sm">
      <p>
        <strong>Seller ID:</strong> {loading ? "Resolving…" : sellerId}
      </p>
      {!sellerId && !loading && <p className="text-red-600">{error}</p>}
    </div>
  );
}
