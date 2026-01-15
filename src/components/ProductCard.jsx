import { useState, useMemo } from "react";

export default function ProductCard({ product = {} }) {
  const [showModal, setShowModal] = useState(false);

  const priceLabel = useMemo(() => {
    if (product.price === undefined || product.price === null || product.price === "") {
      return "Price on request";
    }

    if (typeof product.price === "number") {
      return `₹${product.price.toLocaleString("en-IN")}`;
    }

    const numeric = Number(product.price);
    if (!Number.isNaN(numeric)) {
      return `₹${numeric.toLocaleString("en-IN")}`;
    }

    return product.price;
  }, [product.price]);

  const detailItems = useMemo(
    () =>
      [
        { label: "Brand", value: product.brand },
        { label: "Model", value: product.model || product.variant || product.subCategory },
        { label: "Category", value: product.category || product.type },
        {
          label: "Condition",
          value: product.condition || product.status,
        },
        {
          label: "Location",
          value: product.city || product.location || product.address,
        },
        { label: "Seller", value: product.sellerName || product.ownerName },
        { label: "Delivery", value: product.deliveryType },
      ].filter((item) => item.value),
    [
      product.brand,
      product.model,
      product.variant,
      product.subCategory,
      product.category,
      product.type,
      product.condition,
      product.status,
      product.city,
      product.location,
      product.address,
      product.sellerName,
      product.ownerName,
      product.deliveryType,
    ]
  );

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={openModal}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openModal();
          }
        }}
        className="border rounded-lg overflow-hidden bg-white hover:shadow-2xl transform hover:-translate-y-2 transition duration-300 ease-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <div className="relative">
          <img
            src={product.image || product.thumbnail || "https://via.placeholder.com/400x300?text=No+Image"}
            alt={product.title || product.model || "Product"}
            className="w-full h-48 object-cover"
          />
          <span className="absolute top-2 left-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded-md">
            View Details
          </span>
        </div>

        <div className="p-4 space-y-2">
          <h3 className="text-lg font-semibold truncate">{product.title || product.model || "Untitled product"}</h3>
          <p className="text-gray-500 text-sm">
            {[product.brand, product.subCategory || product.category]
              .filter(Boolean)
              .join(" • ")}
          </p>
          <p className="text-blue-600 font-bold mt-2">{priceLabel}</p>
          <p className="text-xs text-gray-400">Click to see full specifications</p>
        </div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-40 px-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <div>
                <h2 className="text-xl font-semibold">{product.title || product.model || "Product details"}</h2>
                <p className="text-sm text-gray-500">{priceLabel}</p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                aria-label="Close details"
              >
                ×
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6 p-6">
              <img
                src={product.image || product.thumbnail || "https://via.placeholder.com/400x300?text=No+Image"}
                alt={product.title || product.model || "Product preview"}
                className="w-full h-60 object-cover rounded-lg border"
              />

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Key Information</h3>
                  <ul className="space-y-1 text-sm">
                    {detailItems.length > 0 ? (
                      detailItems.map((item) => (
                        <li key={item.label} className="flex justify-between gap-4">
                          <span className="text-gray-500">{item.label}</span>
                          <span className="font-medium text-right">{item.value}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-500">No additional details provided.</li>
                    )}
                  </ul>
                </div>

                {product.description && (
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Description</h3>
                    <p className="text-sm text-gray-600">{product.description}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 flex flex-wrap gap-3 justify-end border-t">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                onClick={closeModal}
              >
                Close
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                onClick={() => setShowModal(false)}
              >
                Book / Contact Seller
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}