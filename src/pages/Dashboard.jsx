// src/pages/Dashboard.jsx
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../services/api";

function Dashboard() {
  const { user, token, logout } = useAuth();
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [userListings, setUserListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      loadVerificationStatus();
      loadUserListings();
    }
  }, [token]);

  const loadVerificationStatus = async () => {
    const status = await api.verificationStatus(token);
    setVerificationStatus(status);
  };

  const loadUserListings = async () => {
    setLoading(true);
    // You'll need to add this endpoint to your backend
    const response = await fetch(
      "http://localhost:5000/api/listings/my-listings",
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const data = await response.json();
    setUserListings(data.listings || []);
    setLoading(false);
  };

  const isVerified = verificationStatus?.is_verified || user?.is_verified;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        <div className="border-t pt-4">
          <h2 className="text-xl font-semibold mb-4">Welcome, {user?.name}!</h2>

          {/* Verification Status */}
          {isVerified ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-green-800 flex items-center gap-2">
                <span>✅</span> Phone number verified! You can post listings.
              </p>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-yellow-800 flex items-center gap-2">
                <span>⚠️</span> Phone number not verified. You cannot post
                listings until you verify your phone.
              </p>
              <Link
                to="/verify"
                className="inline-block mt-2 text-blue-600 hover:text-blue-800"
              >
                Click here to verify your phone →
              </Link>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Quick Actions</h3>
              {isVerified ? (
                <Link
                  to="/create-listing"
                  className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Post New Listing
                </Link>
              ) : (
                <button
                  disabled
                  className="w-full bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed"
                  title="Verify your phone first"
                >
                  Post New Listing (Verify First)
                </button>
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Your Stats</h3>
              <p className="text-gray-600">
                Total Listings: {userListings.length}
              </p>
            </div>
          </div>

          {/* User's Listings */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Your Listings</h3>
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : userListings.length === 0 ? (
              <p className="text-gray-500">
                You haven't posted any listings yet.
              </p>
            ) : (
              <div className="space-y-4">
                {userListings.map((listing) => (
                  <div
                    key={listing.id}
                    className="border rounded-lg p-4 flex justify-between items-center"
                  >
                    <div>
                      <h4 className="font-semibold">{listing.title}</h4>
                      <p className="text-sm text-gray-600">
                        {listing.location}
                      </p>
                      {listing.is_taken && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                          TAKEN
                        </span>
                      )}
                    </div>
                    <Link
                      to={`/listing/${listing.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
