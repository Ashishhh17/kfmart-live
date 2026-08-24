import React, { useState } from 'react';
import { X, Truck, ShieldCheck, CheckCircle2, Bike, Phone, User, MapPin, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface DeliveryPartnerRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeliveryPartnerRegistrationModal: React.FC<DeliveryPartnerRegistrationModalProps> = ({
  isOpen,
  onClose
}) => {
  const { registerDeliveryExecutive } = useStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [vehicleType, setVehicleType] = useState<'Bike / Motorcycle' | 'Scooter' | 'E-Rickshaw' | 'Van' | 'Bicycle'>('Bike / Motorcycle');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [assignedZone, setAssignedZone] = useState('Pincode 229413 (Lalgopalganj Hub)');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    registerDeliveryExecutive({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || `rider.${Date.now()}@kfmart.in`,
      vehicleType,
      vehicleNumber: vehicleNumber.trim() || 'UP-33-KFM-NEW',
      assignedZone,
      assignedOrdersCount: 0,
      completedDeliveries: 0,
      totalEarnings: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    });

    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white space-y-4 relative my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
            <Truck className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Register Delivery Partner
              </h3>
              <span className="bg-emerald-100 text-[#005723] dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-full">
                100 SLOTS READY
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Join KF Mart Express delivery fleet in Lalgopalganj & Kunda
            </p>
          </div>
        </div>

        {isSubmitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                Delivery Partner Registered Successfully!
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                <strong>{name}</strong> is now active in the 100-partner delivery network.
              </p>
            </div>

            <div className="p-3 bg-emerald-50 dark:bg-slate-800 rounded-2xl border border-emerald-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-1">
              <p><strong>Unified Login:</strong> Use registered phone number or email to log in.</p>
              <p><strong>Zone:</strong> {assignedZone}</p>
              <p><strong>Vehicle:</strong> {vehicleType} ({vehicleNumber || 'Standard'})</p>
            </div>

            <button
              onClick={() => {
                setIsSubmitted(false);
                onClose();
              }}
              className="bg-[#005723] hover:bg-[#00401A] text-white font-extrabold px-6 py-2.5 rounded-xl text-xs shadow-sm transition-all"
            >
              Open Delivery Terminal
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            
            <div className="p-3 bg-blue-50 dark:bg-slate-800/80 rounded-2xl border border-blue-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#005723] shrink-0" />
              <span>Earn ₹50 per delivered parcel with instant daily UPI payout.</span>
            </div>

            <div>
              <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">
                Rider Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Kumar Verma"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-[#005723]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">
                  Mobile Number (WhatsApp) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98XXX XXXXX"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-[#005723]"
                />
              </div>

              <div>
                <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">
                  Email ID (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rider@kfmart.in"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-[#005723]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">
                  Vehicle Type *
                </label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-[#005723]"
                >
                  <option value="Bike / Motorcycle">Bike / Motorcycle</option>
                  <option value="Scooter">Scooter</option>
                  <option value="E-Rickshaw">E-Rickshaw</option>
                  <option value="Van">Delivery Van</option>
                  <option value="Bicycle">Bicycle</option>
                </select>
              </div>

              <div>
                <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">
                  Vehicle Plate No.
                </label>
                <input
                  type="text"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  placeholder="e.g. UP-33-AB-1234"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-[#005723]"
                />
              </div>
            </div>

            <div>
              <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">
                Assigned Operational Hub / Pincode *
              </label>
              <select
                value={assignedZone}
                onChange={(e) => setAssignedZone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-[#005723]"
              >
                <option value="Pincode 229413 (Lalgopalganj Hub)">Pincode 229413 (Lalgopalganj Central)</option>
                <option value="Pincode 229413 (Main Market)">Pincode 229413 (Main Market & Bazaar)</option>
                <option value="Pincode 229413 (Station Road)">Pincode 229413 (Station Road & Galla Mandi)</option>
                <option value="Pincode 230201 (Kunda Sector)">Pincode 230201 (Kunda Sector)</option>
              </select>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold py-2.5 rounded-xl hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-[#005723] hover:bg-[#00401A] text-white font-extrabold py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Truck className="w-4 h-4 text-amber-300" />
                <span>Register Partner Now</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
