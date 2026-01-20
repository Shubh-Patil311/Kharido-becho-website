import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  MdDirectionsCar,
  MdTwoWheeler,
  MdPhoneIphone,
  MdLaptop,
  MdGavel,
  MdTimer,
  MdPerson,
  MdAttachMoney,
  MdTrendingUp,
} from "react-icons/md";

/**
 * Live Product Card Component
 * Displays live auction products with bidding functionality
 */
export default function LiveProductCard({
  product,
  productType,
  onPlaceBid,
  topBids = [],
  winner = null,
}) {
  const [bidAmount, setBidAmount] = useState("");
  const [showBidModal, setShowBidModal] = useState(false);
  const [isPlacingBid, setIsPlacingBid] = useState(false);

  // Get product ID based on type
  const getProductId = () => {
    if (product.carId) return product.carId;
    if (product.bike_id || product.bikeId) return product.bike_id || product.bikeId;
    if (product.mobileId) return product.mobileId;
    if (product.laptopId) return product.laptopId;
    return product.id;
  };

  // Get product image
  const getProductImage = () => {
    if (product.images && product.images.length > 0) {
      return product.images[0].imageUrl || product.images[0];
    }
    return "https://via.placeholder.com/400x300?text=No+Image";
  };

  // Get product name
  const getProductName = () => {
    return `${product.brand || ""} ${product.model || ""}`.trim();
  };

  // Get current price
  const getCurrentPrice = () => {
    return product.currentBid || product.startingBid || product.price || product.prize || 0;
  };

  // Get product icon based on type
  const getProductIcon = () => {
    switch (productType) {
      case "CAR":
        return <MdDirectionsCar className="text-2xl" />;
      case "BIKE":
        return <MdTwoWheeler className="text-2xl" />;
      case "MOBILE":
        return <MdPhoneIphone className="text-2xl" />;
      case "LAPTOP":
        return <MdLaptop className="text-2xl" />;
      default:
        return <MdGavel className="text-2xl" />;
    }
  };

  // Handle bid placement
  const handlePlaceBid = async () => {
    const amount = Number(bidAmount);
    const currentPrice = getCurrentPrice();

    if (!amount || amount <= 0) {
      toast.error("Please enter a valid bid amount");
      return;
    }

    if (amount <= currentPrice) {
      toast.error(`Bid must be higher than current price: ₹${currentPrice.toLocaleString()}`);
      return;
    }

    setIsPlacingBid(true);
    try {
      await onPlaceBid(getProductId(), amount);
      setBidAmount("");
      setShowBidModal(false);
      toast.success("Bid placed successfully!");
    } catch (error) {
      toast.error("Failed to place bid");
    } finally {
      setIsPlacingBid(false);
    }
  };

  const productId = getProductId();
  const productName = getProductName();
  const currentPrice = getCurrentPrice();
  const imageUrl = getProductImage();
  const isAuctionEnded = product.auctionEnded || winner;

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-blue-500">
      {/* Live Badge */}
      <div className="relative">
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 animate-pulse">
            <span className="w-2 h-2 bg-white rounded-full"></span>
            LIVE
          </span>
        </div>
        
        {isAuctionEnded && (
          <div className="absolute top-3 right-3 z-10">
            <span className="bg-gray-600 text-white px-3 py-1 rounded-full text-xs font-bold">
              ENDED
            </span>
          </div>
        )}

        {/* Product Image */}
        <div className="relative h-64 overflow-hidden bg-gray-100">
          <img
            src={imageUrl}
            alt={productName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          
          {/* Product Type Icon */}
          <div className="absolute bottom-3 left-3 text-white">
            <div className="bg-black/50 backdrop-blur-sm rounded-lg p-2">
              {getProductIcon()}
            </div>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
          {productName}
        </h3>

        {/* Additional Info */}
        <div className="flex flex-wrap gap-2 mb-4 text-sm text-gray-600">
          {product.yearOfPurchase && (
            <span>Year: {product.yearOfPurchase}</span>
          )}
          {product.condition && (
            <span>• Condition: {product.condition}</span>
          )}
          {product.location && (
            <span>• {product.location}</span>
          )}
        </div>

        {/* Current Bid */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Current Bid</p>
              <p className="text-2xl font-bold text-blue-600">
                ₹{currentPrice.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Total Bids</p>
              <p className="text-xl font-bold text-purple-600">
                {product.totalBids || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Top 3 Bids */}
        {topBids.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
              <MdTrendingUp className="text-blue-500" />
              Top Bids
            </p>
            <div className="space-y-1">
              {topBids.slice(0, 3).map((bid, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-2 rounded ${
                    index === 0
                      ? "bg-yellow-50 border border-yellow-200"
                      : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0
                          ? "bg-yellow-400 text-yellow-900"
                          : index === 1
                          ? "bg-gray-300 text-gray-700"
                          : "bg-orange-200 text-orange-800"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span className="text-sm text-gray-700">
                      {bid.buyerName || `Bidder ${index + 1}`}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">
                    ₹{bid.bidAmount?.toLocaleString() || bid.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Winner Section */}
        {winner && (
          <div className="mb-4 bg-green-50 border-2 border-green-400 rounded-lg p-3">
            <p className="text-sm font-semibold text-green-800 mb-1 flex items-center gap-1">
              <MdPerson className="text-green-600" />
              Winner
            </p>
            <p className="text-lg font-bold text-green-700">
              {winner.winnerName || "Unknown"}
            </p>
            <p className="text-sm text-green-600">
              Winning Bid: ₹{winner.winnerBid?.toLocaleString() || currentPrice.toLocaleString()}
            </p>
          </div>
        )}

        {/* Timer (if available) */}
        {product.auctionEndTime && !isAuctionEnded && (
          <div className="mb-4 flex items-center gap-2 text-sm text-orange-600">
            <MdTimer />
            <span>Ends in: {formatTimeRemaining(product.auctionEndTime)}</span>
          </div>
        )}

        {/* Bid Button */}
        {!isAuctionEnded && (
          <button
            onClick={() => setShowBidModal(true)}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <MdGavel />
            Place Bid
          </button>
        )}
      </div>

      {/* Bid Modal */}
      {showBidModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold mb-4">Place Your Bid</h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Product: {productName}</p>
              <p className="text-lg font-semibold text-gray-800">
                Current Bid: ₹{currentPrice.toLocaleString()}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Bid Amount (₹)
              </label>
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder={`Min: ₹${(currentPrice + 1).toLocaleString()}`}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
                min={currentPrice + 1}
                step="100"
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum bid: ₹{(currentPrice + 1).toLocaleString()}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowBidModal(false);
                  setBidAmount("");
                }}
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePlaceBid}
                disabled={isPlacingBid}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPlacingBid ? "Placing..." : "Place Bid"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Format time remaining until auction end
 */
function formatTimeRemaining(endTime) {
  const now = new Date();
  const end = new Date(endTime);
  const diff = end - now;

  if (diff <= 0) return "Ended";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

