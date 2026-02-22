import { useState, useEffect } from 'react';
import { aiService } from '../../services/api';

function SkeletonLoader() {
  return (
    <div className="space-y-2 animate-pulse">
      <div className="skeleton h-3 w-3/4" />
      <div className="skeleton h-3 w-full" />
      <div className="skeleton h-3 w-5/6" />
      <div className="skeleton h-3 w-4/5 mt-3" />
      <div className="skeleton h-3 w-full" />
      <div className="skeleton h-3 w-2/3" />
    </div>
  );
}

export default function AIRecommendationPanel({ disasterId, impactLevel }) {
  const [recommendation, setRecommendation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const isVisible = impactLevel === 'DIRECT' || impactLevel === 'NEARBY';

  useEffect(() => {
    if (!isVisible || !disasterId) return;

    const fetchRec = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await aiService.getRecommendation(disasterId);
        setRecommendation(data.recommendation);
      } catch (err) {
        setError('Gagal memuat rekomendasi AI. Silakan coba lagi.');
        console.log('AI Recommendation fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRec();
  }, [disasterId, isVisible]);

  if (!isVisible) return null;

  return (
    <div className={`card p-4 border ${impactLevel === 'DIRECT' ? 'border-red-500/30 bg-red-950/20' : 'border-yellow-500/20 bg-yellow-950/10'}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="relative">
          <div className="w-6 h-6 rounded bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
              <circle cx="8" cy="8" r="3" fill="white" opacity="0.9" />
              <path d="M8 2v1M8 13v1M2 8h1M13 8h1M4.05 4.05l.7.7M11.25 11.25l.7.7M4.05 11.95l.7-.7M11.25 4.75l.7-.7" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
            </svg>
          </div>
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        </div>
        <div>
          <span className="text-xs font-mono font-semibold text-cyan-400 tracking-wider">
            REKOMENDASI AI
          </span>
          {impactLevel === 'DIRECT' && (
            <span className="ml-2 text-[10px] font-mono bg-red-500/20 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded">
              PRIORITAS TINGGI
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="min-h-20">
        {isLoading && <SkeletonLoader />}

        {error && !isLoading && (
          <div className="text-xs text-red-400 font-mono">{error}</div>
        )}

        {recommendation && !isLoading && (
          <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap animate-fade-in">
            {recommendation.text}
          </div>
        )}

        {!recommendation && !isLoading && !error && (
          <div className="text-xs text-slate-500 font-mono">
            Menganalisis kondisi situasional...
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="mt-3 pt-3 border-t border-border/50">
        <p className="text-[10px] text-slate-600 leading-relaxed italic">
          ⚠️ Rekomendasi ini dihasilkan oleh AI dan bukan pengganti instruksi resmi dari pihak berwenang. Selalu ikuti arahan BPBD, BMKG, dan aparat setempat.
        </p>
      </div>
    </div>
  );
}