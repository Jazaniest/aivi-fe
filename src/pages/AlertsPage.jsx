import { useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useDisasterStore, MOCK_DISASTERS } from '../store/disasterStore';
import { getSeverityConfig, getDisasterTypeConfig, formatRelativeTime, getImpactConfig } from '../utils/helpers';
import AIRecommendationPanel from '../components/ui/AIRecommendationPanel';

// Mock alerts based on mock disasters
const MOCK_ALERTS = [
  {
    id: 'a1',
    disaster_id: '1',
    impact_level: 'DIRECT',
    disaster: MOCK_DISASTERS[0],
  },
  {
    id: 'a2',
    disaster_id: '2',
    impact_level: 'NEARBY',
    disaster: MOCK_DISASTERS[1],
  },
  {
    id: 'a3',
    disaster_id: '3',
    impact_level: 'NONE',
    disaster: MOCK_DISASTERS[2],
  },
];

function AlertCard({ alert }) {
  const impact = getImpactConfig(alert.impact_level);
  const severity = getSeverityConfig(alert.disaster?.severity);
  const type = getDisasterTypeConfig(alert.disaster?.type);

  return (
    <div className={`card p-4 border ${impact.border} animate-fade-in`}>
      {/* Alert level banner */}
      <div className={`flex items-center gap-2 mb-3 p-2 rounded ${impact.bg}`}>
        <span className="text-base">
          {alert.impact_level === 'DIRECT' ? '⚠️' : alert.impact_level === 'NEARBY' ? '🔔' : 'ℹ️'}
        </span>
        <span className={`text-xs font-mono font-semibold ${impact.color}`}>
          {alert.impact_level === 'DIRECT'
            ? 'CRITICAL WARNING — YOUR AREA IS DIRECTLY AFFECTED'
            : alert.impact_level === 'NEARBY'
            ? 'WARNING — DISASTER IN SURROUNDING AREA'
            : 'INFO — DISASTER DETECTED'}
        </span>
      </div>

      {/* Disaster info */}
      <div className="flex items-start gap-3 mb-3">
        <span className="text-2xl">{type.icon}</span>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-white">{alert.disaster?.name}</h3>
              <p className="font-mono text-xs text-slate-500">
                {alert.disaster?.location?.kabupaten}, {alert.disaster?.location?.provinsi}
              </p>
            </div>
            <span className={severity.badgeClass}>{severity.label}</span>
          </div>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            {alert.disaster?.description?.substring(0, 150)}...
          </p>
          <p className="text-[10px] text-slate-600 font-mono mt-1">
            {formatRelativeTime(alert.disaster?.occurred_at)}
          </p>
        </div>
      </div>

      {/* Critical: evacuation + contacts */}
      {alert.impact_level === 'DIRECT' && alert.disaster?.evacuation_instructions && (
        <div className="p-3 mb-3 border rounded-lg bg-red-950/30 border-red-500/20">
          <p className="text-[10px] font-mono text-red-400 uppercase tracking-wider mb-1">Evacuation Instructions</p>
          <p className="text-xs leading-relaxed text-slate-300">{alert.disaster.evacuation_instructions}</p>
        </div>
      )}

      {alert.impact_level === 'DIRECT' && alert.disaster?.emergency_contacts?.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-3">
          {alert.disaster.emergency_contacts.map((c, i) => (
            <a
              key={i}
              href={`tel:${c.phone}`}
              className="p-2 transition-colors border rounded-lg bg-surface-secondary hover:bg-surface-hover border-border"
            >
              <p className="text-[10px] text-slate-500">{c.name}</p>
              <p className="font-mono text-xs text-cyan-400">{c.phone}</p>
            </a>
          ))}
        </div>
      )}

      {/* AI Recommendation */}
      <div className="mb-3">
        <AIRecommendationPanel
          disasterId={alert.disaster_id}
          impactLevel={alert.impact_level}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Link
          to={`/map?disaster=${alert.disaster_id}`}
          className="flex-1 py-2 text-xs text-center btn-secondary"
        >
          View on Map
        </Link>
        <Link
          to={`/disasters/${alert.disaster_id}`}
          className="flex-1 py-2 text-xs text-center btn-secondary"
        >
          Disaster Details
        </Link>
      </div>
    </div>
  );
}

export default function AlertsPage() {
  const { isAuthenticated, user } = useAuthStore();
  const { userAlerts, fetchUserAlerts } = useDisasterStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const displayAlerts = userAlerts.length > 0 ? userAlerts : MOCK_ALERTS;
  //eslint-disable-next-line
  useEffect(() => {
    fetchUserAlerts();
  }, [fetchUserAlerts]);

  const criticalAlerts = displayAlerts.filter((a) => a.impact_level === 'DIRECT');
  const nearbyAlerts = displayAlerts.filter((a) => a.impact_level === 'NEARBY');
  const infoAlerts = displayAlerts.filter((a) => a.impact_level === 'NONE');

  return (
    <div className="max-w-3xl px-4 py-6 mx-auto sm:px-6">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-xl font-bold text-white">My Alerts</h1>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <p className="font-mono text-xs text-slate-500">
            Based on your location: {user?.location?.kabupaten || 'Unknown'}
          </p>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        <div className="p-3 text-center card border-red-500/20">
          <p className="font-mono text-xl font-bold text-red-400">{criticalAlerts.length}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Critical</p>
        </div>
        <div className="p-3 text-center card border-yellow-500/20">
          <p className="font-mono text-xl font-bold text-yellow-400">{nearbyAlerts.length}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Warning</p>
        </div>
        <div className="p-3 text-center card">
          <p className="font-mono text-xl font-bold text-cyan-400">{infoAlerts.length}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Information</p>
        </div>
      </div>

      {displayAlerts.length === 0 ? (
        <div className="py-16 text-center">
          <div className="mb-3 text-4xl">✅</div>
          <p className="font-medium text-slate-300">No active alerts</p>
          <p className="mt-1 text-sm text-slate-500">Your area is safe from monitored disasters</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Critical first */}
          {criticalAlerts.length > 0 && (
            <div>
              <h2 className="text-xs font-mono text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                Critical Alerts
              </h2>
              <div className="space-y-3">
                {criticalAlerts.map((a) => <AlertCard key={a.id} alert={a} />)}
              </div>
            </div>
          )}

          {nearbyAlerts.length > 0 && (
            <div>
              <h2 className="text-xs font-mono text-yellow-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                Surrounding Area
              </h2>
              <div className="space-y-3">
                {nearbyAlerts.map((a) => <AlertCard key={a.id} alert={a} />)}
              </div>
            </div>
          )}

          {infoAlerts.length > 0 && (
            <div>
              <h2 className="mb-2 font-mono text-xs tracking-wider uppercase text-slate-400">General Information</h2>
              <div className="space-y-3">
                {infoAlerts.map((a) => <AlertCard key={a.id} alert={a} />)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}