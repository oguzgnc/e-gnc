// API Service
const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'production' 
    ? 'https://gncsarkuteri-backend.onrender.com/api' 
    : 'http://localhost:5000/api');

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const token = sessionStorage.getItem('token');

  // Build headers: if options.body is a FormData, DO NOT set Content-Type so browser can add boundary
  const headers = (options && options.headers) || {};
  if (!(options && options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const config = {
    ...options,
    headers,
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
    const token = sessionStorage.getItem('token');
    const url = `${API_URL}/products`;
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: productData, // productData should be FormData
    });
    if (!response.ok) throw new Error('Oluşturma başarısız');
    return response.json();
  },

  updateProduct: async (productId, productData) => {
    const token = sessionStorage.getItem('token');
    const url = `${API_URL}/products/${productId}`;
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: productData, // productData should be FormData
    });
    if (!response.ok) throw new Error('Güncelleme başarısız');
    return response.json();
  },

  deleteProduct: async (productId) => {
    return apiCall(`/products/${productId}`, {
      method: 'DELETE',
    });
  },

  toggleStock: async (productId, inStock) => {
    return apiCall(`/products/${productId}/stock`, {
      method: 'PUT',
      body: JSON.stringify({ in_stock: inStock }),
    });
  },
};

// Category API
export const categoryAPI = {
  getCategories: async () => {
    return apiCall('/categories');
  },
};

// Order API
export const orderAPI = {
  createOrder: async (orderData) => {
    return apiCall('/orders/create', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  getUserOrders: async () => {
    return apiCall('/orders/my-orders');
  },

  getOrderDetails: async (orderId) => {
    return apiCall(`/orders/${orderId}`);
  },
};

// Contact API
export const contactAPI = {
  sendMessage: async (messageData) => {
    return apiCall('/contact', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  },

  getAllMessages: async () => {
    return apiCall('/contact/messages');
  },

  markAsRead: async (messageId) => {
    return apiCall(`/contact/messages/${messageId}/read`, {
      method: 'PUT',
    });
  },

  deleteMessage: async (messageId) => {
    return apiCall(`/contact/messages/${messageId}`, {
      method: 'DELETE',
    });
  },
};

export default apiCall;
