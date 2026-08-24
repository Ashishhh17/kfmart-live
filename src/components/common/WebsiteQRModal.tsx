import React, { useState, useRef } from 'react';
import { QrCode, X, Download, Copy, Check, Share2, Printer, ExternalLink, Smartphone, Sparkles } from 'lucide-react';

interface WebsiteQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUrl?: string;
}

export const WebsiteQRModal: React.FC<WebsiteQRModalProps> = ({
  isOpen,
  onClose,
  targetUrl = 'https://kfmart.in'
}) => {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const encodedUrl = encodeURIComponent(targetUrl);
  // High quality QR Code API with margin and error correction level H (300x300)
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodedUrl}&format=png&ecc=H&margin=2`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadQR = async () => {
    try {
      setIsDownloading(true);
      const response = await fetch(qrImageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'kfmart-website-qr-code.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      // Fallback direct link
      window.open(qrImageUrl, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleWhatsAppShare = () => {
    const message = encodeURIComponent(
      `🛍️ *KF MART Retail - Har Dukaan, Ek Platform*\n\nShop online with 24-Hour Express Delivery in Lalgopalganj & surrounding areas!\n\n👉 *Visit Website / Scan QR:* ${targetUrl}`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white space-y-5 relative my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#005723] text-amber-300 flex items-center justify-center shrink-0 shadow-md">
            <QrCode className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                KF MART Website QR Code
              </h3>
              <span className="bg-emerald-100 text-[#005723] dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-full">
                LIVE
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Scan with any phone camera to visit <strong className="text-[#005723] dark:text-emerald-400">kfmart.in</strong>
            </p>
          </div>
        </div>

        {/* QR Code Card (Printable Stand Design) */}
        <div ref={printRef} className="bg-gradient-to-b from-emerald-50 to-white dark:from-slate-800 dark:to-slate-900 p-5 rounded-3xl border-2 border-emerald-500/30 text-center space-y-3 shadow-inner">
          
          {/* Brand Header inside QR card */}
          <div className="flex items-center justify-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#005723] flex items-center justify-center text-amber-300 text-[10px] font-black">
              KF
            </div>
            <span className="font-black text-sm text-[#005723] dark:text-emerald-400 tracking-wide">
              KF MART RETAIL
            </span>
          </div>

          <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
            Har Dukaan, Ek Platform • 24-Hr Express Delivery
          </p>

          {/* QR Code Image Container */}
          <div className="bg-white p-4 rounded-2xl shadow-md inline-block mx-auto border border-slate-200">
            <img
              src={qrImageUrl}
              alt="Scan QR to open https://kfmart.in"
              className="w-48 h-48 sm:w-56 sm:h-56 object-contain mx-auto"
              loading="eager"
            />
            <div className="mt-2 flex items-center justify-center gap-1.5 text-[11px] font-extrabold text-[#005723]">
              <Smartphone className="w-3.5 h-3.5" />
              <span>SCAN WITH CAMERA TO OPEN</span>
            </div>
          </div>

          {/* Website Link Badge */}
          <div className="bg-white/80 dark:bg-slate-800 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 border border-emerald-300 dark:border-slate-700 text-xs font-black text-slate-800 dark:text-slate-200">
            <span>🌐</span>
            <span>{targetUrl}</span>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="space-y-2 text-xs">
          
          {/* Row 1: Download QR Image & Copy Link */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleDownloadQR}
              disabled={isDownloading}
              className="bg-[#005723] hover:bg-[#00401A] text-white font-extrabold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>{isDownloading ? 'Downloading...' : 'Save QR Image'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-extrabold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700 active:scale-95 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 dark:text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>Copy Web Link</span>
                </>
              )}
            </button>
          </div>

          {/* Row 2: WhatsApp Share & Print Poster */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>Share WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="bg-slate-900 hover:bg-black text-amber-300 font-extrabold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print Poster</span>
            </button>
          </div>
        </div>

        {/* Footer info instructions */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
          <p className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            How to use this QR Code:
          </p>
          <ul className="list-disc list-inside space-y-0.5 text-[10px]">
            <li>Print & stick on shop counters, delivery boxes, and banners.</li>
            <li>Customers point their phone camera to instantly open and order on <strong>kfmart.in</strong>.</li>
            <li>Works with Google Lens, Paytm, PhonePe, and camera scanners.</li>
          </ul>
        </div>

      </div>
    </div>
  );
};
