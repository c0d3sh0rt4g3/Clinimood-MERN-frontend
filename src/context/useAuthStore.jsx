import { create } from 'zustand';
import axios from 'axios';

/**
 * Zustand store for user authentication management.
 * Handles user login, state persistence, and session clearing.
 */
const useAuthStore = create((set) => ({
  /**
   * Current authenticated user.
   * Retrieved from local storage on initialization.
   * @type {Object|null}
   */
  user: JSON.parse(localStorage.getItem('user')) || null,

  /**
   * Sets the user data in the store and local storage.
   * @param {Object} userData - The user data to store.
   */
  setUser: (userData) => {
    console.log('User logged:', userData);
    localStorage.setItem('user', JSON.stringify(userData));
    set({ user: userData });
  },

  /**
   * Clears the user session by removing it from the store and local storage.
   */
  clearUser: () => {
    localStorage.removeItem('user');
    set({ user: null });
  },

  /**
   * Authenticates a user with email and password.
   * Sends a login request to the backend and updates the store on success.
   * @param {Object} credentials - The user login credentials.
   * @param {string} credentials.email - The user's email.
   * @param {string} credentials.password - The user's password.
   * @returns {Promise<{success: boolean, error?: string}>} - The authentication result.
   */
  loginUser: async ({ email, password }) => {
    try {
      const response = await axios.post(
          'https://clinimood-mern-backend.onrender.com/users/login',
          { email, password }
      );

      if (response.data.success) {
        set({ user: response.data.data });
        localStorage.setItem('user', JSON.stringify(response.data.data));
        return { success: true };
      } else {
        return { success: false, error: response.data.message || 'Unknown error' };
      }
    } catch (err) {
      console.error('Login error:', err.response?.data?.message || err.message);
      return { success: false, error: err.response?.data?.message || err.message };
    }
  },
}));

export default useAuthStore;
