// src/components/Profile.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";  // your auth context
import { fetchBuyerInfo, fetchSellerInfo } from "../store/services/authServices";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { authState, hasRole, logout } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      if (hasRole("BUYER")) {
        const data = await fetchBuyerInfo(authState.userId);
        setProfileData({ role: "BUYER", ...data });
      } else if (hasRole("SELLER")) {
        const data = await fetchSellerInfo(authState.userId);
        setProfileData({ role: "SELLER", ...data });
      } else {
        // guest or unknown — maybe redirect to login or show minimal info
        setProfileData({ role: "GUEST" });
      }
      setLoading(false);
    };

    loadProfile();
  }, [authState, hasRole]);

  if (loading) return <div>Loading profile...</div>;

  if (!authState.token) {
    // user not logged in — redirect to login or show message
    return (
      <div className="p-4">
        <p>You are not logged in.</p>
        <button onClick={() => navigate("/login")}>Login</button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Your Profile</h2>

      <div className="mb-4">
        <strong>Role:</strong> {profileData.role}
      </div>

      {profileData.role === "BUYER" && (
        <div>
          <div className="mb-2"><strong>Name:</strong> {profileData.name}</div>
          <div className="mb-2"><strong>Email:</strong> {profileData.email}</div>
          <div className="mb-2"><strong>Buyer ID:</strong> {profileData.userId || authState.userId}</div>
          {/* add more buyer-specific info as per your API response */}
        </div>
      )}

      {profileData.role === "SELLER" && (
        <div>
          <div className="mb-2"><strong>Shop Name:</strong> {profileData.shopName}</div>
          <div className="mb-2"><strong>Email:</strong> {profileData.email}</div>
          <div className="mb-2"><strong>Seller ID:</strong> {profileData.sellerId || authState.sellerId}</div>
          {/* add more seller-specific info */}
        </div>
      )}

      <div className="mt-6 flex space-x-4">
        <button
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          Logout
        </button>
        {/* you may also add “Edit Profile” button if needed */}
      </div>
    </div>
  );
};

export default Profile;
