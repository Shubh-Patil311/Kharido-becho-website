import { FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
export default function BikeCard({ bike }) {
  const navigate = useNavigate();

  const imageUrl =
    bike.bikePhotos?.[0]?.photo_link ||
    bike.images?.[0]?.image_link ||
    bike.image ||
    "https://via.placeholder.com/350x230?text=No+Image";

  // Prevent default action (scrolling) and navigate
  const handleViewDetails = (e) => {
    e.preventDefault(); // Prevent default scrolling behavior
    navigate(`/buy/bikes/${bike.bike_id}`);
  };

  return (
    <div
      onClick={handleViewDetails}
      className="bg-white rounded-xl shadow hover:shadow-xl transition p-3 cursor-pointer"
    >
      {/* Image */}
      <div className="relative w-full h-48 rounded-lg overflow-hidden">
        <img
          src={imageUrl}
          alt={`${bike.brand} ${bike.model}`}
          className="w-full h-full object-cover"
        />

        {/* Heart Icon (no navigation when clicked) */}
        <button
          onClick={(e) => e.stopPropagation()}  // Prevent click event from bubbling
          className="absolute top-2 right-2 bg-white p-1 rounded-full shadow"
        >
          <FaRegHeart size={18} />
        </button>

        {/* Featured Badge */}
        {bike?.featured && (
          <span className="absolute bottom-2 left-2 text-[11px] font-bold px-2 py-0.5 rounded-full bg-yellow-300">
            FEATURED
          </span>
        )}

        {/* Sold Badge */}
        {bike?.status === "SOLD" && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold text-xl border-2 border-white px-4 py-1 rounded bg-red-600/80 transform -rotate-12">
              SOLD
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mt-3">
        <p className="text-xl font-bold text-gray-800">
          ₹ {bike.prize?.toLocaleString()}
        </p>

        <p className="text-gray-600 text-sm">
          {bike.manufactureYear || "N/A"} • {bike.kilometersDriven ? `${bike.kilometersDriven} km` : "0 km"}
        </p>

        <h2 className="text-md font-semibold mt-1">
          {bike.brand} {bike.model}
        </h2>

        <p className="text-gray-500 text-sm">
          {bike.address || bike.city || bike.location || "Location N/A"}
        </p>
      </div >

      <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
        <span>{bike.city || bike.state || "India"}</span>
        <span>{bike.date || "Jun 12"}</span>
      </div>

      {/* View Details (still works separately) */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent event bubbling
          handleViewDetails(e);  // Call the updated handleViewDetails
        }}
        className="w-full mt-3 py-2 bg-indigo-600 text-white font-semibold text-sm rounded-lg hover:bg-indigo-700"
      >
        View Details
      </button>
    </div >
  );
}




