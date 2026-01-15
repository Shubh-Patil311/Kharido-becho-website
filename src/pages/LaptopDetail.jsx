import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";

// SERVICES
import { getLaptopById } from "../store/services/laptopServices";
import {
  createLaptopBooking,
  getLaptopBookingsByBuyer,
} from "../store/services/laptopBookingServices";

// Icons
import {
  FaMicrochip,
  FaMemory,
  FaHdd,
  FaBatteryThreeQuarters,
  FaPalette,
  FaLaptop,
  FaWeightHanging,
  FaIndustry,
  FaUsb,
  FaCogs,
  FaRegClock,
  FaUser,
  FaChevronLeft,
  FaChevronRight,
  FaRupeeSign,
  FaTag,
  FaShieldAlt,
  FaStar,
  FaCheckCircle,
  FaPhoneAlt,
  FaWhatsapp,
  FaCalendarAlt,
} from "react-icons/fa";

export default function LaptopDetail() {
  const { id } = useParams();
  const [laptop, setLaptop] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    loadLaptop();
  }, []);

  const loadLaptop = async () => {
    setLoading(true);
    try {
      const data = await getLaptopById(id);
      setLaptop(data);
    } catch (err) {
      toast.error("Failed to load laptop details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // OFFER  → UI ONLY (UPDATED)
  // ===============================
  const handleMakeOffer = () => {
    toast.info(
      "Use 'Chat with Seller' to contact the seller and make an offer."
    );
  };

  // ===============================
  // CHAT → CREATES BOOKING (UPDATED)
  // ===============================
  // const handleChat = async () => {
  //   const buyerUserId = Number(localStorage.getItem("buyerUserId"));
  //   let buyerId = Number(localStorage.getItem("buyerId"));

  //   if (!buyerUserId) {
  //     toast.error("Please login as buyer to chat");
  //     return;
  //   }

  //   try {
  //     const bookings = buyerId ? await getLaptopBookingsByBuyer(buyerId) : [];

  //     const existing = bookings.find((b) => b.laptopId === Number(id));

  //     let bookingId;

  //     if (existing) {
  //       bookingId = existing.laptopBookingId;
  //     } else {
  //       const newBooking = await createLaptopBooking({
  //         laptopId: Number(id),
  //         buyerUserId,
  //         message: "Hi, I am interested in this laptop.",
  //         bookingDate: new Date().toISOString().split("T")[0],
  //       });

  //       localStorage.setItem("buyerId", newBooking.buyerId);
  //       bookingId = newBooking.laptopBookingId;
  //     }

  //     window.location.href = `/chat/laptop/${bookingId}`;
  //   } catch (error) {
  //     toast.error("Unable to start chat");
  //     console.error(error);
  //   }
  // };
  const handleChat = async () => {
    const buyerUserId = Number(localStorage.getItem("buyerUserId"));
    let buyerId = Number(localStorage.getItem("buyerId"));

    if (!buyerUserId) {
      toast.error("Please login as buyer to chat");
      return;
    }

    let bookings = [];

    try {
      if (buyerId) {
        bookings = await getLaptopBookingsByBuyer(buyerId);
      }
    } catch (err) {
      // Backend throws 400 when empty → ignore
      bookings = [];
    }

    try {
      const existing = bookings.find((b) => b.laptopId === Number(id));

      let bookingId;

      if (existing) {
        bookingId = existing.laptopBookingId;
      } else {
        const newBooking = await createLaptopBooking({
          laptopId: Number(id),
          buyerUserId,
          message: "Hi, I am interested in this laptop.",
          bookingDate: new Date().toISOString().split("T")[0],
        });

        buyerId = newBooking.buyerId;
        localStorage.setItem("buyerId", buyerId);
        bookingId = newBooking.laptopBookingId;
      }

      // 🔄 Sync booking list (your requirement)
      await getLaptopBookingsByBuyer(buyerId);

      window.location.href = `/chat/laptop/${bookingId}`;
    } catch (error) {
      console.error(error);
      toast.error("Unable to start chat");
    }
  };

  if (loading) return <LoadingSkeleton />;
  if (!laptop) return <NotFoundMessage />;

  const photos = laptop.laptopPhotos || [];
  const seller =
    laptop.bookings?.length > 0 ? laptop.bookings[0].seller?.user : null;
  const sellerName = seller
    ? `${seller.firstName} ${seller.lastName}`
    : "Not Available";
  const sellerContact = seller?.mobileNumber || "Not Available";

  const prevImage = () => {
    setActiveIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setActiveIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const rating = 4.5;
  const condition = laptop.condition || "Excellent";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* HEADER */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link
                to="/buy/laptops"
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <FaChevronLeft className="mr-2" />
                Back to Laptops
              </Link>
            </div>
            <div className="hidden md:block">
              <span className="text-sm text-gray-500">Product ID:</span>
              <span className="ml-2 font-mono text-gray-700">#{id}</span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN - IMAGES */}
          <div className="lg:col-span-2">
            {/* IMAGE SLIDER */}
            <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
              <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-white">
                <img
                  src={
                    photos.length
                      ? photos[activeIndex].photo_link
                      : "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200"
                  }
                  alt={laptop.model}
                  className="w-full h-[500px] object-contain transition-transform duration-500 hover:scale-105"
                />

                {photos.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
                    >
                      <FaChevronLeft className="text-lg" />
                    </button>

                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
                    >
                      <FaChevronRight className="text-lg" />
                    </button>
                  </>
                )}

                {/* Image counter */}
                {photos.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    {activeIndex + 1} / {photos.length}
                  </div>
                )}

                {/* Condition badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                    {condition}
                  </span>
                </div>
              </div>

              {/* Thumbnail strip */}
              {photos.length > 1 && (
                <div className="grid grid-cols-6 gap-3 mt-6">
                  {photos.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveIndex(idx)}
                      className={`relative h-20 rounded-lg overflow-hidden border-3 transition-all duration-200 hover:scale-105 ${
                        idx === activeIndex
                          ? "border-blue-500 ring-2 ring-blue-200"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={p.photo_link}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* SPECIFICATIONS */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  📋 Full Specifications
                </h2>
                <div className="flex items-center space-x-2 text-blue-600">
                  <FaCogs />
                  <span className="text-sm font-medium">Tech Details</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SpecCard
                  icon={<FaLaptop className="text-blue-500" />}
                  title="General"
                  items={[
                    { label: "Brand", value: laptop.brand },
                    { label: "Model", value: laptop.model },
                    { label: "Color", value: laptop.colour },
                    { label: "Manufacturer", value: laptop.manufacturer },
                  ]}
                />

                <SpecCard
                  icon={<FaMicrochip className="text-purple-500" />}
                  title="Performance"
                  items={[
                    { label: "Processor", value: laptop.processor },
                    { label: "Processor Brand", value: laptop.processorBrand },
                    { label: "RAM", value: laptop.ram },
                    { label: "Storage", value: laptop.storage },
                  ]}
                />

                <SpecCard
                  icon={<FaCogs className="text-green-500" />}
                  title="Graphics & Display"
                  items={[
                    { label: "Graphics Card", value: laptop.graphicsCard },
                    { label: "Graphics Brand", value: laptop.graphicBrand },
                    { label: "Screen Size", value: laptop.screenSize },
                    { label: "USB Ports", value: laptop.usbPorts },
                  ]}
                />

                <SpecCard
                  icon={<FaBatteryThreeQuarters className="text-yellow-500" />}
                  title="Battery & Warranty"
                  items={[
                    { label: "Battery", value: laptop.battery },
                    { label: "Battery Life", value: laptop.batteryLife },
                    {
                      label: "Warranty",
                      value: `${laptop.warrantyInYear || "No"} warranty`,
                    },
                    { label: "Weight", value: laptop.weight },
                  ]}
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - DETAILS & ACTIONS */}
          <div className="space-y-6">
            {/* PRODUCT CARD */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              {/* Title & Rating */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {laptop.brand} {laptop.model}
                  </h1>
                  <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                    <FaStar className="text-yellow-500 mr-1" />
                    <span className="font-semibold">{rating.toFixed(1)}</span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm">Refurbished • Like New</p>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline mb-2">
                  <FaRupeeSign className="text-gray-400 mr-1" />
                  <span className="text-4xl font-bold text-gray-900">
                    {laptop.price.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center text-green-600">
                  <FaCheckCircle className="mr-2" />
                  <span className="text-sm font-medium">
                    Price is negotiable
                  </span>
                </div>
              </div>

              {/* Key Specs */}
              <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <FaMicrochip className="text-2xl text-blue-600" />
                  </div>
                  <p className="font-bold text-gray-900">{laptop.processor}</p>
                  <p className="text-xs text-gray-500">Processor</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <FaMemory className="text-2xl text-purple-600" />
                  </div>
                  <p className="font-bold text-gray-900">{laptop.ram}</p>
                  <p className="text-xs text-gray-500">RAM</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <FaHdd className="text-2xl text-green-600" />
                  </div>
                  <p className="font-bold text-gray-900">{laptop.storage}</p>
                  <p className="text-xs text-gray-500">Storage</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <FaShieldAlt className="text-2xl text-yellow-600" />
                  </div>
                  <p className="font-bold text-gray-900">
                    {laptop.warrantyInYear || 0} Year
                  </p>
                  <p className="text-xs text-gray-500">Warranty</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4 mb-8">
                <button
                  onClick={handleMakeOffer}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center"
                >
                  <FaTag className="mr-3" />
                  Make an Offer
                </button>

                <button
                  onClick={handleChat}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center"
                >
                  <FaWhatsapp className="mr-3 text-lg" />
                  Chat with Seller
                </button>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 mb-2">
                  ✨ Key Features
                </h3>
                <div className="flex items-center text-sm">
                  <FaCheckCircle className="text-green-500 mr-3" />
                  <span>Fully functional & tested</span>
                </div>
                <div className="flex items-center text-sm">
                  <FaCheckCircle className="text-green-500 mr-3" />
                  <span>30-day return policy</span>
                </div>
                <div className="flex items-center text-sm">
                  <FaCheckCircle className="text-green-500 mr-3" />
                  <span>Free shipping available</span>
                </div>
                <div className="flex items-center text-sm">
                  <FaCheckCircle className="text-green-500 mr-3" />
                  <span>Original accessories included</span>
                </div>
              </div>
            </div>

            {/* SELLER INFO */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-3 rounded-full">
                  <FaUser className="text-2xl text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-bold text-lg text-gray-900">
                    Seller Information
                  </h3>
                  <p className="text-sm text-gray-500">Verified Seller</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <FaUser className="text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-semibold">{sellerName}</p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <FaPhoneAlt className="text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Contact</p>
                    <p className="font-semibold">{sellerContact}</p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <FaCalendarAlt className="text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="font-semibold">2023</p>
                  </div>
                </div>
              </div>

              <button className="w-full mt-6 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-6 rounded-xl transition-all duration-200">
                View Seller Profile
              </button>
            </div>

            {/* SAFETY TIPS */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5">
              <h4 className="font-bold text-amber-800 mb-3">⚠️ Safety Tips</h4>
              <ul className="space-y-2 text-sm text-amber-700">
                <li>• Meet in safe public locations</li>
                <li>• Verify the product before payment</li>
                <li>• Never pay in advance</li>
                <li>• Check warranty & return policy</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* COMPONENTS */

function SpecCard({ icon, title, items }) {
  return (
    <div className="border border-gray-200 rounded-xl p-5 hover:border-blue-200 hover:shadow-md transition-all duration-300">
      <div className="flex items-center mb-4">
        <div className="p-2 bg-gray-100 rounded-lg mr-3">{icon}</div>
        <h3 className="font-bold text-gray-900">{title}</h3>
      </div>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-center py-2">
            <span className="text-gray-500 text-sm">{item.label}</span>
            <span className="font-semibold text-gray-900">
              {item.value || "N/A"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-4 h-[500px] animate-pulse">
              <div className="h-full bg-gray-200 rounded-xl"></div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 h-96 animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-100 rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 h-[600px] animate-pulse">
              <div className="h-10 bg-gray-200 rounded mb-6"></div>
              <div className="h-16 bg-gray-200 rounded mb-8"></div>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-100 rounded-xl"></div>
                ))}
              </div>
              <div className="h-16 bg-gray-200 rounded mb-4"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotFoundMessage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
        <div className="text-6xl mb-4">💻</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Laptop Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The laptop you're looking for might have been sold or removed.
        </p>
        <Link
          to="/buy/laptops"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
        >
          Browse Other Laptops
        </Link>
      </div>
    </div>
  );
}
