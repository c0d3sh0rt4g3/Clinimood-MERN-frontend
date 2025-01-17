import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  setUser: (userData) => {
    console.log("User logged:", userData);
    set({ user: userData });
  },
  clearUser: () => set({ user: null }),
  loginUser: async ({ email, password }) => {
    try {
      const response = await fetch('https://clinimood-mern-backend.onrender.com/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.message || 'unknown error' };
      }

      const data = await response.json();
      console.log("Server response:", data);

      if (data.success) {
        set({ user: data.data });
        return { success: true };
      } else {
        return { success: false, error: data.error || 'unknown error' };
      }
    } catch (error) {
      console.error('fetch error:', error.message);
      return { success: false, error: error.message };
    }
  },
}));

export default useAuthStore;



