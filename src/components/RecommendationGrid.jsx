// src/components/RecommendationGrid.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllBikes } from "../store/services/bikeServices";

export default function RecommendationGrid() {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setLoading(true);
        const data = await getAllBikes();
        if (!isMounted) return;
        setBikes(data.slice(0, 8)); // show top 8 bikes on home
      } catch (err) {
        console.error("Failed to load recommended bikes", err);
        if (!isMounted) return;
        setBikes([]);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="container mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6">Fresh bike recommendations</h2>

      {loading ? (
        <p className="text-gray-600">Loading bikes...</p>
      ) : bikes.length === 0 ? (
        <p className="text-gray-500">No bikes available right now.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bikes.map((bike) => {
            const imageUrl =
              bike.images?.[0]?.image_link ||
              "https://via.placeholder.com/350x230?text=No+Image";

            return (
              <div
                key={bike.bike_id}
                className="relative border rounded-lg overflow-hidden bg-white hover:shadow-2xl transition-transform transform hover:-translate-y-2"
              >
                <img
                  src={imageUrl}
                  alt={`${bike.brand} ${bike.model}`}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <p className="text-xl font-semibold text-blue-600">
                    ₹ {bike.prize?.toLocaleString()}
                  </p>
                  <h3 className="mt-1 text-lg font-medium">
                    {bike.brand} {bike.model}
                  </h3>
                  <p className="text-gray-500 mt-1 text-sm">
                    {bike.manufactureYear || "Year N/A"} •{" "}
                    {bike.kilometersDriven
                      ? `${bike.kilometersDriven} km`
                      : "KMs N/A"}
                  </p>
                </div>
                <div className="absolute top-2 right-2 bg-white rounded-full p-2 shadow text-xs">
                  ♡
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-8 text-center">
        {/* <Link
          to="/buy/bikes"
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          View All Bikes
        </Link> */}
      </div>
    </section>
  );
}
