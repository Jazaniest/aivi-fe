import { useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, useMap } from 'react-leaflet';
import { getSeverityConfig, getDisasterTypeConfig, getStatusConfig, formatRelativeTime } from '../../utils/helpers';
import { useAuthStore } from '../../store/authStore';

// Set map view component
function FlyToDisaster({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 10, { duration: 1.5 });
    }
  }, [center, map]);
  return null;
}

function DisasterPopup({ disaster, isAuthenticated, userImpactLevel }) {
  const severity = getSeverityConfig(disaster.severity);
  const type = getDisasterTypeConfig(disaster.type);
  const status = getStatusConfig(disaster.status);
  const hasDetailAccess = isAuthenticated && (userImpactLevel === 'DIRECT' || userImpactLevel === 'NEARBY');

  return (
    <Popup maxWidth={280} className="aivi-popup">
      <div className="font-sans text-white min-w-55">
        {/* Header */}
        <div className="flex items-start gap-2 mb-2">
          <span className="text-lg">{type.icon}</span>
          <div>
            <p className="font-semibold text-sm leading-tight text-white">{disaster.name}</p>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">{disaster.location?.kabupaten}</p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${severity.badgeClass}`}>
            {severity.label}
          </span>
          <div className="flex items-center gap-1">
            <div className={status.dotClass} style={{ width: '6px', height: '6px' }} />
            <span className={`text-[10px] font-mono ${status.textColor}`}>{status.label}</span>
          </div>
        </div>

        {/* Time */}
        <p className="text-[11px] text-slate-500 mb-2">{formatRelativeTime(disaster.occurred_at)}</p>

        {/* Full info for authorized users */}
        {hasDetailAccess && disaster.description && (
          <p className="text-xs text-slate-300 leading-relaxed border-t border-white/10 pt-2 mb-2">
            {disaster.description.substring(0, 120)}...
          </p>
        )}

        {!hasDetailAccess && (
          <p className="text-[11px] text-slate-500 italic border-t border-white/10 pt-2">
            Login untuk melihat detail lengkap
          </p>
        )}

        <a
          href={`/disasters/${disaster.id}`}
          className="block text-center text-xs font-mono text-cyan-400 hover:text-cyan-300 mt-2 py-1 border-t border-white/10"
        >
          Lihat detail →
        </a>
      </div>
    </Popup>
  );
}

export default function DisasterMap({ disasters = [], focusDisasterId = null, height = '100%' }) {
  const { isAuthenticated } = useAuthStore();

  // Find focus disaster center
  const focusDisaster = disasters.find((d) => d.id === focusDisasterId);
  let focusCenter = null;
  if (focusDisaster?.coordinates?.length) {
    const lats = focusDisaster.coordinates.map((c) => c[0]);
    const lngs = focusDisaster.coordinates.map((c) => c[1]);
    focusCenter = [
      lats.reduce((a, b) => a + b, 0) / lats.length,
      lngs.reduce((a, b) => a + b, 0) / lngs.length,
    ];
  }

  return (
    <div style={{ height }} className="w-full rounded-lg overflow-hidden">
      <MapContainer
        center={[-2.5, 118.0]}
        zoom={5}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        {/* Dark map tiles */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          maxZoom={19}
        />

        {focusCenter && <FlyToDisaster center={focusCenter} />}

        {disasters.map((disaster) => {
          if (!disaster.coordinates?.length) return null;

          const severity = getSeverityConfig(disaster.severity);

          return (
            <Polygon
              key={disaster.id}
              positions={disaster.coordinates}
              pathOptions={{
                color: severity.color,
                fillColor: severity.color,
                fillOpacity: disaster.status === 'ACTIVE' ? 0.25 : 0.1,
                weight: disaster.id === focusDisasterId ? 3 : 1.5,
                dashArray: disaster.status === 'RESOLVED' ? '6, 4' : null,
                opacity: 0.9,
              }}
              eventHandlers={{
                mouseover: (e) => {
                  e.target.setStyle({ fillOpacity: 0.45, weight: 2.5 });
                },
                mouseout: (e) => {
                  e.target.setStyle({
                    fillOpacity: disaster.status === 'ACTIVE' ? 0.25 : 0.1,
                    weight: disaster.id === focusDisasterId ? 3 : 1.5,
                  });
                },
              }}
            >
              <DisasterPopup
                disaster={disaster}
                isAuthenticated={isAuthenticated}
                userImpactLevel={disaster.user_impact_level}
              />
            </Polygon>
          );
        })}
      </MapContainer>
    </div>
  );
}