import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  CheckCircle2, 
  ShieldCheck, 
  MapPin, 
  KeyRound, 
  AlertTriangle,
  User,
  Plus,
  Bike,
  DollarSign,
  Phone,
  Sparkles,
  LogOut,
  Package,
  Layers
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ChangePasswordModal } from '../common/ChangePasswordModal';
import { Order } from '../../types';

export const DeliveryExecutivePanel: React.FC = () => {
  const { 
    orders, 
    updateOrderStatus, 
    pincode, 
    deliveryExecutives, 
    setIsDeliveryPartnerRegModalOpen,
    session,
    logout
  } = useStore();

  // Find matching agent if logged in via session
  const sessionIdentifier = (session?.identifier || '').trim().toLowerCase();
  const sessionMatchedAgent = deliveryExecutives.find(d => 
    sessionIdentifier && (
      d.id.toLowerCase() === sessionIdentifier ||
      d.phone.replace(/\D/g, '') === sessionIdentifier.replace(/\D/g, '') ||
      (d.email && d.email.toLowerCase() === sessionIdentifier)
    )
  );

  const [selectedExecId, setSelectedExecId] = useState<string>(() => {
    const saved = localStorage.getItem('kfmart_selected_delivery_id');
    if (saved && deliveryExecutives.some(d => d.id === saved)) return saved;
    return sessionMatchedAgent?.id || deliveryExecutives[0]?.id || 'del-1';
  });

  const [deliveryTab, setDeliveryTab] = useState<'assigned' | 'hub_pool' | 'completed'>('assigned');
  const [enteredOTP, setEnteredOTP] = useState<Record<string, string>>({});
  const [otpError, setOtpError] = useState<Record<string, string>>({});
  const [otpSuccess, setOtpSuccess] = useState<Record<string, string>>({});
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  // Sync when session changes
  useEffect(() => {
    if (sessionMatchedAgent && sessionMatchedAgent.id !== selectedExecId) {
      setSelectedExecId(sessionMatchedAgent.id);
      localStorage.setItem('kfmart_selected_delivery_id', sessionMatchedAgent.id);
    }
  }, [sessionMatchedAgent?.id]);

  const handleSelectAgent = (id: string) => {
    setSelectedExecId(id);
    localStorage.setItem('kfmart_selected_delivery_id', id);
  };

  const activeAgent = deliveryExecutives.find(d => d.id === selectedExecId) || deliveryExecutives[0] || {
    id: 'del-1',
    name: 'Rajesh Kumar',
    phone: '+91 91617 72664',
    vehicleType: 'Hero Splendor Plus',
    vehicleNumber: 'UP-33-KFM-101',
    assignedZone: 'Lalgopalganj & Kunda (229413 & 230201)',
    completedDeliveries: 142,
    totalEarnings: 8520,
    status: 'Active'
  };

  // Check if an order is assigned to the current active agent
  const isAssignedToCurrentAgent = (order: Order) => {
    if (!order.deliveryPartnerId) return false;
    const assigned = String(order.deliveryPartnerId).trim().toLowerCase();
    const agentId = String(activeAgent.id).trim().toLowerCase();
    const cleanAgentPhone = activeAgent.phone.replace(/\D/g, '');
    const cleanAssignedPhone = assigned.replace(/\D/g, '');
    const cleanAgentName = activeAgent.name.trim().toLowerCase();

    return (
      assigned === agentId ||
      (cleanAgentPhone && cleanAssignedPhone && cleanAgentPhone === cleanAssignedPhone) ||
      assigned === cleanAgentName ||
      (order.courierPartner && String(order.courierPartner).toLowerCase().includes(cleanAgentName))
    );
  };

  // 1. My Assigned Active Parcels (Ordered, Packed, Shipped, Out For Delivery)
  const myAssignedOrders = orders.filter(o => 
    isAssignedToCurrentAgent(o) && o.status !== 'Delivered' && o.status !== 'Cancelled'
  );

  // 2. Hub Pool (Orders in zone not yet assigned or out for delivery)
  const hubPoolOrders = orders.filter(o => 
    !o.deliveryPartnerId && o.status !== 'Delivered' && o.status !== 'Cancelled'
  );

  // 3. Completed Deliveries by this agent
  const completedOrders = orders.filter(o => 
    isAssignedToCurrentAgent(o) && o.status === 'Delivered'
  );

  const displayedOrders = deliveryTab === 'assigned' 
    ? myAssignedOrders 
    : deliveryTab === 'hub_pool' 
    ? hubPoolOrders 
    : completedOrders;

  const handleVerifyOTP = (orderId: string, correctOTP: string) => {
    const input = (enteredOTP[orderId] || '').trim();
    if (!input) {
      setOtpError(prev => ({ ...prev, [orderId]: 'Please enter the 4-digit Delivery OTP provided by customer.' }));
      return;
    }

    if (input === String(correctOTP).trim()) {
      updateOrderStatus(orderId, 'Delivered', `OTP verified successfully at doorstep by Rider ${activeAgent.name} (${activeAgent.phone})`);
      setOtpError(prev => ({ ...prev, [orderId]: '' }));
      setOtpSuccess(prev => ({ ...prev, [orderId]: 'Delivery confirmed successfully! Order marked as Delivered.' }));
      setTimeout(() => {
        setOtpSuccess(prev => ({ ...prev, [orderId]: '' }));
      }, 5000);
    } else {
      setOtpError(prev => ({ 
        ...prev, 
        [orderId]: 'Invalid Delivery OTP! Ask customer to check the 4-digit OTP shown in their KF Mart order screen or invoice.' 
      }));
    }
  };

  return (
    <div className="py-6 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Top Banner with Agent Selector and Action Buttons */}
      <div className="bg-gradient-to-r from-slate-900 via-[#003816] to-slate-900 rounded-3xl p-6 text-white shadow-xl mb-6 flex flex-wrap items-center justify-between gap-4 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-400/20 text-amber-300 rounded-2xl border border-amber-400/30">
            <Truck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="bg-emerald-500 text-slate-950 font-black text-[10px] uppercase px-2 py-0.5 rounded">
                VERIFIED DELIVERY PARTNER
              </span>
              <span className="text-xs text-slate-300">Zone: <strong>{activeAgent.assignedZone || pincode}</strong></span>
            </div>
            <h1 className="text-lg font-black">{activeAgent.name} • Dispatch Portal</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Agent Switcher Dropdown */}
          <select
            value={selectedExecId}
            onChange={(e) => handleSelectAgent(e.target.value)}
            className="px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold text-white outline-none cursor-pointer backdrop-blur-md"
            title="Switch Delivery Profile"
          >
            {deliveryExecutives.map(exec => (
              <option key={exec.id} value={exec.id} className="text-slate-900 bg-white">
                {exec.name} ({exec.phone})
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setIsDeliveryPartnerRegModalOpen(true)}
            className="px-3.5 py-2 bg-[#005723] hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>+ Add Rider</span>
          </button>

          <button
            type="button"
            onClick={() => setIsChangePasswordOpen(true)}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            title="Change Rider Account Password"
          >
            <KeyRound className="w-4 h-4 text-amber-400" />
            <span>Password</span>
          </button>

          <button
            type="button"
            onClick={logout}
            className="px-3 py-2 bg-red-600/80 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1 transition-all cursor-pointer"
            title="Logout from Delivery Partner session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Rider Performance & Vehicle Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Assigned Vehicle</span>
          <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1 mt-0.5">
            <Bike className="w-4 h-4 text-amber-500" /> {activeAgent.vehicleType || 'Bike'}
          </span>
          <span className="text-[10px] text-slate-500 font-mono">{activeAgent.vehicleNumber || 'UP-33-REG'}</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Active Assigned</span>
          <span className="font-extrabold text-slate-900 dark:text-white text-base mt-0.5">
            {myAssignedOrders.length} Parcels
          </span>
          <span className="text-[10px] text-emerald-600 font-bold">Ready for Delivery</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Completed Deliveries</span>
          <span className="font-extrabold text-[#005723] dark:text-emerald-400 text-base mt-0.5">
            {(activeAgent.completedDeliveries || 0) + completedOrders.length} Delivered
          </span>
          <span className="text-[10px] text-slate-500">100% Doorstep Verified</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Rider Partner ID</span>
          <span className="font-extrabold font-mono text-slate-900 dark:text-white text-xs mt-0.5">
            {activeAgent.id}
          </span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block truncate">
            {activeAgent.phone}
          </span>
        </div>
      </div>

      {/* Tabs for Order Views */}
      <div className="flex items-center gap-2 mb-4 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
        <button
          type="button"
          onClick={() => setDeliveryTab('assigned')}
          className={`flex-1 py-2 px-3 rounded-xl font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            deliveryTab === 'assigned'
              ? 'bg-[#005723] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Assigned Parcels ({myAssignedOrders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setDeliveryTab('hub_pool')}
          className={`flex-1 py-2 px-3 rounded-xl font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            deliveryTab === 'hub_pool'
              ? 'bg-[#005723] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Unassigned Hub Pool ({hubPoolOrders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setDeliveryTab('completed')}
          className={`flex-1 py-2 px-3 rounded-xl font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            deliveryTab === 'completed'
              ? 'bg-[#005723] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Completed ({completedOrders.length})</span>
        </button>
      </div>

      {/* Deliveries List */}
      <div className="space-y-4">
        {displayedOrders.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 text-xs text-slate-400 space-y-2 shadow-xs">
            <Truck className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="font-bold text-slate-700 dark:text-slate-300">
              {deliveryTab === 'assigned'
                ? `No active parcels assigned to ${activeAgent.name} right now.`
                : deliveryTab === 'hub_pool'
                ? `All hub parcels in pincodes 229413 & 230201 are currently assigned!`
                : `No completed deliveries recorded in this session yet.`}
            </p>
            {deliveryTab === 'assigned' && hubPoolOrders.length > 0 && (
              <p className="text-[11px] text-[#005723] dark:text-emerald-400 font-bold">
                There are {hubPoolOrders.length} unassigned parcels in the Hub Pool tab.
              </p>
            )}
          </div>
        ) : (
          displayedOrders.map(order => (
            <div 
              key={order.id} 
              className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3 text-xs"
            >
              <div className="flex justify-between items-center font-bold flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-slate-900 dark:text-white font-extrabold text-sm">Parcel #{order.id}</span>
                  
                  {/* CONFIDENTIAL OTP BADGE - Delivery Partner NEVER sees customer's OTP! */}
                  {order.status !== 'Delivered' && (
                    <span className="text-[10px] bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300/80 dark:border-amber-700/60 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                      Confidential • Ask Customer for OTP
                    </span>
                  )}

                  {order.status === 'Delivered' && (
                    <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      OTP Verified & Delivered
                    </span>
                  )}
                </div>
                
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                  order.status === 'Delivered'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-100 text-[#F97316] dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {order.status}
                </span>
              </div>

              {/* Delivery Address & Customer Details */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl space-y-1.5 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <p className="font-bold text-slate-900 dark:text-white">
                    <strong>Customer:</strong> {order.customerName}
                  </p>
                  <a 
                    href={`tel:${order.customerPhone}`}
                    className="text-[#005723] dark:text-emerald-400 font-black flex items-center gap-1 hover:underline"
                  >
                    <Phone className="w-3.5 h-3.5" /> {order.customerPhone}
                  </a>
                </div>

                <p className="flex items-start gap-1 text-slate-700 dark:text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-[#F97316] shrink-0 mt-0.5" />
                  <span>
                    {order.shippingAddress.street}, {order.shippingAddress.city} - <strong className="text-slate-900 dark:text-white">{order.shippingAddress.pincode}</strong>
                  </span>
                </p>

                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200 dark:border-slate-800">
                  <p><strong>Payment Mode:</strong> <span className="font-bold text-slate-900 dark:text-white">{order.paymentMethod}</span></p>
                  <p><strong>Collect Amount:</strong> <span className="font-black text-[#005723] dark:text-emerald-400 text-xs">₹{order.totalAmount}</span></p>
                </div>
              </div>

              {/* OTP Input Form - Active Deliveries Only */}
              {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-[#005723] dark:text-emerald-400 shrink-0" />
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        Enter 4-Digit OTP given by Customer:
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500">
                      Customer has OTP on their screen
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="••••"
                      value={enteredOTP[order.id] || ''}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setEnteredOTP({ ...enteredOTP, [order.id]: val });
                        if (otpError[order.id]) setOtpError(prev => ({ ...prev, [order.id]: '' }));
                      }}
                      className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white font-mono font-black text-center w-28 text-base tracking-widest outline-none focus:ring-2 focus:ring-[#005723]"
                    />

                    <button
                      type="button"
                      onClick={() => handleVerifyOTP(order.id, order.deliveryOTP)}
                      className="bg-[#005723] hover:bg-[#00401A] text-white px-4 py-2 rounded-xl font-extrabold text-xs shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-amber-300" />
                      <span>Verify OTP & Mark Delivered</span>
                    </button>
                  </div>

                  {otpError[order.id] && (
                    <p className="text-xs text-red-600 dark:text-red-400 font-bold flex items-center gap-1 mt-1 bg-red-50 dark:bg-red-950/40 p-2 rounded-xl border border-red-200 dark:border-red-900">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" /> 
                      <span>{otpError[order.id]}</span>
                    </p>
                  )}

                  {otpSuccess[order.id] && (
                    <p className="text-xs text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-1 mt-1 bg-emerald-100 dark:bg-emerald-950/60 p-2 rounded-xl border border-emerald-300 dark:border-emerald-800">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" /> 
                      <span>{otpSuccess[order.id]}</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        defaultUserId={activeAgent.phone || activeAgent.id}
        accountTitle={`Delivery Partner (${activeAgent.name})`}
        role="delivery"
      />

    </div>
  );
};
