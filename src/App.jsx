import React, { useState, useEffect, useRef, useCallback } from 'react';
import MapBoard from './components/MapBoard';
import SearchSidebar from './components/SearchSidebar';
import BrandLogo from './components/BrandLogo';
import VoicePanel from './components/VoicePanel';

const App = () => {
  // --- State Navigasi ---
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [routeMode, setRouteMode] = useState(false);
  const [viewCoords, setViewCoords] = useState(null);

  // --- State Voice & Logic ---
  const [isVoicePanelActive, setIsVoicePanelActive] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isAutoMode, setIsAutoMode] = useState(false); // State untuk tombol Auto
  const [isListeningStatus, setIsListeningStatus] = useState(false); // Visual indicator

  // Refs untuk akses state di dalam event listener tanpa dependencies hell
  const recognitionRef = useRef(null);
  const isAutoModeRef = useRef(false); 
  const isVoicePanelActiveRef = useRef(false);

  // Sinkronisasi Ref dengan State
  useEffect(() => { isAutoModeRef.current = isAutoMode; }, [isAutoMode]);
  useEffect(() => { isVoicePanelActiveRef.current = isVoicePanelActive; }, [isVoicePanelActive]);

  // --- KONFIGURASI KATA KUNCI ---
  const TRIGGER_WORDS = ["hello map", "halo map", "hey map", "buka map", "open map"];
  const CLOSE_WORDS = ["close", "tutup", "cancel", "batal", "exit"];

  // --- FUNGSI UTAMA SPEECH RECOGNITION ---
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Browser Anda tidak mendukung Speech Recognition. Gunakan Chrome/Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true; // Agar tidak stop setelah 1 kalimat
    recognition.interimResults = true; // Agar responsif
    recognition.lang = 'id-ID'; 

    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setIsListeningStatus(true);
    };

    recognition.onend = () => {
      setIsListeningStatus(false);
      // LOGIKA KUNCI: Jika Auto Mode nyala, paksa restart saat mati
      if (isAutoModeRef.current) {
        setTimeout(() => {
          try {
            recognition.start();
          } catch (e) {
            console.error("Restart error:", e);
          }
        }, 200);
      }
    };

    recognition.onresult = (event) => {
      const current = event.resultIndex;
      const result = event.results[current];
      const textRaw = result[0].transcript;
      const text = textRaw.toLowerCase().trim();
      const isFinal = result.isFinal;

      // Update transcript hanya jika panel terbuka agar user melihat apa yang diucap
      if (isVoicePanelActiveRef.current) {
        setTranscript(textRaw);
      }

      // 1. Cek Trigger Word (Hanya jika panel tertutup)
      if (!isVoicePanelActiveRef.current) {
        const isTriggered = TRIGGER_WORDS.some(word => text.includes(word));
        if (isTriggered) {
          setIsVoicePanelActive(true);
          setTranscript("Halo! Ada yang bisa dibantu?"); // Reset pesan awal
        }
      } 

      // 2. Cek Command Close (Hanya jika panel terbuka)
      if (isVoicePanelActiveRef.current) {
        const isClosed = CLOSE_WORDS.some(word => text.includes(word));
        if (isClosed) {
          setIsVoicePanelActive(false);
          setTranscript('');
        }
      }
      
      // 3. Reset transcript visual setelah selesai bicara (opsional)
      if (isFinal && isVoicePanelActiveRef.current) {
        // Logika tambahan untuk memproses perintah navigasi bisa ditaruh di sini
        // handleNavigationCommand(text); 
      }
    };

    return () => {
      recognition.stop();
    };
  }, []);

  // --- Handlers ---

  // Toggle Button "Auto Tangkap Suara"
  const toggleAutoMode = () => {
    const newMode = !isAutoMode;
    setIsAutoMode(newMode);
    
    if (newMode) {
      // Start Manual
      try {
        recognitionRef.current?.start();
      } catch (e) { 
        // Ignore if already started 
      }
    } else {
      // Stop Manual
      recognitionRef.current?.stop();
      setIsVoicePanelActive(false);
    }
  };

  const handleLocationSelect = (location) => {
    if (routeMode) {
      if (!startPoint) setStartPoint(location);
      else if (!endPoint) setEndPoint(location);
    } else {
      setViewCoords({ lat: location.lat, lon: location.lon, name: location.name });
    }
    setIsVoicePanelActive(false);
  };

  return (
    <div className="relative w-full h-screen bg-slate-50 overflow-hidden font-sans text-slate-800">
      <BrandLogo />

      {/* --- Sidebar UI --- */}
      <div className="absolute top-0 left-0 h-full w-full md:w-[400px] z-[1000] pointer-events-none p-4 flex flex-col">
        <div className="pointer-events-auto shadow-2xl rounded-3xl bg-white/90 backdrop-blur-xl border border-white/50 overflow-hidden flex flex-col max-h-[90vh]">
          <SearchSidebar 
            onLocationSelect={handleLocationSelect}
            routeMode={routeMode}
            setRouteMode={setRouteMode}
            startPoint={startPoint}
            endPoint={endPoint}
            onReset={() => { setStartPoint(null); setEndPoint(null); setRouteMode(false); }}
          />
        </div>
      </div>

      {/* --- Map --- */}
      <div className="absolute inset-0 z-0">
        <MapBoard 
          startPoint={startPoint}
          endPoint={endPoint}
          viewCoords={viewCoords}
          routeMode={routeMode}
        />
      </div>

      {/* --- TOMBOL AUTO TANGKAP SUARA (FAB) --- */}
      <button
        onClick={toggleAutoMode}
        className={`fixed bottom-6 left-6 z-[2000] flex items-center gap-2 px-6 py-3 rounded-full shadow-xl font-bold transition-all duration-300 transform hover:scale-105 ${
          isAutoMode 
            ? 'bg-red-600 text-white animate-pulse ring-4 ring-red-200' 
            : 'bg-slate-800 text-white hover:bg-slate-700'
        }`}
      >
        {isAutoMode ? (
          <>
            <span className="w-3 h-3 bg-white rounded-full animate-ping"/>
            Auto ON (Mendengarkan...)
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            Aktifkan Suara
          </>
        )}
      </button>

      {/* --- Voice Assistant Panel --- */}
      <VoicePanel 
        isActive={isVoicePanelActive} 
        transcript={transcript}
        isListening={isListeningStatus}
        triggerWords={TRIGGER_WORDS}
        onClose={() => setIsVoicePanelActive(false)}
      />

      {/* --- Overlay --- */}
      {isVoicePanelActive && (
        <div 
          className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px] z-[1500] transition-opacity duration-500"
          onClick={() => setIsVoicePanelActive(false)}
        ></div>
      )}
    </div>
  );
};

export default App;