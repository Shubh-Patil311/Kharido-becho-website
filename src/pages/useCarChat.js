import { useEffect, useState, useCallback } from "react";
import apiClient from "../store/services/apiClient";

export default function useCarChat(bookingId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 Load chat history
  useEffect(() => {
    if (!bookingId) return;

    const loadChat = async () => {
      try {
        setLoading(true);

        const res = await apiClient.get(`/api/carBookings/${bookingId}`);

        const conversation = res.data?.conversation || [];

        // normalize backend response
        const formatted = conversation.map((msg) => ({
          content: msg.message,
          senderType: msg.senderType,
          createdAt: msg.timestamp,
        }));

        setMessages(formatted);
        setError(null);
      } catch (err) {
        console.error("Failed to load car chat", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadChat();
  }, [bookingId]);

  // 🔹 Send message
  const sendMessage = useCallback(
    async (content, senderType) => {
      if (!content?.trim()) return;

      const userId =
        senderType === "BUYER"
          ? Number(localStorage.getItem("buyerUserId"))
          : Number(localStorage.getItem("sellerUserId"));

      const optimistic = {
        content,
        senderType,
        createdAt: new Date().toISOString(),
        optimistic: true,
      };

      setMessages((prev) => [...prev, optimistic]);
      setSending(true);

      try {
        await apiClient.post(`/api/carBookings/send?bookingId=${bookingId}`, {
          userId,
          message: content,
        });
      } catch (err) {
        console.error("Send failed", err);
        setError(err);
      } finally {
        setSending(false);
      }
    },
    [bookingId]
  );

  return {
    messages,
    loading,
    sending,
    error,
    sendMessage,
  };
}
