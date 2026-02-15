import React from 'react';

const BrandLogo = () => {
  return (
    <div className="absolute top-4 right-4 z-1000 hidden md:block">
      <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/50 flex items-center gap-2">
        <div className="w-8 h-8 bg-linear-to-tr from-indigo-600 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm transform rotate-3 shadow-md">
          Ai
        </div>
        <span className="font-bold text-xl tracking-tight text-slate-800">Aivi</span>
      </div>
    </div>
  );
};

export default BrandLogo;