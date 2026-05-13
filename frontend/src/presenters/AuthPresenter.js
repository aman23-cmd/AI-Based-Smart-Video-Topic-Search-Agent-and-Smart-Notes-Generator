import authService from '../services/authService';
import UserModel from '../models/UserModel';

/**
 * AuthPresenter — Business logic for authentication (MVP pattern).
 * Coordinates between the View (React component) and the Model (UserModel).
 */
class AuthPresenter {
  constructor(updateView) {
    this.model = new UserModel();
    this.updateView = updateView; // React setState callback
    this.model.loadFromStorage();
    this._notifyView();
  }

  /**
   * Push current model state to the view
   */
  _notifyView() {
    this.updateView(this.model.toState());
  }

  /**
   * Handle user login
   * @param {string} email
   * @param {string} password
   * @returns {Promise<boolean>} success
   */
  async login(email, password) {
    this.model.setLoading(true);
    this.model.setError(null);
    this._notifyView();

    try {
      const data = await authService.login(email, password);
      this.model.setUser(data.user);
      this._notifyView();
      return true;
    } catch (err) {
      const message = err.response?.data?.error || 'Login failed. Please check your credentials.';
      this.model.setError(message);
      this._notifyView();
      return false;
    } finally {
      this.model.setLoading(false);
      this._notifyView();
    }
  }

  /**
   * Handle user registration
   * @param {string} username
   * @param {string} email
   * @param {string} password
   * @returns {Promise<boolean>} success
   */
  async register(username, email, password) {
    this.model.setLoading(true);
    this.model.setError(null);
    this._notifyView();

    try {
      await authService.register(username, email, password);
      // Auto-login after registration
      return await this.login(email, password);
    } catch (err) {
      const message = err.response?.data?.error || 'Registration failed. Please try again.';
      this.model.setError(message);
      this._notifyView();
      return false;
    } finally {
      this.model.setLoading(false);
      this._notifyView();
    }
  }

  /**
   * Handle logout
   */
  async logout() {
    await authService.logout();
    this.model.clearUser();
    this._notifyView();
  }

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    return this.model.isAuthenticated;
  }

  /**
   * Get current user
   * @returns {Object|null}
   */
  getUser() {
    return this.model.user;
  }
}

export default AuthPresenter;
