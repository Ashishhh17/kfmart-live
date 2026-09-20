import React, { ErrorInfo, ReactNode } from 'react';
import { RefreshCw, Trash2, ShoppingBag, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('KF Mart Uncaught React Error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleResetCacheAndReload = () => {
    try {
      // Clear potentially corrupt cached localStorage keys
      const keysToClear = [
        'kfmart_cart',
        'kfmart_wishlist',
        'kfmart_orders',
        'kfmart_session',
        'kfmart_active_role',
        'kfmart_current_vendor_id',
        'kfmart_user_passwords_v2',
        'kfmart_pwa_installed'
      ];
      keysToClear.forEach(k => {
        try { localStorage.removeItem(k); } catch {}
      });
      
      // Unregister any service workers
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(regs => {
          regs.forEach(r => r.unregister());
        }).catch(() => {});
      }
      
      // Clear caches
      if ('caches' in window) {
        caches.keys().then(keys => {
          keys.forEach(k => caches.delete(k));
        }).catch(() => {});
      }
    } catch (e) {
      console.warn('Error clearing storage:', e);
    }
    window.location.reload();
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-900">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-[#005723] rounded-2xl mx-auto flex items-center justify-center shadow-inner">
              <ShoppingBag className="w-8 h-8" />
            </div>

            <div>
              <h1 className="text-xl font-black text-slate-900">KF MART Retail</h1>
              <p className="text-xs text-emerald-700 font-bold uppercase tracking-wider mt-0.5">Application Restored</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-left">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-xs mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Temporary glitch recovered</span>
              </div>
              <p className="text-[11px] text-amber-700 leading-relaxed">
                {this.state.error?.message || 'A script interruption was detected and isolated.'}
              </p>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="w-full bg-[#005723] hover:bg-[#00481D] text-white font-bold py-3 px-4 rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Website
              </button>

              <button
                type="button"
                onClick={this.handleResetCacheAndReload}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-200"
              >
                <Trash2 className="w-3.5 h-3.5 text-slate-500" />
                Clear Local Cache & Restart
              </button>
            </div>

            <div className="text-[11px] text-slate-400">
              WhatsApp Support: <strong className="text-slate-700">+91 91617 72664</strong>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
