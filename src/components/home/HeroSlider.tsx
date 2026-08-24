import React from 'react';
import { Truck, ShieldCheck, RefreshCw, Store, ArrowRight, Zap } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const HeroSlider: React.FC = () => {
  const { setSelectedCategory } = useStore();

  return (
    <div className="relative w-full rounded-2xl bg-[#EBF5EF] overflow-hidden my-4 border border-emerald-100/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-8 md:py-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        
        {/* Left Text & Feature Pills */}
        <div className="md:col-span-7 space-y-6">
          
          {/* Main Headline */}
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-[1.15] tracking-tight">
              Lalgopalganj Ka Apna <br className="hidden sm:inline" />
              Online Shopping Platform
            </h1>
            
            {/* Tagline with Yellow Highlight Line */}
            <div className="mt-3 inline-block relative">
              <p className="text-base sm:text-xl font-bold text-slate-800">
                Har Dukaan, Ek Platform
              </p>
              <div className="h-1 bg-[#EAB308] w-20 rounded-full mt-1" />
            </div>
          </div>

          {/* 4 Green Circle Features Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            
            {/* 1. 24 Hours Delivery */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-[#005723] text-white flex items-center justify-center shrink-0 shadow-sm">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-bold text-slate-900 leading-tight">
                24 Hours <br />Delivery
              </span>
            </div>

            {/* 2. Safe & Secure Payment */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-[#005723] text-white flex items-center justify-center shrink-0 shadow-sm">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-bold text-slate-900 leading-tight">
                Safe & Secure <br />Payment
              </span>
            </div>

            {/* 3. Easy Returns */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-[#005723] text-white flex items-center justify-center shrink-0 shadow-sm">
                <RefreshCw className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-bold text-slate-900 leading-tight">
                Easy <br />Returns
              </span>
            </div>

            {/* 4. Trusted Local Shops */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-[#005723] text-white flex items-center justify-center shrink-0 shadow-sm">
                <Store className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-bold text-slate-900 leading-tight">
                Trusted Local <br />Shops
              </span>
            </div>

          </div>

          {/* Dark Green CTA Button */}
          <div className="pt-2">
            <button
              onClick={() => setSelectedCategory('Fashion')}
              className="inline-flex items-center gap-2 bg-[#005723] hover:bg-[#00401A] text-white font-extrabold px-7 py-3 rounded-xl text-sm shadow-md transition-all transform hover:-translate-y-0.5"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Right Graphic Composition matching screenshot */}
        <div className="md:col-span-5 relative flex items-center justify-center min-h-[260px] sm:min-h-[320px]">
          
          {/* Fast 24 Hours Delivery Round Badge (Top Right) */}
          <div className="absolute top-0 right-2 sm:right-6 z-20 bg-white border-2 border-emerald-100 p-2 rounded-full shadow-lg text-center flex flex-col items-center justify-center w-24 h-24 sm:w-28 sm:h-28">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">FAST</span>
            <span className="text-2xl sm:text-3xl font-black text-[#005723] leading-none my-0.5">24</span>
            <span className="text-[9px] font-black text-slate-800 uppercase tracking-wider">HOURS</span>
            <div className="bg-[#EAB308] text-slate-950 font-black text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-full mt-0.5 w-full">
              DELIVERY
            </div>
          </div>

          {/* Central Illustration Stack: Shopping Bag + Product Showcase */}
          <div className="relative w-full max-w-md flex items-center justify-center">
            
            {/* The Green Shopping Bag */}
            <div className="relative z-10 w-48 sm:w-56 bg-[#005723] rounded-2xl p-5 shadow-2xl text-white text-center border-t-4 border-[#EAB308]">
              {/* Yellow handles */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-20 h-10 border-4 border-[#EAB308] rounded-t-full" />
              
              <div className="pt-2 pb-1">
                <span className="font-black text-4xl tracking-tighter text-white block">KF</span>
                <span className="font-extrabold text-sm tracking-tight text-white block mt-0.5">
                  KFMart<span className="text-[#EAB308]">.in</span>
                </span>
              </div>
            </div>

            {/* Surrounding Product Elements matching studio arrangement */}
            {/* Yellow T-Shirt on Left */}
            <div className="absolute -left-4 sm:-left-2 top-4 z-20 w-20 sm:w-28 drop-shadow-lg transform -rotate-6">
              <img 
                src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=400&auto=format&fit=crop" 
                alt="Yellow T-Shirt" 
                className="w-full h-auto rounded-xl object-contain bg-amber-50/80 p-1 border border-amber-200" 
              />
            </div>

            {/* Pink Handbag on Right-Middle */}
            <div className="absolute -right-3 sm:-right-1 bottom-8 z-20 w-18 sm:w-22 drop-shadow-lg transform rotate-6">
              <img 
                src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=400&auto=format&fit=crop" 
                alt="Pink Handbag" 
                className="w-full h-auto rounded-xl object-contain bg-pink-50/80 p-1 border border-pink-200" 
              />
            </div>

            {/* White Sneakers in Front Left */}
            <div className="absolute -bottom-3 left-1 sm:left-4 z-20 w-22 sm:w-28 drop-shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=400&auto=format&fit=crop" 
                alt="White Sneakers" 
                className="w-full h-auto rounded-xl object-contain bg-white p-1 border border-slate-200" 
              />
            </div>

            {/* Dark Green Water Bottle on Far Right */}
            <div className="absolute top-8 -right-6 sm:-right-8 z-20 w-12 sm:w-16 drop-shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=400&auto=format&fit=crop" 
                alt="Green Water Bottle" 
                className="w-full h-auto rounded-xl object-contain bg-emerald-50 p-1 border border-emerald-200" 
              />
            </div>

            {/* Black Wristwatch in Front Right */}
            <div className="absolute -bottom-2 right-6 sm:right-10 z-20 w-12 sm:w-16 drop-shadow-md transform -rotate-12">
              <img 
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&auto=format&fit=crop" 
                alt="Black Wristwatch" 
                className="w-full h-auto rounded-xl object-contain bg-slate-900 p-1 border border-slate-800" 
              />
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
