import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  setUser: (userData) => {
    console.log("User logged:", userData);
    localStorage.setItem("user", JSON.stringify(userData));
    set({ user: userData });
  },
  clearUser: () => {
    localStorage.removeItem("user");
    set({ user: null });
  },
  loginUser: async ({ email, password }) => {
    try {
      const response = await fetch('https://clinimood-mern-backend.onrender.com/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.message || 'Unknown error' };
      }

      const data = await response.json();
      console.log("Server response:", data);

      if (data.success) {
        set({ user: data.data });
        localStorage.setItem("user", JSON.stringify(data.data));
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Unknown error' };
      }
    } catch (error) {
      console.error('petition error:', error.message);
      return { success: false, error: error.message };
    }
  },
}));

export default useAuthStore;




