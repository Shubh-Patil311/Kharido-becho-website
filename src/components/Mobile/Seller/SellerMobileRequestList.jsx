import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { getMobileRequestsBySeller } from "../../../store/services/mobileRequestServices";

const SellerMobileRequestList = ({ onSelect, selectedId }) => {
    const navigate = useNavigate();
    const sellerId = Number(localStorage.getItem("sellerId"));

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadRequests = async () => {
            try {
                setLoading(true);

                const data = await getMobileRequestsBySeller(sellerId);

                const formatted = data.map((r) => ({
                    requestId: r.requestId,
                    title: `${r.mobile?.brand || ""} ${r.mobile?.model || ""}`,
                    buyerName: `${r.buyer?.user?.firstName || ""} ${r.buyer?.user?.lastName || ""
                        }`,
                    status: r.status || "PENDING",
                }));

                setRequests(formatted);
            } catch (err) {
                console.error("Failed to load mobile requests", err);
                toast.error("Failed to load mobile requests");
            } finally {
                setLoading(false);
            }
        };

        loadRequests();
    }, [sellerId]);

    const openChat = (e, requestId) => {
        e.stopPropagation(); // ✅ prevent card click
        navigate(`/seller/mobile-request-chat/${requestId}`);
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="bg-white border-b px-4 py-3">
                <h1 className="text-xl font-bold">Mobile Requests</h1>
            </div>

            <div className="p-4">
                {loading ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : requests.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        <p>No mobile requests</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {requests.map((r) => (
                            <div
                                key={r.requestId}
                                onClick={() => onSelect && onSelect({
                                    bookingId: r.requestId,
                                    title: r.title,
                                    status: r.status,
                                    buyerName: r.buyerName
                                })}
                                className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${selectedId === r.requestId
                                        ? "bg-blue-50 border-blue-500 shadow-md ring-1 ring-blue-500"
                                        : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                                    }`}
                            >
                                <div className="flex justify-between items-start">
                                    <h2 className="font-semibold text-gray-900">{r.title}</h2>
                                    {selectedId === r.requestId && (
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                    Buyer: {r.buyerName}
                                </p>
                                <div className="mt-2 text-right">
                                    <span
                                        className="px-2 py-0.5 rounded-full text-xs font-medium border bg-gray-100 text-gray-600 border-gray-200 capitalize"
                                    >
                                        {r.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerMobileRequestList;