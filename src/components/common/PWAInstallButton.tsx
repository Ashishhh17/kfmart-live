import React, { useState, useEffect } from 'react';
import { Download, Smartphone, X, Check, Share, Sparkles, CheckCircle2, ExternalLink, MoreVertical, PlusSquare, Info } from 'lucide-react';

export const PWAInstallButton: React.FC<{ variant?: 'navbar' | 'banner' | 'floating' }> = ({ 
  variant = 'navbar' 
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [installSuccessModal, setInstallSuccessModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'android' | 'ios'>('android');
  const [isInIframe, setIsInIframe] = useState(false);

  useEffect(() => {
    // Detect if running inside an iframe
    try {
      setIsInIframe(window.self !== window.top);
    } catch (e) {
      setIsInIframe(true);
    }

    // Detect iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    if (isIOS) {
      setActiveTab('ios');
    }

    // Check if app is running in standalone mode (installed)
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
      setInstallSuccessModal(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setIsInstalled(true);
          localStorage.setItem('kfmart_pwa_installed', 'true');
          setInstallSuccessModal(true);
        }
        setDeferredPrompt(null);
      } catch (err) {
        setShowGuideModal(true);
      }
    } else {
      // If native deferredPrompt is not ready or blocked by iframe / iOS, show interactive guide modal
      setShowGuideModal(true);
    }
  };

  const openInNewTab = () => {
    window.open(window.location.href, '_blank', 'noopener,noreferrer');
  };

  const handleUninstallReset = () => {
    localStorage.removeItem('kfmart_pwa_installed');
    setIsInstalled(false);
  };

  if (isInstalled) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="inline-flex items-center gap-1 bg-[#005723]/10 text-[#005723] border border-[#005723]/20 text-[10px] font-extrabold px-2.5 py-1 rounded-xl shadow-2xs">
          <Check className="w-3.5 h-3.5 text-[#005723]" />
          <span className="hidden sm:inline">App Installed</span>
          <span className="sm:hidden">Installed</span>
        </span>
        <button
          onClick={handleUninstallReset}
          title="Reset state to test install"
          className="text-[10px] text-slate-400 hover:text-red-500 underline hidden xl:inline"
        >
          Reset
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Navbar Variant */}
      {variant === 'navbar' && (
        <button
          onClick={handleInstallClick}
          className="relative group bg-[#005723] hover:bg-[#00401A] text-white font-extrabold text-xs px-3.5 py-1.5 rounded-xl shadow-xs transition-all duration-200 flex items-center gap-1.5 active:scale-95"
          title="Install KF MART App on Phone Home Screen"
        >
          <Download className="w-4 h-4 stroke-[2.5] text-amber-300" />
          <span className="hidden sm:inline">Install App</span>
          <span className="sm:hidden">Install</span>

          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
          </span>
        </button>
      )}

      {/* Banner Variant */}
      {variant === 'banner' && (
        <button
          onClick={handleInstallClick}
          className="bg-[#005723] hover:bg-[#00401A] text-white font-extrabold text-xs px-4 py-2 rounded-full shadow-md transition-transform duration-200 hover:scale-105 flex items-center gap-1.5"
        >
          <Download className="w-4 h-4 stroke-[2.5] text-amber-300" />
          <span>Install KF MART PWA</span>
        </button>
      )}

      {/* Step-by-Step Installation Guide Modal (For iOS / Preview iFrame / Manual Install) */}
      {showGuideModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-slate-900 space-y-4 relative">
            <button
              onClick={() => setShowGuideModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-xl bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#005723] rounded-2xl flex items-center justify-center shrink-0 shadow-md">
                <Smartphone className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Add KF MART to Home Screen
                </h3>
                <p className="text-xs text-slate-500">
                  Install our official mobile app on your phone in 2 simple steps.
                </p>
              </div>
            </div>

            {/* Note if inside iframe preview */}
            {isInIframe && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-amber-900">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Inside Preview Window?</p>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    Phone browsers require opening the app directly in a full tab to place the icon on your home screen.
                  </p>
                  <button
                    onClick={openInNewTab}
                    className="mt-2 inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-3 py-1 rounded-lg text-[11px] shadow-xs"
                  >
                    <span>Open in Full Browser Tab</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* OS Selector Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('android')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'android' 
                    ? 'bg-white text-[#005723] shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Android (Chrome)
              </button>
              <button
                onClick={() => setActiveTab('ios')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'ios' 
                    ? 'bg-white text-[#005723] shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                iPhone / iPad (Safari)
              </button>
            </div>

            {/* Direct Install & APK Buttons */}
            <div className="bg-emerald-50 dark:bg-slate-800 p-4 rounded-2xl border border-emerald-200 text-xs space-y-3">
              <p className="text-slate-800 dark:text-slate-200 font-bold text-center">
                {activeTab === 'android' 
                  ? "⚡ Choose 1-Click App Install or download Android .APK directly to your phone:" 
                  : "🍎 On iPhone (Safari), tap Share icon below and select 'Add to Home Screen'."}
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
                    className="w-full bg-[#005723] hover:bg-[#00401A] text-white font-black py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
                  >
                    <Download className="w-4 h-4 text-amber-300 stroke-[3]" />
                    <span>⚡ Direct 1-Click App Install</span>
                  </button>

                  <a
                    href="https://kfmart.in/kfmart.apk"
                    download="KF-MART.apk"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("📲 APK File Download:\n\nIf the .apk file hasn't been hosted on your Vercel server yet, tap 'Direct 1-Click App Install' above to instantly install the KF MART app on your phone!");
                    }}
                    className="w-full bg-black hover:bg-slate-900 text-amber-400 font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-700 shadow-sm transition-all"
                  >
                    <Smartphone className="w-4 h-4 text-amber-300" />
                    <span>📦 Download Direct Android .APK File</span>
                  </a>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    alert("🍎 iPhone Installation Guide:\n\n1. Tap the Share button at the bottom of Safari.\n2. Scroll down & select 'Add to Home Screen'.\n3. Tap 'Add' at top right!");
                  }}
                  className="w-full bg-[#005723] hover:bg-[#00401A] text-white font-black py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
                >
                  <Download className="w-4 h-4 text-amber-300 stroke-[3]" />
                  <span>iPhone Safari Installation Guide</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={openInNewTab}
                className="flex-1 bg-[#005723] hover:bg-[#00401A] text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Launch in Full Browser Tab</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {installSuccessModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-slate-900 text-center space-y-4 relative">
            <button
              onClick={() => setInstallSuccessModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-xl bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-14 h-14 bg-emerald-100 text-[#005723] rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8 animate-bounce" />
            </div>

            <div>
              <h3 className="text-base font-black text-slate-900">
                KF MART App Installed!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                The KF MART Progressive Web App is now added to your device Home Screen for instant 1-click access.
              </p>
            </div>

            <button
              onClick={() => setInstallSuccessModal(false)}
              className="w-full bg-[#005723] hover:bg-[#00401A] text-white font-black py-2.5 rounded-xl text-xs transition-colors shadow-md"
            >
              Start Shopping
            </button>
          </div>
        </div>
      )}
    </>
  );
};

