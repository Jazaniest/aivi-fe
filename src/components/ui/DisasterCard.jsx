import { Link } from 'react-router-dom';
import {
  getSeverityConfig,
  getDisasterTypeConfig,
  getStatusConfig,
  formatRelativeTime,
  formatNumber,
} from '../../utils/helpers';

export default function DisasterCard({ disaster, compact = false }) {
  const severity = getSeverityConfig(disaster.severity);
  const type = getDisasterTypeConfig(disaster.type);
  const status = getStatusConfig(disaster.status);

  if (compact) {
    return (
      <div className={`card p-3 hover:bg-surface-secondary transition-all duration-200 cursor-pointer border-l-2 ${disaster.severity === 'CRITICAL' ? 'border-l-red-500' : disaster.severity === 'HIGH' ? 'border-l-orange-500' : disaster.severity === 'MEDIUM' ? 'border-l-yellow-500' : 'border-l-green-500'}`}>
        <div className="flex items-start gap-2">
          <span className="text-base mt-0.5">{type.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{disaster.name}</p>
            <p className="text-xs text-slate-500 truncate">{disaster.location?.kabupaten}</p>
          </div>
          <span className={`shrink-0 font-mono text-[10px] px-1.5 py-0.5 rounded border ${severity.bgColor} ${severity.textColor} ${severity.borderColor}`}>
            {severity.label}
          </span>
        </div>
      </div>
    );
  }

  return (
    <Link to={`/disasters/${disaster.id}`}>
      <div className={`card p-4 hover:bg-surface-secondary transition-all duration-200 group animate-fade-in relative overflow-hidden`}>
        {/* Severity left bar */}
        <div
          className="absolute left-0 top-0 bottom-0 w-0.5 transition-all duration-200 group-hover:w-1"
          style={{ backgroundColor: severity.color }}
        />

        <div className="pl-2">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-lg">{type.icon}</span>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-white truncate group-hover:text-cyan-300 transition-colors">
                  {disaster.name}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {disaster.location?.kabupaten}, {disaster.location?.provinsi}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className={severity.badgeClass}>{severity.label}</span>
              <div className="flex items-center gap-1.5">
                <div className={status.dotClass} />
                <span className={`text-[10px] font-mono ${status.textColor}`}>{status.label}</span>
              </div>
            </div>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="font-mono bg-surface-secondary px-2 py-0.5 rounded text-slate-400">
              {type.label}
            </span>
            <span>{formatRelativeTime(disaster.occurred_at)}</span>
            {disaster.affected_count && (
              <span className="text-slate-600">
                ~{formatNumber(disaster.affected_count)} terdampak
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}