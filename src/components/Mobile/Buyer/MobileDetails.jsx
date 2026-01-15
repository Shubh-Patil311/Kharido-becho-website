
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";

// Services
import { getMobileById } from "../../../store/services/mobileServices";
import { createMobileRequest } from "../../../store/services/mobileRequestServices";

// Icons
import {
    FaMobileAlt,
    FaMemory,
    FaMicrochip,
    FaBatteryThreeQuarters,
    FaCamera,
    FaPalette,
    FaChevronLeft,
    FaChevronRight,
    FaRupeeSign,
    FaTag,
    FaStar,
    FaWhatsapp,
} from "react-icons/fa";

export default function MobileDetail() {
    const { id } = useParams();

    const [mobile, setMobile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    /* ================= LOAD MOBILE ================= */
    useEffect(() => {
        loadMobile();
    }, [id]);

    const loadMobile = async () => {
        setLoading(true);
        try {
            const data = await getMobileById(id);
            setMobile(data);
        } catch (err) {
            toast.error("Failed to load mobile details");
        } finally {
            setLoading(false);
        }
    };

    /* ================= MAKE OFFER ================= */
    const handleMakeOffer = async () => {
        const buyerUserId = Number(localStorage.getItem("userId"));

        if (!buyerUserId) {
            toast.error("Please login as buyer");
            return;
        }

        try {
            await createMobileRequest({
                mobileId: Number(id),
                buyerUserId,
                message: "Hi, I want to make an offer for this mobile",
            });

            toast.success("Offer sent successfully!");
        } catch (err) {
            toast.error("Failed to send offer");
        }
    };

    /* ================= CHAT WITH SELLER ================= */
    const handleChat = async () => {
        const buyerUserId = Number(localStorage.getItem("userId"));

        if (!buyerUserId) {
            toast.error("Please login and make an offer first");
            return;
        }

        try {
            const request = await createMobileRequest({
                mobileId: Number(id),
                buyerUserId,
                message: "Hi, I am interested in this mobile",
            });

            toast.success("Chat started");

            // ✅ Redirect to buyer chat
            window.location.href = `/buyer/chat/${request.requestId}`;
        } catch (err) {
            toast.error("Unable to start chat");
        }
    };

    /* ================= UI STATES ================= */
    if (loading) return <LoadingSkeleton />;
    if (!mobile) return <NotFoundMessage />;

    const photos = mobile?.images?.map((img) => img.imageUrl) || [];
    const condition = mobile.condition || "Excellent";
    const rating = 4.6;

    const prevImage = () => {
        setActiveIndex((i) => (i === 0 ? photos.length - 1 : i - 1));
    };

    const nextImage = () => {
        setActiveIndex((i) => (i === photos.length - 1 ? 0 : i + 1));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            {/* HEADER */}
            <div className="bg-white border-b shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <Link
                        to="/buy/mobiles"
                        className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                        <FaChevronLeft className="mr-2" />
                        Back to Mobiles
                    </Link>
                </div>
            </div>

            {/* MAIN */}
            <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT */}
                <div className="lg:col-span-2 space-y-6">
                    {/* IMAGE SLIDER */}
                    <div className="bg-white rounded-2xl shadow-lg p-4">
                        <div className="relative overflow-hidden rounded-xl">
                            <img
                                src={
                                    photos.length > 0
                                        ? photos[activeIndex]
                                        : "https://via.placeholder.com/800x500?text=No+Image"
                                }
                                alt={mobile.model}
                                className="w-full h-[500px] object-cover transition-transform duration-500 hover:scale-105"
                                onError={(e) =>
                                (e.target.src =
                                    "https://via.placeholder.com/800x500?text=Image+Error")
                                }
                            />

                            {photos.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow"
                                    >
                                        <FaChevronLeft />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow"
                                    >
                                        <FaChevronRight />
                                    </button>
                                </>
                            )}

                            <span className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full shadow">
                                {condition}
                            </span>
                        </div>
                    </div>

                    {/* BASIC INFO */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h2 className="text-lg font-bold mb-4 border-b pb-2">
                            Basic Mobile Information
                        </h2>

                        <div className="space-y-3 text-sm">
                            <SpecRow label="Brand" value={mobile.brand} />
                            <SpecRow label="Model" value={mobile.model} />
                            <SpecRow
                                label="Price"
                                value={`₹ ${mobile.price?.toLocaleString()}`}
                            />
                            <SpecRow label="Color" value={mobile.color} />
                            <SpecRow
                                label="Year of Purchase"
                                value={mobile.yearOfPurchase}
                            />
                            <SpecRow label="Condition" value={mobile.condition} />
                        </div>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6 space-y-4">
                        <h1 className="text-3xl font-bold">
                            {mobile.brand} {mobile.model}
                        </h1>

                        <div className="flex items-center">
                            <FaStar className="text-yellow-500 mr-2" />
                            <span>{rating}</span>
                        </div>

                        <div className="text-4xl font-bold flex items-center">
                            <FaRupeeSign className="mr-2" />
                            {mobile.price?.toLocaleString()}
                        </div>

                        <button
                            onClick={handleMakeOffer}
                            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold"
                        >
                            <FaTag className="inline mr-2" />
                            Make Offer
                        </button>

                        <button
                            onClick={handleChat}
                            className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold"
                        >
                            <FaWhatsapp className="inline mr-2" />
                            Chat with Seller
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ================= HELPER COMPONENTS ================= */

function SpecRow({ label, value }) {
    return (
        <div className="flex justify-between border-b pb-2">
            <span className="text-gray-600">{label}</span>
            <span className="font-medium text-gray-900">
                {value || "N/A"}
            </span>
        </div>
    );
}

function LoadingSkeleton() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            Loading...
        </div>
    );
}

function NotFoundMessage() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            Mobile Not Found
        </div>
    );
}