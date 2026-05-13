import api from './api';

/**
 * Authentication service — handles login, signup, logout API calls.
 */
const authService = {
  /**
   * Register a new user
   * @param {string} username 
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise} API response with user data
   */
  async register(username, email, password) {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data;
  },

  /**
   * Login and receive JWT token
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise} API response with access_token and user
   */
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  /**
   * Logout — remove token and notify server
   */
  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      // Even if server logout fails, clear local state
      console.warn('Server logout failed:', err);
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },

  /**
   * Get current authenticated user profile
   * @returns {Promise} User data
   */
  async getMe() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  /**
   * Check if user is currently authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  },

  /**
   * Get stored user data
   * @returns {Object|null}
   */
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export default authService;
