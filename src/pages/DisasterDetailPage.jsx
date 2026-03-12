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
      <div className="max-w-4xl px-4 py-6 mx-auto sm:px-6">
        <div className="space-y-4 animate-pulse">
          <div className="w-1/2 h-6 skeleton" />
          <div className="w-1/3 h-4 skeleton" />
          <div className="p-6 space-y-3 card">
            <div className="w-full h-4 skeleton" />
            <div className="w-4/5 h-4 skeleton" />
            <div className="w-3/4 h-4 skeleton" />
          </div>
          <div className="rounded-lg skeleton h-72" />
        </div>
      </div>
    );
  }

  if (!disaster) {
    return (
      <div className="max-w-4xl px-4 py-6 mx-auto text-center sm:px-6">
        <div className="mb-3 text-4xl">🔍</div>
        <p className="text-slate-400">Disaster not found</p>
        <Link to="/disasters" className="inline-block mt-3 font-mono text-xs text-cyan-400">
          ← Back to list
        </Link>
      </div>
    );
  }

  const severity = getSeverityConfig(disaster.severity);
  const type = getDisasterTypeConfig(disaster.type);
  const status = getStatusConfig(disaster.status);
  const userImpactLevel = disaster.user_impact_level || 'NONE';

  return (
    <div className="max-w-4xl px-4 py-6 mx-auto sm:px-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4 font-mono text-xs text-slate-500">
        <Link to="/" className="transition-colors hover:text-slate-300">Home</Link>
        <span>/</span>
        <Link to="/disasters" className="transition-colors hover:text-slate-300">Disasters</Link>
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
            <h1 className="text-xl font-bold text-white sm:text-2xl">{disaster.name}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-500">
              <span className="font-mono">📍 {disaster.location?.kabupaten}, {disaster.location?.provinsi}</span>
              <span>🕐 {formatDateTime(disaster.occurred_at)}</span>
              {disaster.affected_count && (
                <span>👥 ~{formatNumber(disaster.affected_count)} people affected</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Main content */}
        <div className="space-y-4 md:col-span-2">
          {/* Description */}
          <div className="p-4 card">
            <h2 className="mb-2 font-mono text-xs tracking-wider uppercase text-slate-400">Description</h2>
            <p className="text-sm leading-relaxed text-slate-300">{disaster.description}</p>
          </div>

          {/* Map */}
          <div className="overflow-hidden card">
            <div className="flex items-center justify-between p-3 border-b border-border">
              <h2 className="font-mono text-xs tracking-wider uppercase text-slate-400">Affected Area Map</h2>
              <Link to={`/map?disaster=${disaster.id}`} className="font-mono text-xs text-cyan-400 hover:text-cyan-300">
                Open full map →
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
            <div className="p-4 card border-cyan-500/20 bg-cyan-500/5">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 border rounded bg-cyan-500/20 border-cyan-500/30 shrink-0">
                  <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                    <circle cx="8" cy="8" r="3" fill="#06b6d4" opacity="0.9" />
                    <path d="M8 2v1M8 13v1M2 8h1M13 8h1" stroke="#06b6d4" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
                  </svg>
                </div>
                <div>
                  <p className="mb-1 text-sm font-semibold text-cyan-300">AI Recommendations Available</p>
                  <p className="text-xs leading-relaxed text-slate-400">
                    Login to get AI-powered situational recommendations, including evacuation guidance, weather conditions, and mitigation steps based on your location.
                  </p>
                  <Link to="/login" className="inline-block mt-2 text-xs btn-primary py-1.5 px-3">
                    Login now
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
            <div className="p-4 card border-orange-500/20">
              <h3 className="text-xs font-mono text-orange-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                Evacuation Instructions
              </h3>
              <p className="text-xs leading-relaxed text-slate-300">{disaster.evacuation_instructions}</p>
            </div>
          )}

          {/* Emergency contacts */}
          {disaster.emergency_contacts?.length > 0 && (
            <div className="p-4 card">
              <h3 className="mb-2 font-mono text-xs tracking-wider uppercase text-slate-400">Emergency Contacts</h3>
              <div className="space-y-2">
                {disaster.emergency_contacts.map((c, i) => (
                  <a
                    key={i}
                    href={`tel:${c.phone}`}
                    className="flex items-center justify-between p-2 transition-colors rounded hover:bg-surface-secondary group"
                  >
                    <span className="text-xs text-slate-400 group-hover:text-slate-300">{c.name}</span>
                    <span className="font-mono text-xs text-cyan-400 group-hover:text-cyan-300">{c.phone}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Meta info */}
          <div className="p-4 card">
            <h3 className="mb-3 font-mono text-xs tracking-wider uppercase text-slate-400">Information</h3>
            <div className="space-y-2 text-xs">
              {[
                { label: 'Impact Radius', value: disaster.impact_radius_km ? `${disaster.impact_radius_km} km` : '-' },
                { label: 'Affected Population', value: disaster.affected_count ? formatNumber(disaster.affected_count) + ' people' : '-' },
                { label: 'Occurred', value: formatRelativeTime(disaster.occurred_at) },
                { label: 'Coordinates', value: disaster.coordinates?.length ? `${disaster.coordinates.length} points` : '-' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between">
                  <span className="text-slate-500">{label}</span>
                  <span className="font-mono text-slate-300">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}