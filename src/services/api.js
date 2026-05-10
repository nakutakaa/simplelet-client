// src/services/api.js
const API_URL = "http://localhost:5000/api";

const api = {
  // Listings
  getListings: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_URL}/listings?${params}`);
    return response.json();
  },

  getListing: async (id) => {
    const response = await fetch(`${API_URL}/listings/${id}`);
    return response.json();
  },

  getHouseTypes: async () => {
    const response = await fetch(`${API_URL}/listings/house-types`);
    return response.json();
  },

  // Auth
  login: async (phone, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, password }),
    });
    return response.json();
  },

  register: async (name, phone, password) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, password }),
    });
    return response.json();
  },

  // Add these verification methods
  sendVerification: async (token) => {
    const response = await fetch(`${API_URL}/auth/send-verification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },

  verifyPhone: async (token, code) => {
    const response = await fetch(`${API_URL}/auth/verify-phone`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ code }),
    });
    return response.json();
  },

  verificationStatus: async (token) => {
    const response = await fetch(`${API_URL}/auth/verification-status`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },
  // Add to api object
  createListing: async (token, listingData) => {
    const response = await fetch(`${API_URL}/listings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(listingData),
    });
    return response.json();
  },
  // Comments
  getComments: async (listingId, page = 1) => {
    const response = await fetch(
      `${API_URL}/comments/listings/${listingId}/comments?page=${page}`,
    );
    return response.json();
  },

  getReplies: async (commentId, page = 1) => {
    const response = await fetch(
      `${API_URL}/comments/${commentId}/replies?page=${page}`,
    );
    return response.json();
  },

  postComment: async (
    listingId,
    token,
    content,
    parentId = null,
    guestName = null,
  ) => {
    const headers = token
      ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
      : { "Content-Type": "application/json" };

    const body = { content };
    if (parentId) body.parent_id = parentId;
    if (guestName) body.guest_name = guestName;

    const response = await fetch(
      `${API_URL}/comments/listings/${listingId}/comments`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      },
    );
    return response.json();
  },
};

export default api;
