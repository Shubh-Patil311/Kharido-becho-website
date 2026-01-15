// import { useState } from "react";
// import { toast } from "react-toastify";

// import useSellerId from "../hooks/useSellerId";
// import { addCar } from "../store/services/carServices";
// import { uploadCarImage } from "../store/services/carImageServices";

// const initialCarForm = {
//   title: "",
//   brand: "",
//   model: "",
//   variant: "",
//   manufactureYear: "",
//   kilometersDriven: "",
//   fuelType: "PETROL",
//   transmission: "MANUAL",
//   owners: "FIRST",
//   bodyType: "",
//   color: "",
//   price: "",
//   location: "",
//   description: "",
//   status: "AVAILABLE",
// };

// export default function SellCarForm() {
//   const {
//     sellerId,
//     loading: sellerLoading,
//     error: sellerError,
//   } = useSellerId();

//   const [form, setForm] = useState(initialCarForm);
//   const [photoFiles, setPhotoFiles] = useState([]);
//   const [createdCarId, setCreatedCarId] = useState(null);
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
//         manufactureYear: Number(form.manufactureYear || 0),
//         kilometersDriven: Number(form.kilometersDriven || 0),
//         sellerId,
//       };

//       const response = await addCar(payload);
//       toast.success(response?.message || "Car listed successfully!");

//       const newId =
//         response?.data?.id ||
//         response?.id ||
//         response?.carId ||
//         response?.data?.carId ||
//         response?.message?.match(/(\d+)/)?.[1];

//       if (newId) {
//         setCreatedCarId(newId);
//       }

//       setForm(initialCarForm);
//     } catch (error) {
//       console.error("Car creation failed", error);
//       toast.error(
//         error?.response?.data?.message ||
//           error?.message ||
//           "Failed to list car"
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handlePhotoUpload = async () => {
//     if (!createdCarId) {
//       toast.error("Create a car listing before uploading images.");
//       return;
//     }

//     if (photoFiles.length === 0) {
//       toast.error("Select at least one image to upload.");
//       return;
//     }

//     try {
//       setUploading(true);
//       for (const file of photoFiles) {
//         await uploadCarImage(createdCarId, file);
//       }
//       toast.success("Images uploaded successfully!");
//     } catch (error) {
//       console.error("Car image upload failed", error);
//       toast.error("Failed to upload some images. Please retry.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div>
//       <h1 className="text-3xl font-bold mb-6">List a Car</h1>

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
//           label="Variant"
//           value={form.variant}
//           onChange={(e) => handleInput("variant", e.target.value)}
//         />
//         <InputField
//           label="Price (₹)"
//           type="number"
//           value={form.price}
//           onChange={(e) => handleInput("price", e.target.value)}
//           required
//         />
//         <InputField
//           label="Manufacture Year"
//           type="number"
//           value={form.manufactureYear}
//           onChange={(e) => handleInput("manufactureYear", e.target.value)}
//         />
//         <InputField
//           label="Kilometers Driven"
//           type="number"
//           value={form.kilometersDriven}
//           onChange={(e) => handleInput("kilometersDriven", e.target.value)}
//         />
//         <InputField
//           label="Colour"
//           value={form.color}
//           onChange={(e) => handleInput("color", e.target.value)}
//         />
//         <InputField
//           label="Location"
//           value={form.location}
//           onChange={(e) => handleInput("location", e.target.value)}
//         />
//         <div>
//           <label className="block font-semibold mb-1 text-sm">Fuel Type</label>
//           <select
//             value={form.fuelType}
//             onChange={(e) => handleInput("fuelType", e.target.value)}
//             className="w-full border rounded p-2 text-sm"
//           >
//             <option value="PETROL">Petrol</option>
//             <option value="DIESEL">Diesel</option>
//             <option value="CNG">CNG</option>
//             <option value="ELECTRIC">Electric</option>
//             <option value="HYBRID">Hybrid</option>
//           </select>
//         </div>
//         <div>
//           <label className="block font-semibold mb-1 text-sm">
//             Transmission
//           </label>
//           <select
//             value={form.transmission}
//             onChange={(e) => handleInput("transmission", e.target.value)}
//             className="w-full border rounded p-2 text-sm"
//           >
//             <option value="MANUAL">Manual</option>
//             <option value="AUTOMATIC">Automatic</option>
//             <option value="AMT">AMT</option>
//             <option value="IMT">iMT</option>
//           </select>
//         </div>
//         <div>
//           <label className="block font-semibold mb-1 text-sm">Ownership</label>
//           <select
//             value={form.owners}
//             onChange={(e) => handleInput("owners", e.target.value)}
//             className="w-full border rounded p-2 text-sm"
//           >
//             <option value="FIRST">First Owner</option>
//             <option value="SECOND">Second Owner</option>
//             <option value="THIRD">Third Owner</option>
//             <option value="FOURTH_PLUS">Fourth or above</option>
//           </select>
//         </div>
//         <InputField
//           label="Body Type"
//           value={form.bodyType}
//           onChange={(e) => handleInput("bodyType", e.target.value)}
//           placeholder="SUV, Sedan, Hatchback..."
//         />
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
//             <option value="DELETED">Deleted</option>
//           </select>
//         </div>
//         <div className="md:col-span-2">
//           <label className="block font-semibold mb-1 text-sm">Description</label>
//           <textarea
//             value={form.description}
//             onChange={(e) => handleInput("description", e.target.value)}
//             className="w-full border rounded p-2 text-sm h-24"
//             placeholder="Mention service history, insurance, accessories, etc."
//           />
//         </div>
//         <button
//           type="submit"
//           disabled={submitting || !sellerId || sellerLoading}
//           className="md:col-span-2 bg-indigo-600 text-white py-3 rounded font-semibold disabled:opacity-60"
//         >
//           {submitting
//             ? "Submitting…"
//             : sellerLoading
//               ? "Resolving seller…"
//               : "Create Listing"}
//         </button>
//       </form>

//       {createdCarId && (
//         <div className="mt-10 border-t pt-6">
//           <h2 className="text-xl font-semibold mb-3">
//             Upload Car Images (ID: {createdCarId})
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
//           {error || "Login as a seller to list cars."}
//         </p>
//       )}
//     </div>
//   );
// }



import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import useSellerId from "../../pages/useSellerId";
import {
  addCar,
  updateCar,
  getCarById,
} from "../../store/services/carServices";
import { uploadCarImage } from "../../store/services/carImageServices";

const initialCarForm = {
  title: "",
  description: "",

  airbag: false,
  abs: false,
  buttonStart: false,
  sunroof: false,
  childSafetyLocks: false,
  acFeature: false,
  musicFeature: false,

  price: "",
  negotiable: false,

  condition: "USED",

  brand: "",
  model: "",
  variant: "",

  color: "",
  yearOfPurchase: "",
  fuelType: "PETROL",

  carInsurance: false,
  carInsuranceDate: "",
  carInsuranceType: "",

  transmission: "MANUAL",

  powerWindowFeature: false,
  rearParkingCameraFeature: false,

  kmDriven: "",
  numberOfOwners: "",

  address: "",
  city: "",
  state: "",
  pincode: "",
};

export default function SellCarForm({ productId }) {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    sellerId,
    loading: sellerLoading,
    error: sellerError,
  } = useSellerId();

  const isEditMode = !!productId || location.state?.mode === "edit";
  const editItem = location.state?.item;

  const [form, setForm] = useState(initialCarForm);
  const [photoFiles, setPhotoFiles] = useState([]);
  const [createdCarId, setCreatedCarId] = useState(productId || null);

  const [creating, setCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch car data in edit mode
  useEffect(() => {
    const fetchCarData = async () => {
      if (!isEditMode || !productId) return;

      try {
        setLoading(true);
        const car = await getCarById(productId);

        if (car) {
          setForm({
            title: car.title || "",
            description: car.description || "",
            airbag: car.airbag || false,
            abs: car.abs || false,
            buttonStart: car.buttonStart || false,
            sunroof: car.sunroof || false,
            childSafetyLocks: car.childSafetyLocks || false,
            acFeature: car.acFeature || false,
            musicFeature: car.musicFeature || false,
            price: car.price || "",
            negotiable: car.negotiable || false,
            condition: car.condition || "USED",
            brand: car.brand || "",
            model: car.model || "",
            variant: car.variant || "",
            color: car.color || "",
            yearOfPurchase: car.yearOfPurchase || "",
            fuelType: car.fuelType || "PETROL",
            carInsurance: car.carInsurance || false,
            carInsuranceDate: car.carInsuranceDate || "",
            carInsuranceType: car.carInsuranceType || "",
            transmission: car.transmission || "MANUAL",
            powerWindowFeature: car.powerWindowFeature || false,
            rearParkingCameraFeature: car.rearParkingCameraFeature || false,
            kmDriven: car.kmDriven || "",
            numberOfOwners: car.numberOfOwners || "",
            address: car.address || "",
            city: car.city || "",
            state: car.state || "",
            pincode: car.pincode || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch car:", error);
        toast.error("Failed to load car data");
      } finally {
        setLoading(false);
      }
    };

    // If editItem is provided in state, use it directly
    if (isEditMode && editItem) {
      setForm({
        title: editItem.title || "",
        description: editItem.description || "",
        airbag: editItem.airbag || false,
        abs: editItem.abs || false,
        buttonStart: editItem.buttonStart || false,
        sunroof: editItem.sunroof || false,
        childSafetyLocks: editItem.childSafetyLocks || false,
        acFeature: editItem.acFeature || false,
        musicFeature: editItem.musicFeature || false,
        price: editItem.price || "",
        negotiable: editItem.negotiable || false,
        condition: editItem.condition || "USED",
        brand: editItem.brand || "",
        model: editItem.model || "",
        variant: editItem.variant || "",
        color: editItem.color || "",
        yearOfPurchase: editItem.yearOfPurchase || "",
        fuelType: editItem.fuelType || "PETROL",
        carInsurance: editItem.carInsurance || false,
        carInsuranceDate: editItem.carInsuranceDate || "",
        carInsuranceType: editItem.carInsuranceType || "",
        transmission: editItem.transmission || "MANUAL",
        powerWindowFeature: editItem.powerWindowFeature || false,
        rearParkingCameraFeature: editItem.rearParkingCameraFeature || false,
        kmDriven: editItem.kmDriven || "",
        numberOfOwners: editItem.numberOfOwners || "",
        address: editItem.address || "",
        city: editItem.city || "",
        state: editItem.state || "",
        pincode: editItem.pincode || "",
      });
    } else {
      fetchCarData();
    }
  }, [isEditMode, productId, editItem]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  /* ---------------- CREATE/UPDATE CAR ---------------- */
  const handleCreateCar = async (e) => {
    e.preventDefault();

    if (!sellerId) {
      toast.error("Seller ID missing. Please login again.");
      return;
    }

    try {
      setCreating(true);

      const payload = {
        ...form,
        price: Number(form.price || 0),
        yearOfPurchase: Number(form.yearOfPurchase || 0),
        kmDriven: Number(form.kmDriven || 0),
        numberOfOwners: Number(form.numberOfOwners || 0),
        pincode: form.pincode?.toString(),
        sellerId,
      };

      if (isEditMode && productId) {
        // UPDATE MODE
        await updateCar(productId, payload);
        toast.success("Car updated successfully!");
        navigate("/dashboard");
      } else {
        // CREATE MODE
        const res = await addCar(payload);

        const newId =
          res?.carId ||
          res?.data?.carId ||
          res?.id ||
          res?.data?.id ||
          res?.message?.match(/(\d+)/)?.[1];

        if (!newId) {
          toast.error("Car created but ID missing.");
          return;
        }

        setCreatedCarId(newId);
        toast.success("Car created! Now upload images.");
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          (isEditMode ? "Failed to update car" : "Failed to create car")
      );
    } finally {
      setCreating(false);
    }
  };

  /* ---------------- UPLOAD IMAGES ---------------- */
  const handleUploadImages = async () => {
    if (!createdCarId) {
      toast.error("Create a car listing first.");
      return;
    }

    if (photoFiles.length === 0) {
      toast.error("Select at least one image.");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      photoFiles.forEach((file) => formData.append("files", file));

      await uploadCarImage(createdCarId, formData);

      toast.success("Images uploaded successfully!");
      navigate("/dashboard", { state: { tab: "CARS" } });
    } catch (err) {
      toast.error("Failed to upload images.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-5 py-6">
        <p>Loading car data...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-5 py-6">
      <h1 className="text-3xl font-bold mb-6">
        {isEditMode ? "Edit Car" : "Sell Your Car"}
      </h1>

      <SellerBanner
        sellerId={sellerId}
        loading={sellerLoading}
        error={sellerError}
      /> 123 Main Street,<br />
                  Pune, Maharashtra – 400001

      {/* MAIN FORM */}
      <form
        onSubmit={handleCreateCar}
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
          label="Variant"
          value={form.variant}
          onChange={(e) => updateField("variant", e.target.value)}
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
          label="KM Driven"
          type="number"
          value={form.kmDriven}
          onChange={(e) => updateField("kmDriven", e.target.value)}
        />

        <Input
          label="Total Owners"
          type="number"
          value={form.numberOfOwners}
          onChange={(e) => updateField("numberOfOwners", e.target.value)}
        />

        <Input
          label="Fuel Type"
          value={form.fuelType}
          onChange={(e) => updateField("fuelType", e.target.value)}
          placeholder="e.g. PETROL, DIESEL"
        />

        <Input
          label="Transmission"
          value={form.transmission}
          onChange={(e) => updateField("transmission", e.target.value)}
          placeholder="e.g. MANUAL, AUTOMATIC"
        />

        <Input
          label="Address"
          value={form.address}
          onChange={(e) => updateField("address", e.target.value)}
        />
        <Input
          label="City"
          value={form.city}
          onChange={(e) => updateField("city", e.target.value)}
        />
        <Input
          label="State"
          value={form.state}
          onChange={(e) => updateField("state", e.target.value)}
        />
        <Input
          label="Pincode"
          value={form.pincode}
          onChange={(e) => updateField("pincode", e.target.value)}
        />

        {/* FEATURES */}
        <div className="md:col-span-2">
          <h3 className="font-semibold mb-2">Features & Safety</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Checkbox
              label="Airbag"
              checked={form.airbag}
              onChange={() => updateField("airbag", !form.airbag)}
            />
            <Checkbox
              label="ABS"
              checked={form.abs}
              onChange={() => updateField("abs", !form.abs)}
            />
            <Checkbox
              label="Sunroof"
              checked={form.sunroof}
              onChange={() => updateField("sunroof", !form.sunroof)}
            />
            <Checkbox
              label="Button Start"
              checked={form.buttonStart}
              onChange={() => updateField("buttonStart", !form.buttonStart)}
            />

            <Checkbox
              label="AC Feature"
              checked={form.acFeature}
              onChange={() => updateField("acFeature", !form.acFeature)}
            />
            <Checkbox
              label="Music Feature"
              checked={form.musicFeature}
              onChange={() => updateField("musicFeature", !form.musicFeature)}
            />

            <Checkbox
              label="Power Window"
              checked={form.powerWindowFeature}
              onChange={() =>
                updateField("powerWindowFeature", !form.powerWindowFeature)
              }
            />

            <Checkbox
              label="Rear Parking Camera"
              checked={form.rearParkingCameraFeature}
              onChange={() =>
                updateField(
                  "rearParkingCameraFeature",
                  !form.rearParkingCameraFeature
                )
              }
            />
          </div>
        </div>

        {/* INSURANCE */}
        <div className="md:col-span-2">
          <h3 className="font-semibold mb-2">Insurance</h3>

          <Checkbox
            label="Has Insurance"
            checked={form.carInsurance}
            onChange={() => updateField("carInsurance", !form.carInsurance)}
          />

          {form.carInsurance && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <Input
                label="Insurance Type"
                value={form.carInsuranceType}
                onChange={(e) =>
                  updateField("carInsuranceType", e.target.value)
                }
              />
              <Input
                label="Insurance Expiry Date"
                type="date"
                value={form.carInsuranceDate}
                onChange={(e) =>
                  updateField("carInsuranceDate", e.target.value)
                }
              />
            </div>
          )}
        </div>

        {/* DESCRIPTION */}
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
          className="md:col-span-2 bg-indigo-600 text-white py-3 rounded font-semibold disabled:opacity-60"
        >
          {creating
            ? isEditMode
              ? "Updating…"
              : "Creating…"
            : isEditMode
            ? "Update Car Listing"
            : "Create Car Listing"}
        </button>
      </form>

      {/* IMAGE UPLOAD */}
      {createdCarId && !isEditMode && (
        <div className="mt-10 border-t pt-6">
          <h2 className="text-xl font-semibold mb-3">Upload Car Images</h2>

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

/* -------------------------- INPUT COMPONENTS -------------------------- */

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block font-semibold mb-1 text-sm">{label}</label>
      <input {...props} className="w-full border rounded p-2 text-sm" />
    </div>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" checked={checked} onChange={onChange} />
      {label}
    </label>
  );
}

function SellerBanner({ sellerId, loading, error }) {
  return (
    <div className="p-3 bg-gray-100 rounded mb-5 text-sm">
      <p>
        <strong>Seller ID:</strong> {loading ? "Resolving…" : sellerId}
      </p>
      {!sellerId && !loading && (
        <p className="text-red-600 mt-1">{error || "Login required"}</p>
      )}
    </div>
  );
}
