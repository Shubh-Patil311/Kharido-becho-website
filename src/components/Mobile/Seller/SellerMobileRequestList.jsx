import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { getMobileRequestsBySeller } from "../../../store/services/mobileRequestServices";

const SellerMobileRequestList = () => {
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
                                onClick={() =>
                                    navigate(`/seller/mobile-request-chat/${r.requestId}`)
                                }
                                className="bg-white border rounded-lg p-4 cursor-pointer hover:bg-gray-50 flex justify-between items-center"
                            >
                                {/* LEFT INFO */}
                                <div>
                                    <h2 className="font-semibold text-gray-900">{r.title}</h2>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Buyer: {r.buyerName}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Status: {r.status}
                                    </p>
                                </div>

                                {/* RIGHT BUTTON */}
                                <button
                                    onClick={(e) => openChat(e, r.requestId)}
                                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-blue-700"
                                >
                                    Chat
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerMobileRequestList;