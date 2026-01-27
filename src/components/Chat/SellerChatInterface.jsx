import React, { useEffect, useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import useChatSeller from "../../hook/useChatSeller";
import { useSocketChat } from "../../socketio/useSocketChat";
import { bookingStatuses, statusStyles } from "../../constants/bookingConstants";

const SellerChatInterface = ({
    bookingId,
    chatType = "BIKE",
    bookingStatus,
    onClose,
    isEmbedded = false,
    useSocketIO = true, // Enable Socket.IO by default
}) => {
    const [inputValue, setInputValue] = useState("");
    const [status, setStatus] = useState(bookingStatus);

    useEffect(() => {
        setStatus(bookingStatus);
    }, [bookingStatus]);

    // Use Socket.IO chat if enabled, otherwise fallback to API
    const socketChat = useSocketChat(bookingId, "SELLER", chatType);
    const apiChatHook = useChatSeller(bookingId);
    
    // Choose which chat to use - Socket.IO for messages, API for accept/reject
    const chatHook = useSocketIO && socketChat.connected ? socketChat : apiChatHook;
    const { acceptBooking, rejectBooking } = apiChatHook; // Always use API for actions

    const { messages, loading, sending, error, sendMessage, connected = false } = chatHook;

    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;
        try {
            // Socket.IO sendMessage expects (content, senderType), API expects just content
            if (useSocketIO && socketChat.connected) {
                await sendMessage(inputValue, "SELLER");
            } else {
                await sendMessage(inputValue);
            }
            setInputValue("");
        } catch (err) {
            console.error("Seller send failed:", err);
        }
    };

    const handleAccept = async () => {
        if (window.confirm("Are you sure you want to accept this booking?")) {
            await acceptBooking();
        }
    };

    const handleReject = async () => {
        if (window.confirm("Are you sure you want to reject this booking?")) {
            await rejectBooking();
            setStatus("REJECTED");
        }
    };

    return (
        <div className={`flex flex-col h-full bg-white ${!isEmbedded ? "rounded-2xl shadow-2xl overflow-hidden" : ""}`}>
            {/* HEADER */}
            <div className="bg-white px-4 py-4 border-b flex items-center justify-between shadow-sm z-10">
                <div>
                    <h2 className="text-lg font-bold text-gray-800">Chat</h2>
                    <p className="text-xs text-gray-500">Booking ID: {bookingId}</p>
                    {useSocketIO && (
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                            {connected ? (
                                <>
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    Real-time
                                </>
                            ) : (
                                <>
                                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                    API Mode
                                </>
                            )}
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${statusStyles[status] ||
                            "bg-gray-100 text-gray-600 border-gray-200 capitalize"
                            }`}
                    >
                        {bookingStatuses[status] || status || "Unknown"}
                    </span>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
                        >
                            <MdClose size={24} />
                        </button>
                    )}
                </div>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 min-h-[400px]">
                {loading && (
                    <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                    </div>
                )}

                {!loading && (messages || []).length === 0 && (
                    <div className="text-center text-gray-400 py-10 text-sm">
                        No messages yet. Start the conversation!
                    </div>
                )}

                {(messages || []).map((msg, i) => {
                    const isMe = msg.senderType === "SELLER";
                    const messageKey = msg.messageId || msg.id || `msg-${i}`;
                    return (
                        <div key={messageKey} className={`flex ${isMe ? "justify-end" : "justify-start"} animate-fadeIn`}>
                            <div
                                className={`px-4 py-2.5 rounded-2xl text-[15px] leading-relaxed max-w-[80%] shadow-sm
                  ${isMe
                                        ? "bg-green-600 text-white rounded-br-none"
                                        : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"}
                  ${msg.optimistic ? "opacity-70" : ""}
                  ${msg.failed ? "opacity-50 border-red-300" : ""}
                `}
                            >
                                {msg?.content || msg?.content === "" ? msg.content : "Invalid message"}
                                {msg.optimistic && (
                                    <span className="ml-2 text-xs opacity-60">⏳</span>
                                )}
                                {msg.failed && (
                                    <span className="ml-2 text-xs opacity-60">⚠️</span>
                                )}
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 text-xs px-4 py-2 text-center border-t border-red-100">
                    Connection issue: {error}
                </div>
            )}

            {/* INPUT AREA */}
            {["SOLD", "REJECTED"].includes(status) ? (
                <div className="bg-gray-100 px-4 py-4 border-t flex items-center justify-center">
                    <p className={`text-sm font-bold ${status === "SOLD" ? "text-green-600" : "text-red-600"
                        }`}>
                        {status === "SOLD"
                            ? "This item has been sold."
                            : "The product is rejected."}
                    </p>
                </div>
            ) : (
                <form
                    onSubmit={handleSubmit}
                    className="bg-white px-4 py-3 border-t flex gap-3 items-center"
                >
                    <input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="flex-1 bg-gray-100 border-transparent focus:border-green-500 focus:bg-white focus:ring-0 rounded-full px-4 py-2.5 text-sm transition-all outline-none"
                        placeholder="Type your message..."
                    />
                    <button
                        disabled={sending || !inputValue.trim()}
                        className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all transform active:scale-95
                ${sending || !inputValue.trim()
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg"}
            `}
                    >
                        {sending ? "..." : "Send"}
                    </button>
                </form>
            )}

            {/* BOTTOM ACTIONS (Accept/Reject) */}
            {["PENDING", "IN_NEGOTIATION"].includes(status) && (
                <div className="bg-gray-50 px-4 py-3 border-t flex items-center justify-between gap-3">
                    <button
                        onClick={handleAccept}
                        className="flex-1 bg-white border border-green-600 text-green-700 hover:bg-green-50 text-sm py-2.5 rounded-xl font-semibold transition-colors shadow-sm"
                    >
                        Accept Request
                    </button>
                    <button
                        onClick={handleReject}
                        className="flex-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-sm py-2.5 rounded-xl font-semibold transition-colors shadow-sm"
                    >
                        Reject
                    </button>
                </div>
            )}
        </div>
    );
};

export default SellerChatInterface;
