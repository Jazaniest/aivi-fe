import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDisasterStore, MOCK_DISASTERS } from '../store/disasterStore';
import { useAuthStore } from '../store/authStore';
import DisasterMap from '../components/map/DisasterMap';
import DisasterCard from '../components/ui/DisasterCard';
import { getSeverityConfig } from '../utils/helpers';

export default function MapPage() {
  const { disasters, isLoading, fetchDisasters } = useDisasterStore();
  const { isAuthenticated } = useAuthStore();
  const [searchParams] = useSearchParams();
  const [selectedId, setSelectedId] = useState(searchParams.get('disaster'));
  const [filter, setFilter] = useState('ALL');

  const displayDisasters = disasters.length > 0 ? disasters : MOCK_DISASTERS;

  const filteredDisasters = displayDisasters.filter((d) => {
    if (filter === 'ALL') return true;
    if (filter === 'ACTIVE') return d.status === 'ACTIVE';
    if (filter === 'CRITICAL') return d.severity === 'CRITICAL';
    return true;
  });

  useEffect(() => {
    fetchDisasters();
  }, [fetchDisasters]);

  return (
    <div className="h-[calc(100vh-56px)] flex">
      {/* Sidebar */}
      <div className="w-72 shrink-0 flex flex-col bg-navy-800 border-r border-border overflow-hidden">
        {/* Header */}
        <div className="p-3 border-b border-border">
          <h2 className="text-sm font-semibold text-white mb-2">Peta Bencana</h2>

          {/* Filter tabs */}
          <div className="flex gap-1">
            {[
              { value: 'ALL', label: 'Semua' },
              { value: 'ACTIVE', label: 'Aktif' },
              { value: 'CRITICAL', label: 'Kritis' },
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`flex-1 text-xs py-1 px-2 rounded font-mono transition-all ${
                  filter === value
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-surface-secondary'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="px-3 py-2 border-b border-border/50">
          <p className="text-[10px] font-mono text-slate-600 uppercase tracking-wider mb-1.5">Legenda</p>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {[
              { color: '#ef4444', label: 'Kritis' },
              { color: '#f97316', label: 'Tinggi' },
              { color: '#eab308', label: 'Sedang' },
              { color: '#22c55e', label: 'Rendah' },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className="w-3 h-2 rounded-sm opacity-70" style={{ backgroundColor: color }} />
                <span className="text-[10px] text-slate-500">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Disaster list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
          {isLoading && filteredDisasters.length === 0 ? (
            <div className="space-y-2 p-1">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton h-16 rounded" />
              ))}
            </div>
          ) : (
            filteredDisasters.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedId(d.id === selectedId ? null : d.id)}
                className={`w-full text-left transition-all duration-150 rounded-lg ${
                  selectedId === d.id ? 'ring-1 ring-cyan-500/50' : ''
                }`}
              >
                <DisasterCard disaster={d} compact />
              </button>
            ))
          )}
        </div>

        {/* Auth notice */}
        {!isAuthenticated && (
          <div className="p-3 border-t border-border bg-navy-900/50">
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Login untuk melihat detail lengkap pada setiap polygon bencana
            </p>
          </div>
        )}
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <DisasterMap
          disasters={filteredDisasters}
          focusDisasterId={selectedId}
          height="100%"
        />

        {/* Map overlay: stats */}
        <div className="absolute top-3 right-3 z-1000">
          <div className="glass-surface rounded-lg p-2.5 text-xs font-mono min-w-30">
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-slate-400">Live</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-600">Tampil:</span>
                <span className="text-white">{filteredDisasters.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Aktif:</span>
                <span className="text-red-400">{filteredDisasters.filter(d => d.status === 'ACTIVE').length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected disaster info overlay */}
        {selectedId && (() => {
          const d = filteredDisasters.find((x) => x.id === selectedId);
          if (!d) return null;
          const sev = getSeverityConfig(d.severity);
          return (
            <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-xs z-1000">
              <div className="glass-surface rounded-lg p-3 animate-slide-up">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-white">{d.name}</p>
                    <p className="text-xs text-slate-400 font-mono">{d.location?.kabupaten}</p>
                  </div>
                  <button onClick={() => setSelectedId(null)} className="text-slate-500 hover:text-white transition-colors">✕</button>
                </div>
                <div className="mt-2 flex gap-2">
                  <span className={sev.badgeClass}>{sev.label}</span>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}