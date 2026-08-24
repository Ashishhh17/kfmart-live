import React, { useState } from 'react';
import { Logo } from '../common/Logo';
import { ShieldCheck, Truck, RotateCcw, Lock, Send, MapPin, QrCode, Smartphone, Download } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PWAInstallButton } from '../common/PWAInstallButton';
import { WebsiteQRModal } from '../common/WebsiteQRModal';

export const Footer: React.FC = () => {
  const { setSelectedCategory, pincode } = useStore();
  const [showQRModal, setShowQRModal] = useState(false);

  const websiteUrl = 'https://kfmart.in';
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(websiteUrl)}&format=png&ecc=H&margin=1`;

  const categories = [
    'Men', 'Women', 'Kids', 'Fashion', 'Accessories', 'Shoes', 
    'Electronics', 'Home', 'Kitchen', 'Furniture', 'Beauty', 
    'Health', 'Sports', 'Books', 'Mobile', 'Laptop', 'Groceries', 
    'Toys', 'Gift Items', 'Seasonal Products'
  ];

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-xs pt-12 pb-6">
      
      {/* Guarantees Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 border-b border-slate-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center space-y-1">
            <Truck className="w-6 h-6 text-[#F97316]" />
            <span className="font-bold text-white">Express Pincode Delivery</span>
            <span className="text-[11px] text-slate-400">Pincode {pincode} Direct Slot</span>
          </div>

          <div className="flex flex-col items-center space-y-1">
            <RotateCcw className="w-6 h-6 text-amber-400" />
            <span className="font-bold text-white">24-Hour Return Window</span>
            <span className="text-[11px] text-slate-400">Easy post-delivery policy</span>
          </div>

          <div className="flex flex-col items-center space-y-1">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <span className="font-bold text-white">100% Genuine Vendors</span>
            <span className="text-[11px] text-slate-400">Admin verified hubs</span>
          </div>

          <div className="flex flex-col items-center space-y-1">
            <Lock className="w-6 h-6 text-emerald-400" />
            <span className="font-bold text-white">Direct UPI QR Checkout</span>
            <span className="text-[11px] text-slate-400">Paytm, PhonePe, GPay & COD</span>
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-5 gap-8">
        
        {/* Brand Column */}
        <div className="md:col-span-2 space-y-4">
          <Logo variant="dark" showTagline={true} />
          <p className="text-slate-400 leading-relaxed max-w-sm">
            KF Mart Retail (kfmart.in) is India’s premier luxury multi-vendor marketplace, curated with high-performance vendor hubs, transparent formula pricing, and express delivery in pincode 229413.
          </p>
          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <MapPin className="w-4 h-4 text-[#F97316]" />
            <span>Primary Operational Hub: Pincode 229413, Uttar Pradesh, India</span>
          </div>

          {/* Website QR Code Mini-Card */}
          <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 max-w-sm flex items-center gap-3.5">
            <div 
              onClick={() => setShowQRModal(true)} 
              className="bg-white p-1.5 rounded-xl cursor-pointer hover:scale-105 transition-transform shrink-0"
              title="Click to expand QR Code"
            >
              <img
                src={qrImageUrl}
                alt="Scan to open kfmart.in"
                className="w-16 h-16 object-contain"
              />
            </div>
            <div className="space-y-1 text-left">
              <div className="flex items-center gap-1 text-[10px] font-black text-emerald-400 uppercase tracking-wider">
                <QrCode className="w-3 h-3" />
                <span>Scan & Visit Website</span>
              </div>
              <p className="text-white font-bold text-[11px] leading-tight">
                Point your phone camera to open <strong>kfmart.in</strong>
              </p>
              <button
                type="button"
                onClick={() => setShowQRModal(true)}
                className="text-[10px] font-extrabold text-amber-300 hover:text-amber-200 underline flex items-center gap-1 cursor-pointer"
              >
                <span>Save / Print QR Poster</span>
              </button>
            </div>
          </div>
        </div>

        {/* Categories Link */}
        <div>
          <h4 className="font-bold text-white text-sm mb-3">Top Categories</h4>
          <div className="grid grid-cols-1 gap-1.5 text-slate-400">
            {categories.slice(0, 7).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="text-left hover:text-[#F97316] transition-colors"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* More Categories */}
        <div>
          <h4 className="font-bold text-white text-sm mb-3">More Collections</h4>
          <div className="grid grid-cols-1 gap-1.5 text-slate-400">
            {categories.slice(7, 14).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="text-left hover:text-[#F97316] transition-colors"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Newsletter & Contact */}
        <div className="space-y-3">
          <h4 className="font-bold text-white text-sm">Join KF Exclusive Club</h4>
          <p className="text-slate-400 text-[11px]">Subscribe for festival secret coupons and flash sale invites.</p>
          
          <form onSubmit={(e) => e.preventDefault()} className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-3 py-2 bg-slate-800 text-white rounded-l-xl text-xs focus:outline-none w-full border border-slate-700"
            />
            <button className="bg-[#F97316] text-white px-3 rounded-r-xl font-bold hover:bg-orange-600 transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* WhatsApp Direct Support Button */}
          <div className="pt-2 space-y-2">
            <a
              href="https://wa.me/919161772664?text=Hello%20KFMart%20Team%2C%20I%20have%20a%20query"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-colors w-full justify-center shadow-md"
            >
              <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.205 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>WhatsApp: +91 91617 72664</span>
            </a>
            <p className="text-[11px] text-slate-500">
              Domain: <strong>kfmart.in</strong> • Support: support@kfmart.in
            </p>
          </div>

          <div className="pt-2">
            <PWAInstallButton variant="banner" />
          </div>
        </div>

      </div>

      {/* Full QR Modal */}
      <WebsiteQRModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        targetUrl={websiteUrl}
      />

      {/* Copyright Bottom Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-4">
        <p>© 2026 KF Mart Retail Private Limited (kfmart.in). All Rights Reserved.</p>
        <div className="flex items-center gap-4">
          <span className="hover:underline cursor-pointer">Privacy Policy</span>
          <span className="hover:underline cursor-pointer">Terms of Service</span>
          <span className="hover:underline cursor-pointer">Vendor Escrow Agreement</span>
          <span className="hover:underline cursor-pointer">24h Return Policy</span>
        </div>
      </div>
    </footer>
  );
};
