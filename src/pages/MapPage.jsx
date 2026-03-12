import { useEffect, useState, useRef } from 'react';
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

  // Mobile states
  //eslint-disable-next-line
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [drawerHeight, setDrawerHeight] = useState('peek'); // 'peek' | 'half' | 'full'
  const drawerRef = useRef(null);
  const dragStartY = useRef(null);
  const dragStartHeight = useRef(null);

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

  // Drawer drag handlers
  const handleDragStart = (e) => {
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    dragStartY.current = clientY;
    dragStartHeight.current = drawerHeight;
  };

  const handleDragEnd = (e) => {
    const clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
    const delta = dragStartY.current - clientY;

    if (delta > 60) {
      setDrawerHeight(dragStartHeight.current === 'peek' ? 'half' : 'full');
    } else if (delta < -60) {
      setDrawerHeight(dragStartHeight.current === 'full' ? 'half' : 'peek');
    }

    dragStartY.current = null;
  };

  const drawerHeightClass = {
    peek: 'h-[30vh]',
    half: 'h-[55vh]',
    full: 'h-[85vh]',
  }[drawerHeight];

  return (
    <div className="h-[calc(100vh-56px)] flex">
      {/* ─── DESKTOP SIDEBAR ─────────────────────────────────── */}
      <div className="flex-col hidden overflow-hidden border-r sm:flex w-72 shrink-0 bg-navy-800 border-border">
        {/* Header */}
        <div className="p-3 border-b border-border">
          <h2 className="mb-2 text-sm font-semibold text-white">Disaster Map</h2>
          <div className="flex gap-1">
            {[
              { value: 'ALL', label: 'All' },
              { value: 'ACTIVE', label: 'Active' },
              { value: 'CRITICAL', label: 'Critical' },
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
          <p className="text-[10px] font-mono text-slate-600 uppercase tracking-wider mb-1.5">Legend</p>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {[
              { color: '#ef4444', label: 'Critical' },
              { color: '#f97316', label: 'High' },
              { color: '#eab308', label: 'Medium' },
              { color: '#22c55e', label: 'Low' },
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
            <div className="p-1 space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 rounded skeleton" />
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

        {!isAuthenticated && (
          <div className="p-3 border-t border-border bg-navy-900/50">
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Login to see full details on each disaster polygon
            </p>
          </div>
        )}
      </div>

      {/* ─── MAP (full width on mobile) ──────────────────────── */}
      <div className="relative flex-1">
        <DisasterMap
          disasters={filteredDisasters}
          focusDisasterId={selectedId}
          height="100%"
        />

        {/* Stats overlay */}
        <div className="absolute top-3 right-3 z-1000">
          <div className="glass-surface rounded-lg p-2.5 text-xs font-mono min-w-30">
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-slate-400">Live</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-600">Showing:</span>
                <span className="text-white">{filteredDisasters.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Active:</span>
                <span className="text-red-400">
                  {filteredDisasters.filter((d) => d.status === 'ACTIVE').length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected disaster info overlay (desktop only — mobile shows inside drawer) */}
        {selectedId && (() => {
          const d = filteredDisasters.find((x) => x.id === selectedId);
          if (!d) return null;
          const sev = getSeverityConfig(d.severity);
          return (
            <div className="absolute hidden sm:block bottom-3 left-3 right-3 sm:right-auto sm:max-w-xs z-1000">
              <div className="p-3 rounded-lg glass-surface animate-slide-up">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-white">{d.name}</p>
                    <p className="font-mono text-xs text-slate-400">{d.location?.kabupaten}</p>
                  </div>
                  <button
                    onClick={() => setSelectedId(null)}
                    className="transition-colors text-slate-500 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex gap-2 mt-2">
                  <span className={sev.badgeClass}>{sev.label}</span>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ─── MOBILE BOTTOM DRAWER ──────────────────────────── */}
        <div
          ref={drawerRef}
          className={`
            sm:hidden
            absolute bottom-0 left-0 right-0 z-1000
            flex flex-col
            bg-navy-800 rounded-t-2xl
            border-t border-border
            shadow-[0_-4px_24px_rgba(0,0,0,0.4)]
            transition-[height] duration-300 ease-out
            ${drawerHeightClass}
          `}
        >
          {/* Drag handle */}
          <div
            className="flex flex-col items-center pt-2 pb-1 shrink-0 cursor-grab active:cursor-grabbing"
            onTouchStart={handleDragStart}
            onTouchEnd={handleDragEnd}
            onMouseDown={handleDragStart}
            onMouseUp={handleDragEnd}
          >
            <div className="w-10 h-1 mb-2 rounded-full bg-slate-600" />

            {/* Compact header row */}
            <div className="flex items-center justify-between w-full px-3">
              <h2 className="text-sm font-semibold text-white">Disaster Map</h2>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-500">
                  {filteredDisasters.length} disasters
                </span>
                {/* Chevron toggle */}
                <button
                  onClick={() =>
                    setDrawerHeight((h) =>
                      h === 'peek' ? 'half' : h === 'half' ? 'full' : 'peek'
                    )
                  }
                  className="p-1 transition-colors text-slate-500 hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`w-4 h-4 transition-transform duration-300 ${
                      drawerHeight === 'full' ? 'rotate-180' : ''
                    }`}
                  >
                    <polyline points="18 15 12 9 6 15" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="px-3 pb-2 shrink-0">
            <div className="flex gap-1">
              {[
                { value: 'ALL', label: 'All' },
                { value: 'ACTIVE', label: 'Active' },
                { value: 'CRITICAL', label: 'Critical' },
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

          {/* Divider */}
          <div className="h-px bg-border/50 shrink-0" />

          {/* Selected detail (only when something is selected) */}
          {selectedId && (() => {
            const d = filteredDisasters.find((x) => x.id === selectedId);
            if (!d) return null;
            const sev = getSeverityConfig(d.severity);
            return (
              <div className="shrink-0 mx-3 mt-2 glass-surface rounded-lg p-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold text-white">{d.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{d.location?.kabupaten}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={sev.badgeClass + ' text-[10px]'}>{sev.label}</span>
                    <button
                      onClick={() => setSelectedId(null)}
                      className="text-xs leading-none transition-colors text-slate-500 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Scrollable list */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5 overscroll-contain">
            {isLoading && filteredDisasters.length === 0 ? (
              <div className="p-1 space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 rounded skeleton" />
                ))}
              </div>
            ) : (
              filteredDisasters.map((d) => (
                <button
                  key={d.id}
                  onClick={() => {
                    setSelectedId(d.id === selectedId ? null : d.id);
                    // Collapse slightly when selecting so map is visible
                    if (drawerHeight === 'full') setDrawerHeight('half');
                  }}
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
            <div className="px-3 py-2 border-t shrink-0 border-border bg-navy-900/50">
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Login to see full details on each disaster polygon
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}