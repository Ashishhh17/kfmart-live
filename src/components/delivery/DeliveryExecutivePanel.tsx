import React, { useState } from 'react';
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
  Sparkles
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ChangePasswordModal } from '../common/ChangePasswordModal';

export const DeliveryExecutivePanel: React.FC = () => {
  const { 
    orders, 
    updateOrderStatus, 
    pincode, 
    deliveryExecutives, 
    setIsDeliveryPartnerRegModalOpen 
  } = useStore();

  const [selectedExecId, setSelectedExecId] = useState<string>(
    deliveryExecutives[0]?.id || 'del-1'
  );
  const [enteredOTP, setEnteredOTP] = useState<Record<string, string>>({});
  const [otpError, setOtpError] = useState<Record<string, string>>({});
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

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

  const activeDeliveries = orders.filter(o => 
    o.status === 'Out For Delivery' || 
    o.status === 'Shipped' ||
    o.deliveryPartnerId === activeAgent.id
  );

  const handleVerifyOTP = (orderId: string, correctOTP: string) => {
    const input = enteredOTP[orderId]?.trim();
    if (input === correctOTP) {
      updateOrderStatus(orderId, 'Delivered', `OTP verified successfully by agent ${activeAgent.name}`);
      setOtpError(prev => ({ ...prev, [orderId]: '' }));
    } else {
      setOtpError(prev => ({ ...prev, [orderId]: 'Invalid Delivery OTP entered. Ask customer for 4-digit code.' }));
    }
  };

  return (
    <div className="py-6 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Top Banner with Agent Selector and Add Partner Button */}
      <div className="bg-gradient-to-r from-slate-900 via-[#003816] to-slate-900 rounded-3xl p-6 text-white shadow-xl mb-6 flex flex-wrap items-center justify-between gap-4 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-400/20 text-amber-300 rounded-2xl border border-amber-400/30">
            <Truck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="bg-emerald-500 text-slate-950 font-black text-[10px] uppercase px-2 py-0.5 rounded">
                100 RIDER FLEET READY
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
            onChange={(e) => setSelectedExecId(e.target.value)}
            className="px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold text-white outline-none cursor-pointer backdrop-blur-md"
          >
            {deliveryExecutives.map(exec => (
              <option key={exec.id} value={exec.id} className="text-slate-900 bg-white">
                {exec.name} ({exec.vehicleType || 'Bike'})
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
            <span>Change Password</span>
          </button>
        </div>
      </div>

      {/* Rider Performance & Vehicle Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Vehicle</span>
          <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1 mt-0.5">
            <Bike className="w-4 h-4 text-amber-500" /> {activeAgent.vehicleType || 'Bike'}
          </span>
          <span className="text-[10px] text-slate-500 font-mono">{activeAgent.vehicleNumber || 'UP-33-REG'}</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Delivered</span>
          <span className="font-extrabold text-slate-900 dark:text-white text-base mt-0.5">
            {activeAgent.completedDeliveries || 0} Parcels
          </span>
          <span className="text-[10px] text-emerald-600 font-bold">100% Success Rate</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Earnings</span>
          <span className="font-extrabold text-[#005723] dark:text-emerald-400 text-base mt-0.5">
            ₹{(activeAgent.totalEarnings || 0).toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-500">Daily UPI Settlement</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Rider ID</span>
          <span className="font-extrabold font-mono text-slate-900 dark:text-white text-xs mt-0.5">
            {activeAgent.id}
          </span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Authorized Dispatch</span>
        </div>
      </div>

      {/* Active Deliveries List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Active Parcels Requiring Customer OTP Verification ({activeDeliveries.length})
          </h2>
          <span className="text-xs text-slate-500">OTP protection active</span>
        </div>

        {activeDeliveries.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 text-xs text-slate-400 space-y-2">
            <Truck className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
            <p>No active parcels pending delivery in pincode {pincode}.</p>
            <p className="text-[11px] text-slate-500">All assigned parcels for agent {activeAgent.name} are completed!</p>
          </div>
        ) : (
          activeDeliveries.map(order => (
            <div 
              key={order.id} 
              className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3 text-xs"
            >
              <div className="flex justify-between items-center font-bold">
                <div className="flex items-center gap-2">
                  <span className="text-slate-900 dark:text-white font-extrabold">Parcel #{order.id}</span>
                  <span className="text-[10px] bg-blue-50 text-[#005723] px-2 py-0.5 rounded font-bold">
                    OTP: {order.deliveryOTP}
                  </span>
                </div>
                <span className="text-[#F97316] uppercase font-extrabold">{order.status}</span>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl space-y-1.5 text-slate-600 dark:text-slate-300">
                <p><strong>Customer:</strong> {order.customerName} ({order.customerPhone})</p>
                <p className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#F97316] shrink-0" />
                  <span>{order.shippingAddress.street}, {order.shippingAddress.city} - <strong>{order.shippingAddress.pincode}</strong></span>
                </p>
                <p><strong>Payment Mode:</strong> {order.paymentMethod} (Amount: <strong>₹{order.totalAmount}</strong>)</p>
              </div>

              {/* OTP Input Form */}
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex flex-wrap items-center gap-3">
                <KeyRound className="w-4 h-4 text-[#005723] dark:text-emerald-400" />
                <span className="font-bold text-slate-800 dark:text-slate-200">Verify 4-Digit Customer OTP:</span>
                
                <input
                  type="text"
                  maxLength={4}
                  placeholder="e.g. 4819"
                  value={enteredOTP[order.id] || ''}
                  onChange={(e) => setEnteredOTP({ ...enteredOTP, [order.id]: e.target.value })}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white font-mono font-bold text-center w-28 text-sm outline-none focus:ring-2 focus:ring-[#005723]"
                />

                <button
                  type="button"
                  onClick={() => handleVerifyOTP(order.id, order.deliveryOTP)}
                  className="bg-[#005723] hover:bg-[#00401A] text-white px-4 py-2 rounded-xl font-extrabold text-xs shadow-sm transition-all"
                >
                  Verify & Mark Delivered
                </button>
              </div>

              {otpError[order.id] && (
                <p className="text-xs text-red-500 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> {otpError[order.id]}
                </p>
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
