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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Hero section */}
      <div className="relative mb-8 overflow-hidden">
        <div className="py-8 sm:py-12">
          {/* Ambient glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="font-mono text-xs text-slate-400 tracking-widest uppercase">
                Sistem Aktif — {activeCount} Bencana Dipantau
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-3">
              Informasi Bencana{' '}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500">
                Real-Time
              </span>
            </h1>
            <p className="text-slate-400 text-base max-w-xl leading-relaxed">
              Platform peringatan dan informasi bencana berbasis AI untuk seluruh wilayah Indonesia.
              {!isAuthenticated && ' Daftar untuk menerima peringatan sesuai lokasi Anda.'}
            </p>

            {!isAuthenticated && (
              <div className="flex gap-3 mt-5">
                <Link to="/register" className="btn-primary">
                  Daftar Sekarang
                </Link>
                <Link to="/disasters" className="btn-secondary">
                  Lihat Bencana
                </Link>
              </div>
            )}

            {isAuthenticated && (
              <div className="mt-4 inline-flex items-center gap-2 bg-surface border border-border rounded-lg px-4 py-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm text-slate-300">
                  Anda masuk sebagai{' '}
                  <span className="text-white font-medium">{user?.name?.split(' ')[0]}</span>
                  {user?.location?.kabupaten && (
                    <> · <span className="text-cyan-400 text-xs font-mono">{user.location.kabupaten}</span></>
                  )}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <StatCard value={displayDisasters.length} label="Total Kejadian" color="cyan" />
        <StatCard value={activeCount} label="Bencana Aktif" color="red" />
        <StatCard value={criticalCount} label="Status Kritis" color="yellow" />
        <StatCard value={monitoringCount} label="Dalam Pemantauan" color="green" />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Disaster list */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-white">Bencana Terkini</h2>
              {isLoading && (
                <span className="w-3 h-3 border border-slate-600 border-t-cyan-500 rounded-full animate-spin" />
              )}
            </div>
            <div className="flex items-center gap-2">
              {lastUpdated && (
                <span className="text-[10px] text-slate-600 font-mono">
                  Diperbarui {formatRelativeTime(lastUpdated)}
                </span>
              )}
              <Link to="/disasters" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-mono">
                Lihat semua →
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
          <div className="card p-4">
            <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3">Akses Cepat</h3>
            <div className="space-y-2">
              {[
                { to: '/map', label: '🗺️ Peta Bencana', desc: 'Visualisasi polygon wilayah terdampak' },
                { to: '/disasters', label: '📋 Daftar Bencana', desc: 'Filter dan cari bencana' },
                ...(isAuthenticated ? [{ to: '/alerts', label: '🔔 Peringatan Saya', desc: 'Peringatan sesuai lokasi Anda' }] : []),
              ].map(({ to, label, desc }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-surface-secondary transition-colors group"
                >
                  <div className="flex-1">
                    <p className="text-sm text-white group-hover:text-cyan-300 transition-colors">{label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                  </div>
                  <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 text-slate-600 group-hover:text-cyan-400 transition-colors">
                    <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>

          {/* System status */}
          <div className="card p-4">
            <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3">Status Sistem</h3>
            <div className="space-y-2">
              {[
                { label: 'Data Real-time', status: 'online' },
                { label: 'Analisis AI', status: 'online' },
                { label: 'Sensor BMKG', status: 'online' },
                { label: 'Notifikasi Push', status: 'degraded' },
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
                      {status === 'online' ? 'ONLINE' : status === 'degraded' ? 'TERGANGGU' : 'OFFLINE'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info box */}
          {!isAuthenticated && (
            <div className="card p-4 border-cyan-500/20 bg-cyan-500/5">
              <div className="flex items-start gap-2">
                <span className="text-cyan-400 text-base mt-0.5">ℹ️</span>
                <div>
                  <p className="text-xs font-semibold text-cyan-300 mb-1">Daftar untuk Peringatan</p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Pengguna terdaftar menerima peringatan real-time berdasarkan lokasi, rekomendasi AI, dan akses penuh ke peta terdampak.
                  </p>
                  <Link to="/register" className="inline-block mt-2 text-xs text-cyan-400 hover:text-cyan-300 font-mono underline underline-offset-2">
                    Daftar gratis →
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