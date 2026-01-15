import { FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function MobileCard({ mobile }) {
    const navigate = useNavigate();

    const imageUrl =
        mobile?.images?.length > 0
            ? mobile.images[0].imageUrl
            : "https://via.placeholder.com/300x200?text=No+Image";


    const handleViewDetails = (e) => {
        e.preventDefault();
        navigate(`/mobile/${mobile.mobileId || mobile.id}`);
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
                    alt={`${mobile.brand} ${mobile.model}`}
                    className="w-full h-full object-cover"
                />



                {mobile?.featured && (
                    <span className="absolute bottom-2 left-2 text-[11px] font-bold px-2 py-0.5 rounded-full bg-yellow-300">
                        FEATURED
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="mt-3">
                <p className="text-xl font-bold text-gray-800">
                    ₹ {mobile.price?.toLocaleString()}
                </p>

                <p className="text-gray-600 text-sm">
                    {mobile.condition || "Good"} • {mobile.yearOfPurchase || "2025"}
                </p>

                <h2 className="text-md font-semibold mt-1">
                    {mobile.brand} {mobile.model}
                </h2>

                <p className="text-gray-500 text-sm">
                    {mobile.location || "Somwar Peth"}
                </p>
            </div>

            <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                <span>{mobile.location || "Somwar Peth"}</span>
                <span>{mobile.date || "Jun 12"}</span>
            </div>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetails(e);
                }}
                className="w-full mt-3 py-2 bg-gradient-to-r from-indigo-600 to-purple-500 text-white font-semibold text-sm rounded-lg hover:bg-indigo-700"
            >
                View Details
            </button>
        </div>
    );
}
