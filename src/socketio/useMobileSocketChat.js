import { useEffect, useState, useCallback, useRef } from "react";
import { getSocket, initializeSocket } from "./socketConnection";
import { toast } from "react-toastify";
import { 
  getMobileRequestsByBuyer, 
  getMobileRequestsBySeller,
  getMobileChatHistory,
  postMobileRequestMessage
} from "../store/services/mobileRequestServices";
import apiClient from "../store/services/apiClient";

/**
 * Custom hook for Mobile Socket.IO based real-time chat
 * 
 * Backend Socket.IO Events:
 * - send_chat_message: Send message (ChatSendDTO: { requestId, senderUserId, message })
 * - receive_chat_message: Receive message (ChatMessageDTO: { messageId, requestId, senderUserId, receiverUserId, senderRole, message, createdAt })
 * 
 * IMPORTANT:
 * - Chat only works when request status is IN_NEGOTIATION
 * - userId (buyerUserId/sellerUserId) must be fetched from API if not in localStorage
 * - Socket.IO connection requires userId in handshake
 * 
 * @param {string|number} requestId - The mobile request ID
 * @param {string} senderType - "BUYER" or "SELLER"
 * @returns {Object} Chat state and functions
 */
export const useMobileSocketChat = (requestId, senderType = "BUYER") => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [requestStatus, setRequestStatus] = useState(null);
  const [senderUserId, setSenderUserId] = useState(null);
  const socketRef = useRef(null);
  const messagesLoadedRef = useRef(false);
  const connectionAttemptedRef = useRef(false);

  /**
   * Fetch sender userId from API if not in localStorage
   * Backend doesn't set userId with token, so we need to fetch it
   * 
   * IMPORTANT: For Socket.IO and chat, we need User.id (base userId), not buyerId or sellerId
   * The backend validates senderUserId against User.id (buyer.user.id or seller.user.id)
   * 
   * The userId should be the same as what's stored in localStorage.getItem("userId")
   * But if it's missing, we fetch it from buyer/seller info API
   */
  const fetchSenderUserId = useCallback(async () => {
    // First check localStorage for base userId (User.id) - this should be set during login
    let baseUserId = Number(localStorage.getItem("userId"));
    
    if (baseUserId) {
      return baseUserId;
    }

    // If not in localStorage, fetch from API using buyerId or sellerId
    // We need to get the User.id from buyer/seller info
    try {
      if (senderType === "BUYER") {
        // Try to get buyerId first
        const buyerId = Number(localStorage.getItem("buyerId") || localStorage.getItem("buyerUserId"));
        if (buyerId) {
          // Note: fetchBuyerInfo expects userId (User.id), not buyerId
          // But we can try to get user profile or use a different approach
          // Actually, we need to get the userId from the current user's profile
          // Let's try fetching current user profile
          try {
            const response = await apiClient.get("/api/v1/users/profile/me");
            if (response.data?.user?.id) {
              baseUserId = response.data.user.id;
              localStorage.setItem("userId", baseUserId);
              return baseUserId;
            }
          } catch (profileErr) {
            console.error("Failed to fetch user profile:", profileErr);
          }
        }
      } else {
        // For seller, try similar approach
        const sellerId = Number(localStorage.getItem("sellerId"));
        if (sellerId) {
          try {
            const response = await apiClient.get("/api/v1/users/profile/me");
            if (response.data?.user?.id) {
              baseUserId = response.data.user.id;
              localStorage.setItem("userId", baseUserId);
              return baseUserId;
            }
          } catch (profileErr) {
            console.error("Failed to fetch user profile:", profileErr);
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch userId from API:", err);
      return null;
    }

    return null;
  }, [senderType]);

  /**
   * Fetch request status and validate chat eligibility
   */
  const fetchRequestStatus = useCallback(async () => {
    if (!requestId) return null;

    try {
      let requestData = null;

      if (senderType === "BUYER") {
        const buyerId = Number(localStorage.getItem("buyerId") || localStorage.getItem("buyerUserId"));
        if (!buyerId) return null;
        const data = await getMobileRequestsByBuyer(buyerId);
        requestData = Array.isArray(data) ? data.find(r => r.requestId === Number(requestId)) : data;
      } else {
        const sellerId = Number(localStorage.getItem("sellerId"));
        if (!sellerId) return null;
        const data = await getMobileRequestsBySeller(sellerId);
        requestData = Array.isArray(data) ? data.find(r => r.requestId === Number(requestId)) : data;
      }

      if (requestData) {
        setRequestStatus(requestData.status);
        return requestData.status;
      }
      return null;
    } catch (err) {
      console.error("Failed to fetch request status:", err);
      return null;
    }
  }, [requestId, senderType]);

  // Initialize socket connection
  useEffect(() => {
    if (!requestId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token found for Socket.IO chat");
      setLoading(false);
      return;
    }

    let isMounted = true;

    // Initialize: Fetch userId and request status
    const initialize = async () => {
      // Fetch sender userId
      const userId = await fetchSenderUserId();
      if (!userId) {
        console.error("Failed to get sender userId");
        if (isMounted) {
          setLoading(false);
          setError("User ID not found. Please login again.");
        }
        return;
      }
      setSenderUserId(userId);

      // Fetch request status
      const status = await fetchRequestStatus();
      if (!status) {
        console.error("Failed to get request status");
        if (isMounted) {
          setLoading(false);
          setError("Request not found");
        }
        return;
      }

      // Chat only allowed when status is IN_NEGOTIATION
      if (status !== "IN_NEGOTIATION") {
        console.log(`Chat not allowed. Request status: ${status}. Chat only works when status is IN_NEGOTIATION.`);
        if (isMounted) {
          setLoading(false);
          // Load messages from API as fallback (for PENDING status initial message)
          try {
            const chatHistory = await getMobileChatHistory(requestId);
            if (Array.isArray(chatHistory)) {
              const formattedMessages = chatHistory.map((msg) => ({
                messageId: msg.messageId,
                id: msg.messageId,
                requestId: msg.requestId,
                senderUserId: msg.senderUserId,
                receiverUserId: msg.receiverUserId,
                senderType: msg.senderRole,
                content: msg.message,
                message: msg.message,
                createdAt: msg.createdAt,
                timestamp: msg.createdAt,
              }));
              setMessages(formattedMessages);
            }
          } catch (err) {
            console.error("Failed to load chat history:", err);
          }
        }
        return;
      }

      // Get or initialize socket - use getSocket() which handles singleton pattern
      let socket = getSocket();
      
      // If no socket, try to initialize (but getSocket should handle this)
      if (!socket) {
        const token = localStorage.getItem("token");
        socket = initializeSocket(token);
      }
      
      if (!socket) {
        console.warn("Failed to initialize Socket.IO - falling back to API");
        if (isMounted) {
          loadMessagesFromAPI();
        }
        return;
      }

      // Store socket reference
      socketRef.current = socket;

      // Connection handlers
      const handleConnect = () => {
        if (!isMounted) return;
        setConnected(true);
        console.log("✅ Connected to mobile chat socket");
        
        // Request chat history via HTTP API (Socket.IO doesn't have get-history event)
        loadMessagesFromAPI();
      };

      const handleDisconnect = () => {
        if (!isMounted) return;
        setConnected(false);
        console.log("⚠️ Disconnected from mobile chat socket");
      };

      // Listen for new messages (Backend event: receive_chat_message)
      const handleReceiveMessage = (data) => {
        if (!isMounted) return;
        console.log("New mobile message received:", data);
        
        if (data.requestId === Number(requestId)) {
          const newMessage = {
            messageId: data.messageId,
            id: data.messageId,
            requestId: data.requestId,
            senderUserId: data.senderUserId,
            receiverUserId: data.receiverUserId,
            senderType: data.senderRole,
            content: data.message,
            message: data.message,
            createdAt: data.createdAt || new Date().toISOString(),
            timestamp: data.createdAt || new Date().toISOString(),
          };

          setMessages((prev) => {
            // Check if message already exists (avoid duplicates)
            const exists = prev.some((msg) => msg.messageId === newMessage.messageId);
            if (exists) return prev;
            return [...prev, newMessage];
          });
        }
      };

      // Listen for errors
      const handleError = (errorData) => {
        if (!isMounted) return;
        console.error("Mobile chat error:", errorData);
        const errorMsg = typeof errorData === 'string' ? errorData : (errorData?.message || "Chat error occurred");
        setError(errorMsg);
        if (errorMsg.includes("Chat allowed only when request is IN_NEGOTIATION")) {
          toast.error("Chat is only available when seller accepts the request");
        } else if (errorMsg) {
          toast.error(errorMsg);
        }
        setSending(false);
      };

      // Set up event listeners - remove existing ones first to prevent duplicates
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("receive_chat_message", handleReceiveMessage);
      socket.off("socket_error", handleError);
      
      // Now add listeners
      socket.on("connect", handleConnect);
      socket.on("disconnect", handleDisconnect);
      socket.on("receive_chat_message", handleReceiveMessage);
      socket.on("socket_error", handleError);

      // If already connected, trigger connect handler
      if (socket.connected) {
        handleConnect();
      }

      // Cleanup function - only remove event listeners, don't disconnect socket
      // Socket is shared across components, so we shouldn't disconnect it
      return () => {
        isMounted = false;
        if (socketRef.current) {
          // Only remove our event listeners, don't disconnect the socket
          // The socket is shared and other components might be using it
          socketRef.current.off("connect", handleConnect);
          socketRef.current.off("disconnect", handleDisconnect);
          socketRef.current.off("receive_chat_message", handleReceiveMessage);
          socketRef.current.off("socket_error", handleError);
        }
        messagesLoadedRef.current = false;
        connectionAttemptedRef.current = false;
      };
    };

    initialize();

    // Cleanup on unmount
    return () => {
      isMounted = false;
    };
  }, [requestId, senderType, fetchSenderUserId, fetchRequestStatus]);

  /**
   * Load messages from HTTP API (fallback or initial load)
   */
  const loadMessagesFromAPI = async () => {
    try {
      setLoading(true);
      const chatHistory = await getMobileChatHistory(requestId);
      
      if (Array.isArray(chatHistory)) {
        const formattedMessages = chatHistory.map((msg) => ({
          messageId: msg.messageId,
          id: msg.messageId,
          requestId: msg.requestId,
          senderUserId: msg.senderUserId,
          receiverUserId: msg.receiverUserId,
          senderType: msg.senderRole,
          content: msg.message,
          message: msg.message,
          createdAt: msg.createdAt,
          timestamp: msg.createdAt,
        }));
        setMessages(formattedMessages);
        messagesLoadedRef.current = true;
      } else {
        setMessages([]);
      }
      setLoading(false);
    } catch (err) {
      console.error("Failed to load mobile messages from API:", err);
      setLoading(false);
    }
  };

  /**
   * Send a message via Socket.IO
   * Backend expects: { requestId, senderUserId, message }
   */
  const sendMessage = useCallback(
    async (content) => {
      const trimmed = (content || "").trim();
      if (!requestId || !trimmed) return;

      // Check if chat is allowed (status must be IN_NEGOTIATION)
      if (requestStatus !== "IN_NEGOTIATION") {
        toast.error("Chat is only available when seller accepts the request (IN_NEGOTIATION status)");
        return;
      }

      const socket = socketRef.current;
      const currentSenderUserId = senderUserId || await fetchSenderUserId();
      
      if (!currentSenderUserId) {
        toast.error("User ID not found. Please login again.");
        return;
      }

      // Try Socket.IO first if connected
      if (socket && socket.connected) {
        // Create optimistic message
        const tempId = `temp-${Date.now()}`;
        const optimisticMessage = {
          tempId,
          id: tempId,
          requestId: Number(requestId),
          senderUserId: currentSenderUserId,
          senderType: senderType,
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
          // Emit message to server (Backend event: send_chat_message)
          socket.emit("send_chat_message", {
            requestId: Number(requestId),
            senderUserId: currentSenderUserId,
            message: trimmed,
          });

          // Timeout for confirmation (remove optimistic if no response)
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
            setSending(false);
          }, 5000);
        } catch (err) {
          console.error("Failed to send message via Socket.IO:", err);
          // Remove optimistic message
          setMessages((prev) => prev.filter((msg) => msg.tempId !== tempId));
          // Fallback to API
          await sendMessageViaAPI(trimmed);
        }
      } else {
        // Fallback to API if Socket.IO not connected
        await sendMessageViaAPI(trimmed);
      }
    },
    [requestId, senderType, senderUserId, requestStatus, fetchSenderUserId]
  );

  /**
   * Fallback: Send message via HTTP API
   */
  const sendMessageViaAPI = async (content) => {
    try {
      setSending(true);
      const currentSenderUserId = senderUserId || await fetchSenderUserId();
      
      if (!currentSenderUserId) {
        toast.error("User ID not found");
        return;
      }

      await postMobileRequestMessage(Number(requestId), {
        senderUserId: currentSenderUserId,
        message: content,
      });

      // Reload messages from API
      await loadMessagesFromAPI();
      setSending(false);
      setError(null);
    } catch (err) {
      console.error("Failed to send message via API:", err);
      setError("Failed to send message");
      setSending(false);
      toast.error(err?.response?.data?.message || "Failed to send message");
    }
  };

  return {
    messages,
    loading,
    sending,
    error,
    connected,
    requestStatus,
    sendMessage,
    setMessages,
    refreshMessages: loadMessagesFromAPI,
  };
};

export default useMobileSocketChat;
