// API Service
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Bir hata oluştu');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: async (userData) => {
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  login: async (credentials) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  getProfile: async () => {
    return apiCall('/auth/profile');
  },
};

// Admin API
export const adminAPI = {
  getDashboardStats: async () => {
    return apiCall('/admin/stats');
  },

  getAllUsers: async () => {
    return apiCall('/admin/users');
  },

  updateUserRole: async (userId, role) => {
    return apiCall(`/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  },

  deleteUser: async (userId) => {
    return apiCall(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  },

  getAllOrders: async () => {
    return apiCall('/admin/orders');
  },

  updateOrderStatus: async (orderId, status) => {
    return apiCall(`/admin/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};

// Product API
export const productAPI = {
  getAllProducts: async () => {
    return apiCall('/products');
  },

  createProduct: async (productData) => {
    return apiCall('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  updateProduct: async (productId, productData) => {
    return apiCall(`/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  deleteProduct: async (productId) => {
    return apiCall(`/products/${productId}`, {
      method: 'DELETE',
    });
  },
};

export default apiCall;
