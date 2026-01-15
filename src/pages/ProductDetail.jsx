/**
 * ProductDetail Component
 *
 * Example product detail page demonstrating role-based access control:
 *
 * - GUEST: Can view product details, but "Buy Now" / "View Detail Price" buttons
 *   redirect to buyer login page
 *
 * - BUYER: Can view product details and proceed to buy (buttons are enabled)
 *
 * - SELLER: Can view product details, but buy actions are disabled/redirected
 *   (sellers shouldn't buy products, they sell them)
 *
 * This component uses useAuth to check user role and conditionally render
 * buy actions based on role.
 */

import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { getBikeById } from "../store/services/bikeServices";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isSignedIn, roles } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Determine user role
  const isGuest = !isSignedIn;
  const isBuyer = roles.includes("BUYER") || roles.includes("USER");
  const isSeller = roles.includes("SELLER");

  // Load product details
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        // Example: Loading a bike by ID
        // In a real app, you'd have a generic product service or determine product type
        const data = await getBikeById(id);
        setProduct(data);
      } catch (err) {
        console.error("Failed to load product", err);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  /**
   * Handle "Buy Now" button click
   *
   * Role-based behavior:
   * - GUEST: Redirect to buyer login with return URL
   * - BUYER: Proceed to checkout/purchase flow
   * - SELLER: Show message that sellers can't buy (or redirect to dashboard)
   */
  const handleBuyNow = () => {
    if (isGuest) {
      // Guest: Redirect to login with return URL so they come back after login
      const returnUrl = `/product/${id}`;
      navigate(`/login?redirect=${encodeURIComponent(returnUrl)}`, {
        state: { message: "Please login as a buyer to purchase this product" },
      });
      toast.info("Please login as a buyer to purchase products");
      return;
    }

    if (isSeller) {
      // Seller: Can't buy products (they sell them)
      toast.info("Sellers cannot purchase products. Please login as a buyer.");
      navigate("/dashboard");
      return;
    }

    if (isBuyer) {
      // Buyer: Proceed to checkout
      navigate(`/checkout/${id}`);
      toast.success("Proceeding to checkout...");
    }
  };

  /**
   * Handle "View Detail Price" or "Contact Seller" button
   *
   * Similar role-based logic as Buy Now
   */
  const handleViewPrice = () => {
    if (isGuest) {
      navigate(`/login?redirect=${encodeURIComponent(`/product/${id}`)}`, {
        state: { message: "Please login as a buyer to view pricing details" },
      });
      toast.info("Please login to view pricing details");
      return;
    }

    if (isSeller) {
      toast.info("Sellers cannot view buyer pricing. Please login as a buyer.");
      return;
    }

    if (isBuyer) {
      // Show price details or open chat with seller
      toast.success("Price details displayed");
      // Could navigate to chat: navigate(`/buyer/chat?productId=${id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Product not found</p>
      </div>
    );
  }

  // Get product image (handle different product types)
  const imageUrl =
    product.images?.[0]?.image_link ||
    product.image ||
    "https://via.placeholder.com/400x300?text=No+Image";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Product Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid md:grid-cols-2 gap-6 p-6">
            {/* Product Image */}
            <div>
              <img
                src={imageUrl}
                alt={product.brand || product.title || "Product"}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {product.brand} {product.model || product.title}
              </h1>
              {product.variant && (
                <p className="text-gray-600 mb-4">Variant: {product.variant}</p>
              )}

              {/* Price Section - Role-based visibility */}
              {isBuyer ? (
                <div className="mb-6">
                  <p className="text-2xl font-bold text-green-600">
                    ₹{" "}
                    {product.prize?.toLocaleString() ||
                      product.price?.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Final price (buyer only)
                  </p>
                </div>
              ) : (
                <div className="mb-6">
                  <p className="text-lg text-gray-500">
                    {isGuest
                      ? "Login to view price"
                      : "Price available for buyers only"}
                  </p>
                </div>
              )}

              {/* Action Buttons - Role-based behavior */}
              <div className="space-y-3">
                {/* Buy Now Button */}
                <button
                  onClick={handleBuyNow}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition ${
                    isBuyer
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                  disabled={!isBuyer}
                  title={
                    isGuest
                      ? "Login as buyer to purchase"
                      : isSeller
                      ? "Sellers cannot buy products"
                      : "Buy Now"
                  }
                >
                  {isGuest
                    ? "Login to Buy"
                    : isSeller
                    ? "Sellers Can't Buy"
                    : "Buy Now"}
                </button>

                {/* View Price / Contact Seller Button */}
                <button
                  onClick={handleViewPrice}
                  className={`w-full py-3 px-6 rounded-lg font-semibold border-2 transition ${
                    isBuyer
                      ? "border-blue-600 text-blue-600 hover:bg-blue-50"
                      : "border-gray-300 text-gray-600"
                  }`}
                  disabled={!isBuyer}
                  title={
                    isGuest
                      ? "Login to view pricing"
                      : isSeller
                      ? "Sellers cannot view buyer pricing"
                      : "View Price Details"
                  }
                >
                  {isGuest
                    ? "Login to View Price"
                    : isSeller
                    ? "Price for Buyers Only"
                    : "View Price Details"}
                </button>
              </div>

              {/* Role indicator (for debugging/demo) */}
              <div className="mt-4 text-xs text-gray-500">
                Current role:{" "}
                {isGuest
                  ? "Guest"
                  : isBuyer
                  ? "Buyer"
                  : isSeller
                  ? "Seller"
                  : "Unknown"}
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Product Details</h2>

          <div className="grid md:grid-cols-2 gap-4">
            {product.manufactureYear && (
              <div>
                <span className="font-semibold">Year: </span>
                <span>{product.manufactureYear}</span>
              </div>
            )}
            {product.kilometersDriven && (
              <div>
                <span className="font-semibold">Kilometers: </span>
                <span>{product.kilometersDriven.toLocaleString()} km</span>
              </div>
            )}
            {product.fuelType && (
              <div>
                <span className="font-semibold">Fuel Type: </span>
                <span>{product.fuelType}</span>
              </div>
            )}
            {product.color && (
              <div>
                <span className="font-semibold">Color: </span>
                <span>{product.color}</span>
              </div>
            )}
          </div>

          {product.description && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-700">{product.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
