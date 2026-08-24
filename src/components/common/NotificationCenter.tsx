import React from 'react';
import { X, Bell, CheckCheck, Truck, Package, Tag, AlertCircle, Phone, Mail, Globe } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const NotificationCenter: React.FC = () => {
  const { 
    notifications, 
    isNotificationDrawerOpen, 
    setIsNotificationDrawerOpen, 
    markNotificationAsRead 
  } = useStore();

  if (!isNotificationDrawerOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'delivery': return <Truck className="w-4 h-4 text-amber-500" />;
      case 'order': return <Package className="w-4 h-4 text-[#1E3A8A]" />;
      case 'offer': return <Tag className="w-4 h-4 text-emerald-500" />;
      default: return <AlertCircle className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
        onClick={() => setIsNotificationDrawerOpen(false)}
      />

      {/* Slide-over drawer */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl z-10 flex flex-col border-l border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#F97316]" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Notifications & Alerts</h2>
          </div>
          <button 
            onClick={() => setIsNotificationDrawerOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Bell className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p className="text-xs">No notifications yet.</p>
            </div>
          ) : (
            notifications.map(n => (
              <div 
                key={n.id}
                onClick={() => markNotificationAsRead(n.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  n.read 
                    ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-80' 
                    : 'bg-blue-50/60 dark:bg-slate-800 border-blue-200 dark:border-blue-900/50 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-700 shadow-xs">
                    {getIcon(n.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{n.title}</h4>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.timestamp}</span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-2">{n.message}</p>

                    {/* Dispatch Channels Indicator (SMS / Email / Website) */}
                    {n.channelsSent && n.channelsSent.length > 0 && (
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[10px] text-slate-500 dark:text-slate-400">
                        <span className="font-semibold text-slate-400">Sent via:</span>
                        {n.channelsSent.includes('Website') && (
                          <span className="flex items-center gap-0.5 bg-slate-200/80 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300">
                            <Globe className="w-2.5 h-2.5 text-[#1E3A8A]" /> Web
                          </span>
                        )}
                        {n.channelsSent.includes('SMS') && (
                          <span className="flex items-center gap-0.5 bg-amber-500/10 text-[#F97316] px-1.5 py-0.5 rounded font-semibold">
                            <Phone className="w-2.5 h-2.5" /> SMS
                          </span>
                        )}
                        {n.channelsSent.includes('Email') && (
                          <span className="flex items-center gap-0.5 bg-blue-500/10 text-blue-600 px-1.5 py-0.5 rounded font-semibold">
                            <Mail className="w-2.5 h-2.5" /> Email
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-[11px] text-slate-500 text-center">
          Order updates & pincode notifications are synced in real time.
        </div>
      </div>
    </div>
  );
};
