import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/api';
import { socketService } from '../services/socket';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await authService.login(credentials);
          const { token, user } = data;

          localStorage.setItem('aivi_token', token);
          socketService.connect(token);

          set({ user, token, isAuthenticated: true, isLoading: false });
          return { success: true };
        } catch (err) {
          const message = err.response?.data?.message || 'Login failed. Check your email and password..';
          set({ isLoading: false, error: message });
          return { success: false, message };
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await authService.register(userData);
          const { token, user } = data;

          localStorage.setItem('aivi_token', token);
          socketService.connect(token);

          set({ user, token, isAuthenticated: true, isLoading: false });
          return { success: true };
        } catch (err) {
          const message = err.response?.data?.message || 'Registration failed. Please try again.';
          set({ isLoading: false, error: message });
          return { success: false, message };
        }
      },

      logout: () => {
        localStorage.removeItem('aivi_token');
        socketService.disconnect();
        set({ user: null, token: null, isAuthenticated: false });
      },

      refreshUser: async () => {
        try {
          const { data } = await authService.me();
          set({ user: data.user });
        } catch {
          get().logout();
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'aivi_auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);