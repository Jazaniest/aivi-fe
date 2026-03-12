// src/services/mockApi.js
// ─── Mock data untuk prototype (tanpa backend) ────────────────────────────────

const MOCK_USERS = [
  {
    id: 1,
    email: 'admin@aivi.id',
    password: 'admin123',
    name: 'Admin AIVI',
    role: 'admin',
    avatar: null,
    location: {
      negara: 'Indonesia',
      provinsi: 'Jawa Barat',
      kabupaten: 'Bandung',
    },
  },
  {
    id: 2,
    email: 'user@aivi.id',
    password: 'user123',
    name: 'User Demo',
    role: 'user',
    avatar: null,
    location: {
      negara: 'Indonesia',
      provinsi: 'Jawa Timur',
      kabupaten: 'Surabaya',
    },
  },
];

// Simulasi delay network
const delay = (ms = 600) => new Promise((res) => setTimeout(res, ms));

const generateToken = (userId) =>
  `mock_token_${userId}_${Date.now()}`;

// ─── Mock Auth Service ────────────────────────────────────────────────────────
export const mockAuthService = {
  login: async ({ email, password }) => {
    await delay();
    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );
    if (!user) {
      const error = new Error('Email atau password salah.');
      error.response = { data: { message: 'Email atau password salah.' } };
      throw error;
    }
    const { password: _, ...safeUser } = user;
    return { data: { token: generateToken(user.id), user: safeUser } };
  },

  register: async ({ name, email, password }) => {
    await delay();
    const exists = MOCK_USERS.find((u) => u.email === email);
    if (exists) {
      const error = new Error('Email sudah terdaftar.');
      error.response = { data: { message: 'Email sudah terdaftar.' } };
      throw error;
    }
    const newUser = {
      id: MOCK_USERS.length + 1,
      email,
      name,
      role: 'user',
      avatar: null,
    };
    MOCK_USERS.push({ ...newUser, password });
    return { data: { token: generateToken(newUser.id), user: newUser } };
  },

  me: async () => {
    await delay(300);
    const token = localStorage.getItem('aivi_token');
    if (!token?.startsWith('mock_token_')) {
      const error = new Error('Unauthorized');
      error.response = { status: 401 };
      throw error;
    }
    // Ambil userId dari token mock
    const userId = parseInt(token.split('_')[2]);
    const user = MOCK_USERS.find((u) => u.id === userId);
    if (!user) throw new Error('User not found');
    const { password: _, ...safeUser } = user;
    return { data: { user: safeUser } };
  },

  logout: async () => {
    await delay(200);
    return { data: { success: true } };
  },
};

// ─── Mock Wilayah Service ─────────────────────────────────────────────────────
export const mockWilayahService = {
  getNegara: async () => {
    await delay();
    return {
      data: [
        { id: 1, nama: 'Indonesia', kode: 'ID' },
      ],
    };
  },
  getProvinsi: async () => {
    await delay();
    return {
      data: [
        { id: 1, nama: 'Jawa Barat' },
        { id: 2, nama: 'Jawa Tengah' },
        { id: 3, nama: 'Jawa Timur' },
        { id: 4, nama: 'Riau' },
        { id: 5, nama: 'Sumatera Utara' },
      ],
    };
  },
  getKabupaten: async () => {
    await delay();
    return {
      data: [
        { id: 1, nama: 'Bandung' },
        { id: 2, nama: 'Bogor' },
        { id: 3, nama: 'Bekasi' },
      ],
    };
  },
};

// ─── Mock Disaster Service ────────────────────────────────────────────────────
export const mockDisasterService = {
  getAll: async () => {
    await delay();
    return {
      data: {
        data: [
          {
            id: 1,
            jenis: 'Banjir',
            lokasi: 'Jakarta Utara',
            level: 'TINGGI',
            tanggal: '2025-03-10',
            status: 'aktif',
          },
          {
            id: 2,
            jenis: 'Gempa Bumi',
            lokasi: 'Cianjur, Jawa Barat',
            level: 'SEDANG',
            tanggal: '2025-03-09',
            status: 'aktif',
          },
          {
            id: 3,
            jenis: 'Tanah Longsor',
            lokasi: 'Puncak, Bogor',
            level: 'RENDAH',
            tanggal: '2025-03-08',
            status: 'selesai',
          },
        ],
      },
    };
  },
  getById: async (id) => {
    await delay();
    return { data: { id, jenis: 'Banjir', lokasi: 'Jakarta Utara', level: 'TINGGI' } };
  },
  getAlerts: async () => {
    await delay();
    return { data: [] };
  },
};

// ─── Mock AI Service ──────────────────────────────────────────────────────────
export const mockAiService = {
  getRecommendation: async (disasterId) => {
    await delay(1200); // AI terasa lebih lambat, realistis
    return {
      data: {
        disasterId,
        rekomendasi: [
          'Segera evakuasi ke titik kumpul terdekat.',
          'Hindari daerah aliran sungai dan dataran rendah.',
          'Siapkan tas darurat berisi dokumen penting, obat-obatan, dan air minum.',
          'Pantau informasi resmi dari BNPB dan BPBD setempat.',
        ],
        level_risiko: 'TINGGI',
        generated_at: new Date().toISOString(),
      },
    };
  },
};