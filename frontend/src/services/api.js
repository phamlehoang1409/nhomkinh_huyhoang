import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: Attach JWT token if stored
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('huyhoang_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized on admin page, clear token
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        localStorage.removeItem('huyhoang_admin_token');
        localStorage.removeItem('huyhoang_admin_user');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Helper methods
export const fetchSettings = () => api.get('/settings');
export const updateSettings = (data) => api.put('/settings', data);

export const fetchCategories = () => api.get('/categories');
export const fetchCategoryBySlug = (slug) => api.get(`/categories/${slug}`);
export const createCategory = (data) => api.post('/categories', data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

export const fetchProducts = (params) => api.get('/products', { params });
export const fetchFeaturedProducts = (limit = 8) => api.get('/products/featured', { params: { limit } });
export const fetchProductBySlug = (slug) => api.get(`/products/${slug}`);
export const fetchSimilarProducts = (id, limit = 4) => api.get(`/products/similar/${id}`, { params: { limit } });
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

export const fetchServices = () => api.get('/services');
export const fetchFeaturedServices = () => api.get('/services/featured');
export const fetchServiceBySlug = (slug) => api.get(`/services/${slug}`);
export const createService = (data) => api.post('/services', data);
export const updateService = (id, data) => api.put(`/services/${id}`, data);
export const deleteService = (id) => api.delete(`/services/${id}`);

export const fetchProjects = (params) => api.get('/projects', { params });
export const fetchProjectBySlug = (slug) => api.get(`/projects/${slug}`);
export const createProject = (data) => api.post('/projects', data);
export const updateProject = (id, data) => api.put(`/projects/${id}`, data);
export const deleteProject = (id) => api.delete(`/projects/${id}`);

export const fetchArticles = (params) => api.get('/articles', { params });
export const fetchArticleCategories = () => api.get('/articles/categories');
export const fetchArticleBySlug = (slug) => api.get(`/articles/${slug}`);
export const createArticle = (data) => api.post('/articles', data);
export const updateArticle = (id, data) => api.put(`/articles/${id}`, data);
export const deleteArticle = (id) => api.delete(`/articles/${id}`);

export const submitQuoteRequest = (formData) => api.post('/quote-requests', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const fetchQuoteRequests = (params) => api.get('/quote-requests', { params });
export const updateQuoteStatus = (id, data) => api.put(`/quote-requests/${id}/status`, data);
export const deleteQuoteRequest = (id) => api.delete(`/quote-requests/${id}`);

export const fetchReviews = (params) => api.get('/reviews', { params });
export const createReview = (data) => api.post('/reviews/public', data);
export const createAdminReview = (data) => api.post('/reviews', data);
export const updateReview = (id, data) => api.put(`/reviews/${id}`, data);
export const deleteReview = (id) => api.delete(`/reviews/${id}`);

export const globalSearch = (params) => api.get('/search', { params });
export const fetchDashboardStats = () => api.get('/stats/dashboard');

export const loginAdmin = (credentials) => api.post('/auth/login', credentials);
export const quickLoginAdmin = () => api.post('/auth/quick-login');
export const getAdminProfile = () => api.get('/auth/me');
export const changeAdminPassword = (data) => api.put('/auth/change-password', data);

export const uploadSingleImage = (formData) => api.post('/upload/single', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const uploadMultipleImages = (formData) => api.post('/upload/multiple', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

export default api;
