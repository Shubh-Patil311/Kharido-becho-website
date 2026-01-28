import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MdSearch,
  MdDirectionsCar,
  MdTwoWheeler,
  MdPhoneIphone,
  MdLaptop,
  MdStorefront,
  MdArrowForward,
  MdVerified,
  MdLocalShipping,
  MdSecurity,
  MdTrendingUp,
  MdGavel,
} from "react-icons/md";
import RecommendationGrid from "../components/RecommendationGrid";

export default function Home() {
  const navigate = useNavigate();

  const categories = [
    {
      icon: <MdDirectionsCar />,
      label: "Cars",
      count: "2,345+",
      bgColor: "from-blue-500 to-blue-600",
      path: "/buy/cars",
      banner:
        "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    },
    {
      icon: <MdTwoWheeler />,
      label: "Bikes",
      count: "1,890+",
      bgColor: "from-green-500 to-teal-600",
      path: "/buy/bikes",
      banner:
        "https://images.unsplash.com/photo-1558981806-ec527fa84c39?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    },
    {
      icon: <MdPhoneIphone />,
      label: "Mobiles",
      count: "4,567+",
      bgColor: "from-purple-500 to-pink-600",
      path: "/buy/mobiles",
      banner:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    },
    {
      icon: <MdLaptop />,
      label: "Laptops",
      count: "3,210+",
      bgColor: "from-orange-500 to-red-600",
      path: "/buy/laptops",
      banner:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    },
    {
      icon: <MdGavel />,
      label: "🔴 Live Auctions",
      count: "Live Now",
      bgColor: "from-red-500 to-pink-600",
      path: "/buy/products",
      banner:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    },
  ];

  const features = [
    {
      icon: <MdVerified className="text-3xl text-green-600" />,
      title: "Verified Listings",
      description: "All products undergo quality checks and verification",
    },
    {
      icon: <MdSecurity className="text-3xl text-blue-600" />,
      title: "Secure Transactions",
      description: "Safe payment methods and buyer protection",
    },
    {
      icon: <MdLocalShipping className="text-3xl text-purple-600" />,
      title: "Easy Delivery",
      description: "Doorstep delivery across major cities",
    },
    {
      icon: <MdTrendingUp className="text-3xl text-orange-600" />,
      title: "Best Prices",
      description: "Great deals and price negotiation options",
    },
  ];

  const popularSearches = [
    "iPhone 15",
    "MacBook Air",
    "Honda Activa",
    "Maruti Swift",
    "Samsung S24",
    "Dell Laptop",
    "Royal Enfield",
    "Hyundai Creta",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Banner */}
      <div className="relative bg-gradient-to-br from-blue-900/90 to-teal-800/90 text-white overflow-hidden">
        {/* Background Banner Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')",
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/70 to-teal-500/70"></div>

        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            {/* Brand */}
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mr-3">
                <MdStorefront className="text-2xl" />
              </div>
              <div className="text-left">
                <h1 className="text-4xl md:text-5xl font-bold">
                  Kharido<span className="text-blue-100">Becho</span>
                </h1>
                <p className="text-blue-100 text-sm">
                  Your Trusted Marketplace
                </p>
              </div>
            </div>

            {/* Main Heading */}
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Buy & Sell <span className="text-yellow-300">Anything</span>
              <br />
              <span className="text-2xl md:text-3xl">
                Vehicles & Electronics
              </span>
            </h2>

            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              India's fastest growing marketplace for pre-owned cars, bikes,
              mobiles, and laptops
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MdSearch className="text-gray-400 text-xl" />
                </div>
                <input
                  type="text"
                  placeholder="Search for cars, bikes, mobiles, laptops..."
                  className="w-full pl-12 pr-32 py-4 rounded-xl text-gray-800 text-lg focus:outline-none focus:ring-3 focus:ring-blue-300 shadow-lg"
                />
                <div className="absolute inset-y-0 right-0 flex">
                  <select className="px-4 bg-gray-100 text-gray-700 border-l border-gray-300 rounded-r-xl focus:outline-none">
                    <option value="all">All Categories</option>
                    <option value="cars">Cars</option>
                    <option value="bikes">Bikes</option>
                    <option value="mobiles">Mobiles</option>
                    <option value="laptops">Laptops</option>
                  </select>
                  <button className="px-8 bg-gradient-to-r from-blue-700 to-teal-600 text-white rounded-xl ml-2 mr-2 hover:opacity-90 transition">
                    Search
                  </button>
                </div>
              </div>

              {/* Popular Searches */}
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <span className="text-blue-100 text-sm">Popular:</span>
                {popularSearches.slice(0, 4).map((search, idx) => (
                  <button
                    key={idx}
                    className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm hover:bg-white/30 transition"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/register")}
                className="px-8 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-100 transition shadow-lg flex items-center justify-center"
              >
                Start Selling
                <MdArrowForward className="ml-2" />
              </button>
              <button
                onClick={() => navigate("/buy/products")}
                className="px-8 py-3 bg-blue-800 text-white rounded-xl font-semibold hover:bg-blue-900 transition shadow-lg border border-blue-700"
              >
                Browse Products
              </button>
              {/* <button
                onClick={() => navigate("/buy/products")}
                className="px-8 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition shadow-lg border border-red-500 flex items-center justify-center"
              >
                🔴 Live Auctions
              </button> */}
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section with Banner Images */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Shop by Category
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore thousands of verified products across different categories
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {categories.map((category, idx) => (
            <Link
              key={idx}
              to={category.path}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Category Banner Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={category.banner}
                  alt={category.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${category.bgColor}/80 from-transparent`}
                ></div>

                {/* Category Icon */}
                <div
                  className={`absolute top-4 right-4 w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center`}
                >
                  <div className="text-white text-2xl">{category.icon}</div>
                </div>

                {/* Category Title */}
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold">{category.label}</h3>
                  <p className="text-sm opacity-90">
                    {category.count} listings
                  </p>
                </div>
              </div>

              {/* View Button */}
              <div className="bg-white p-4">
                <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700 justify-center">
                  <span>Browse {category.label}</span>
                  <MdArrowForward className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Recommendations Section */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Fresh Recommendations
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Handpicked products based on trending searches and user
              preferences
            </p>
          </div>

          {/* Imported RecommendationGrid Component */}
          <RecommendationGrid />

          <div className="text-center mt-10">
            <button
              onClick={() => navigate("/buy/laptops")}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-lg font-semibold hover:opacity-90 transition"
            >
              View All Products
              <MdArrowForward className="ml-2" />
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Why Choose KharidoBecho?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We make buying and selling simple, safe, and rewarding
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-lg transition"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Banner Ad Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="relative rounded-2xl overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1607082350899-7e105aa886ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')",
            }}
          />
          <div className="relative bg-gradient-to-r from-blue-900/80 to-teal-800/80 py-12 px-8 md:px-16">
            <div className="max-w-2xl">
              <h3 className="text-3xl font-bold text-white mb-4">
                Start Selling Today!
              </h3>
              <p className="text-blue-100 mb-6">
                List your products for free and reach thousands of potential
                buyers. Complete seller verification for better visibility.
              </p>
              <button
                onClick={() => navigate("/register")}
                className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Become a Seller
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-blue-700 to-teal-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">50,000+</div>
              <div className="text-blue-100">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">12,000+</div>
              <div className="text-blue-100">Verified Sellers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">75,000+</div>
              <div className="text-blue-100">Products Sold</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">200+</div>
              <div className="text-blue-100">Cities Served</div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-teal-500 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Trading?</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied buyers and sellers on India's fastest
            growing marketplace
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/register")}
              className="px-8 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-100 transition"
            >
              Create Free Account
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-3 bg-blue-800 text-white rounded-xl font-semibold hover:bg-blue-900 transition border border-blue-700"
            >
              Sign In to Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
