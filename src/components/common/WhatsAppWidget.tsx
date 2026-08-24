import React, { useState } from 'react';
import { X, Send, MessageSquare, PhoneCall, Sparkles, HelpCircle } from 'lucide-react';

interface WhatsAppWidgetProps {
  phoneNumber?: string;
  defaultMessage?: string;
}

export const WhatsAppWidget: React.FC<WhatsAppWidgetProps> = ({
  phoneNumber = '919161772664',
  defaultMessage = 'Hello KF Mart Team, I have a query regarding a product/order.'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userQuery, setUserQuery] = useState('');

  const formattedPhone = '+91 91617 72664';

  const handleOpenWhatsApp = (customMsg?: string) => {
    const msg = customMsg || userQuery.trim() || defaultMessage;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const quickPrompts = [
    '📦 Need help with Order Delivery',
    '🛍️ Inquire about Product Availability',
    '💼 Vendor Partnership Inquiry',
    '💬 General Question'
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end select-none">
      
      {/* Expanded WhatsApp Chat Card Popup */}
      {isOpen && (
        <div className="mb-4 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-emerald-100 dark:border-slate-800 w-80 sm:w-96 overflow-hidden animate-fadeIn duration-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-[#005723] to-[#00702e] p-4 text-white relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Close WhatsApp Chat"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              {/* WhatsApp Logo Icon */}
              <div className="w-12 h-12 rounded-2xl bg-[#25D366] flex items-center justify-center shadow-md shrink-0">
                <svg className="w-7 h-7 fill-white" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.205 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
              </div>

              <div>
                <h3 className="font-extrabold text-sm flex items-center gap-1.5">
                  KF Mart Support
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h3>
                <p className="text-[11px] text-emerald-100 font-semibold">
                  Official WhatsApp: {formattedPhone}
                </p>
                <p className="text-[10px] text-[#A7F3D0] mt-0.5">
                  Har Dukaan, Ek Platform • Quick Response
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3 bg-slate-50 dark:bg-slate-900">
            {/* Direct Phone Number Banner */}
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-3 flex items-center justify-between text-xs text-[#005723] dark:text-emerald-300">
              <div className="flex items-center gap-2 font-bold">
                <PhoneCall className="w-4 h-4 text-[#005723] shrink-0" />
                <span>Need Instant Help?</span>
              </div>
              <a 
                href={`https://wa.me/${phoneNumber}?text=Hello%20KFMart`} 
                target="_blank"
                rel="noreferrer"
                className="font-black text-xs text-[#005723] underline"
              >
                {formattedPhone}
              </a>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
              Click a quick question or type your message below to start chatting with us on WhatsApp:
            </p>

            {/* Quick Prompts */}
            <div className="space-y-1.5">
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleOpenWhatsApp(prompt)}
                  className="w-full text-left px-3 py-2 bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-between group"
                >
                  <span>{prompt}</span>
                  <Send className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#005723] transition-colors" />
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="pt-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleOpenWhatsApp();
                  }}
                  placeholder="Type your query..."
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-[#005723]"
                />
                <button
                  onClick={() => handleOpenWhatsApp()}
                  className="bg-[#25D366] hover:bg-[#20ba5a] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-md transition-transform active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-100 dark:bg-slate-800/80 p-2.5 text-center text-[10px] text-slate-500 font-semibold border-t border-slate-200 dark:border-slate-800 flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>KF Mart Customer Care (+91 91617 72664)</span>
          </div>

        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 border-2 border-white"
        title="Chat on WhatsApp (+91 91617 72664)"
      >
        {/* WhatsApp Official SVG Logo */}
        <svg className="w-7 h-7 fill-white" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.205 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>

        {/* Pulsing indicator badge */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-400 border border-white"></span>
        </span>

        {/* Hover Pill Label */}
        <span className="absolute right-full mr-3 bg-[#005723] text-white text-xs font-extrabold px-3 py-1.5 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg pointer-events-none flex items-center gap-1.5">
          <span>Chat on WhatsApp</span>
          <span className="text-amber-300">+91 91617 72664</span>
        </span>
      </button>

    </div>
  );
};
