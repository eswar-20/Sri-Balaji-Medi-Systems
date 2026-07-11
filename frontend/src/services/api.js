import axios from 'axios';

const getBaseURL = () => {
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return process.env.REACT_APP_API_URL || 'http://localhost:8080';
  }
  if (process.env.REACT_APP_API_URL && !process.env.REACT_APP_API_URL.includes('localhost')) {
    return process.env.REACT_APP_API_URL;
  }
  return 'https://sri-balaji-medi-systems.onrender.com';
};

// Create axios instance with base configuration
const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors and retries
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config } = error;
    if (!config) {
      return Promise.reject(error);
    }
    
    config.__retryCount = config.__retryCount || 0;
    const isNetworkOrServerError = !error.response || error.response.status >= 500;
    
    if (isNetworkOrServerError && config.__retryCount < 3) {
      config.__retryCount += 1;
      console.warn(`Request to ${config.url} failed. Retrying attempt ${config.__retryCount}/3 after 1s delay...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return api(config);
    }

    // Only redirect to login on 401 for protected endpoints
    if (error.response?.status === 401 && !error.config.url.includes('/products')) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }
    if (error.response?.status === 403 && error.config.url.includes('/api/owner')) {
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Product API endpoints
export const productAPI = {
  // Get all products with optional filters
  getProducts: (params = {}) => {
    return api.get('/api/products', { params });
  },

  // Get only medical equipment
  getEquipmentProducts: (params = {}) => {
    return api.get('/api/products/equipment', { params });
  },

  // Get only spare parts
  getSparePartsProducts: (params = {}) => {
    return api.get('/api/products/spare-parts', { params });
  },

  // Get single product by ID
  getProduct: (id) => {
    return api.get(`/api/products/${id}`);
  },

  // Get products by category
  getProductsByCategory: (category) => {
    return api.get(`/api/products/category/${category}`);
  },

  // Search products
    searchProducts: (query) => {
      return api.get('/api/products/search', { params: { name: query } });
    },

  // Get featured products
  getFeaturedProducts: () => {
    return api.get('/api/products/featured');
  },

  // Get product categories
  getCategories: () => {
    return api.get('/api/products/categories');
  },

  // Get categories by type
  getCategoriesByType: (type) => {
    return api.get('/api/products/categories', { params: { type } });
  },

  // Get website settings
  getSettings: () => {
    return api.get('/api/meta/settings');
  }
};

// Order API endpoints
export const orderAPI = {
  createOrder: (orderData) => api.post('/api/orders', orderData),
  getOrder: (orderId) => api.get(`/api/orders/${orderId}`),
  getAllOrders: () => api.get('/api/orders'),
  getMyOrders: () => api.get('/api/orders/my-orders'),
  updateOrderStatus: (orderId, status) => api.put(`/api/orders/${orderId}/status`, null, { params: { status } }),
};

// Product API - add owner mutations
productAPI.createProduct = (data) => api.post('/api/products', data);
productAPI.updateProduct = (id, data) => api.put(`/api/products/${id}`, data);
productAPI.deleteProduct = (id) => api.delete(`/api/products/${id}`);
productAPI.restoreProduct = (id) => api.post(`/api/products/${id}/restore`);
productAPI.duplicateProduct = (id) => api.post(`/api/products/${id}/duplicate`);

orderAPI.returnOrder = (id) => api.put(`/api/orders/${id}/return`);
orderAPI.refundOrder = (id) => api.put(`/api/orders/${id}/refund`);

// Auth API endpoints
export const authAPI = {
  sendOtp: (identifier, password) => api.post('/api/auth/send-otp', { identifier, password }),
  verifyOtp: (identifier, otp, name = 'Customer') => api.post('/api/auth/verify-otp', { identifier, otp, name }),
  resendOtp: (identifier) => api.post('/api/auth/resend-otp', { identifier }),
  getProfile: () => api.get('/api/auth/me'),
};

// Owner API endpoints (ROLE_OWNER only)
export const ownerAPI = {
  getDashboard: () => api.get('/api/owner/dashboard'),
  getInventory: () => api.get('/api/owner/inventory'),
  getAnalytics: () => api.get('/api/owner/analytics'),
  getUsers: () => api.get('/api/owner/users'),
  promoteUser: (userId, role) => api.post('/api/owner/users/promote', null, { params: { userId, role } }),
  blockUser: (userId, blocked) => api.post('/api/owner/users/block', null, { params: { userId, blocked } }),
  deleteUser: (userId) => api.delete(`/api/owner/users/${userId}`),
  getAuditLogs: () => api.get('/api/owner/audit-logs'),
  getStockHistory: () => api.get('/api/owner/inventory/history'),
  adjustStock: (productId, quantity, type, reason) => api.post('/api/owner/inventory/adjust', null, { params: { productId, quantity, type, reason } }),
  updateSettings: (settingsMap) => api.post('/api/owner/settings', settingsMap)
};

// Owner Services API endpoints
export const ownerServiceAPI = {
  getRequests: () => api.get('/api/services/owner/requests'),
  assignEngineer: (requestId, engineerId, notes) => api.post(`/api/services/owner/requests/${requestId}/assign`, null, { params: { engineerId, notes } }),
  generateInvoice: (requestId, laborCost) => api.post(`/api/services/owner/requests/${requestId}/invoice`, null, { params: { laborCost } }),
  getEngineers: () => api.get('/api/services/owner/engineers'),
  registerEngineer: (engineerData) => api.post('/api/services/owner/engineers', engineerData),
  updateEngineer: (id, engineerData) => api.put(`/api/services/owner/engineers/${id}`, engineerData),
  getSummary: () => api.get('/api/services/owner/dashboard/summary'),
};

// Wishlist API endpoints
export const wishlistAPI = {
  getWishlist: () => api.get('/api/wishlist'),
  add: (productId) => api.post(`/api/wishlist/${productId}`),
  remove: (productId) => api.delete(`/api/wishlist/${productId}`),
};

// Cart API endpoints
export const cartAPI = {
  getCartItems: () => api.get('/api/cart'),
  addToCart: (productId, quantity) => api.post('/api/cart/add', null, { params: { productId, quantity } }),
  updateCartItem: (id, quantity) => api.put(`/api/cart/${id}`, null, { params: { quantity } }),
  removeFromCart: (id) => api.delete(`/api/cart/${id}`),
  clearCart: () => api.delete('/api/cart/clear'),
};

// Customer Service API endpoints
export const customerServiceAPI = {
  createRequest: (data) => api.post('/api/services/customer/requests', data),
  getMyRequests: () => api.get('/api/services/customer/requests'),
  getRequestDetails: (id) => api.get(`/api/services/customer/requests/${id}`),
  submitFeedback: (id, feedbackData) => api.post(`/api/services/customer/requests/${id}/feedback`, feedbackData),
  subscribeAMC: (amcData) => api.post('/api/services/customer/amc/subscribe', amcData),
  getMyContracts: () => api.get('/api/services/customer/amc/my-contracts'),
  getVisits: (id) => api.get(`/api/services/customer/requests/${id}/visits`),
  getAssignment: (id) => api.get(`/api/services/customer/requests/${id}/assignment`),
  getAuditLogs: (id) => api.get(`/api/services/customer/requests/${id}/audit-logs`),
};

// Technician Service API endpoints
export const technicianServiceAPI = {
  getAssignedJobs: () => api.get('/api/services/technician/jobs'),
  getJobDetails: (id) => api.get(`/api/services/technician/jobs/${id}`),
  getVisits: (requestId) => api.get(`/api/services/technician/assignments/${requestId}/visits`),
  recordVisit: (requestId, visitData) => api.post(`/api/services/technician/assignments/${requestId}/visits`, visitData),
  completeVisit: (visitId, visitData) => api.put(`/api/services/technician/visits/${visitId}/complete`, visitData),
  reservePart: (visitId, productId, quantity) => api.post(`/api/services/technician/visits/${visitId}/parts/reserve`, null, { params: { productId, quantity } }),
  updatePartStatus: (usageId, status) => api.post(`/api/services/technician/parts-usages/${usageId}/status`, null, { params: { status } }),
  completeJob: (id) => api.post(`/api/services/technician/jobs/${id}/complete`),
};

// Payment API endpoints
export const paymentAPI = {
  createOrder: (paymentData) => api.post('/api/payments/razorpay/create-order', paymentData),
  verifyPayment: (verificationData) => api.post('/api/payments/razorpay/verify-payment', verificationData),
};

// Review API endpoints
export const reviewAPI = {
  // Get product reviews
  getProductReviews: (productId) => {
    return api.get(`/api/reviews/product/${productId}`);
  },

  // Add product review
  addReview: (reviewData) => {
    return api.post('/api/reviews', reviewData);
  },

  // Update review
  updateReview: (reviewId, reviewData) => {
    return api.put(`/api/reviews/${reviewId}`, reviewData);
  },

  // Delete review
  deleteReview: (reviewId) => {
    return api.delete(`/api/reviews/${reviewId}`);
  }
};

// Utility function to handle API errors
export const handleApiError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const message = error.response.data?.message || 'Server error occurred';
    return {
      message,
      status: error.response.status,
      data: error.response.data
    };
  } else if (error.request) {
    // The request was made but no response was received
    return {
      message: 'Network error. Please check your connection.',
      status: null,
      data: null
    };
  } else {
    // Something happened in setting up the request that triggered an Error
    return {
      message: error.message || 'An unexpected error occurred',
      status: null,
      data: null
    };
  }
};

export default api;
