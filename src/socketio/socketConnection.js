import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8087";

// Create Socket.IO connection instance
let socket = null;

/**
 * Initialize Socket.IO connection
 * @param {string} token - JWT token for authentication
 * @returns {Socket} Socket instance
 */
export const initializeSocket = (token) => {
  if (socket?.connected) {
    return socket;
  }

  socket = io(BASE_URL, {
    auth: {
      token: token || localStorage.getItem("token"),
    },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  socket.on("connect", () => {
    console.log("✅ Socket.IO Connected:", socket.id);
  });

  socket.on("disconnect", (reason) => {
    // Only log disconnect if it's not a normal close
    if (reason !== "io client disconnect") {
      console.log("⚠️ Socket.IO Disconnected:", reason);
    }
  });

  socket.on("connect_error", (error) => {
    // Suppress duplicate error logs - only log once per connection attempt
    // The native WebSocket error will still show in browser console, but we handle it here
    if (error.message && !error.message.includes("xhr poll error")) {
      // Only log meaningful errors, not every retry attempt
      const errorMsg = error.message || error.toString();
      
      // Check if it's an authentication error
      if (errorMsg.includes("Authentication") || errorMsg.includes("credentials")) {
        console.warn("⚠️ Socket.IO: Authentication required or backend not running");
      } else if (errorMsg.includes("websocket error") || errorMsg.includes("TransportError")) {
        // This is the WebSocket transport error - backend likely not running
        console.warn("⚠️ Socket.IO: Backend server not available. Live features will be disabled.");
      } else {
        console.warn("⚠️ Socket.IO Connection Error:", errorMsg);
      }
    }
  });

  return socket;
};

/**
 * Get current socket instance
 * @returns {Socket|null} Socket instance or null
 */
export const getSocket = () => {
  if (!socket) {
    const token = localStorage.getItem("token");
    if (token) {
      return initializeSocket(token);
    }
    return null;
  }
  return socket;
};

/**
 * Disconnect Socket.IO
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("🔌 Socket.IO Disconnected");
  }
};

export default socket;

