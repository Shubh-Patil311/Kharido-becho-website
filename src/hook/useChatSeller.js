import { useState, useCallback, useEffect } from "react";
import {
    updateBikeStatus,
} from "../store/services/bikeServices";
import {
    getBikeBookingsForSeller,
    sendBikeBookingMessage,
    getBikeBookingById,
    completeBikeBooking,
    rejectBikeBooking,
    updateBikeBookingStatus,
} from "../store/services/bikeBookingServices";

/**
 * Custom hook to manage seller interactions for bike bookings.
 * Provides functionality to fetch bookings and send messages.
 *
 * @param {string|number} [bookingId] - Optional booking ID to fetch chat interactions for.
 */
const useChatSeller = (bookingId) => {
    const [bookings, setBookings] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sending, setSending] = useState(false);

    // Fetch all bookings for a specific seller
    const fetchBookings = useCallback(async (sellerId) => {
        if (!sellerId) return;

        setLoading(true);
        setError(null);
        try {
            const data = await getBikeBookingsForSeller(sellerId);
            setBookings(data || []);
        } catch (err) {
            console.error("Error fetching seller bookings:", err);
            setError(err.response?.data?.message || "Failed to fetch bookings");
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch messages for the current booking
    const fetchMessages = useCallback(async () => {
        if (!bookingId) return;

        try {
            // Use getBikeBookingById instead of the 404 endpoint
            const bookingData = await getBikeBookingById(bookingId);

            // Extract conversation or messages from the booking object
            // Adjust based on actual API response structure (likely 'conversation' or 'messages')
            const msgs = bookingData?.conversation || bookingData?.messages || [];
            console.log("Raw fetched messages:", msgs);

            // Map 'message' field to 'content' for UI consistency if needed
            const formatted = (msgs || []).map((m) => ({
                ...m,
                content: m.content || m.message || "",
            }));
            console.log("Formatted messages:", formatted);
            setMessages(formatted);
        } catch (err) {
            console.error("Error fetching messages:", err);
            // Don't set global error to avoid blocking UI on poll
        } finally {
            setLoading(false);
        }
    }, [bookingId]);

    // Initial fetch of messages when bookingId changes
    useEffect(() => {
        if (bookingId) {
            setLoading(true);
            fetchMessages();
        } else {
            setMessages([]);
        }
    }, [bookingId, fetchMessages]);

    // Send a chat message for a specific booking
    // If content is passed as string, it wraps it. If object, uses it.
    const sendMessage = useCallback(
        async (contentOrPayload) => {
            if (!bookingId) return;

            setSending(true);
            try {
                let payload = {};
                const userId = localStorage.getItem("userId");
                if (typeof contentOrPayload === "string" && userId) {
                    // Backend expects 'message' field
                    payload = { userId, message: contentOrPayload };
                } else {
                    // Assume caller knows what they are doing, but ensure 'message' exists if 'content' matches
                    payload = { ...contentOrPayload };
                    if (payload.content && !payload.message) {
                        payload.message = payload.content;
                    }
                }

                const response = await sendBikeBookingMessage(bookingId, payload);

                // Auto-update status to IN_NEGOTIATION if this is the first seller reply
                const hasSellerReplied = messages.some(
                    (m) => m.senderType === "SELLER" || m.senderType === "seller"
                );

                if (!hasSellerReplied) {
                    try {
                        console.log("First seller reply detected, updating status to IN_NEGOTIATION...");
                        await updateBikeBookingStatus(bookingId, "IN_NEGOTIATION");
                        // Ideally, we might want to refresh bookings to reflect status change in list
                        // fetchBookings(); 
                    } catch (statusErr) {
                        console.error("Failed to auto-update status:", statusErr);
                    }
                }

                // Refresh messages after sending
                await fetchMessages();

                return response;
            } catch (err) {
                console.error("Error sending message:", err);
                setError(err.response?.data?.message || "Failed to send message");
                throw err;
            } finally {
                setSending(false);
            }
        },
        [bookingId, fetchMessages]
    );

    // Accept booking (Complete)
    const acceptBooking = useCallback(async () => {
        if (!bookingId) return;
        setLoading(true);
        try {
            // 1. Mark booking as complete
            const res = await completeBikeBooking(bookingId);

            // 2. Mark bike as SOLD
            // We need to find the bikeId. It should be in the booking details.
            // Since we might not have the full booking object handy if we only used fetchMessages,
            // let's try to find it in 'bookings' (if fetched) or fetch it again.
            // For safety, let's fetch the latest booking details to get the bikeId.
            const bookingDetails = await getBikeBookingById(bookingId);
            const bikeId = bookingDetails?.bikeId; // Ensure this field exists in your API

            if (bikeId) {
                console.log(`Marking bike ${bikeId} as SOLD...`);
                await updateBikeStatus(bikeId, "SOLD");
            } else {
                console.warn("Could not find bikeId to mark as SOLD");
            }

            // 3. Force refresh to update dashboard stats
            window.location.reload();

            return res;
        } catch (err) {
            console.error("Error accepting booking:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [bookingId]);

    // Reject booking
    const rejectBooking = useCallback(async () => {
        if (!bookingId) return;
        setLoading(true);
        try {
            const res = await rejectBikeBooking(bookingId);
            return res;
        } catch (err) {
            console.error("Error rejecting booking:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [bookingId]);

    return {
        bookings,
        messages,
        loading,
        error,
        sending,
        fetchBookings,
        fetchMessages,
        sendMessage,
        acceptBooking,
        rejectBooking,
    };
};

export default useChatSeller;
