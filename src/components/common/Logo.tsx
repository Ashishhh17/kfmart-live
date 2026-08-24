import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'favicon' | 'full';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = 'h-10', 
  variant = 'light',
  showTagline = true 
}) => {
  const isDark = variant === 'dark';
  const kfColor = isDark ? '#FFFFFF' : '#005723';
  const martColor = '#FFB800';
  const dotInColor = isDark ? '#FFFFFF' : '#005723';
  const taglineColor = isDark ? '#A7F3D0' : '#005723';

  if (variant === 'favicon') {
    return (
      <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="22" fill="#005723" />
        {/* Yellow handle */}
        <path d="M38 32 C38 18, 62 18, 62 32" stroke="#FFB800" strokeWidth="6" strokeLinecap="round" fill="none" />
        {/* Bag body */}
        <path d="M22 32 H78 L74 86 C74 88, 72 90, 70 90 H30 C28 90, 26 88, 26 86 L22 32 Z" fill="#00481D" />
        {/* Monogram KF */}
        <text x="35" y="70" fill="#FFFFFF" fontSize="32" fontWeight="900" fontStyle="italic" fontFamily="sans-serif">K</text>
        <text x="54" y="70" fill="#FFB800" fontSize="32" fontWeight="900" fontStyle="italic" fontFamily="sans-serif">F</text>
      </svg>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 select-none cursor-pointer ${className}`}>
      
      {/* Exact KFMart.in Shopping Bag Icon with Yellow Speed Lines & Dual Color Slanted KF */}
      <div className="relative shrink-0">
        <svg 
          className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-md transition-transform duration-200 hover:scale-105" 
          viewBox="0 0 200 180" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 4 Golden Yellow Speed / Motion Lines on the Left */}
          <rect x="20" y="58" width="30" height="7" rx="3.5" fill="#FFB800" />
          <rect x="10" y="72" width="45" height="8" rx="4" fill="#FFB800" />
          <rect x="15" y="88" width="40" height="8" rx="4" fill="#FFB800" />
          <rect x="25" y="104" width="28" height="7" rx="3.5" fill="#FFB800" />

          {/* Golden Yellow Handles */}
          <path 
            d="M82 42 C82 14, 128 14, 128 42" 
            stroke="#FFB800" 
            strokeWidth="9" 
            strokeLinecap="round" 
            fill="none" 
          />

          {/* Green Shopping Bag Body */}
          <path 
            d="M58 42 H152 C157 42, 161 45, 162 50 L170 142 C171 148, 166 154, 160 154 H50 C44 154, 39 148, 40 142 L48 50 C49 45, 53 42, 58 42 Z" 
            fill="#005723" 
          />

          {/* Bottom Green Curve Shadow Arc under bag */}
          <path 
            d="M40 158 C70 166, 140 166, 170 158" 
            stroke="#003D18" 
            strokeWidth="4" 
            strokeLinecap="round" 
          />

          {/* Handle Grommets (White Circles) */}
          <circle cx="82" cy="44" r="5" fill="#FFFFFF" />
          <circle cx="128" cy="44" r="5" fill="#FFFFFF" />

          {/* Slanted Monogram Text: White "K" + Yellow "F" */}
          <g transform="skewX(-14) translate(22, 0)">
            {/* K in White */}
            <text 
              x="82" 
              y="122" 
              fill="#FFFFFF" 
              fontSize="68" 
              fontWeight="900" 
              fontFamily="system-ui, -apple-system, sans-serif"
              letterSpacing="-2"
            >
              K
            </text>
            
            {/* F in Golden Yellow */}
            <text 
              x="122" 
              y="122" 
              fill="#FFB800" 
              fontSize="68" 
              fontWeight="900" 
              fontFamily="system-ui, -apple-system, sans-serif"
              letterSpacing="-2"
            >
              F
            </text>
          </g>
        </svg>
      </div>

      {/* Brand Name Typography + Tagline matching the exact logo picture */}
      <div className="flex flex-col justify-center">
        {/* Main Title: KFMart.in */}
        <div className="flex items-baseline font-black tracking-tight leading-none text-2xl sm:text-3xl" style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
          <span className="italic" style={{ color: kfColor }}>KF</span>
          <span className="italic" style={{ color: martColor }}>Mart</span>
          <span className="italic text-xl sm:text-2xl" style={{ color: dotInColor }}>.in</span>
        </div>
        
        {/* Subtitle Tagline: — HAR DUKAAN, EK PLATFORM — */}
        {showTagline && (
          <div className="flex items-center gap-1.5 mt-1">
            <div className="h-[1.5px] w-3 bg-[#005723] dark:bg-emerald-400" />
            <span 
              className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider whitespace-nowrap"
              style={{ color: taglineColor }}
            >
              HAR DUKAAN, EK PLATFORM
            </span>
            <div className="h-[1.5px] w-3 bg-[#005723] dark:bg-emerald-400" />
          </div>
        )}
      </div>

    </div>
  );
};
