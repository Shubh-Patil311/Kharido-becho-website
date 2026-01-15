import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import {
  createLaptop,
  updateLaptop,
  getLaptopById,
  uploadLaptopPhotos,
} from "../../store/services/laptopServices";

import {
  getLocationStates,
  getLocationCities,
  getLocationLocalities,
} from "../../store/services/bikeBrandServices";

import {
  getRamOptions,
  getStorageOptions,
  getScreenSizes,
  getMemoryTypes,
  getProcessorBrands,
  getGraphicsBrands,
  getWarrantyOptions,
  getLaptopBrands,
  getLaptopModels,
} from "../../store/services/laptopDropdownServices";

import useSellerId from "../../pages/useSellerId";

export default function SellLaptopForm({ productId }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { sellerId } = useSellerId();

  const isEditMode = !!productId || location.state?.mode === "edit";

  const colorOptions = [
    "Black",
    "White",
    "Silver",
    "Grey",
    "Blue",
    "Red",
    "Green",
    "Gold",
  ];

  const [errors, setErrors] = useState({});
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);

  const [formData, setFormData] = useState({
    serialNumber: "",
    dealer: "",
    brand: "",
    model: "",
    price: "",
    warrantyInYear: "",

    processor: "",
    processorBrand: "",
    memoryType: "",
    screenSize: "",
    colour: "",
    ram: "",
    storage: "",
    battery: "",
    batteryLife: "",
    graphicsCard: "",
    graphicBrand: "",
    weight: "",
    manufacturer: "",
    usbPorts: "",
    status: "ACTIVE",
    state: "",
    city: "",
    locality: "",
  });

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [localities, setLocalities] = useState([]);

  const [dropdowns, setDropdowns] = useState({
    ram: [],
    storage: [],
    screenSizes: [],
    memoryTypes: [],
    processorBrands: [],
    graphicsBrands: [],
    warranty: [],
  });

  const [photoFiles, setPhotoFiles] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [createdLaptopId, setCreatedLaptopId] = useState(productId || null);
  const [loading, setLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);

  useEffect(() => {
    getLocationStates().then(setStates);
  }, []);

  const handleStateChange = async (state) => {
    setFormData((p) => ({ ...p, state, city: "", locality: "" }));
    setCities(await getLocationCities(state));
    setLocalities([]);
  };

  const handleCityChange = async (city) => {
    setFormData((p) => ({ ...p, city, locality: "" }));
    setLocalities(await getLocationLocalities(formData.state, city));
  };

  useEffect(() => {
    (async () => {
      const [
        ram,
        storage,
        screenSizes,
        memoryTypes,
        processorBrands,
        graphicsBrands,
        warranty,
        brandRes,
      ] = await Promise.all([
        getRamOptions(),
        getStorageOptions(),
        getScreenSizes(),
        getMemoryTypes(),
        getProcessorBrands(),
        getGraphicsBrands(),
        getWarrantyOptions(),
        getLaptopBrands(),
      ]);

      console.log("Warranty dropdown:", warranty.data);

      setDropdowns({
        ram: ram.data,
        storage: storage.data,
        screenSizes: screenSizes.data,
        memoryTypes: memoryTypes.data,
        processorBrands: processorBrands.data,
        graphicsBrands: graphicsBrands.data,
        warranty: warranty.data,
      });

      setBrands((brandRes.data?.list || []).map((b) => b.brand));
    })();
  }, []);

  useEffect(() => {
    if (!formData.brand) return;
    getLaptopModels(formData.brand).then((res) => {
      setModels(res.data?.list || []);
    });
  }, [formData.brand]);

  useEffect(() => {
    if (!isEditMode || !productId) return;

    (async () => {
      setLoading(true);
      const laptop = await getLaptopById(productId);

      setFormData((p) => ({
        ...p,
        ...laptop,
        locality: laptop.locality || "",
      }));

      setPhotoPreviews(
        (laptop.laptopPhotos || []).map((p) => ({
          id: p.photoId,
          url: p.photo_link,
          existing: true,
        }))
      );

      setLoading(false);
    })();
  }, [productId]);

  const requiredFields = [
    "serialNumber",
    "dealer",
    "brand",
    "model",
    "price",
    "processor",
    "colour",
    "graphicsCard",
    "state",
    "city",
    "locality",

    "warrantyInYear",
  ];

  const validateForm = () => {
    const e = {};
    requiredFields.forEach((f) => !formData[f] && (e[f] = "Required"));
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleLaptopSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload = {
      ...formData,
      price: Number(formData.price),
      usbPorts: Number(formData.usbPorts || 0),
      warrantyInYear: Number(formData.warrantyInYear),
      sellerId,
    };

    // 🔥 REMOVE invalid frontend-only field
    delete payload.neighborhood;

    console.log("FINAL PAYLOAD:", payload);
    console.log("SENDING SERIAL:", payload.serialNumber);

    try {
      if (isEditMode) {
        await updateLaptop(productId, payload);
      } else {
        const res = await createLaptop(payload);
        setCreatedLaptopId(res?.data?.id || res?.id || res?.laptopId);
      }

      toast.success("Laptop saved successfully!");
    } catch (err) {
      console.error("BACKEND ERROR:", err?.response?.data || err);
      toast.error(err?.response?.data?.message || "Failed to save laptop");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  const fieldClass = (name) =>
    `border p-2 rounded ${errors[name] ? "border-red-500" : "border-gray-300"}`;

  const isRequired = (name) => requiredFields.includes(name);

  const renderInput = (label, name) => (
    <div className="flex flex-col">
      <label className="text-sm font-semibold mb-1">
        {label}
        {isRequired(name) && <span className="text-red-500">*</span>}
      </label>
      <input
        name={name}
        value={formData[name]}
        onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
        className={fieldClass(name)}
      />
      {errors[name] && (
        <span className="text-xs text-red-500">{errors[name]}</span>
      )}
    </div>
  );

  const renderSelect = (label, name, options) => (
    <div className="flex flex-col">
      <label className="text-sm font-semibold mb-1">
        {label}
        {isRequired(name) && <span className="text-red-500">*</span>}
      </label>

      <select
        name={name}
        value={formData[name]}
        onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
        className={fieldClass(name)}
      >
        <option value="">Select {label}</option>
        {options.map((o, i) => {
          const value = typeof o === "object" ? o.value : o;
          const text = typeof o === "object" ? o.label : o;
          return (
            <option key={i} value={value}>
              {text}
            </option>
          );
        })}
      </select>

      {errors[name] && (
        <span className="text-xs text-red-500">{errors[name]}</span>
      )}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        {isEditMode ? "Edit Laptop" : "Add Laptop"}
      </h1>

      <form onSubmit={handleLaptopSubmit} className="grid grid-cols-2 gap-4">
        {renderInput("Serial Number", "serialNumber")}
        {renderInput("Dealer", "dealer")}

        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">
            Brand<span className="text-red-500">*</span>
          </label>
          <select
            value={formData.brand}
            onChange={(e) =>
              setFormData({ ...formData, brand: e.target.value, model: "" })
            }
            className={fieldClass("brand")}
          >
            <option value="">Select Brand</option>
            {brands.map((b, i) => (
              <option key={i} value={b}>
                {b}
              </option>
            ))}
          </select>
          {errors.brand && (
            <span className="text-xs text-red-500">{errors.brand}</span>
          )}
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">
            Model<span className="text-red-500">*</span>
          </label>
          <select
            value={formData.model}
            onChange={(e) =>
              setFormData({ ...formData, model: e.target.value })
            }
            className={fieldClass("model")}
          >
            <option value="">Select Model</option>
            {models.map((m, i) => (
              <option key={i} value={m}>
                {m}
              </option>
            ))}
          </select>
          {errors.model && (
            <span className="text-xs text-red-500">{errors.model}</span>
          )}
        </div>

        {renderInput("Price", "price")}
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">
            Warranty<span className="text-red-500">*</span>
          </label>

          <select
            value={formData.warrantyInYear}
            onChange={(e) =>
              setFormData({ ...formData, warrantyInYear: e.target.value })
            }
            className={fieldClass("warrantyInYear")}
          >
            <option value="">Select Warranty</option>

            {dropdowns.warranty.map((w, i) => (
              <option key={i} value={w.years}>
                {w.label}
              </option>
            ))}
          </select>

          {errors.warrantyInYear && (
            <span className="text-xs text-red-500">
              {errors.warrantyInYear}
            </span>
          )}
        </div>

        {renderInput("Processor", "processor")}
        {renderSelect(
          "Processor Brand",
          "processorBrand",
          dropdowns.processorBrands
        )}
        {renderSelect("RAM", "ram", dropdowns.ram)}
        {renderSelect("Storage", "storage", dropdowns.storage)}
        {renderSelect("Screen Size", "screenSize", dropdowns.screenSizes)}
        {renderSelect("Memory Type", "memoryType", dropdowns.memoryTypes)}
        {renderInput("Battery", "battery")}
        {renderInput("Battery Life", "batteryLife")}

        {/* 🌈 COLOR DROPDOWN */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">
            Colour<span className="text-red-500">*</span>
          </label>
          <select
            value={formData.colour}
            onChange={(e) =>
              setFormData({ ...formData, colour: e.target.value })
            }
            className={fieldClass("colour")}
          >
            <option value="">Select Colour</option>
            {colorOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.colour && (
            <span className="text-xs text-red-500">{errors.colour}</span>
          )}
        </div>

        {renderInput("Graphics Card", "graphicsCard")}
        {renderSelect(
          "Graphics Brand",
          "graphicBrand",
          dropdowns.graphicsBrands
        )}
        {renderInput("Weight", "weight")}
        {renderInput("Manufacturer", "manufacturer")}
        {renderInput("USB Ports", "usbPorts")}

        {/* 📍 LOCATION */}
        <div className="col-span-2 mt-4 border-t pt-4">
          <h2 className="text-lg font-bold mb-2">Confirm Your Location</h2>

          <div className="grid grid-cols-3 gap-4">
            <select
              value={formData.state}
              onChange={(e) => handleStateChange(e.target.value)}
              className={fieldClass("state")}
            >
              <option value="">State</option>
              {states.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              value={formData.city}
              disabled={!formData.state}
              onChange={(e) => handleCityChange(e.target.value)}
              className={fieldClass("city")}
            >
              <option value="">City</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={formData.locality}
              disabled={!formData.city}
              onChange={(e) =>
                setFormData({ ...formData, locality: e.target.value })
              }
              className={fieldClass("locality")}
            >
              <option value="">Locality</option>
              {localities.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="col-span-2 bg-blue-600 text-white py-3 rounded mt-6"
        >
          Save Laptop
        </button>
      </form>

      {/* 📸 IMAGE UPLOAD */}
      <div className="mt-10">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => {
            const files = Array.from(e.target.files);
            const previews = files.map((file) => ({
              file,
              url: URL.createObjectURL(file),
            }));
            setPhotoFiles((p) => [...p, ...files]);
            setPhotoPreviews((p) => [...p, ...previews]);
          }}
        />

        <div className="grid grid-cols-3 gap-4 mt-4">
          {photoPreviews.map((img, i) => (
            <div key={i} className="relative">
              <img src={img.url} className="h-32 w-full object-cover rounded" />
              <button
                type="button"
                onClick={() => {
                  setPhotoPreviews((p) => p.filter((_, x) => x !== i));
                  setPhotoFiles((f) => f.filter((_, x) => x !== i));
                }}
                className="absolute top-1 right-1 bg-red-600 text-white w-6 h-6 rounded-full"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          disabled={photoLoading}
          onClick={async () => {
            const laptopId = createdLaptopId || productId;
            if (!laptopId) return toast.error("Save laptop first");

            try {
              setPhotoLoading(true);
              if (photoFiles.length)
                await uploadLaptopPhotos(laptopId, photoFiles);
              toast.success("Listing published!");
              navigate("/dashboard");
            } catch {
              toast.error("Upload failed");
            } finally {
              setPhotoLoading(false);
            }
          }}
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded"
        >
          {photoLoading ? "Saving..." : "Save & Publish"}
        </button>
      </div>
    </div>
  );
}
