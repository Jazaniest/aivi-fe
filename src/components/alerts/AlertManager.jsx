import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatRelativeTime } from '../../utils/helpers';

// ─── Critical Alert Modal (DIRECT impact) ────────────────────────────────────
export function CriticalAlertModal({ alert, onAcknowledge }) {
  const [step, setStep] = useState(0);

  const handleAcknowledge = () => {
    setStep(1);
    setTimeout(() => onAcknowledge(alert.id), 400);
  };

  return (
    <div className="fixed inset-0 z-9000 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Pulsing border effect */}
      <div
        className="absolute inset-4 sm:inset-16 rounded-2xl border-2 border-red-500/30 pointer-events-none"
        style={{ animation: 'pulseRed 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}
      />

      <div
        className={`relative w-full max-w-lg bg-navy-800 border-2 border-red-500/70 rounded-xl shadow-2xl animate-slide-up transition-opacity duration-300 ${step === 1 ? 'opacity-0' : 'opacity-100'}`}
        style={{ boxShadow: '0 0 60px rgba(239, 68, 68, 0.3), 0 0 120px rgba(239, 68, 68, 0.1)' }}
      >
        {/* Red top bar */}
        <div className="h-1 w-full bg-linear-to-r from-red-700 via-red-500 to-red-700 rounded-t-xl" />

        <div className="p-5 sm:p-6">
          {/* Header */}
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-xl shrink-0 animate-pulse">
              ⚠️
            </div>
            <div>
              <div className="font-mono text-[10px] text-red-400 tracking-widest mb-1">
                SIAGA I — PERINGATAN KRITIS
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white leading-tight">
                {alert.disaster?.name || 'Bencana Terdeteksi'}
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {formatRelativeTime(alert.disaster?.occurred_at)} · {alert.disaster?.location?.kabupaten}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="bg-red-950/40 border border-red-500/20 rounded-lg p-3 mb-4">
            <p className="text-sm text-slate-300 leading-relaxed">
              {alert.disaster?.description}
            </p>
          </div>

          {/* Evacuation instructions */}
          {alert.disaster?.evacuation_instructions && (
            <div className="mb-4">
              <div className="font-mono text-xs text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                Instruksi Evakuasi
              </div>
              <p className="text-sm text-white leading-relaxed bg-surface-secondary rounded-lg p-3">
                {alert.disaster?.evacuation_instructions}
              </p>
            </div>
          )}

          {/* Emergency contacts */}
          {alert.disaster?.emergency_contacts?.length > 0 && (
            <div className="mb-5">
              <div className="font-mono text-xs text-slate-400 uppercase tracking-wider mb-2">
                Kontak Darurat
              </div>
              <div className="grid grid-cols-2 gap-2">
                {alert.disaster.emergency_contacts.map((contact, i) => (
                  <a
                    key={i}
                    href={`tel:${contact.phone}`}
                    className="flex flex-col bg-surface-secondary hover:bg-surface-hover border border-border rounded-lg p-2.5 transition-colors"
                  >
                    <span className="text-xs text-slate-400">{contact.name}</span>
                    <span className="text-sm font-mono font-semibold text-cyan-400">{contact.phone}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Link
              to={`/map?disaster=${alert.disaster?.id}`}
              className="flex-1 text-center btn-secondary text-xs py-2.5"
            >
              Lihat di Peta
            </Link>
            <button
              onClick={handleAcknowledge}
              className="flex-1 btn-danger text-xs py-2.5 font-mono tracking-wide"
            >
              SAYA MENGERTI
            </button>
          </div>

          <p className="text-center text-[10px] text-slate-600 font-mono mt-3">
            Peringatan ini tidak dapat ditutup tanpa konfirmasi
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Nearby Warning Banner (NEARBY impact) ───────────────────────────────────
export function NearbyWarningBanner({ alert, onDismiss }) {
  const [visible, setVisible] = useState(true);

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(() => onDismiss(alert.id), 300);
  };

  return (
    <div
      className={`fixed top-14 left-0 right-0 z-8000 transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}`}
    >
      <div
        className="bg-yellow-900/80 border-b border-yellow-500/40 backdrop-blur-sm"
        style={{ boxShadow: '0 4px 20px rgba(234, 179, 8, 0.15)' }}
      >
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-3">
          <span className="text-base shrink-0">🔔</span>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-mono text-yellow-400 font-semibold">
              PERINGATAN WILAYAH SEKITAR
            </span>
            <span className="text-xs text-yellow-200/80 ml-2">
              {alert.disaster?.name} — {alert.disaster?.location?.kabupaten}
            </span>
            <span className="hidden sm:inline text-xs text-slate-400 ml-2">
              {formatRelativeTime(alert.disaster?.occurred_at)}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to={`/disasters/${alert.disaster?.id}`}
              className="text-xs font-mono text-yellow-400 hover:text-yellow-300 underline underline-offset-2"
            >
              Detail
            </Link>
            <button
              onClick={handleDismiss}
              className="text-yellow-500 hover:text-white transition-colors text-sm"
              aria-label="Tutup peringatan"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Info Toast for unaffected users ─────────────────────────────────────────
export function InfoAlertStrip({ alerts }) {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 z-7000 max-w-xs animate-slide-up">
      <div className="card p-3 border-border/80">
        <div className="flex items-start gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
          <div>
            <p className="text-xs font-mono text-cyan-400 mb-0.5">INFO BENCANA</p>
            <p className="text-xs text-slate-400">
              Ada {alerts.length} bencana aktif di{' '}
              {[...new Set(alerts.map((a) => a.disaster?.location?.provinsi))].slice(0, 2).join(', ')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Alert Manager — renders appropriate alerts based on impact level ─────────
export function AlertManager({ alerts = [] }) {
  const [dismissedIds, setDismissedIds] = useState([]);
  const [acknowledgedIds, setAcknowledgedIds] = useState([]);

  const visibleAlerts = alerts.filter(
    (a) => !dismissedIds.includes(a.id) && !acknowledgedIds.includes(a.id)
  );

  const criticalAlerts = visibleAlerts.filter((a) => a.impact_level === 'DIRECT');
  const nearbyAlerts = visibleAlerts.filter((a) => a.impact_level === 'NEARBY');
  const infoAlerts = visibleAlerts.filter((a) => a.impact_level === 'NONE');

  const handleAcknowledge = (id) => setAcknowledgedIds((prev) => [...prev, id]);
  const handleDismiss = (id) => setDismissedIds((prev) => [...prev, id]);

  return (
    <>
      {criticalAlerts.length > 0 && (
        <CriticalAlertModal
          alert={criticalAlerts[0]}
          onAcknowledge={handleAcknowledge}
        />
      )}
      {nearbyAlerts.map((alert) => (
        <NearbyWarningBanner
          key={alert.id}
          alert={alert}
          onDismiss={handleDismiss}
        />
      ))}
      {infoAlerts.length > 0 && criticalAlerts.length === 0 && (
        <InfoAlertStrip alerts={infoAlerts} />
      )}
    </>
  );
}