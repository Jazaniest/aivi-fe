import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { disasterService } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { MOCK_DISASTERS } from '../store/disasterStore';
import {
  getSeverityConfig,
  getDisasterTypeConfig,
  getStatusConfig,
  formatDateTime,
  formatRelativeTime,
  formatNumber,
} from '../utils/helpers';
import DisasterMap from '../components/map/DisasterMap';
import AIRecommendationPanel from '../components/ui/AIRecommendationPanel';

export default function DisasterDetailPage() {
  const { id } = useParams();
  const { isAuthenticated } = useAuthStore();
  const [disaster, setDisaster] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    //eslint-disable-next-line
    setIsLoading(true);
    disasterService.getById(id)
      .then(({ data }) => setDisaster(data.disaster))
      .catch(() => {
        // Use mock data in dev
        const mock = MOCK_DISASTERS.find((d) => d.id === id);
        if (mock) setDisaster(mock);
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="animate-pulse space-y-4">
          <div className="skeleton h-6 w-1/2" />
          <div className="skeleton h-4 w-1/3" />
          <div className="card p-6 space-y-3">
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-4/5" />
            <div className="skeleton h-4 w-3/4" />
          </div>
          <div className="skeleton h-72 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!disaster) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 text-center">
        <div className="text-4xl mb-3">🔍</div>
        <p className="text-slate-400">Bencana tidak ditemukan</p>
        <Link to="/disasters" className="mt-3 inline-block text-xs text-cyan-400 font-mono">
          ← Kembali ke daftar
        </Link>
      </div>
    );
  }

  const severity = getSeverityConfig(disaster.severity);
  const type = getDisasterTypeConfig(disaster.type);
  const status = getStatusConfig(disaster.status);
  const userImpactLevel = disaster.user_impact_level || 'NONE';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-4">
        <Link to="/" className="hover:text-slate-300 transition-colors">Beranda</Link>
        <span>/</span>
        <Link to="/disasters" className="hover:text-slate-300 transition-colors">Bencana</Link>
        <span>/</span>
        <span className="text-slate-400">{disaster.name}</span>
      </div>

      {/* Header */}
      <div className={`card p-5 mb-4 border-l-4 ${disaster.severity === 'CRITICAL' ? 'critical-glow' : disaster.severity === 'HIGH' ? 'warning-glow' : ''}`}
        style={{ borderLeftColor: severity.color }}>
        <div className="flex items-start gap-3">
          <span className="text-3xl">{type.icon}</span>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className={severity.badgeClass}>{severity.label}</span>
              <div className="flex items-center gap-1.5">
                <div className={status.dotClass} />
                <span className={`text-xs font-mono ${status.textColor}`}>{status.label}</span>
              </div>
              <span className="font-mono text-xs bg-surface-secondary px-2 py-0.5 rounded text-slate-400">
                {type.label}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">{disaster.name}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-500">
              <span className="font-mono">📍 {disaster.location?.kabupaten}, {disaster.location?.provinsi}</span>
              <span>🕐 {formatDateTime(disaster.occurred_at)}</span>
              {disaster.affected_count && (
                <span>👥 ~{formatNumber(disaster.affected_count)} jiwa terdampak</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Main content */}
        <div className="md:col-span-2 space-y-4">
          {/* Description */}
          <div className="card p-4">
            <h2 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Deskripsi</h2>
            <p className="text-sm text-slate-300 leading-relaxed">{disaster.description}</p>
          </div>

          {/* Map */}
          <div className="card overflow-hidden">
            <div className="p-3 border-b border-border flex items-center justify-between">
              <h2 className="text-xs font-mono text-slate-400 uppercase tracking-wider">Peta Terdampak</h2>
              <Link to={`/map?disaster=${disaster.id}`} className="text-xs text-cyan-400 font-mono hover:text-cyan-300">
                Buka peta penuh →
              </Link>
            </div>
            <DisasterMap
              disasters={[disaster]}
              focusDisasterId={disaster.id}
              height="280px"
            />
          </div>

          {/* AI Recommendation */}
          {isAuthenticated && (
            <AIRecommendationPanel
              disasterId={disaster.id}
              impactLevel={userImpactLevel}
            />
          )}

          {!isAuthenticated && (
            <div className="card p-4 border-cyan-500/20 bg-cyan-500/5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                    <circle cx="8" cy="8" r="3" fill="#06b6d4" opacity="0.9" />
                    <path d="M8 2v1M8 13v1M2 8h1M13 8h1" stroke="#06b6d4" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-cyan-300 mb-1">Rekomendasi AI Tersedia</p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Login untuk mendapatkan rekomendasi situasional berbasis AI, termasuk panduan evakuasi, kondisi cuaca, dan langkah mitigasi sesuai lokasi Anda.
                  </p>
                  <Link to="/login" className="inline-block mt-2 text-xs btn-primary py-1.5 px-3">
                    Masuk sekarang
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Evacuation */}
          {disaster.evacuation_instructions && (
            <div className="card p-4 border-orange-500/20">
              <h3 className="text-xs font-mono text-orange-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                Instruksi Evakuasi
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">{disaster.evacuation_instructions}</p>
            </div>
          )}

          {/* Emergency contacts */}
          {disaster.emergency_contacts?.length > 0 && (
            <div className="card p-4">
              <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Kontak Darurat</h3>
              <div className="space-y-2">
                {disaster.emergency_contacts.map((c, i) => (
                  <a
                    key={i}
                    href={`tel:${c.phone}`}
                    className="flex items-center justify-between p-2 rounded hover:bg-surface-secondary transition-colors group"
                  >
                    <span className="text-xs text-slate-400 group-hover:text-slate-300">{c.name}</span>
                    <span className="text-xs font-mono text-cyan-400 group-hover:text-cyan-300">{c.phone}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Meta info */}
          <div className="card p-4">
            <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3">Informasi</h3>
            <div className="space-y-2 text-xs">
              {[
                { label: 'Radius Dampak', value: disaster.impact_radius_km ? `${disaster.impact_radius_km} km` : '-' },
                { label: 'Jumlah Terdampak', value: disaster.affected_count ? formatNumber(disaster.affected_count) + ' jiwa' : '-' },
                { label: 'Kejadian', value: formatRelativeTime(disaster.occurred_at) },
                { label: 'Koordinat', value: disaster.coordinates?.length ? `${disaster.coordinates.length} titik` : '-' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between">
                  <span className="text-slate-500">{label}</span>
                  <span className="text-slate-300 font-mono">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}