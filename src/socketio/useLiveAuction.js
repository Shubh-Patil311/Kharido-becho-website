import { useEffect, useState, useCallback, useRef } from "react";
import { getSocket, initializeSocket } from "./socketConnection";
import { toast } from "react-toastify";

/**
 * Custom hook for managing live auction products with Socket.IO
 * @param {string} productType - Type of product: 'CAR', 'BIKE', 'MOBILE', 'LAPTOP'
 * @returns {Object} Live auction state and functions
 */
export const useLiveAuction = (productType) => {
  const [liveProducts, setLiveProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      // Don't show error toast if user is not logged in - they might be browsing
      return;
    }

    // Get or initialize socket
    let socket = getSocket();
    
    // If no socket, try to initialize
    if (!socket) {
      socket = initializeSocket(token);
    }
    
    // If still no socket, can't connect
    if (!socket) {
      console.warn("Failed to initialize Socket.IO - userId or token missing");
      setConnected(false);
      setLoading(false);
      return;
    }

    socketRef.current = socket;

    // If socket exists but not connected, wait for connection
    if (!socket.connected) {
      // Wait a bit for connection
      const connectionCheckTimeout = setTimeout(() => {
        if (!socket.connected) {
          console.warn("Socket.IO connection timeout for live auctions");
          setConnected(false);
          setLoading(false);
        }
      }, 2000);
      
      // Clear timeout if connection succeeds
      socket.once("connect", () => {
        clearTimeout(connectionCheckTimeout);
      });
    }

    let connectionTimeout;
    let hasShownError = false;

    socket.on("connect", () => {
      setConnected(true);
      hasShownError = false;
      clearTimeout(connectionTimeout);
      console.log("✅ Connected to live auction socket");
      
      // Join room for product type
      socket.emit("join-live-auctions", { productType });
    });

    socket.on("disconnect", (reason) => {
      setConnected(false);
      if (reason !== "io client disconnect") {
        console.log("⚠️ Disconnected from live auction socket:", reason);
      }
    });

    // Handle connection errors gracefully
    socket.on("connect_error", (error) => {
      // Only show error once, not on every retry
      if (!hasShownError) {
        hasShownError = true;
        const errorMsg = error.message || error.toString();
        
        // Check if backend is not running
        if (errorMsg.includes("websocket error") || 
            errorMsg.includes("TransportError") ||
            errorMsg.includes("ECONNREFUSED") ||
            errorMsg.includes("Failed to fetch")) {
          // Backend is likely not running - don't show error toast, just log
          console.warn("⚠️ Live auction server unavailable. Backend may not be running.");
          setLoading(false);
        } else if (errorMsg.includes("Authentication") || errorMsg.includes("credentials")) {
          // Authentication issue
          console.warn("⚠️ Authentication required for live auctions");
          setLoading(false);
        }
      }
    });

    // Set timeout to stop loading if connection takes too long
    connectionTimeout = setTimeout(() => {
      if (!socket.connected) {
        setLoading(false);
        if (!hasShownError) {
          console.warn("⚠️ Live auction connection timeout. Backend may not be running.");
        }
      }
    }, 5000);

    // Listen for live products list
    socket.on("live-products", (products) => {
      console.log("Received live products:", products);
      setLiveProducts(Array.isArray(products) ? products : []);
      setLoading(false);
    });

    // Listen for new product added to auction
    socket.on("product-live", (product) => {
      console.log("New live product:", product);
      setLiveProducts((prev) => {
        const exists = prev.some((p) => getProductId(p) === getProductId(product));
        if (!exists && product.productType === productType) {
          return [...prev, product];
        }
        return prev;
      });
    });

    // Listen for product removed from auction
    socket.on("product-auction-ended", (productId) => {
      console.log("Auction ended for product:", productId);
      setLiveProducts((prev) =>
        prev.filter((p) => getProductId(p) !== productId)
      );
    });

    // Listen for bid updates
    socket.on("bid-updated", (data) => {
      console.log("Bid updated:", data);
      setLiveProducts((prev) =>
        prev.map((product) => {
          const productId = getProductId(product);
          if (productId === data.productId) {
            return {
              ...product,
              currentBid: data.currentBid,
              topBids: data.topBids || product.topBids || [],
              totalBids: data.totalBids || (product.totalBids || 0) + 1,
            };
          }
          return product;
        })
      );
    });

    // Listen for auction winner
    socket.on("auction-winner", (data) => {
      console.log("Auction winner:", data);
      toast.success(`Auction ended! Winner: ${data.winnerName || "Unknown"}`);
      setLiveProducts((prev) =>
        prev.map((product) => {
          const productId = getProductId(product);
          if (productId === data.productId) {
            return {
              ...product,
              winner: data.winner,
              winnerName: data.winnerName,
              winnerBid: data.winnerBid,
              auctionEnded: true,
            };
          }
          return product;
        })
      );
    });

    // Request initial live products only if connected
    let tryEmitTimeout = null;
    if (socket.connected) {
      socket.emit("get-live-products", { productType });
    } else {
      // If not connected, wait a bit then try
      tryEmitTimeout = setTimeout(() => {
        if (socketRef.current?.connected) {
          socketRef.current.emit("get-live-products", { productType });
        } else {
          setLoading(false);
        }
      }, 2000);
    }

    // Cleanup function
    return () => {
      if (tryEmitTimeout) clearTimeout(tryEmitTimeout);
      if (connectionTimeout) clearTimeout(connectionTimeout);
      if (socketRef.current) {
        socketRef.current.emit("leave-live-auctions", { productType });
        socketRef.current.off("live-products");
        socketRef.current.off("product-live");
        socketRef.current.off("product-auction-ended");
        socketRef.current.off("bid-updated");
        socketRef.current.off("auction-winner");
        socketRef.current.off("connect");
        socketRef.current.off("disconnect");
        socketRef.current.off("connect_error");
      }
    };
  }, [productType]);

  /**
   * Place a bid on a product
   */
  const placeBid = useCallback(
    (productId, bidAmount) => {
      const socket = socketRef.current;
      if (!socket || !socket.connected) {
        toast.error("Not connected to auction server");
        return;
      }

      const buyerId = localStorage.getItem("buyerUserId") || localStorage.getItem("userId");
      if (!buyerId) {
        toast.error("Please login as buyer to place bids");
        return;
      }

      socket.emit("place-bid", {
        productId,
        productType,
        buyerId: Number(buyerId),
        bidAmount: Number(bidAmount),
      });

      toast.info("Bid placed! Waiting for confirmation...");
    },
    [productType]
  );

  /**
   * Get top 3 bids for a product
   */
  const getTopBids = useCallback((productId) => {
    const product = liveProducts.find(
      (p) => getProductId(p) === productId
    );
    return product?.topBids || [];
  }, [liveProducts]);

  /**
   * Get winner for a product
   */
  const getWinner = useCallback((productId) => {
    const product = liveProducts.find(
      (p) => getProductId(p) === productId
    );
    return product?.winner ? {
      winnerId: product.winner,
      winnerName: product.winnerName,
      winnerBid: product.winnerBid,
    } : null;
  }, [liveProducts]);

  return {
    liveProducts,
    loading,
    connected,
    placeBid,
    getTopBids,
    getWinner,
  };
};

/**
 * Helper function to get product ID based on product type
 */
const getProductId = (product) => {
  if (product.carId) return product.carId;
  if (product.bike_id || product.bikeId) return product.bike_id || product.bikeId;
  if (product.mobileId) return product.mobileId;
  if (product.laptopId) return product.laptopId;
  return product.id;
};

