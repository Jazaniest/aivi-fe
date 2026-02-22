import { useEffect, useState } from 'react';
import { useDisasterStore, MOCK_DISASTERS } from '../store/disasterStore';
import DisasterCard from '../components/ui/DisasterCard';
import { formatRelativeTime } from '../utils/helpers';

const DISASTER_TYPES = [
  { value: '', label: 'Semua Tipe' },
  { value: 'BANJIR', label: 'Banjir' },
  { value: 'GEMPA', label: 'Gempa Bumi' },
  { value: 'KEBAKARAN', label: 'Kebakaran' },
  { value: 'TSUNAMI', label: 'Tsunami' },
  { value: 'LONGSOR', label: 'Longsor' },
  { value: 'GUNUNG_BERAPI', label: 'Gunung Berapi' },
  { value: 'ANGIN_PUTING', label: 'Angin Puting Beliung' },
];

const PROVINCES = [
  { value: '', label: 'Semua Provinsi' },
  { value: 'JB', label: 'Jawa Barat' },
  { value: 'JT', label: 'Jawa Tengah' },
  { value: 'JI', label: 'Jawa Timur' },
  { value: 'RI', label: 'Riau' },
  { value: 'PP', label: 'Papua' },
  { value: 'KL', label: 'Kalimantan' },
  { value: 'SU', label: 'Sumatera Utara' },
];

const STATUSES = [
  { value: '', label: 'Semua Status' },
  { value: 'ACTIVE', label: 'Aktif' },
  { value: 'MONITORING', label: 'Monitoring' },
  { value: 'RESOLVED', label: 'Selesai' },
];

function FilterSelect({ value, onChange, options }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-field appearance-none pr-8 py-2 text-xs min-w-35"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
        <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export default function DisastersPage() {
  const { disasters, isLoading, filters, setFilter, resetFilters, fetchDisasters, lastUpdated } = useDisasterStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const displayDisasters = (disasters.length > 0 ? disasters : MOCK_DISASTERS).filter((d) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      d.name?.toLowerCase().includes(q) ||
      d.location?.kabupaten?.toLowerCase().includes(q) ||
      d.location?.provinsi?.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    fetchDisasters();
  }, [fetchDisasters]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => fetchDisasters(), 30000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchDisasters]);

  const hasActiveFilters = filters.type || filters.province || filters.status;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-xl font-bold text-white">Informasi Bencana</h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            {displayDisasters.length} kejadian ditemukan
            {lastUpdated && ` · diperbarui ${formatRelativeTime(lastUpdated)}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Auto-refresh toggle */}
          <button
            onClick={() => setAutoRefresh((v) => !v)}
            className={`flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded border transition-all ${
              autoRefresh
                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                : 'bg-surface-secondary border-border text-slate-500'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${autoRefresh ? 'bg-cyan-400 animate-pulse' : 'bg-slate-500'}`} />
            Auto-refresh
          </button>
          <button
            onClick={fetchDisasters}
            disabled={isLoading}
            className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="w-3 h-3 border border-slate-500 border-t-cyan-500 rounded-full animate-spin" />
            ) : (
              <svg viewBox="0 0 14 14" fill="none" className="w-3 h-3">
                <path d="M1 7a6 6 0 0 1 6-6 6 6 0 0 1 4.24 1.76M13 7a6 6 0 0 1-6 6 6 6 0 0 1-4.24-1.76M11 2v3h-3M3 12V9h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            Perbarui
          </button>
        </div>
      </div>

      {/* Filters bar */}
      <div className="card p-3 mb-4 flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative flex-1 min-w-45">
          <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
            <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10 10l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, lokasi..."
            className="input-field pl-8 py-2 text-xs"
          />
        </div>

        <FilterSelect
          value={filters.type}
          onChange={(v) => setFilter('type', v)}
          options={DISASTER_TYPES}
        />

        <FilterSelect
          value={filters.province}
          onChange={(v) => setFilter('province', v)}
          options={PROVINCES}
        />

        <FilterSelect
          value={filters.status}
          onChange={(v) => setFilter('status', v)}
          options={STATUSES}
        />

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-xs font-mono text-red-400 hover:text-red-300 px-2 py-1.5 rounded hover:bg-red-500/10 transition-all"
          >
            Hapus filter
          </button>
        )}
      </div>

      {/* Results */}
      {isLoading && disasters.length === 0 ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="card p-4 animate-pulse">
              <div className="flex gap-3">
                <div className="skeleton w-8 h-8 rounded" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-3 w-2/3" />
                  <div className="skeleton h-3 w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : displayDisasters.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-slate-400 text-sm">Tidak ada bencana yang cocok dengan filter</p>
          <button onClick={resetFilters} className="mt-3 text-xs text-cyan-400 hover:text-cyan-300 font-mono">
            Reset filter
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {displayDisasters.map((disaster) => (
            <DisasterCard key={disaster.id} disaster={disaster} />
          ))}
        </div>
      )}
    </div>
  );
}