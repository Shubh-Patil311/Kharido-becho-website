import React, { useEffect, useState } from "react";
import { getAllCars } from "../../../store/services/carServices";
import { useNavigate } from "react-router-dom";

export default function BuyCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    try {
      setLoading(true);
      const data = await getAllCars(0, 100);
      setCars(data || []);
    } catch (err) {
      console.error("Failed to load cars", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-2">Browse Cars</h2>
      <p className="text-gray-600 mb-6">
        Find your perfect car from our wide range of listings.
      </p>

      {loading ? (
        <p className="text-gray-700 text-lg">Loading cars...</p>
      ) : cars.length === 0 ? (
        <p className="text-gray-600">No cars available right now.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cars.map((car) => (
            <CarCard key={car.carId || car._id || car.id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
}

function fallbackDataUrl() {
  return (
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="350" height="230">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9ca3af" font-family="Arial" font-size="20">No Image</text>
    </svg>`
    )
  );
}

function getImageUrl(car) {
  if (!car) return fallbackDataUrl();
  if (Array.isArray(car.images) && car.images.length > 0) {
    const first = car.images[0];
    if (typeof first === "string") return first;
    if (first && (first.imageUrl || first.url))
      return first.imageUrl || first.url;
  }
  if (car.image) return car.image;
  return fallbackDataUrl();
}

function CarCard({ car }) {
  const navigate = useNavigate();
  const imageUrl = getImageUrl(car);

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition p-3">
      <div className="w-full h-44 rounded-md overflow-hidden">
        <img
          src={imageUrl}
          alt={car.model || `${car.brand} ${car.model}`}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="mt-3 space-y-1">
        <h3 className="text-lg font-semibold">{car.title}</h3>

        {car.variant && <p className="text-gray-600 text-sm">{car.variant}</p>}

        <p className="text-gray-600 text-sm">
          {car.yearOfPurchase || car.manufactureYear || "Year N/A"} •{" "}
          {car.fuelType || "-"}
        </p>

        <p className="text-green-600 font-bold text-lg">
          ₹ {Number(car.price || 0).toLocaleString()}
        </p>
      </div>

      <button
        onClick={() => navigate(`/buy/cars/${car.carId}`)}
        className="w-full mt-3 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700"
      >
        View Details
      </button>
    </div>
  );
}
