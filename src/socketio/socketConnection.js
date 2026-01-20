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
    console.log("❌ Socket.IO Disconnected:", reason);
  });

  socket.on("connect_error", (error) => {
    console.error("❌ Socket.IO Connection Error:", error);
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

