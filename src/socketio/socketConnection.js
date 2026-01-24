import { io } from "socket.io-client";

// Socket.IO server configuration (separate from REST API)
// Backend Socket.IO runs on port 9092
const SOCKET_IO_URL = import.meta.env.VITE_SOCKET_IO_URL || "http://localhost:9092";

// Create Socket.IO connection instance
let socket = null;
let isInitializing = false;
let eventListenersAttached = false;

/**
 * Initialize Socket.IO connection
 * @param {string} token - JWT token for authentication
 * @returns {Socket} Socket instance or null
 */
export const initializeSocket = (token) => {
  // If socket exists and is connected, return it immediately
  if (socket?.connected) {
    console.log("✅ Socket already connected, reusing existing connection");
    return socket;
  }

  const authToken = token || localStorage.getItem("token");
  const userId = Number(
    localStorage.getItem("userId") || 
    localStorage.getItem("buyerUserId") || 
    localStorage.getItem("sellerId")
  );

  if (!userId) {
    console.error("❌ No userId available for Socket.IO connection");
    return null;
  }

  console.log("🔄 Socket.IO: Initializing connection...");
  console.log("🔗 Server URL:", SOCKET_IO_URL);
  console.log("👤 User ID:", userId);

  // Clear existing socket if exists
  if (socket) {
    console.log("🗑️ Cleaning up existing socket...");
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
    eventListenersAttached = false;
  }

  isInitializing = true;
  
  const socketUrl = SOCKET_IO_URL;
  
  console.log("🔌 Creating NEW Socket.IO connection");
  console.log("🔌 Server:", SOCKET_IO_URL);
  console.log("🔌 UserId:", userId);

  // ✅ Create socket with query parameters in options
  socket = io(socketUrl, {
    // ✅ THIS IS THE FIX: Pass userId as query parameter (NOT in URL string)
    query: {
      userId: userId.toString()
    },
    
    // Optional auth token
    auth: {
      token: authToken || ""
    },
    
    // Transport settings
    transports: ["websocket", "polling"],
    upgrade: true,
    rememberUpgrade: true,
    
    // Reconnection settings
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    
    // Timeout
    timeout: 20000,
    
    // Don't force new connection
    forceNew: false,
    
    // Auto connect
    autoConnect: true,
    
    // CORS
    withCredentials: false
  });

  // ✅ Only attach event listeners once
  if (!eventListenersAttached) {
    eventListenersAttached = true;

    // Connection successful
    socket.on("connect", () => {
      isInitializing = false;
      console.log("✅ Socket.IO Connected successfully!");
      console.log("✅ Socket ID:", socket.id);
      console.log("✅ Connected to:", SOCKET_IO_URL);
      if (socket.io?.engine?.transport) {
        console.log("✅ Transport:", socket.io.engine.transport.name);
      }
    });

    // Connection error handler
    socket.on("connect_error", (error) => {
      isInitializing = false;
      const errorMsg = error.message || error.toString();
      
      console.warn("⚠️ Socket.IO Connection Error:", errorMsg);
      
      // Specific error handling
      if (errorMsg.includes("userId missing") || errorMsg.includes("userId is required")) {
        console.error("❌ Backend says: userId missing or invalid");
        console.error("❌ Check if userId is being sent in query parameters");
      } else if (errorMsg.includes("User not found")) {
        console.error("❌ Backend says: User not found in database");
        console.error("❌ User ID:", userId, "does not exist in database");
      } else if (errorMsg.includes("ECONNREFUSED")) {
        console.error("❌ Cannot connect to server. Is backend running on port 9092?");
      }
    });

    // Disconnection handler
    socket.on("disconnect", (reason) => {
      console.log("⚠️ Socket.IO Disconnected. Reason:", reason);
      
      // If server disconnected us, try to reconnect after delay
      if (reason === "io server disconnect") {
        console.log("🔄 Server disconnected us, reconnecting in 3 seconds...");
        setTimeout(() => {
          if (socket && !socket.connected) {
            socket.connect();
          }
        }, 3000);
      }
    });

    // Reconnection attempt
    socket.on("reconnect_attempt", (attemptNumber) => {
      if (attemptNumber <= 3) {
        console.log(`🔄 Socket.IO reconnection attempt ${attemptNumber}...`);
      }
    });

    // Reconnection successful
    socket.on("reconnect", (attemptNumber) => {
      console.log(`✅ Socket.IO reconnected after ${attemptNumber} attempts`);
    });

    // Reconnection failed
    socket.on("reconnect_failed", () => {
      console.error("❌ Socket.IO reconnection failed");
    });

    // Custom error events from server
    socket.on("socket_error", (errorMessage) => {
      console.error("❌ Received socket_error from server:", errorMessage);
    });
  }

  return socket;
};

/**
 * Get current socket instance
 * @returns {Socket|null} Socket instance or null
 */
export const getSocket = () => {
  // If socket exists and is connected, return it
  if (socket?.connected) {
    return socket;
  }

  // If socket exists but not connected, try to connect
  if (socket && !socket.connected) {
    const userId = Number(
      localStorage.getItem("userId") || 
      localStorage.getItem("buyerUserId") || 
      localStorage.getItem("sellerId")
    );
    
    if (userId) {
      console.log("🔄 Socket exists but not connected, connecting...");
      socket.connect();
    }
  }

  // No socket exists, create one
  if (!socket) {
    const token = localStorage.getItem("token");
    return initializeSocket(token);
  }
 
  return socket;
};

/**
 * Check if socket is connected
 * @returns {boolean} Connection status
 */
export const isSocketConnected = () => {
  return socket?.connected || false;
};

/**
 * Send a chat message through socket
 * @param {Object} messageData - Chat message data
 * @returns {boolean} Success status
 */
export const sendChatMessage = (messageData) => {
  const currentSocket = getSocket();
  
  if (!currentSocket?.connected) {
    console.error("❌ Cannot send message: Socket not connected");
    return false;
  }
  
  console.log("📤 Sending chat message:", messageData);
  currentSocket.emit("send_chat_message", messageData);
  return true;
};

/**
 * Listen for incoming chat messages
 * @param {Function} callback - Callback function to handle messages
 */
export const listenForChatMessages = (callback) => {
  const currentSocket = getSocket();
  
  if (!currentSocket) {
    console.error("❌ Cannot listen: Socket not available");
    return;
  }
  
  currentSocket.off("receive_chat_message"); // Remove previous listener
  currentSocket.on("receive_chat_message", callback);
  console.log("👂 Listening for chat messages...");
};

/**
 * Disconnect Socket.IO
 */
export const disconnectSocket = () => {
  if (socket) {
    isInitializing = false;
    eventListenersAttached = false;
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
    console.log("🔌 Socket.IO Disconnected");
  }
};

/**
 * Utility function to test connection
 */
export const testSocketConnection = () => {
  console.log("🧪 Testing Socket.IO Connection...");
  console.log("Socket exists:", !!socket);
  console.log("Socket connected:", socket?.connected || false);
  console.log("Socket ID:", socket?.id || "N/A");
  console.log("User ID:", localStorage.getItem("userId") || "Not found");
  
  if (socket) {
    console.log("Socket transport:", socket.io?.engine?.transport?.name || "Unknown");
  }
  
  return {
    exists: !!socket,
    connected: socket?.connected || false,
    userId: localStorage.getItem("userId") || null
  };
};
 
export default socket;
 
