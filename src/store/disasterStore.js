import { create } from 'zustand';
import { disasterService } from '../services/api';

export const useDisasterStore = create((set, get) => ({
  disasters: [],
  userAlerts: [],
  filters: {
    type: '',
    province: '',
    status: '',
  },
  isLoading: false,
  lastUpdated: null,
  pollingInterval: null,

  fetchDisasters: async () => {
    set({ isLoading: true });
    try {
      const { filters } = get();
      const params = {};
      if (filters.type) params.type = filters.type;
      if (filters.province) params.province_id = filters.province;
      if (filters.status) params.status = filters.status;

      const { data } = await disasterService.getAll(params);
      set({
        disasters: data.disasters || [],
        lastUpdated: new Date(),
        isLoading: false,
      });
    } catch (err) {
      console.error('Failed to fetch disasters:', err);
      set({ isLoading: false });
    }
  },

  fetchUserAlerts: async () => {
    try {
      const { data } = await disasterService.getAlerts();
      set({ userAlerts: data.alerts || [] });
    } catch (err) {
      console.error('Failed to fetch user alerts:', err);
    }
  },

  setFilter: (key, value) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    }));
    get().fetchDisasters();
  },

  resetFilters: () => {
    set({ filters: { type: '', province: '', status: '' } });
    get().fetchDisasters();
  },

  addOrUpdateDisaster: (disaster) => {
    set((state) => {
      const idx = state.disasters.findIndex((d) => d.id === disaster.id);
      if (idx >= 0) {
        const updated = [...state.disasters];
        updated[idx] = disaster;
        return { disasters: updated };
      }
      return { disasters: [disaster, ...state.disasters] };
    });
  },

  startPolling: (intervalMs = 30000) => {
    const interval = setInterval(() => {
      get().fetchDisasters();
    }, intervalMs);
    set({ pollingInterval: interval });
  },

  stopPolling: () => {
    const { pollingInterval } = get();
    if (pollingInterval) {
      clearInterval(pollingInterval);
      set({ pollingInterval: null });
    }
  },
}));

// ─── Mock data for development ────────────────────────────────────────────────
export const MOCK_DISASTERS = [
  {
    id: '1',
    name: 'Citarum River Flash Flood',
    type: 'BANJIR',
    location: { kabupaten: 'Kabupaten Bandung', provinsi: 'Jawa Barat' },
    severity: 'CRITICAL',
    status: 'ACTIVE',
    occurred_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    description: 'Flash flood due to extreme rainfall causing the Citarum River to overflow in the southern part of Bandung Regency.',
    evacuation_instructions: 'Residents along the riverbanks must immediately evacuate to the assembly point at the Bandung Regency Sports Hall. Bring important documents and medicines.',
    emergency_contacts: [
      { name: 'BPBD Kab. Bandung', phone: '022-1234567' },
      { name: 'PMI Bandung', phone: '022-7654321' },
    ],
    coordinates: [
      [-6.9174, 107.6191],
      [-6.9200, 107.6250],
      [-6.9150, 107.6300],
      [-6.9100, 107.6250],
      [-6.9174, 107.6191],
    ],
    impact_radius_km: 15,
    affected_count: 12500,
  },
  {
    id: '2',
    name: 'M6.2 Cianjur Earthquake',
    type: 'GEMPA',
    location: { kabupaten: 'Kabupaten Cianjur', provinsi: 'Jawa Barat' },
    severity: 'HIGH',
    status: 'ACTIVE',
    occurred_at: new Date(Date.now() - 6 * 3600000).toISOString(),
    description: 'An earthquake measuring M6.2 struck the Cianjur area and its surroundings. Several buildings reported damaged.',
    evacuation_instructions: 'Avoid buildings that may collapse. Gather at the nearest open field.',
    emergency_contacts: [
      { name: 'BPBD Cianjur', phone: '0263-123456' },
      { name: 'Basarnas', phone: '115' },
    ],
    coordinates: [
      [-6.8174, 107.1391],
      [-6.8200, 107.1450],
      [-6.8150, 107.1500],
      [-6.8100, 107.1450],
      [-6.8174, 107.1391],
    ],
    impact_radius_km: 25,
    affected_count: 8200,
  },
  {
    id: '3',
    name: 'Central Riau Forest Fire',
    type: 'KEBAKARAN',
    location: { kabupaten: 'Kabupaten Pelalawan', provinsi: 'Riau' },
    severity: 'MEDIUM',
    status: 'MONITORING',
    occurred_at: new Date(Date.now() - 24 * 3600000).toISOString(),
    description: 'Peatland fires are observed spreading in several areas of Pelalawan Regency. Smoke may disrupt visibility.',
    evacuation_instructions: 'Residents with respiratory conditions should limit outdoor activities. Use N95 masks.',
    emergency_contacts: [
      { name: 'BPBD Pelalawan', phone: '0762-123456' },
      { name: 'Manggala Agni', phone: '0762-654321' },
    ],
    coordinates: [
      [0.1174, 102.1391],
      [0.1200, 102.1450],
      [0.1150, 102.1500],
      [0.1100, 102.1450],
      [0.1174, 102.1391],
    ],
    impact_radius_km: 30,
    affected_count: 3500,
  },
  {
    id: '4',
    name: 'Pacific Tsunami Warning',
    type: 'TSUNAMI',
    location: { kabupaten: 'Kabupaten Biak Numfor', provinsi: 'Papua' },
    severity: 'CRITICAL',
    status: 'ACTIVE',
    occurred_at: new Date(Date.now() - 1 * 3600000).toISOString(),
    description: 'Tsunami warning issued following a M7.8 earthquake in the Pacific Ocean. Coastal residents urged to be alert.',
    evacuation_instructions: 'IMMEDIATELY evacuate to high ground at least 30 meters above sea level. Do not wait.',
    emergency_contacts: [
      { name: 'BMKG', phone: '021-6546315' },
      { name: 'BPBD Papua', phone: '0967-123456' },
    ],
    coordinates: [
      [-1.1174, 136.1391],
      [-1.1200, 136.1450],
      [-1.1150, 136.1500],
      [-1.1100, 136.1450],
      [-1.1174, 136.1391],
    ],
    impact_radius_km: 40,
    affected_count: 2100,
  },
];