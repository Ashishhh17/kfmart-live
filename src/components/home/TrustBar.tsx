import React from 'react';
import { Truck, ShieldCheck, RefreshCw, Headphones } from 'lucide-react';

export const TrustBar: React.FC = () => {
  return (
    <div className="my-8 bg-[#EBF5EF] rounded-2xl p-4 sm:p-6 border border-emerald-100">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* 1. 24 Hours Delivery & Fee Policy */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#005723] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Truck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Express Delivery</h4>
            <p className="text-xs text-slate-600">FREE on ₹1,000+ • ₹20 under ₹1,000</p>
          </div>
        </div>

        {/* 2. Safe & Secure Payment */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#005723] text-white flex items-center justify-center shrink-0 shadow-xs">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Safe & Secure Payment</h4>
            <p className="text-xs text-slate-600">Direct UPI QR Code & Cash on Delivery</p>
          </div>
        </div>

        {/* 3. Easy Returns */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#005723] text-white flex items-center justify-center shrink-0 shadow-xs">
            <RefreshCw className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Easy Returns</h4>
            <p className="text-xs text-slate-600">24-hour hassle-free return window</p>
          </div>
        </div>

        {/* 4. WhatsApp Support */}
        <a 
          href="https://wa.me/919161772664?text=Hello%20KFMart%20Team%2C%20I%20have%20a%20query"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 hover:opacity-90 transition-opacity"
        >
          <div className="w-12 h-12 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-xs">
            <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.205 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">WhatsApp Query</h4>
            <p className="text-xs text-emerald-700 font-bold">+91 91617 72664</p>
          </div>
        </a>

      </div>
    </div>
  );
};
