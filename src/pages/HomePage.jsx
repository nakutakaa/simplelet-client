// src/pages/HomePage.jsx
import { useState, useEffect } from "react";
import api from "../services/api";

function HomePage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [houseTypes, setHouseTypes] = useState([]);
  const [filters, setFilters] = useState({ house_type: "", location: "" });

  useEffect(() => {
    // Fetch house types
    api.getHouseTypes().then((data) => {
      setHouseTypes(data.house_types || []);
    });

    // Fetch listings
    loadListings();
  }, []);

  const loadListings = async () => {
    setLoading(true);
    const data = await api.getListings(filters);
    setListings(data.listings || []);
    setLoading(false);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    loadListings();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading listings...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Filters Section */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex gap-4 flex-wrap">
          <select
            name="house_type"
            value={filters.house_type}
            onChange={handleFilterChange}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            {houseTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="location"
            placeholder="Search location..."
            value={filters.location}
            onChange={handleFilterChange}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />

          <button
            onClick={applyFilters}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Search
          </button>
        </div>
      </div>

      {/* Listings Grid */}
      {listings.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No listings found. Check back later!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}

// Listing Card Component
function ListingCard({ listing }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <div className="relative h-48 bg-gray-200">
        {listing.cover_image ? (
          <img
            src={listing.cover_image}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No Image
          </div>
        )}
        {listing.is_taken && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
            TAKEN
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="text-sm text-gray-500 mb-1">
          {listing.house_type_display}
        </div>
        <h3 className="font-semibold text-lg mb-1 truncate">{listing.title}</h3>
        <div className="text-gray-600 text-sm mb-2 truncate">
          {listing.location}
        </div>
        {listing.price && (
          <div className="text-xl font-bold text-blue-600">
            KSh {listing.price.toLocaleString()}
          </div>
        )}
        <a
          href={`/listing/${listing.id}`}
          className="mt-3 inline-block text-blue-600 hover:text-blue-800 text-sm"
        >
          View Details →
        </a>
      </div>
    </div>
  );
}

export default HomePage;
