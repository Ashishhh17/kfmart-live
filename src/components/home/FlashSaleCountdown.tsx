import React, { useState, useEffect } from 'react';
import { Zap, Clock, Sparkles } from 'lucide-react';

export const FlashSaleCountdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 42, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-r from-amber-500 via-[#F97316] to-amber-600 rounded-2xl p-4 text-white shadow-lg mb-6 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
          <Zap className="w-6 h-6 text-yellow-200 fill-yellow-300 animate-bounce" />
        </div>
        <div>
          <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-wide flex items-center gap-1.5">
            Flash Sale Deals of the Day
            <Sparkles className="w-4 h-4 text-yellow-200" />
          </h3>
          <p className="text-xs text-amber-100">Guaranteed lowest prices across all multi-vendor hubs</p>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-slate-950/30 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
        <Clock className="w-4 h-4 text-amber-300" />
        <span className="text-xs font-semibold text-amber-200">Ends In:</span>
        <div className="flex items-center gap-1 font-mono font-bold text-sm">
          <span className="bg-white/20 px-2 py-1 rounded text-white">{String(timeLeft.hours).padStart(2, '0')}</span>:
          <span className="bg-white/20 px-2 py-1 rounded text-white">{String(timeLeft.minutes).padStart(2, '0')}</span>:
          <span className="bg-white/20 px-2 py-1 rounded text-white">{String(timeLeft.seconds).padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  );
};
