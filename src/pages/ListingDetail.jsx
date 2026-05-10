// src/pages/ListingDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Zoom } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/zoom";

import api from "../services/api";
import CommentSection from "../components/CommentSection";

function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPhone, setShowPhone] = useState(false);

  useEffect(() => {
    loadListing();
  }, [id]);

  const loadListing = async () => {
    setLoading(true);
    const data = await api.getListing(id);
    setListing(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-700">Listing not found</h2>
        <button
          onClick={() => navigate("/")}
          className="mt-4 text-blue-600 hover:text-blue-800"
        >
          ← Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Image Gallery - WhatsApp Status Style */}
      <div className="bg-black rounded-lg overflow-hidden mb-6">
        {listing.images && listing.images.length > 0 ? (
          <Swiper
            modules={[Navigation, Pagination, Zoom]}
            navigation
            pagination={{ clickable: true }}
            zoom={{ maxRatio: 3 }}
            className="h-96 md:h-[500px]"
          >
            {listing.images.map((image, index) => (
              <SwiperSlide key={image.id}>
                <div className="swiper-zoom-container h-full">
                  <img
                    src={image.url}
                    alt={`${listing.title} - Image ${index + 1}`}
                    className="w-full h-full object-contain"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="h-96 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No images available</span>
          </div>
        )}
        <div className="text-center text-white text-sm py-2 bg-black/50">
          {listing.images?.length || 0} photo(s) • Tap to zoom
        </div>
      </div>

      {/* Listing Details */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mb-2">
              {listing.house_type_display}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {listing.title}
            </h1>
          </div>
          {listing.is_taken && (
            <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">
              TAKEN
            </span>
          )}
        </div>

        <div className="text-gray-600 mb-4">📍 {listing.location}</div>

        {listing.price && (
          <div className="text-3xl font-bold text-blue-600 mb-4">
            KSh {listing.price.toLocaleString()}
            <span className="text-sm font-normal text-gray-500">
              {" "}
              per month
            </span>
          </div>
        )}

        <div className="border-t border-b py-4 my-4">
          <h3 className="font-semibold text-lg mb-2">Description</h3>
          <p className="text-gray-700 whitespace-pre-wrap">
            {listing.description || "No description provided."}
          </p>
        </div>

        {/* Contact Information */}
        <div className="mb-4">
          <h3 className="font-semibold text-lg mb-2">Contact</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 mb-2">
              <span className="font-medium">Posted by:</span>{" "}
              {listing.author?.name}
            </p>
            {showPhone ? (
              <div>
                <p className="text-lg font-mono text-blue-600">
                  📞 {listing.contact_phone}
                </p>
                <button
                  onClick={() =>
                    (window.location.href = `tel:${listing.contact_phone}`)
                  }
                  className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Call Now
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowPhone(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Reveal Phone Number
              </button>
            )}
          </div>
        </div>

        {/* Posted Date */}
        <div className="text-sm text-gray-400">
          Posted on {new Date(listing.created_at).toLocaleDateString()}
        </div>
      </div>

      {/* Comments Section  */}
      <CommentSection listingId={id} />

      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="mt-6 text-gray-600 hover:text-gray-800 transition flex items-center gap-2"
      >
        ← Back to listings
      </button>
    </div>
  );
}

export default ListingDetail;
