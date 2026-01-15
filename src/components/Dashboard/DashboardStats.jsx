import React from "react";

const STATUS_KEYS = ["ACTIVE", "PENDING", "SOLD"];

const normalizeStatus = (status) => {
  if (!status) return "";
  return status.toString().trim().toUpperCase();
};

export default function DashboardStats({ listings = [] }) {
  const counts = listings.reduce(
    (acc, listing) => {
      const normalized = normalizeStatus(listing.status);
      if (STATUS_KEYS.includes(normalized)) {
        acc[normalized] += 1;
      }
      return acc;
    },
    {
      ACTIVE: 0,
      PENDING: 0,
      SOLD: 0,
    }
  );

  const stats = [
    { label: "Total Listings", value: listings.length },
    { label: "Active Listings", value: counts.ACTIVE },
    { label: "Pending Review", value: counts.PENDING },
    { label: "Sold Items", value: counts.SOLD },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div key={stat.label} className="p-4 bg-white rounded shadow">
          <p className="text-sm font-medium text-gray-500">{stat.label}</p>
          <p className="text-2xl font-semibold">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}

