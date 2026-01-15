// src/pages/Services.jsx
import React from 'react';

export default function Services() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h2 className="text-4xl font-bold mb-6">Our Services</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="p-6 border rounded-lg hover:shadow-lg transition">
          <h3 className="text-2xl font-semibold mb-3">Buy Vehicles & Electronics</h3>
          <p className="text-gray-700">
            Browse listings of cars, bikes, mobiles and laptops with smart filters to find exactly what you’re looking for.
          </p>
        </div>

        <div className="p-6 border rounded-lg hover:shadow-lg transition">
          <h3 className="text-2xl font-semibold mb-3">Sell Your Item Easily</h3>
          <p className="text-gray-700">
            Create a listing in minutes—upload images, provide specs and connect directly with buyers.
          </p>
        </div>

        <div className="p-6 border rounded-lg hover:shadow-lg transition">
          <h3 className="text-2xl font-semibold mb-3">Advanced Filtering & Alerts</h3>
          <p className="text-gray-700">
            Use detailed filters by brand, model, year (for vehicles), specs (for electronics), and get notified when matching items are listed.
          </p>
        </div>

        <div className="p-6 border rounded-lg hover:shadow-lg transition">
          <h3 className="text-2xl font-semibold mb-3">Secure Communication</h3>
          <p className="text-gray-700">
            Connect safely with buyers or sellers through our platform, keeping your personal information secure.
          </p>
        </div>

        <div className="p-6 border rounded-lg hover:shadow-lg transition">
          <h3 className="text-2xl font-semibold mb-3">Responsive Support</h3>
          <p className="text-gray-700">
            Our team is here to assist you with listing management, resolving issues and ensuring smooth transactions.
          </p>
        </div>

        <div className="p-6 border rounded-lg hover:shadow-lg transition">
          <h3 className="text-2xl font-semibold mb-3">Mobile-Friendly Experience</h3>
          <p className="text-gray-700">
            Access our marketplace on any device—list, browse or buy on the go.
          </p>
        </div>
      </div>
    </div>
  );
}
