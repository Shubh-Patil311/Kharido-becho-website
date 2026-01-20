import { useCallback, useEffect, useState } from "react";
import {
  getBookingsForBuyer,
  sendBikeBookingMessage,
} from "../store/services/bikeBookingServices";

export default function useChat(bookingId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  // Load initial chat history when bookingId changes
  useEffect(() => {
    if (!bookingId) {
      setMessages([]);
      setError(null);
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);

        const buyerId = Number(localStorage.getItem("buyerId"));
        const data = buyerId ? await getBookingsForBuyer(buyerId) : [];

        if (!cancelled) {
          const booking = Array.isArray(data)
            ? data.find((b) => b.id === Number(bookingId))
            : null;
          const conversation = booking?.conversation || [];

          // Map to format expected by ChatModal (content instead of message)
          const formattedMessages = conversation.map(msg => ({
            ...msg,
            content: msg.message, // Map 'message' from API to 'content' for UI
          }));

          setMessages(formattedMessages);
          setStatus(booking?.status || ""); // Set the status
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load chat messages", err);
          setError(err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [bookingId]);

  // Optimistic send
  const sendMessage = useCallback(
    async (content, senderType, extra = {}) => {
      const trimmed = (content || "").trim();
      if (!bookingId || !trimmed) return;

      const tempId = `temp-${Date.now()}`;

      const optimisticMessage = {
        id: tempId,
        bookingId,
        content: trimmed,
        senderType,
        createdAt: new Date().toISOString(),
        optimistic: true,
        ...extra,
      };

      setMessages((prev) => [...prev, optimisticMessage]);
      setSending(true);

      try {
        // Prepare payload with 'message' key matching the backend expectation
        const payload = {
          message: trimmed
        };

        const saved = await sendBikeBookingMessage(
          bookingId,
          payload
        );

        const savedMessage = {
          ...saved,
          content: saved?.message || trimmed
        };


        if (saved && saved.id) {
          setMessages((prev) =>
            prev.map((msg) => (msg.id === tempId ? savedMessage : msg))
          );
        } else {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === tempId ? { ...m, optimistic: false } : m
            )
          );
        }

        setError(null);
        return saved;
      } catch (err) {
        console.error("Failed to send chat message", err);
        setError(err);

        // Remove optimistic message if send fails
        setMessages((prev) => prev.filter((msg) => msg.id !== tempId));

        throw err;
      } finally {
        setSending(false);
      }
    },
    [bookingId]
  );

  // Find the current booking status from the loaded messages (if we had access to the full booking object locally)
  // Since we only set 'messages' state, we might need another state for status or re-derive it if we kept the booking object.
  // For now, let's assume we want to return the status so ChatModal can use it.
  // But wait, we only stored 'messages'.
  // Let's improve the hook to store the 'status' as well.

  const [status, setStatus] = useState("");

  // Update the load function to set status
  // We need to re-copy the useEffect logic to include setStatus, or better, just use multi_replace to inject 'setStatus' logic inside useEffect.
  // However, simpler for now is to just return what we have, but to do it properly I should update the state.
  // Let's return status from state, and I will update the useEffect in a separate call or use multi_replace for the whole file if needed.
  // Actually, I can use replace_file_content to replace the return statement and ADD the state variable at the top? No, that's two places.
  // I will use multi_replace_file_content for this file.

  return {
    messages,
    loading,
    sending,
    error,
    sendMessage,
    setMessages,
    status,
  };
}
