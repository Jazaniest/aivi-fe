import React, { useState, useEffect } from 'react';

const SearchSidebar = ({ 
  onLocationSelect, 
  routeMode, 
  setRouteMode, 
  startPoint, 
  endPoint,
  onReset,
  setStartPoint,
  setEndPoint
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Search API
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length < 3) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`);
        const data = await res.json();
        setResults(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (item) => {
    onLocationSelect({
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      name: item.display_name
    });
    setQuery('');
    setResults([]);
  };

  return (
    <div className="w-full flex flex-col bg-white">
      {/* Header Panel */}
      <div className="p-5 border-b border-slate-100">
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 mb-4">
          {routeMode ? 'Perjalanan' : 'Mau kemana hari ini?'}
        </h2>
        
        {/* Search Input Box */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
            placeholder={routeMode ? "Cari titik lokasi..." : "Cari restoran, jalan, kota..."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {loading && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <div className="animate-spin h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex gap-2">
          <button 
            onClick={() => setRouteMode(!routeMode)}
            className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2
              ${routeMode 
                ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
                : 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5'
              }`}
          >
            {routeMode ? 'Batal' : '📍 Buat Rute'}
          </button>
          
          {routeMode && (
            <button 
              onClick={onReset}
              className="px-4 py-2.5 rounded-xl bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Route Status Indicators */}
      {routeMode && (
        <div className="bg-indigo-50/50 p-4 space-y-3">
          <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-indigo-100 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xs border border-green-200">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Titik Awal</p>
              <p className="text-sm font-medium truncate text-slate-800">
                {startPoint ? startPoint.name.split(',')[0] : <span className="text-slate-400 italic">Pilih lokasi...</span>}
              </p>
              {startPoint && <button onClick={() => setStartPoint(null)} className="text-xs text-red-400 hover:text-red-600 mt-1">Hapus</button>}
            </div>
          </div>

          <div className="flex justify-center -my-2 relative z-10">
            <span className="bg-indigo-50 p-1 text-slate-300">⬇</span>
          </div>

          <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-indigo-100 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs border border-indigo-200">
              B
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Tujuan</p>
              <p className="text-sm font-medium truncate text-slate-800">
                {endPoint ? endPoint.name.split(',')[0] : <span className="text-slate-400 italic">Pilih lokasi...</span>}
              </p>
              {endPoint && <button onClick={() => setEndPoint(null)} className="text-xs text-red-400 hover:text-red-600 mt-1">Hapus</button>}
            </div>
          </div>
        </div>
      )}

      {/* Search Results List */}
      <div className="flex-1 overflow-y-auto max-h-[400px]">
        {results.map((place) => (
          <button
            key={place.place_id}
            onClick={() => handleSelect(place)}
            className="w-full text-left p-4 hover:bg-slate-50 border-b border-slate-50 transition-colors flex items-start gap-3 group"
          >
            <span className="mt-1 text-slate-400 group-hover:text-indigo-500">📍</span>
            <div>
              <p className="font-medium text-slate-800 leading-snug">
                {place.display_name.split(',')[0]}
              </p>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                {place.display_name}
              </p>
            </div>
          </button>
        ))}
        {results.length === 0 && query && !loading && (
          <div className="p-8 text-center text-slate-400 text-sm">
            Tidak ditemukan lokasi "{query}"
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchSidebar;