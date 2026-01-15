import React from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

const fallbackDate = (value) => {
  if (!value) return "--";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "--" : date.toLocaleDateString("en-IN");
};

const formatStatus = (status = "") =>
  status
    .toString()
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase()) || "--";

const formatPrice = (value) => {
  if (value === undefined || value === null || value === "") return "--";
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return value;
  return numeric.toLocaleString("en-IN");
};

export default function MyListings({ listings = [], onDelete, onEdit }) {
  if (!listings.length) {
    return <p className="text-gray-600">No listings found.</p>;
  }

  const handleDelete = (listing) => {
    if (typeof onDelete === "function") {
      onDelete(listing);
    }
  };

  const handleEdit = (listing) => {
    if (typeof onEdit === "function") {
      onEdit(listing);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="px-4 py-2 border-b text-left">ID</th>
            <th className="px-4 py-2 border-b text-left">Title</th>
            <th className="px-4 py-2 border-b text-left">Category</th>
            <th className="px-4 py-2 border-b text-left">Price (₹)</th>
            <th className="px-4 py-2 border-b text-left">Status</th>
            <th className="px-4 py-2 border-b text-left">Listed At</th>
            <th className="px-4 py-2 border-b text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {listings.map((item) => {
            const safeId = item.id ?? item.laptopId ?? item.productId;
            const title =
              item.title ||
              [item.brand, item.model].filter(Boolean).join(" ").trim() ||
              "Untitled";
            const category = item.category || "Laptops";
            const subCategory =
              item.subCategory || item.series || item.type || "General";
            const status = formatStatus(item.status);
            const createdAt =
              item.createdAt ||
              item.createdDate ||
              item.created_on ||
              item.postedAt;

            return (
              <tr key={safeId || title} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{safeId || "-"}</td>
                <td className="px-4 py-2 border-b">{title}</td>
                <td className="px-4 py-2 border-b">
                  {category} → {subCategory}
                </td>
                <td className="px-4 py-2 border-b">
                  {formatPrice(item.price ?? item.expectedPrice)}
                </td>
                <td className="px-4 py-2 border-b">{status}</td>
                <td className="px-4 py-2 border-b">
                  {fallbackDate(createdAt)}
                </td>
                <td className="px-4 py-2 border-b space-x-3">
                  {onEdit && (
                    <button
                      type="button"
                      onClick={() => handleEdit(item)}
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
                    >
                      <FiEdit2 className="h-4 w-4" /> Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 transition"
                    >
                      <FiTrash2 className="h-4 w-4" /> Delete
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
