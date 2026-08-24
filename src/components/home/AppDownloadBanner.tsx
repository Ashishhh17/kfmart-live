import React, { useState, useEffect } from 'react';
import { Smartphone, Download, QrCode, Sparkles, Apple, Check, ExternalLink, Share, PlusSquare, MoreVertical, X, Printer, Copy } from 'lucide-react';
import { WebsiteQRModal } from '../common/WebsiteQRModal';

export const AppDownloadBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showIosModal, setShowIosModal] = useState(false);
  const [showAndroidModal, setShowAndroidModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  const websiteUrl = 'https://kfmart.in';
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(websiteUrl)}&format=png&ecc=H&margin=1`;

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      localStorage.setItem('kfmart_pwa_installed', 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallNow = async () => {
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
        setShowAndroidModal(true);
      }
    } else {
      // Check if inside iframe
      if (window.self !== window.top) {
        window.open(window.location.href, '_blank');
      } else {
        setShowAndroidModal(true);
      }
    }
  };

  return (
    <section className="my-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-sm space-y-4">
      
      {/* Title & Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
            KF MART Website & Mobile App
          </h3>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowQRModal(true)}
            className="text-xs font-bold text-[#005723] dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>View Full QR</span>
          </button>

          {isInstalled && (
            <span className="text-xs font-bold text-[#005723] bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-200">
              <Check className="w-3.5 h-3.5" /> Installed
            </span>
          )}
        </div>
      </div>

      {/* Main Banner Content with Integrated QR Code and Install Options */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-5 bg-slate-50 dark:bg-slate-800/50 p-4 sm:p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
        
        {/* Left: Brand Description */}
        <div className="flex items-start sm:items-center gap-3.5 flex-1">
          <div className="w-12 h-12 bg-[#005723] rounded-2xl flex items-center justify-center shrink-0 shadow-md">
            <Smartphone className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                Har Dukaan, Ek Platform
              </h4>
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded">
                kfmart.in
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Instant 24-Hour Express Delivery in Lalgopalganj & 1-Click Ordering from your favorite local shops.
            </p>
          </div>
        </div>

        {/* Center: Live Scannable Website QR Code Widget */}
        <div 
          onClick={() => setShowQRModal(true)}
          className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2.5 sm:px-3 sm:py-2.5 rounded-2xl border-2 border-emerald-500/40 shadow-xs cursor-pointer hover:border-[#005723] transition-all group shrink-0"
          title="Click to expand and download QR Code"
        >
          <div className="bg-emerald-50 dark:bg-slate-800 p-1.5 rounded-xl border border-emerald-100 dark:border-slate-700">
            <img
              src={qrImageUrl}
              alt="Scan QR to open kfmart.in"
              className="w-16 h-16 sm:w-18 sm:h-18 object-contain"
            />
          </div>
          <div className="text-left space-y-0.5 pr-1">
            <div className="flex items-center gap-1 text-[10px] font-black text-[#005723] dark:text-emerald-400 uppercase tracking-tight">
              <QrCode className="w-3.5 h-3.5" />
              <span>Scan QR Code</span>
            </div>
            <p className="text-[11px] font-extrabold text-slate-900 dark:text-white">
              Open on Mobile
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Point camera to visit site
            </p>
          </div>
        </div>

        {/* Right: Black "Install Now" Pill Button */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-2 w-full lg:w-auto shrink-0">
          <button
            type="button"
            onClick={handleInstallNow}
            className="w-full lg:w-auto bg-black hover:bg-slate-900 text-white font-extrabold text-xs px-6 py-3 rounded-full shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 border border-slate-800"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Install App Now</span>
          </button>

          <button
            type="button"
            onClick={() => setShowQRModal(true)}
            className="w-full lg:w-auto bg-[#005723] hover:bg-[#00401A] text-white font-extrabold text-xs px-4 py-2.5 rounded-full shadow-sm transition-transform active:scale-95 flex items-center justify-center gap-1.5"
          >
            <QrCode className="w-3.5 h-3.5 text-amber-300" />
            <span>Get Website QR</span>
          </button>
        </div>
      </div>

      {/* Red "Click Here To Download On iphone" Button */}
      <button
        type="button"
        onClick={() => setShowIosModal(true)}
        className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-black text-sm py-3.5 px-4 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 text-center cursor-pointer"
      >
        <Apple className="w-5 h-5 fill-white" />
        <span>Click Here To Download On iphone</span>
      </button>

      {/* Full Website QR Modal */}
      <WebsiteQRModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        targetUrl={websiteUrl}
      />

      {/* iPhone Download Guide Modal */}
      {showIosModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-slate-900 space-y-4 relative shadow-2xl">
            <button
              onClick={() => setShowIosModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-xl bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
                <Apple className="w-7 h-7 fill-red-600" />
              </div>
              <h3 className="text-base font-black text-slate-900">
                Download KF MART on iPhone / iPad
              </h3>
              <p className="text-xs text-slate-500">
                Follow these 3 quick steps in Safari browser to add KF MART to your iPhone home screen:
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-3">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                <p className="text-slate-700">Tap the <strong>Share Icon (<Share className="w-3.5 h-3.5 inline text-blue-600" />)</strong> in Safari bottom menu.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                <p className="text-slate-700">Scroll down and tap <strong>"Add to Home Screen (<PlusSquare className="w-3.5 h-3.5 inline text-slate-900" />)"</strong>.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                <p className="text-slate-700">Tap <strong>"Add"</strong> in top right. The green KF MART icon will instantly download on your iPhone!</p>
              </div>
            </div>

            <button
              onClick={() => setShowIosModal(false)}
              className="w-full bg-red-600 text-white font-bold py-2.5 rounded-xl text-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Android Direct Guide Modal */}
      {showAndroidModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-slate-900 space-y-4 relative shadow-2xl">
            <button
              onClick={() => setShowAndroidModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-xl bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-black text-amber-400 rounded-2xl flex items-center justify-center mx-auto">
                <Download className="w-7 h-7" />
              </div>
              <h3 className="text-base font-black text-slate-900">
                Install KF MART App on Android
              </h3>
              <p className="text-xs text-slate-500">
                To complete installation on Chrome:
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-3">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 bg-black text-white rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                <p className="text-slate-700">Tap Chrome <strong>Menu (<MoreVertical className="w-3.5 h-3.5 inline text-slate-900" />)</strong> in top right.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 bg-black text-white rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                <p className="text-slate-700">Select <strong>"Install App"</strong> or <strong>"Add to Home Screen"</strong>.</p>
              </div>
            </div>

            <button
              onClick={() => setShowAndroidModal(false)}
              className="w-full bg-black text-white font-bold py-2.5 rounded-xl text-xs"
            >
              Got It
            </button>
          </div>
        </div>
      )}

    </section>
  );
};
