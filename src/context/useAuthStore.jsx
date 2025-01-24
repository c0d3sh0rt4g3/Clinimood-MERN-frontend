import { create } from 'zustand';
import axios from 'axios';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,

  setUser: (userData) => {
    console.log('User logged:', userData);
    localStorage.setItem('user', JSON.stringify(userData));
    set({ user: userData });
  },

  clearUser: () => {
    localStorage.removeItem('user');
    set({ user: null });
  },

  loginUser: async ({ email, password }) => {
    try {
      const response = await axios.post('https://clinimood-mern-backend.onrender.com/users/login', {
        email,
        password,
      });

      console.log('Response from backend:', response.data);

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




