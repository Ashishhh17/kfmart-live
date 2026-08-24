import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Heart, 
  Wallet, 
  Tag, 
  MapPin, 
  Bell, 
  FileText, 
  RotateCcw, 
  User as UserIcon, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Truck, 
  ChevronRight,
  ShieldCheck,
  HelpCircle,
  Trash2,
  ShoppingBag,
  X,
  KeyRound,
  Lock
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';
import { ChangePasswordModal } from '../common/ChangePasswordModal';

export const UserDashboard: React.FC = () => {
  const { 
    orders, 
    wishlist, 
    toggleWishlist,
    addToCart,
    notifications, 
    getReturnWindowStatus, 
    requestReturn, 
    requestExchange,
    cancelOrder,
    setActiveInvoiceOrder,
    pincode
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    'orders' | 'wishlist' | 'wallet' | 'coupons' | 'addresses' | 'returns' | 'profile'
  >('orders');

  const [returnModalOrder, setReturnModalOrder] = useState<Order | null>(null);
  const [returnReason, setReturnReason] = useState('');
  const [returnType, setReturnType] = useState<'return' | 'exchange'>('return');
  const [exchangeSize, setExchangeSize] = useState('L');
  const [returnError, setReturnError] = useState<string | null>(null);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  // Order Cancellation State
  const [cancelModalOrder, setCancelModalOrder] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('Ordered by mistake');
  const [customCancelReason, setCustomCancelReason] = useState<string>('');
  const [cancelError, setCancelError] = useState<string | null>(null);

  // Force tick every minute so 24h timer updates live
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 30000);
    return () => clearInterval(timer);
  }, []);

  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnModalOrder) return;

    if (returnType === 'return') {
      const res = requestReturn(returnModalOrder.id, returnReason);
      if (!res.success) setReturnError(res.message);
      else setReturnModalOrder(null);
    } else {
      const res = requestExchange(returnModalOrder.id, exchangeSize, returnReason);
      if (!res.success) setReturnError(res.message);
      else setReturnModalOrder(null);
    }
  };

  const handleCancelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelModalOrder) return;

    const finalReason = cancelReason === 'Other' && customCancelReason.trim() 
      ? customCancelReason.trim() 
      : cancelReason;

    const res = cancelOrder(cancelModalOrder.id, finalReason);
    if (!res.success) {
      setCancelError(res.message);
    } else {
      setCancelModalOrder(null);
      setCancelReason('Ordered by mistake');
      setCustomCancelReason('');
      setCancelError(null);
    }
  };

  return (
    <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#005723] via-[#00401A] to-[#005723] rounded-3xl p-6 text-white shadow-xl mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg">
            KF
          </div>
          <div>
            <h1 className="text-xl font-bold">Welcome back, KF Mart!</h1>
            <p className="text-xs text-emerald-100">Express Delivery Hubs: <strong className="text-amber-300">Pincodes 229413 & 230201</strong></p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-center">
            <span className="text-[10px] text-emerald-100 block uppercase font-bold">KF Wallet</span>
            <span className="text-base font-extrabold text-amber-300">₹1,250.00</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-center">
            <span className="text-[10px] text-emerald-100 block uppercase font-bold">Total Orders</span>
            <span className="text-base font-extrabold text-white">{orders.length}</span>
          </div>
          <button
            type="button"
            onClick={() => setIsChangePasswordOpen(true)}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-4 py-2.5 rounded-2xl font-black text-xs shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <KeyRound className="w-4 h-4" />
            <span>Change Password</span>
          </button>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="space-y-1 bg-white dark:bg-slate-800 p-3 rounded-3xl border border-slate-200 dark:border-slate-700 h-fit shadow-xs">
          {[
            { id: 'orders', label: 'My Orders & Timeline', icon: <Package className="w-4 h-4 text-[#005723]" /> },
            { id: 'wishlist', label: 'Wishlist Items', icon: <Heart className="w-4 h-4 text-red-500" /> },
            { id: 'wallet', label: 'Wallet & Cashback', icon: <Wallet className="w-4 h-4 text-amber-500" /> },
            { id: 'coupons', label: 'Saved Coupons', icon: <Tag className="w-4 h-4 text-emerald-500" /> },
            { id: 'returns', label: 'Exchange & Returns', icon: <RotateCcw className="w-4 h-4 text-[#F97316]" /> },
            { id: 'addresses', label: 'Saved Addresses', icon: <MapPin className="w-4 h-4 text-emerald-600" /> },
            { id: 'profile', label: 'Profile Settings', icon: <UserIcon className="w-4 h-4 text-purple-500" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-[#005723] text-white shadow-sm' 
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {tab.icon}
                <span>{tab.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </button>
          ))}
        </div>

        {/* Content Panel */}
        <div className="lg:col-span-3 space-y-6">

          {/* TAB 1: MY ORDERS & TIMELINE */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-[#005723]" />
                Recent Orders & Live Delivery Timeline
              </h2>

              {orders.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-500">No orders placed yet.</p>
                </div>
              ) : (
                orders.map(order => {
                  const windowStatus = getReturnWindowStatus(order);

                  return (
                    <div 
                      key={order.id}
                      className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4"
                    >
                      {/* Top Order Row */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-3 text-xs">
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Order Number</span>
                          <span className="font-extrabold text-slate-900 dark:text-white">#{order.id}</span>
                        </div>

                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Order Date</span>
                          <span className="font-semibold">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>

                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Amount</span>
                          <span className="font-black text-[#005723] dark:text-amber-400">₹{order.totalAmount.toLocaleString()}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setActiveInvoiceOrder(order)}
                            className="px-3 py-1.5 bg-emerald-50 dark:bg-slate-700 text-[#005723] dark:text-amber-300 font-bold text-[11px] rounded-xl flex items-center gap-1 border border-emerald-200 dark:border-slate-600"
                          >
                            <FileText className="w-3.5 h-3.5" /> Invoice
                          </button>

                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                            order.status === 'Delivered' 
                              ? 'bg-emerald-500/10 text-emerald-600' 
                              : order.status === 'Cancelled'
                              ? 'bg-red-500/10 text-red-600'
                              : 'bg-amber-500/10 text-[#F97316]'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>

                      {/* Items Preview */}
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <img src={item.product.images[0]} alt="" className="w-12 h-14 rounded-xl object-cover" />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{item.product.name}</h4>
                              <p className="text-[10px] text-slate-400">
                                Qty: {item.quantity} 
                                {item.selectedSize && <span className="ml-1 text-slate-700 dark:text-slate-300 font-bold bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-[9px]">Size: {item.selectedSize}</span>}
                                • ₹{item.product.sellingPrice}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Active Order Cancellation Button */}
                      {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                        <div className="flex items-center justify-between p-3.5 bg-red-50/70 dark:bg-red-950/20 rounded-2xl border border-red-200/80 dark:border-red-900/40">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                            <div className="text-xs">
                              <span className="font-bold text-slate-800 dark:text-slate-200">Need to cancel this order?</span>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                                You can cancel free of charge before delivery.{order.paymentMethod !== 'COD' ? ' Instant refund initiated.' : ''}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setCancelModalOrder(order);
                              setCancelReason('Ordered by mistake');
                              setCustomCancelReason('');
                              setCancelError(null);
                            }}
                            className="bg-white dark:bg-slate-800 hover:bg-red-50 text-red-600 dark:text-red-400 hover:text-red-700 font-bold px-3.5 py-1.5 rounded-xl text-xs border border-red-300 dark:border-red-800 shadow-xs transition-colors shrink-0 cursor-pointer"
                          >
                            Cancel Order
                          </button>
                        </div>
                      )}

                      {/* Cancelled Order Banner */}
                      {order.status === 'Cancelled' && (
                        <div className="p-3.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-300 dark:border-slate-700 text-xs">
                          <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 mb-1">
                            <span className="font-bold flex items-center gap-1.5 text-red-500">
                              <X className="w-4 h-4" /> This Order Was Cancelled
                            </span>
                            {order.cancelledAt && (
                              <span className="text-[10px] text-slate-400">
                                {new Date(order.cancelledAt).toLocaleString()}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400">
                            <strong>Reason:</strong> {order.cancellationReason || 'Cancelled by customer'}
                          </p>
                          {order.paymentMethod !== 'COD' && (
                            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                              ✓ Refund status: {order.paymentStatus} (Amount will reflect in bank/wallet within 24 hours)
                            </p>
                          )}
                        </div>
                      )}

                      {/* Live Order Timeline */}
                      <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
                        
                        {/* Vendor Delivery Promise & Courier Partner */}
                        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                          <div className="flex items-center gap-2">
                            <Truck className="w-4 h-4 text-[#F97316]" />
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold uppercase block">Vendor Delivery Promise</span>
                              <span className="font-extrabold text-slate-900 dark:text-white">
                                {order.estimatedDeliveryTime || '24 Hours Express Delivery'}
                              </span>
                            </div>
                          </div>

                          {order.shipmentTrackingNumber && (
                            <div className="text-right">
                              <span className="text-[10px] text-slate-400 font-bold uppercase block">Tracking No. ({order.courierPartner || 'KF Express'})</span>
                              <span className="font-mono font-extrabold text-[#005723] dark:text-amber-400">
                                {order.shipmentTrackingNumber}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Current Location Note */}
                        {order.currentShipmentLocation && (
                          <div className="text-[11px] bg-emerald-50/80 dark:bg-slate-800 p-2.5 rounded-xl border border-emerald-100 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-between">
                            <span>📍 <strong>Current Location:</strong> {order.currentShipmentLocation}</span>
                            <span className="text-[10px] text-slate-400 font-bold">Live Tracking Updated</span>
                          </div>
                        )}

                        <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pt-1">
                          Live Order Status Progress
                        </p>

                        <div className="flex items-center justify-between relative max-w-xl mx-auto py-2">
                          {['Ordered', 'Packed', 'Shipped', 'Out For Delivery', 'Delivered'].map((st, i) => {
                            const isPassed = order.timeline.some(t => t.status === st);
                            const isCurrent = order.status === st;

                            return (
                              <div key={st} className="flex flex-col items-center z-10">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                  isPassed ? 'bg-[#005723] text-white' : 'bg-slate-200 text-slate-500'
                                }`}>
                                  {isPassed ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                                </div>
                                <span className={`text-[9px] font-semibold mt-1 text-center max-w-[60px] ${
                                  isCurrent ? 'text-[#F97316] font-bold' : 'text-slate-400'
                                }`}>
                                  {st}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* 24-HOUR RETURN & EXCHANGE STRICT POLICY BOX */}
                      {order.status === 'Delivered' && (
                        <div className="p-4 rounded-2xl border bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-amber-500/10 border-amber-500/30 space-y-3">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                              <RotateCcw className="w-5 h-5 text-[#F97316]" />
                              <div>
                                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
                                  24-Hour Return & Exchange Window
                                </h4>
                                <p className="text-[10px] text-slate-500">
                                  Policy active for 24 hours post delivery in Pincode {order.shippingAddress.pincode}.
                                </p>
                              </div>
                            </div>

                            {/* Timer indicator */}
                            {windowStatus.active ? (
                              <div className="flex items-center gap-1.5 bg-[#F97316] text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs">
                                <Clock className="w-3.5 h-3.5" />
                                <span>Expires in: {windowStatus.remainingHours}h {windowStatus.remainingMinutes}m</span>
                              </div>
                            ) : (
                              <div className="text-xs font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-xl border border-red-200">
                                {windowStatus.message}
                              </div>
                            )}
                          </div>

                          {/* Return/Exchange Action Buttons */}
                          {windowStatus.active ? (
                            <div className="flex gap-2 pt-2 border-t border-amber-500/20">
                              <button
                                onClick={() => {
                                  setReturnModalOrder(order);
                                  setReturnType('return');
                                }}
                                className="flex-1 bg-white dark:bg-slate-800 hover:bg-slate-100 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white font-bold py-2 rounded-xl text-xs transition-colors"
                              >
                                Request Parcel Return
                              </button>
                              <button
                                onClick={() => {
                                  setReturnModalOrder(order);
                                  setReturnType('exchange');
                                }}
                                className="flex-1 bg-[#005723] hover:bg-[#00401A] text-white font-bold py-2 rounded-xl text-xs transition-colors shadow-xs"
                              >
                                Request Size Exchange
                              </button>
                            </div>
                          ) : (
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 italic">
                              Exchange and Return period has expired.
                            </p>
                          )}
                        </div>
                      )}

                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 2: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Saved Wishlist ({wishlist.length})</h2>
                {wishlist.length > 0 && (
                  <p className="text-xs text-slate-500">Items saved for quick purchase or comparison</p>
                )}
              </div>

              {wishlist.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <Heart className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500 font-semibold">Your wishlist is currently empty.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {wishlist.map(product => (
                    <div key={product.id} className="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="relative mb-2">
                          <img src={product.images[0]} alt={product.name} className="w-full h-36 object-cover rounded-xl" />
                          <button
                            onClick={() => toggleWishlist(product)}
                            className="absolute top-2 right-2 p-1.5 bg-white/90 dark:bg-slate-900/90 hover:bg-red-50 text-red-500 rounded-xl shadow-xs transition-colors"
                            title="Remove item from wishlist"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{product.name}</h4>
                        <p className="text-xs font-extrabold text-[#005723] dark:text-amber-400 mt-0.5">₹{product.sellingPrice.toLocaleString()}</p>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                        <button
                          onClick={() => addToCart(product)}
                          className="flex-1 bg-[#005723] hover:bg-[#00401A] text-white font-bold py-1.5 rounded-xl text-[11px] flex items-center justify-center gap-1 transition-colors"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" /> Move to Cart
                        </button>
                        <button
                          onClick={() => toggleWishlist(product)}
                          className="p-1.5 text-slate-400 hover:text-red-500 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-slate-700 transition-colors"
                          title="Remove item"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: WALLET */}
          {activeTab === 'wallet' && (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Wallet className="w-5 h-5 text-amber-500" />
                KF Mart Pay Balance
              </h2>
              <div className="p-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl text-slate-950 font-black text-2xl shadow-md">
                ₹1,250.00
                <span className="block text-xs font-medium text-slate-900 mt-1">Instant 1-click checkout ready</span>
              </div>
            </div>
          )}

          {/* TAB 4: COUPONS */}
          {activeTab === 'coupons' && (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Tag className="w-5 h-5 text-emerald-600" />
                Available Coupons & Offers
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50 dark:bg-slate-900/60 border border-emerald-200 dark:border-emerald-900/40 rounded-2xl space-y-1">
                  <span className="text-xs font-black text-[#005723] dark:text-emerald-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-emerald-300">
                    KFMART10
                  </span>
                  <p className="text-xs font-bold text-slate-800 dark:text-white mt-1">Flat 10% Instant Discount</p>
                  <p className="text-[11px] text-slate-500">Applicable on orders above ₹499 in Lalgopalganj & Kunda</p>
                </div>
                <div className="p-4 bg-amber-50 dark:bg-slate-900/60 border border-amber-200 dark:border-amber-900/40 rounded-2xl space-y-1">
                  <span className="text-xs font-black text-amber-700 dark:text-amber-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-amber-300">
                    EXPRESSFREE
                  </span>
                  <p className="text-xs font-bold text-slate-800 dark:text-white mt-1">Free 24h Express Delivery</p>
                  <p className="text-[11px] text-slate-500">Zero shipping fee on first 3 orders</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: RETURNS */}
          {activeTab === 'returns' && (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-[#F97316]" />
                24-Hour Return & Exchange Center
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                You can initiate returns or size exchanges within 24 hours of delivery from the <strong>My Orders</strong> tab.
              </p>
            </div>
          )}

          {/* TAB 6: ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                Saved Delivery Addresses
              </h2>
              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black text-slate-900 dark:text-white">Primary Delivery Address</span>
                  <span className="text-[10px] font-bold bg-[#005723] text-white px-2 py-0.5 rounded-full">Default</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Near Railway Station Road, Main Market, Lalgopalganj, UP - 229413
                </p>
              </div>
            </div>
          )}

          {/* TAB 7: PROFILE & PASSWORD SECURITY */}
          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-[#005723]" />
                    Account Details & Security
                  </h2>
                  <p className="text-xs text-slate-500">Manage your profile information and credentials</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsChangePasswordOpen(true)}
                  className="px-4 py-2 bg-[#005723] hover:bg-[#00401A] text-white font-extrabold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <KeyRound className="w-4 h-4 text-amber-300" />
                  <span>Change Password</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Registered Name</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">KF Mart Shopper</span>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Email / User ID</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">customer@kfmart.in</span>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Delivery Zone</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Lalgopalganj & Kunda ({pincode})</span>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Password Status</span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Protected & Active
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsChangePasswordOpen(true)}
                    className="text-xs font-bold text-[#005723] dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        defaultUserId="customer@kfmart.in"
        accountTitle="Customer Shopper Account"
        role="customer"
      />

      {/* Return & Exchange Request Modal */}
      {returnModalOrder && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {returnType === 'return' ? 'Request Parcel Return' : 'Request Item Exchange'}
              </h3>
              <button onClick={() => setReturnModalOrder(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleReturnSubmit} className="space-y-4">
              {returnType === 'exchange' && (
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">Select Exchange Size</label>
                  <select
                    value={exchangeSize}
                    onChange={(e) => setExchangeSize(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="S">Size S</option>
                    <option value="M">Size M</option>
                    <option value="L">Size L</option>
                    <option value="XL">Size XL</option>
                    <option value="XXL">Size XXL</option>
                  </select>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">Reason for Return / Exchange</label>
                <textarea
                  required
                  rows={3}
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  placeholder="e.g. Size fitting issue, fabric color preference..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              {returnError && <p className="text-xs text-red-500 font-bold">{returnError}</p>}

              <button
                type="submit"
                className="w-full bg-[#005723] hover:bg-[#00401A] text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-sm"
              >
                Submit Request
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Order Cancellation Modal */}
      {cancelModalOrder && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-700">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Cancel Order #{cancelModalOrder.id}
                </h3>
                <p className="text-xs text-slate-500">
                  Total Value: ₹{cancelModalOrder.totalAmount.toLocaleString()} • {cancelModalOrder.paymentMethod}
                </p>
              </div>
              <button 
                type="button"
                onClick={() => setCancelModalOrder(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCancelSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  Please select a reason for cancellation:
                </label>
                <div className="space-y-2">
                  {[
                    'Ordered by mistake',
                    'Changed my mind',
                    'Delivery time is too long',
                    'Found better price elsewhere',
                    'Incorrect size or color selected',
                    'Other'
                  ].map(reason => (
                    <label 
                      key={reason}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                        cancelReason === reason 
                          ? 'bg-blue-50/70 dark:bg-blue-900/30 border-[#1E3A8A] dark:border-blue-500 font-bold text-slate-900 dark:text-white' 
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="cancelReason"
                        checked={cancelReason === reason}
                        onChange={() => setCancelReason(reason)}
                        className="text-[#1E3A8A] focus:ring-[#1E3A8A]"
                      />
                      <span>{reason}</span>
                    </label>
                  ))}
                </div>
              </div>

              {cancelReason === 'Other' && (
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    Describe your reason (Optional):
                  </label>
                  <textarea
                    rows={2}
                    value={customCancelReason}
                    onChange={(e) => setCustomCancelReason(e.target.value)}
                    placeholder="Tell us more about why you're cancelling..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                  />
                </div>
              )}

              {cancelModalOrder.paymentMethod !== 'COD' && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300">
                  <strong>Refund Guarantee:</strong> Prepaid amount of ₹{cancelModalOrder.totalAmount.toLocaleString()} will be automatically refunded to your original payment method.
                </div>
              )}

              {cancelError && (
                <p className="text-xs text-red-500 font-bold">{cancelError}</p>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCancelModalOrder(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-2.5 rounded-xl text-xs"
                >
                  Keep Order
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-sm"
                >
                  Confirm Cancellation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
