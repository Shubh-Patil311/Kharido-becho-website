import React from "react";
import { bookingStatuses, statusStyles } from "../../constants/bookingConstants";

const ChatListItem = ({ title, subtitle, status, onClick, tag }) => {
    return (
        <div
            onClick={onClick}
            className="bg-white border rounded-lg p-4 cursor-pointer hover:bg-gray-50 flex justify-between items-center transition-colors shadow-sm"
        >
            <div>
                <h2 className="font-semibold text-gray-900">{title}</h2>
                <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
                <div className="mt-2">
                    <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusStyles[status] ||
                            "bg-gray-100 text-gray-600 border-gray-200"
                            }`}
                    >
                        {bookingStatuses[status] || status || "Unknown"}
                    </span>
                </div>
            </div>
            {tag && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-gray-200 text-gray-700">
                    {tag}
                </span>
            )}
        </div>
    );
};

export default ChatListItem;
