import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { socketService } from '../services/socket';

// ─── Toggle di sini: ganti `true` ke `false` saat backend sudah siap ──────────
const USE_MOCK = true;

const getAuthService = async () => {
  if (USE_MOCK) {
    const { mockAuthService } = await import('../services/mockAuth');
    return mockAuthService;
  }
  const { authService } = await import('../services/api');
  return authService;
};

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
          const authService = await getAuthService();
          const { data } = await authService.login(credentials);
          const { token, user } = data;

          localStorage.setItem('aivi_token', token);
          if (!USE_MOCK) socketService.connect(token);

          set({ user, token, isAuthenticated: true, isLoading: false });
          return { success: true };
        } catch (err) {
          const message = err.response?.data?.message || 'Login gagal. Periksa email dan password Anda.';
          set({ isLoading: false, error: message });
          return { success: false, message };
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const authService = await getAuthService();
          const { data } = await authService.register(userData);
          const { token, user } = data;

          localStorage.setItem('aivi_token', token);
          if (!USE_MOCK) socketService.connect(token);

          set({ user, token, isAuthenticated: true, isLoading: false });
          return { success: true };
        } catch (err) {
          const message = err.response?.data?.message || 'Registrasi gagal. Silakan coba lagi.';
          set({ isLoading: false, error: message });
          return { success: false, message };
        }
      },

      logout: () => {
        localStorage.removeItem('aivi_token');
        if (!USE_MOCK) socketService.disconnect();
        set({ user: null, token: null, isAuthenticated: false });
      },

      refreshUser: async () => {
        try {
          const authService = await getAuthService();
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