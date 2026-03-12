import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDisasterStore, MOCK_DISASTERS } from '../store/disasterStore';
import { useAuthStore } from '../store/authStore';
import DisasterCard from '../components/ui/DisasterCard';
import { formatRelativeTime } from '../utils/helpers';

function StatCard({ value, label, color = 'cyan' }) {
  const colors = {
    cyan: 'text-cyan-400 border-cyan-500/20',
    red: 'text-red-400 border-red-500/20',
    yellow: 'text-yellow-400 border-yellow-500/20',
    green: 'text-green-400 border-green-500/20',
  };

  return (
    <div className={`card p-4 border ${colors[color]}`}>
      <p className={`text-2xl font-mono font-bold ${colors[color].split(' ')[0]}`}>{value}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
    </div>
  );
}

export default function HomePage() {
  const { disasters, isLoading, fetchDisasters, lastUpdated } = useDisasterStore();
  const { isAuthenticated, user } = useAuthStore();

  // Use mock data in dev if no real data
  const displayDisasters = disasters.length > 0 ? disasters : MOCK_DISASTERS;

  useEffect(() => {
    fetchDisasters();
  }, [fetchDisasters]);

  const activeCount = displayDisasters.filter((d) => d.status === 'ACTIVE').length;
  const criticalCount = displayDisasters.filter((d) => d.severity === 'CRITICAL').length;
  const monitoringCount = displayDisasters.filter((d) => d.status === 'MONITORING').length;

  return (
    <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6">
      {/* Hero section */}
      <div className="relative mb-8 overflow-hidden">
        <div className="py-8 sm:py-12">
          {/* Ambient glow */}
          <div className="absolute top-0 h-32 -translate-x-1/2 rounded-full pointer-events-none left-1/2 w-96 bg-cyan-500/10 blur-3xl" />

          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="font-mono text-xs tracking-widest uppercase text-slate-400">
                System Active — {activeCount} Disasters Monitored
              </span>
            </div>
            <h1 className="mb-3 text-3xl font-bold leading-tight text-white sm:text-4xl">
              Disaster Information{' '}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500">
                Real-Time
              </span>
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-slate-400">
              AI-based disaster alert and information platform for all regions of Indonesia.
              {!isAuthenticated && ' Register to receive alerts based on your location.'}
            </p>

            {!isAuthenticated && (
              <div className="flex gap-3 mt-5">
                <Link to="/register" className="btn-primary">
                  Register Now
                </Link>
                <Link to="/disasters" className="btn-secondary">
                  View Disasters
                </Link>
              </div>
            )}

            {isAuthenticated && (
              <div className="inline-flex items-center gap-2 px-4 py-2 mt-4 border rounded-lg bg-surface border-border">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm text-slate-300">
                  You are logged in as{' '}
                  <span className="font-medium text-white">{user?.name?.split(' ')[0]}</span>
                  {user?.location?.kabupaten && (
                    <> · <span className="font-mono text-xs text-cyan-400">{user.location.kabupaten}</span></>
                  )}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-8 sm:grid-cols-4">
        <StatCard value={displayDisasters.length} label="Total Incidents" color="cyan" />
        <StatCard value={activeCount} label="Active Disasters" color="red" />
        <StatCard value={criticalCount} label="Critical Status" color="yellow" />
        <StatCard value={monitoringCount} label="Under Monitoring" color="green" />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Disaster list */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-white">Recent Disasters</h2>
              {isLoading && (
                <span className="w-3 h-3 border rounded-full border-slate-600 border-t-cyan-500 animate-spin" />
              )}
            </div>
            <div className="flex items-center gap-2">
              {lastUpdated && (
                <span className="text-[10px] text-slate-600 font-mono">
                  Updated {formatRelativeTime(lastUpdated)}
                </span>
              )}
              <Link to="/disasters" className="font-mono text-xs transition-colors text-cyan-400 hover:text-cyan-300">
                View all →
              </Link>
            </div>
          </div>

          <div className="space-y-2">
            {displayDisasters.slice(0, 6).map((d) => (
              <DisasterCard key={d.id} disaster={d} />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Quick links */}
          <div className="p-4 card">
            <h3 className="mb-3 font-mono text-xs tracking-wider uppercase text-slate-400">Quick Access</h3>
            <div className="space-y-2">
              {[
                { to: '/map', label: '🗺️ Disaster Map', desc: 'Polygon visualization of affected areas' },
                { to: '/disasters', label: '📋 Disaster List', desc: 'Filter and search disasters' },
                ...(isAuthenticated ? [{ to: '/alerts', label: '🔔 My Alerts', desc: 'Alerts based on your location' }] : []),
              ].map(({ to, label, desc }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-surface-secondary transition-colors group"
                >
                  <div className="flex-1">
                    <p className="text-sm text-white transition-colors group-hover:text-cyan-300">{label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                  </div>
                  <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 transition-colors text-slate-600 group-hover:text-cyan-400">
                    <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>

          {/* System status */}
          <div className="p-4 card">
            <h3 className="mb-3 font-mono text-xs tracking-wider uppercase text-slate-400">System Status</h3>
            <div className="space-y-2">
              {[
                { label: 'Real-time Data', status: 'online' },
                { label: 'AI Analysis', status: 'online' },
                { label: 'BMKG Sensors', status: 'online' },
                { label: 'Push Notifications', status: 'degraded' },
              ].map(({ label, status }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">{label}</span>
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        status === 'online'
                          ? 'bg-green-500'
                          : status === 'degraded'
                          ? 'bg-yellow-500 animate-pulse'
                          : 'bg-red-500'
                      }`}
                    />
                    <span
                      className={`text-[10px] font-mono ${
                        status === 'online' ? 'text-green-400' : status === 'degraded' ? 'text-yellow-400' : 'text-red-400'
                      }`}
                    >
                      {status === 'online' ? 'ONLINE' : status === 'degraded' ? 'DEGRADED' : 'OFFLINE'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info box */}
          {!isAuthenticated && (
            <div className="p-4 card border-cyan-500/20 bg-cyan-500/5">
              <div className="flex items-start gap-2">
                <span className="text-cyan-400 text-base mt-0.5">ℹ️</span>
                <div>
                  <p className="mb-1 text-xs font-semibold text-cyan-300">Register for Alerts</p>
                  <p className="text-xs leading-relaxed text-slate-400">
                    Registered users receive real-time alerts based on location, AI recommendations, and full access to affected area maps.
                  </p>
                  <Link to="/register" className="inline-block mt-2 font-mono text-xs underline text-cyan-400 hover:text-cyan-300 underline-offset-2">
                    Register for free →
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}