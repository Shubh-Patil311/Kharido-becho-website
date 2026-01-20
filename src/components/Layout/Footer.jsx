import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="font-bold text-xl">KB</span>
              </div>
              <h2 className="text-2xl font-bold">
                Kharido<span className="text-green-400">Bhecho</span>
              </h2>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Your trusted marketplace for buying and selling second-hand items.
            </p>
            <div className="flex space-x-3">
              <a
                href="#"
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
              >
                <FaFacebookF className="text-sm" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
              >
                <FaTwitter className="text-sm" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
              >
                <FaInstagram className="text-sm" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
              >
                <FaLinkedinIn className="text-sm" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-700">
              Categories
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/buy/laptops"
                  className="text-gray-400 hover:text-green-400 transition-colors block"
                >
                  Laptops
                </Link>
              </li>
              <li>
                <Link
                  to="/buy/bikes"
                  className="text-gray-400 hover:text-green-400 transition-colors block"
                >
                  Bikes
                </Link>
              </li>
              <li>
                <Link
                  to="/buy/mobiles"
                  className="text-gray-400 hover:text-green-400 transition-colors block"
                >
                  Mobiles
                </Link>
              </li>
              <li>
                <Link
                  to="/buy/cars"
                  className="text-gray-400 hover:text-green-400 transition-colors block"
                >
                  Cars
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-700">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-green-400 transition-colors block"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/sell"
                  className="text-gray-400 hover:text-green-400 transition-colors block"
                >
                  Sell Item
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-green-400 transition-colors block"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-green-400 transition-colors block"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-700">
              Contact Us
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-green-500 mt-1" />
                <span className="text-gray-400 text-sm">
                  123 Market Street, City, State 400001
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhone className="text-green-500" />
                <a
                  href="tel:+911800123456"
                  className="text-gray-400 hover:text-green-400 transition-colors text-sm"
                >
                  +91 1800-123-456
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-green-500" />
                <a
                  href="mailto:contact@kharidobhecho.com"
                  className="text-gray-400 hover:text-green-400 transition-colors text-sm"
                >
                  contact@kharidobhecho.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Copyright Section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {currentYear} Kharido Bhecho. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <Link
              to="/privacy"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="/faq"
              className="text-gray-400 hover:text-white transition-colors"
            >
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
