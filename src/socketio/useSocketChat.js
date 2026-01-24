import { useEffect, useState, useCallback, useRef } from "react";
import { getSocket, initializeSocket } from "./socketConnection";
import { toast } from "react-toastify";

/**
 * Custom hook for Socket.IO based real-time chat
 * Works with ConversationMessageEntity structure:
 * - request_id (bookingId)
 * - sender_user_id
 * - senderType (BUYER/SELLER)
 * - message
 * - createdAt
 * 
 * @param {string|number} requestId - The booking/request ID
 * @param {string} senderType - "BUYER" or "SELLER"
 * @param {string} chatType - "CAR", "BIKE", "MOBILE", "LAPTOP" (optional, for room naming)
 * @returns {Object} Chat state and functions
 */
export const useSocketChat = (requestId, senderType = "BUYER", chatType = "BIKE") => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);
  const messagesLoadedRef = useRef(false);

  // Get sender user ID based on type
  const getSenderUserId = () => {
    if (senderType === "BUYER") {
      return Number(localStorage.getItem("buyerUserId") || localStorage.getItem("buyerId") || localStorage.getItem("userId"));
    } else {
      return Number(localStorage.getItem("sellerId") || localStorage.getItem("userId"));
    }
  };

  // Initialize socket connection
  useEffect(() => {
    if (!requestId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to use chat");
      setLoading(false);
      return;
    }

    // Get or initialize socket
    let socket = getSocket();
    
    // If no socket, try to initialize
    if (!socket) {
      socket = initializeSocket(token);
    }
    
    // If still no socket, fallback to API
    if (!socket) {
      console.warn("Failed to initialize Socket.IO - userId or token missing");
      setLoading(false);
      return;
    }

    socketRef.current = socket;

    // If socket exists but not connected, wait for connection
    if (!socket.connected) {
      // Wait a bit for connection
      const connectionCheckTimeout = setTimeout(() => {
        if (!socket.connected) {
          console.warn("Socket.IO connection timeout");
          setLoading(false);
        }
      }, 2000);
      
      // Clear timeout if connection succeeds
      socket.once("connect", () => {
        clearTimeout(connectionCheckTimeout);
      });
    }

    const senderUserId = getSenderUserId();
    if (!senderUserId) {
      console.error("Sender user ID not found");
      setLoading(false);
      return;
    }

    // Join chat room for this request
    const roomName = `chat-${chatType}-${requestId}`;
    
    socket.on("connect", () => {
      setConnected(true);
      console.log("✅ Connected to chat socket");
      
      // Join the chat room
      socket.emit("join-chat-room", {
        roomName,
        requestId: Number(requestId),
        senderUserId,
        senderType,
        chatType,
      });
    });

    socket.on("disconnect", () => {
      setConnected(false);
      console.log("⚠️ Disconnected from chat socket");
    });

    // Listen for chat history (initial load)
    socket.on("chat-history", (data) => {
      console.log("Received chat history:", data);
      if (data.requestId === Number(requestId)) {
        const formattedMessages = (data.messages || []).map((msg) => ({
          messageId: msg.messageId,
          id: msg.messageId, // For compatibility
          requestId: msg.request_id || data.requestId,
          senderUserId: msg.sender_user_id,
          senderType: msg.senderType || msg.sender_type,
          content: msg.message,
          message: msg.message, // Keep both for compatibility
          createdAt: msg.createdAt || msg.created_at,
          timestamp: msg.createdAt || msg.created_at,
        }));
        setMessages(formattedMessages);
        messagesLoadedRef.current = true;
        setLoading(false);
      }
    });

    // Listen for new messages
    socket.on("new-message", (data) => {
      console.log("New message received:", data);
      if (data.requestId === Number(requestId)) {
        const newMessage = {
          messageId: data.messageId,
          id: data.messageId,
          requestId: data.requestId,
          senderUserId: data.senderUserId || data.sender_user_id,
          senderType: data.senderType || data.sender_type,
          content: data.message,
          message: data.message,
          createdAt: data.createdAt || data.created_at || new Date().toISOString(),
          timestamp: data.createdAt || data.created_at || new Date().toISOString(),
        };

        setMessages((prev) => {
          // Check if message already exists (avoid duplicates)
          const exists = prev.some((msg) => msg.messageId === newMessage.messageId);
          if (exists) return prev;
          return [...prev, newMessage];
        });
      }
    });

    // Listen for message sent confirmation
    socket.on("message-sent", (data) => {
      console.log("Message sent confirmation:", data);
      if (data.requestId === Number(requestId)) {
        // Update optimistic message with real messageId
        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.optimistic && msg.tempId === data.tempId) {
              return {
                ...msg,
                messageId: data.messageId,
                id: data.messageId,
                optimistic: false,
                tempId: undefined,
              };
            }
            return msg;
          })
        );
        setSending(false);
      }
    });

    // Listen for errors
    socket.on("chat-error", (errorData) => {
      console.error("Chat error:", errorData);
      setError(errorData.message || "Chat error occurred");
      toast.error(errorData.message || "Failed to send message");
      setSending(false);
    });

    // Request chat history
    if (socket.connected) {
      socket.emit("get-chat-history", {
        requestId: Number(requestId),
        chatType,
      });
    } else {
      // Wait for connection then request history
      socket.once("connect", () => {
        socket.emit("get-chat-history", {
          requestId: Number(requestId),
          chatType,
        });
      });
    }

    // Set timeout for loading
    const loadingTimeout = setTimeout(() => {
      if (!messagesLoadedRef.current) {
        setLoading(false);
        console.warn("Chat history loading timeout");
      }
    }, 5000);

    return () => {
      clearTimeout(loadingTimeout);
      if (socketRef.current) {
        socketRef.current.emit("leave-chat-room", { roomName });
        socketRef.current.off("chat-history");
        socketRef.current.off("new-message");
        socketRef.current.off("message-sent");
        socketRef.current.off("chat-error");
        socketRef.current.off("connect");
        socketRef.current.off("disconnect");
      }
      messagesLoadedRef.current = false;
    };
  }, [requestId, senderType, chatType]);

  /**
   * Send a message via Socket.IO
   */
  const sendMessage = useCallback(
    async (content, senderTypeOverride = null) => {
      const trimmed = (content || "").trim();
      if (!requestId || !trimmed) return;

      const socket = socketRef.current;
      if (!socket || !socket.connected) {
        toast.error("Not connected to chat server");
        return;
      }

      const finalSenderType = senderTypeOverride || senderType;
      const senderUserId = getSenderUserId();
      
      if (!senderUserId) {
        toast.error("User ID not found");
        return;
      }

      // Create optimistic message
      const tempId = `temp-${Date.now()}`;
      const optimisticMessage = {
        tempId,
        id: tempId,
        requestId: Number(requestId),
        senderUserId,
        senderType: finalSenderType,
        content: trimmed,
        message: trimmed,
        createdAt: new Date().toISOString(),
        timestamp: new Date().toISOString(),
        optimistic: true,
      };

      setMessages((prev) => [...prev, optimisticMessage]);
      setSending(true);
      setError(null);

      try {
        // Emit message to server
        socket.emit("send-message", {
          requestId: Number(requestId),
          senderUserId,
          senderType: finalSenderType,
          message: trimmed,
          chatType,
          tempId, // For matching confirmation
        });

        // The message-sent event will update the optimistic message
        // If no confirmation after 5 seconds, mark as failed
        setTimeout(() => {
          setMessages((prev) =>
            prev.map((msg) => {
              if (msg.tempId === tempId && msg.optimistic) {
                setError("Message may not have been sent");
                return { ...msg, optimistic: false, failed: true };
              }
              return msg;
            })
          );
        }, 5000);
      } catch (err) {
        console.error("Failed to send message:", err);
        setError("Failed to send message");
        // Remove optimistic message on error
        setMessages((prev) => prev.filter((msg) => msg.tempId !== tempId));
        setSending(false);
        throw err;
      }
    },
    [requestId, senderType, chatType]
  );

  return {
    messages,
    loading,
    sending,
    error,
    connected,
    sendMessage,
    setMessages, // For manual updates if needed
  };
};

export default useSocketChat;
