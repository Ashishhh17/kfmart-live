import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Check, ExternalLink, Share, PlusSquare, MoreVertical, Sparkles, QrCode } from 'lucide-react';
import { WebsiteQRModal } from './WebsiteQRModal';

export const TopHeaderInstallBar: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(() => {
    return localStorage.getItem('kfmart_pwa_installed') === 'true';
  });
  const [isDismissed, setIsDismissed] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'android' | 'ios'>('android');
  const [isInIframe, setIsInIframe] = useState(false);

  useEffect(() => {
    try {
      setIsInIframe(window.self !== window.top);
    } catch (e) {
      setIsInIframe(true);
    }

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    if (isIOS) {
      setActiveTab('ios');
    }

    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true) {
      setIsInstalled(true);
      localStorage.setItem('kfmart_pwa_installed', 'true');
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      localStorage.setItem('kfmart_pwa_installed', 'true');
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const triggerDirectInstall = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setIsInstalled(true);
          localStorage.setItem('kfmart_pwa_installed', 'true');
        }
        setDeferredPrompt(null);
      } catch (err) {
        setShowGuideModal(true);
      }
    } else if (isInIframe) {
      // In preview iframe, open in full window to allow native Chrome/Safari PWA installation
      const fullTab = window.open(window.location.href, '_blank');
      if (!fullTab) {
        setShowGuideModal(true);
      }
    } else {
      setShowGuideModal(true);
    }
  };

  // Show install bar unless dismissed in the current session
  if (isDismissed) return null;

  return (
    <>
      {/* Black Sticky Top Header Bar matching user screenshot */}
      <div className="bg-black text-white px-3 sm:px-6 py-2 flex items-center justify-between gap-2 shadow-md z-50 sticky top-0 border-b border-slate-800">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Logo badge */}
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#005723] p-0.5 flex items-center justify-center shrink-0 border border-emerald-400/40 shadow-xs">
            <img 
              src="/favicon.svg" 
              alt="KF MART Logo" 
              className="w-full h-full rounded-full object-cover"
              onError={(e) => {
                // Fallback to text icon
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span className="text-[10px] font-black text-amber-300 tracking-tighter">KF</span>
          </div>

          <div className="min-w-0 leading-tight">
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs sm:text-sm font-extrabold text-white truncate">Install Now</h4>
              <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-black px-1.5 py-0.2 rounded border border-emerald-500/30 hidden sm:inline">OFFICIAL APP</span>
            </div>
            <p className="text-[10px] text-slate-300 truncate">Install KF MART App or Scan Website QR</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Scan QR Button */}
          <button
            type="button"
            onClick={() => setShowQRModal(true)}
            className="bg-slate-800 hover:bg-slate-700 text-amber-300 font-extrabold text-xs px-3 py-1.5 rounded-full shadow-sm active:scale-95 transition-all flex items-center gap-1.5 border border-slate-700 cursor-pointer"
            title="Scan Website QR Code"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Scan QR</span>
          </button>

          {/* White Pill Install Now Button matching user screenshot */}
          <button
            type="button"
            onClick={triggerDirectInstall}
            className="bg-white hover:bg-slate-100 text-black font-black text-xs px-4 py-1.5 rounded-full shadow-md active:scale-95 transition-all flex items-center gap-1.5 border border-slate-200 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#005723] stroke-[3]" />
            <span>Install Now</span>
          </button>

          {/* Dismiss button */}
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 cursor-pointer"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Website QR Modal */}
      <WebsiteQRModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        targetUrl="https://kfmart.in"
      />

      {/* Guide Modal if prompt needs direct manual action or iOS Safari */}
      {showGuideModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-slate-900 space-y-4 relative">
            <button
              onClick={() => setShowGuideModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-xl bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#005723] rounded-2xl flex items-center justify-center shrink-0 shadow-md">
                <Smartphone className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Install KF MART App
                </h3>
                <p className="text-xs text-slate-500">
                  Direct 1-Click App Installation for your smartphone
                </p>
              </div>
            </div>

            {/* Launch Full Tab Button if in iframe */}
            {isInIframe && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl space-y-2 text-xs">
                <p className="font-bold text-amber-900">Inside Preview Window?</p>
                <p className="text-[11px] text-amber-800">
                  Mobile browsers require opening the app directly in a main browser tab to trigger 1-click home screen installation.
                </p>
                <button
                  type="button"
                  onClick={() => window.open(window.location.href, '_blank')}
                  className="w-full bg-[#005723] hover:bg-[#00401A] text-white font-extrabold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <span>Open Full Browser Tab to Install</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* OS Selector Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setActiveTab('android')}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'android' ? 'bg-[#005723] text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                Android (Chrome)
              </button>
              <button
                onClick={() => setActiveTab('ios')}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'ios' ? 'bg-[#005723] text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                iPhone (Safari)
              </button>
            </div>

            {/* Direct Install & APK Download Buttons */}
            <div className="bg-emerald-50 dark:bg-slate-800 p-4 rounded-2xl border border-emerald-200 text-xs space-y-3">
              <p className="text-slate-800 dark:text-slate-200 font-bold text-center">
                {activeTab === 'android' 
                  ? "⚡ Choose 1-Click App Install or download Android .APK directly to your phone:" 
                  : "🍎 On iPhone (Safari), tap Share icon in Safari menu and select 'Add to Home Screen'."}
              </p>

              {activeTab === 'android' ? (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (deferredPrompt) {
                        deferredPrompt.prompt();
                      } else {
                        window.open(window.location.href, '_blank');
                      }
                    }}
                    className="w-full bg-[#005723] hover:bg-[#00401A] text-white font-black py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-amber-300 stroke-[3]" />
                    <span>⚡ Direct 1-Click App Install</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowGuideModal(false);
                      setShowQRModal(true);
                    }}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-300 transition-all cursor-pointer"
                  >
                    <QrCode className="w-4 h-4 text-[#005723]" />
                    <span>📱 Scan Website QR with Phone Camera</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    alert("🍎 iPhone Installation Guide:\n\n1. Tap the Share button at the bottom of Safari.\n2. Scroll down & select 'Add to Home Screen'.\n3. Tap 'Add' at top right!");
                  }}
                  className="w-full bg-[#005723] hover:bg-[#00401A] text-white font-black py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 text-amber-300 stroke-[3]" />
                  <span>iPhone Safari Installation Guide</span>
                </button>
              )}
            </div>

            <button
              onClick={() => setShowGuideModal(false)}
              className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
};
