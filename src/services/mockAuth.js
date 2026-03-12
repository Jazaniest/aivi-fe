// Data dummy user
const mockUser = {
  id: 1,
  name: 'Demo User',
  email: 'demo@example.com',
  role: 'user',
  location: {
    negara: 'Indonesia',
    provinsi: 'Riau',
    kabupaten: 'Pekanbaru',
  },
};

const mockToken = 'mock-jwt-token-12345';

// Simulasi delay agar terasa seperti request sungguhan
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockAuthService = {
  login: async (credentials) => {
    await delay(800); // simulasi loading
    // Contoh validasi sederhana
    if (credentials.email === 'demo@example.com' && credentials.password === 'password') {
      return {
        data: {
          token: mockToken,
          user: mockUser,
        },
      };
    }
    // Simulasi error
    throw {
      response: {
        data: { message: 'Email atau password salah' },
      },
    };
  },

  register: async (userData) => {
    await delay(1000);
    return {
      data: {
        token: mockToken,
        user: { ...mockUser, ...userData },
      },
    };
  },

  me: async () => {
    await delay(300);
    return {
      data: { user: mockUser },
    };
  },

  logout: async () => {
    await delay(200);
    return { data: { message: 'Logout success' } };
  },
};