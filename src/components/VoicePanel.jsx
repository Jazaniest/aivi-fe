import React from 'react';

const VoicePanel = ({ 
  isActive, 
  transcript, 
  isListening, 
  triggerWords = [],
  onClose 
}) => {
  
  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-[2000] flex justify-center transition-transform duration-500 ease-in-out transform ${
        isActive ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-t-[40px] p-8 shadow-[0_-10px_40px_rgba(0,0,0,0.15)] border-t border-white/70 flex flex-col items-center">
        
        {/* Handle bar */}
        <div 
          className="w-12 h-1.5 bg-slate-300 rounded-full mb-6 cursor-pointer hover:bg-slate-400 transition-colors"
          onClick={onClose}
        ></div>
        
        {/* Status Text */}
        <h3 className="font-semibold mb-4 text-indigo-600 text-lg">
           {transcript ? "Mendengarkan..." : "Katakan Sesuatu"}
        </h3>
        
        {/* Visualizer Icon */}
        <div className="relative mb-6">
          {isListening && (
            <>
              <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping"></div>
              <div className="absolute inset-0 bg-indigo-500/10 rounded-full animate-pulse scale-150"></div>
            </>
          )}
          
          <div className="relative w-20 h-20 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-full flex items-center justify-center shadow-xl">
             <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
             </svg>
          </div>
        </div>

        {/* Transcript Output */}
        <div className="text-center min-h-[60px] w-full mb-6 px-4">
          <p className="text-2xl font-bold text-slate-800 break-words leading-tight">
            "{transcript || '...'}"
          </p>
        </div>
        
        {/* Trigger Suggestions */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
           <span className="text-xs text-slate-400 w-full text-center mb-1">Coba katakan:</span>
           {["Cari Pom Bensin", "Ke Jakarta Pusat", "Tutup Map"].map((word, i) => (
             <span key={i} className="px-3 py-1 bg-slate-100 rounded-full text-xs text-slate-600 border border-slate-200">
               {word}
             </span>
           ))}
        </div>
        
        <button
          onClick={onClose}
          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-medium transition-colors"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};

export default VoicePanel;