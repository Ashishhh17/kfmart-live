import React, { useState, useEffect } from 'react';
import { Mic, X, Volume2, Sparkles, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const VoiceSearchModal: React.FC = () => {
  const { isVoiceSearchOpen, setIsVoiceSearchOpen, setSearchQuery } = useStore();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const sampleVoiceQueries = [
    'Silk Bandhgana Kurta for wedding',
    'Active Noise Cancellation Wireless Headphones',
    'Running shoes size 9',
    'Kumkumadi Face Elixir serum'
  ];

  useEffect(() => {
    if (isVoiceSearchOpen) {
      setIsListening(true);
      setTranscript('Listening for query...');
      // Simulate speech recognition
      const timer = setTimeout(() => {
        const randomQuery = sampleVoiceQueries[Math.floor(Math.random() * sampleVoiceQueries.length)];
        setTranscript(randomQuery);
        setIsListening(false);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [isVoiceSearchOpen]);

  if (!isVoiceSearchOpen) return null;

  const handleApplyVoiceSearch = () => {
    if (transcript && transcript !== 'Listening for query...') {
      setSearchQuery(transcript);
      setIsVoiceSearchOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-slate-200 dark:border-slate-700 relative">
        <button 
          onClick={() => setIsVoiceSearchOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-20 h-20 mx-auto mb-4 relative flex items-center justify-center">
          {/* Animated pulse rings */}
          {isListening && (
            <div className="absolute inset-0 bg-[#F97316]/20 rounded-full animate-ping" />
          )}
          <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all ${
            isListening ? 'bg-[#F97316] text-white scale-110' : 'bg-[#1E3A8A] text-white'
          }`}>
            <Mic className="w-8 h-8" />
          </div>
        </div>

        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
          {isListening ? 'Speak Now...' : 'Voice Search Detected'}
        </h3>
        
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 min-h-[40px] flex items-center justify-center italic bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
          "{transcript}"
        </p>

        {!isListening && (
          <div className="space-y-2">
            <button
              onClick={handleApplyVoiceSearch}
              className="w-full bg-[#1E3A8A] hover:bg-blue-900 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              Search for "{transcript}"
            </button>
            <button
              onClick={() => {
                setIsListening(true);
                setTranscript('Listening again...');
                setTimeout(() => {
                  setTranscript(sampleVoiceQueries[Math.floor(Math.random() * sampleVoiceQueries.length)]);
                  setIsListening(false);
                }, 2000);
              }}
              className="w-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-semibold py-2 rounded-xl text-xs transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
