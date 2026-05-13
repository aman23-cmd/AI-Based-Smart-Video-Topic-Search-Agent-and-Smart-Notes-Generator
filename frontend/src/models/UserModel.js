/**
 * UserModel — Data model for user state (MVP pattern).
 * Encapsulates user data and authentication state management.
 */
class UserModel {
  constructor() {
    this.user = null;
    this.isAuthenticated = false;
    this.loading = false;
    this.error = null;
  }

  /**
   * Load user from localStorage on init
   */
  loadFromStorage() {
    const stored = localStorage.getItem('user');
    const token = localStorage.getItem('access_token');
    if (stored && token) {
      this.user = JSON.parse(stored);
      this.isAuthenticated = true;
    }
    return this;
  }

  /**
   * Set user data after successful login
   * @param {Object} userData - { id, username, email }
   */
  setUser(userData) {
    this.user = userData;
    this.isAuthenticated = true;
    this.error = null;
  }

  /**
   * Clear user data on logout
   */
  clearUser() {
    this.user = null;
    this.isAuthenticated = false;
    this.error = null;
  }

  /**
   * Set error state
   * @param {string} error
   */
  setError(error) {
    this.error = error;
  }

  /**
   * Set loading state
   * @param {boolean} loading
   */
  setLoading(loading) {
    this.loading = loading;
  }

  /**
   * Get user display name
   * @returns {string}
   */
  getDisplayName() {
    return this.user?.username || this.user?.email || 'User';
  }

  /**
   * Serialize to plain object (for React state)
   * @returns {Object}
   */
  toState() {
    return {
      user: this.user,
      isAuthenticated: this.isAuthenticated,
      loading: this.loading,
      error: this.error,
    };
  }
}

export default UserModel;
