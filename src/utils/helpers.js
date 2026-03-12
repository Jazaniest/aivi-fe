import { formatDistanceToNow, format } from 'date-fns';
import { enUS } from 'date-fns/locale';

export const severityConfig = {
  CRITICAL: {
    label: 'CRITICAL',
    color: '#ef4444',
    polygonColor: '#ef4444',
    fillColor: 'rgba(239, 68, 68, 0.25)',
    badgeClass: 'severity-badge-critical',
    borderColor: 'border-red-500/40',
    bgColor: 'bg-red-500/10',
    textColor: 'text-red-400',
    ringColor: 'ring-red-500/30',
  },
  HIGH: {
    label: 'HIGH',
    color: '#f97316',
    polygonColor: '#f97316',
    fillColor: 'rgba(249, 115, 22, 0.25)',
    badgeClass: 'severity-badge-high',
    borderColor: 'border-orange-500/40',
    bgColor: 'bg-orange-500/10',
    textColor: 'text-orange-400',
    ringColor: 'ring-orange-500/30',
  },
  MEDIUM: {
    label: 'MEDIUM',
    color: '#eab308',
    polygonColor: '#eab308',
    fillColor: 'rgba(234, 179, 8, 0.25)',
    badgeClass: 'severity-badge-medium',
    borderColor: 'border-yellow-500/40',
    bgColor: 'bg-yellow-500/10',
    textColor: 'text-yellow-400',
    ringColor: 'ring-yellow-500/30',
  },
  LOW: {
    label: 'LOW',
    color: '#22c55e',
    polygonColor: '#22c55e',
    fillColor: 'rgba(34, 197, 94, 0.25)',
    badgeClass: 'severity-badge-low',
    borderColor: 'border-green-500/40',
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-400',
    ringColor: 'ring-green-500/30',
  },
};

export const disasterTypeConfig = {
  BANJIR: { label: 'Flood', icon: '🌊' },
  GEMPA: { label: 'Earthquake', icon: '🌍' },
  KEBAKARAN: { label: 'Fire', icon: '🔥' },
  TSUNAMI: { label: 'Tsunami', icon: '🌊' },
  LONGSOR: { label: 'Landslide', icon: '⛰️' },
  GUNUNG_BERAPI: { label: 'Volcano', icon: '🌋' },
  ANGIN_PUTING: { label: 'Tornado', icon: '🌪️' },
  KEKERINGAN: { label: 'Drought', icon: '🌵' },
};

export const statusConfig = {
  ACTIVE: {
    label: 'Active',
    dotClass: 'status-dot-active',
    textColor: 'text-red-400',
  },
  MONITORING: {
    label: 'Monitoring',
    dotClass: 'status-dot-monitoring',
    textColor: 'text-yellow-400',
  },
  RESOLVED: {
    label: 'Resolved',
    dotClass: 'status-dot-resolved',
    textColor: 'text-green-400',
  },
};

export function formatRelativeTime(dateStr) {
  try {
    return formatDistanceToNow(new Date(dateStr), {
      addSuffix: true,
      locale: enUS,
    });
  } catch {
    return '-';
  }
}

export function formatDateTime(dateStr) {
  try {
    return format(new Date(dateStr), 'dd MMM yyyy, HH:mm', { locale: enUS });
  } catch {
    return '-';
  }
}

export function formatNumber(n) {
  if (!n) return '0';
  return new Intl.NumberFormat('en-US').format(n);
}

export function getSeverityConfig(severity) {
  return severityConfig[severity] || severityConfig.MEDIUM;
}

export function getDisasterTypeConfig(type) {
  return disasterTypeConfig[type] || { label: type, icon: '⚠️' };
}

export function getStatusConfig(status) {
  return statusConfig[status] || statusConfig.MONITORING;
}

// Impact level from backend: 'DIRECT', 'NEARBY', 'NONE'
export function getImpactConfig(impactLevel) {
  const map = {
    DIRECT: {
      level: 'CRITICAL',
      label: 'Directly Affected',
      color: 'text-red-400',
      bg: 'bg-red-500/20',
      border: 'border-red-500/40',
    },
    NEARBY: {
      level: 'WARNING',
      label: 'Surrounding Area',
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/20',
      border: 'border-yellow-500/40',
    },
    NONE: {
      level: 'SAFE',
      label: 'Not Affected',
      color: 'text-green-400',
      bg: 'bg-green-500/20',
      border: 'border-green-500/40',
    },
  };
  return map[impactLevel] || map.NONE;
}