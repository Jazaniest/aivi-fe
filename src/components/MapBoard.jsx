import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

// Fix Icon Leaflet Default
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapBoard = ({ startPoint, endPoint, viewCoords, routeMode }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const routingControlRef = useRef(null);
  const singleMarkerRef = useRef(null);
  
  // Ref khusus untuk marker lokasi user agar bisa dihapus/update
  const userLocationLayerRef = useRef(null); 
  const [isLocating, setIsLocating] = useState(false);

  // --- 1. Init Map ---
  useEffect(() => {
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      zoomControl: false, // Zoom control kita custom posisi
    }).setView([-6.2088, 106.8456], 13); // Default Jakarta (bisa diganti)

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      maxZoom: 20,
    }).addTo(map);

    // Zoom Control di kanan bawah
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapInstanceRef.current = map;

    // Listener saat lokasi ditemukan
    map.on('locationfound', (e) => {
      setIsLocating(false);
      
      // Hapus marker lokasi lama jika ada
      if (userLocationLayerRef.current) {
        map.removeLayer(userLocationLayerRef.current);
      }

      const radius = e.accuracy / 2;

      // Custom Icon: Titik Biru Berdenyut (Style mirip Google Maps)
      const pulsingIcon = L.divIcon({
        className: 'css-icon',
        html: `
          <div class="relative flex items-center justify-center w-full h-full">
            <span class="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping"></span>
            <span class="relative inline-flex rounded-full h-4 w-4 bg-blue-600 border-2 border-white shadow-lg"></span>
          </div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      // Grouping Circle (Akurasi) dan Marker (Titik)
      const locationGroup = L.layerGroup([
        L.circle(e.latlng, radius, { color: '#2563eb', weight: 1, opacity: 0.3, fillOpacity: 0.1 }),
        L.marker(e.latlng, { icon: pulsingIcon }).bindPopup(`📍 Kamu di sini<br>Akurasi: ${Math.round(radius)}m`)
      ]).addTo(map);

      userLocationLayerRef.current = locationGroup;

      // Zoom ke lokasi
      map.flyTo(e.latlng, 16, {
        animate: true,
        duration: 1.5
      });
    });

    // Listener jika gagal
    map.on('locationerror', (e) => {
      setIsLocating(false);
      alert("Gagal mendeteksi lokasi: " + e.message);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // --- 2. Handle Single Marker ---
  useEffect(() => {
    if (!mapInstanceRef.current || !viewCoords) return;

    const { lat, lon, name } = viewCoords;

    if (singleMarkerRef.current) singleMarkerRef.current.remove();

    const marker = L.marker([lat, lon])
      .addTo(mapInstanceRef.current)
      .bindPopup(`<div class="font-bold text-sm">${name}</div>`)
      .openPopup();
    
    singleMarkerRef.current = marker;

    mapInstanceRef.current.setView([lat, lon], 16, { animate: true, duration: 1.5 });
  }, [viewCoords]);

  // --- 3. Handle Routing ---
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
      routingControlRef.current = null;
    }
    
    if (routeMode && singleMarkerRef.current) {
      singleMarkerRef.current.remove();
      singleMarkerRef.current = null;
    }

    if (startPoint && endPoint && routeMode) {
      const plan = L.Routing.plan(
        [L.latLng(startPoint.lat, startPoint.lon), L.latLng(endPoint.lat, endPoint.lon)],
        {
          createMarker: function(i, wp) {
            return L.marker(wp.latLng, { draggable: true })
              .bindPopup(i === 0 ? "Start" : "Destinasi");
          },
          addWaypoints: false 
        }
      );

      const control = L.Routing.control({
        plan: plan,
        routeWhileDragging: true,
        showAlternatives: true,
        fitSelectedRoutes: true,
        containerClassName: 'hidden-routing-container',
        lineOptions: { styles: [{ color: '#6366f1', weight: 6, opacity: 0.9 }] }
      }).addTo(map);

      routingControlRef.current = control;
    }
  }, [startPoint, endPoint, routeMode]);

  // --- FUNGSI TRIGGER LOKASI SAYA ---
  const handleLocateUser = () => {
    if (!mapInstanceRef.current) return;
    setIsLocating(true);
    // Leaflet built-in locate function
    mapInstanceRef.current.locate({ 
      setView: false, // Kita handle view manual di on('locationfound') biar smooth flyTo
      maxZoom: 16,
      enableHighAccuracy: true 
    });
  };

  return (
    <div className="relative w-full h-full">
      {/* Container Peta */}
      <div ref={mapContainerRef} className="w-full h-full outline-none z-0" />

      {/* --- TOMBOL MY LOCATION --- */}
      <button 
        onClick={handleLocateUser}
        title="Lokasi Saya"
        className="absolute bottom-24 right-[10px] z-[500] bg-white p-2 rounded-lg shadow-lg border border-slate-300 hover:bg-slate-50 text-slate-700 transition-all active:scale-95"
      >
        {isLocating ? (
          <svg className="w-6 h-6 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default MapBoard;