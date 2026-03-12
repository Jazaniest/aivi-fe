import { useEffect, useState } from 'react';
import { useDisasterStore, MOCK_DISASTERS } from '../store/disasterStore';
import DisasterCard from '../components/ui/DisasterCard';
import { formatRelativeTime } from '../utils/helpers';

const DISASTER_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'BANJIR', label: 'Flood' },
  { value: 'GEMPA', label: 'Earthquake' },
  { value: 'KEBAKARAN', label: 'Fire' },
  { value: 'TSUNAMI', label: 'Tsunami' },
  { value: 'LONGSOR', label: 'Landslide' },
  { value: 'GUNUNG_BERAPI', label: 'Volcano' },
  { value: 'ANGIN_PUTING', label: 'Tornado' },
];

const PROVINCES = [
  { value: '', label: 'All Provinces' },
  { value: 'JB', label: 'West Java' },
  { value: 'JT', label: 'Central Java' },
  { value: 'JI', label: 'East Java' },
  { value: 'RI', label: 'Riau' },
  { value: 'PP', label: 'Papua' },
  { value: 'KL', label: 'Kalimantan' },
  { value: 'SU', label: 'North Sumatra' },
];

const STATUSES = [
  { value: '', label: 'All Status' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'MONITORING', label: 'Monitoring' },
  { value: 'RESOLVED', label: 'Resolved' },
];

function FilterSelect({ value, onChange, options }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="py-2 pr-8 text-xs appearance-none input-field min-w-35"
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
    <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6">
      {/* Page header */}
      <div className="flex flex-col justify-between gap-3 mb-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold text-white">Disaster Information</h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            {displayDisasters.length} incidents found
            {lastUpdated && ` · updated ${formatRelativeTime(lastUpdated)}`}
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
              <span className="w-3 h-3 border rounded-full border-slate-500 border-t-cyan-500 animate-spin" />
            ) : (
              <svg viewBox="0 0 14 14" fill="none" className="w-3 h-3">
                <path d="M1 7a6 6 0 0 1 6-6 6 6 0 0 1 4.24 1.76M13 7a6 6 0 0 1-6 6 6 6 0 0 1-4.24-1.76M11 2v3h-3M3 12V9h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            Refresh
          </button>
        </div>
      </div>

      {/* Filters bar */}
      <div className="flex flex-wrap items-center gap-2 p-3 mb-4 card">
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
            placeholder="Search name, location..."
            className="py-2 pl-8 text-xs input-field"
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
            Clear filters
          </button>
        )}
      </div>

      {/* Results */}
      {isLoading && disasters.length === 0 ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 card animate-pulse">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded skeleton" />
                <div className="flex-1 space-y-2">
                  <div className="w-2/3 h-3 skeleton" />
                  <div className="w-1/3 h-3 skeleton" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : displayDisasters.length === 0 ? (
        <div className="py-16 text-center">
          <div className="mb-3 text-4xl">🔍</div>
          <p className="text-sm text-slate-400">No disasters match the filters</p>
          <button onClick={resetFilters} className="mt-3 font-mono text-xs text-cyan-400 hover:text-cyan-300">
            Reset filters
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