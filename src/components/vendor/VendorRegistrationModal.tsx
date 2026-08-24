import React, { useState } from 'react';
import { X, Store, FileCheck, Building, ShieldCheck, Clock, CheckCircle2, KeyRound, Eye, EyeOff, Lock, User } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface VendorRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VendorRegistrationModal: React.FC<VendorRegistrationModalProps> = ({ isOpen, onClose }) => {
  const { registerVendor } = useStore();
  
  const [businessName, setBusinessName] = useState('');
  const [customId, setCustomId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [address, setAddress] = useState('');
  const [companyProfile, setCompanyProfile] = useState('');
  
  // Bank
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountHolder, setAccountHolder] = useState('');

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [registeredId, setRegisteredId] = useState('');
  const [registeredPass, setRegisteredPass] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalId = customId.trim() || `v-${businessName.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 15) || Date.now()}`;
    const finalPass = password.trim() || 'vendor123';

    registerVendor({
      businessName,
      customId: finalId,
      customPassword: finalPass,
      ownerName,
      phone,
      email: email || `${finalId}@kfmart.in`,
      panNumber,
      aadhaarNumber,
      bankDetails: {
        accountNumber,
        ifscCode,
        bankName,
        accountHolder: accountHolder || ownerName
      },
      address,
      companyProfile
    });

    setRegisteredId(finalId);
    setRegisteredPass(finalPass);
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full my-8 overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 relative max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-[#F97316]" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Become a Vendor Partner • KF Mart Retail</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form or Awaiting Approval Message */}
        <div className="p-6 overflow-y-auto">
          {isSubmitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Vendor ID & Account Created Successfully!
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-2">
                  Thank you for registering <strong>{businessName}</strong>. You can sign in using your custom ID and newly set password.
                </p>
              </div>

              <div className="p-4 bg-emerald-50 dark:bg-slate-800 rounded-2xl border border-emerald-200 dark:border-slate-700 max-w-md mx-auto text-xs text-slate-700 dark:text-slate-300 space-y-2 text-left">
                <div className="flex items-center justify-between">
                  <span className="font-bold">Your Vendor ID:</span>
                  <span className="font-mono font-black text-emerald-800 dark:text-emerald-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-emerald-300">
                    {registeredId}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold">Your Set Password:</span>
                  <span className="font-mono font-black text-emerald-800 dark:text-emerald-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-emerald-300">
                    {registeredPass}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 pt-1">• Use this Vendor ID and password to log in directly via the Sign In modal.</p>
              </div>

              <button
                onClick={onClose}
                className="bg-[#005723] hover:bg-[#00401A] text-white font-bold px-6 py-2.5 rounded-xl text-xs"
              >
                Close & Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              <div className="p-3 bg-blue-50 dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#F97316]" />
                <span>Choose your own custom Vendor ID and set your account password below.</span>
              </div>

              {/* Custom Vendor ID and Password Configuration */}
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl space-y-3">
                <div className="flex items-center gap-1.5 text-amber-900 dark:text-amber-300 font-extrabold text-xs">
                  <KeyRound className="w-4 h-4 text-amber-500" />
                  <span>Custom Vendor ID & Security Credentials</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold block mb-1 text-slate-800 dark:text-slate-200">
                      Create Your Custom Vendor ID *
                    </label>
                    <input
                      type="text"
                      value={customId}
                      onChange={(e) => setCustomId(e.target.value)}
                      placeholder="e.g. v-royal-threads or shop_name"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white font-mono"
                    />
                    <span className="text-[10px] text-slate-400">Leave blank to auto-generate</span>
                  </div>

                  <div>
                    <label className="font-bold block mb-1 text-slate-800 dark:text-slate-200 flex items-center justify-between">
                      <span>Set Account Password *</span>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-[10px] text-[#005723] dark:text-emerald-400 font-bold hover:underline flex items-center gap-0.5"
                      >
                        {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{showPassword ? 'Hide' : 'Show'}</span>
                      </button>
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter secure password"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Business / Firm Name *</label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => {
                      setBusinessName(e.target.value);
                      if (!customId) {
                        setCustomId('v-' + e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 15));
                      }
                    }}
                    placeholder="e.g. Royal Handlooms & Crafts"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Owner Name *</label>
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="e.g. Vikramaditya Sharma"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vendor@company.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">PAN Number (Optional)</label>
                  <input
                    type="text"
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value)}
                    placeholder="ABCDE1234F"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Aadhaar Number *</label>
                  <input
                    type="text"
                    required
                    value={aadhaarNumber}
                    onChange={(e) => setAadhaarNumber(e.target.value)}
                    placeholder="1234-5678-9012"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Bank Details */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                <p className="font-bold text-slate-800 dark:text-slate-200">Bank Details for Escrow Payouts</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    required
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="Account Number"
                    className="px-3 py-2 rounded-xl border dark:bg-slate-700 dark:text-white"
                  />
                  <input
                    type="text"
                    required
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value)}
                    placeholder="IFSC Code (HDFC0000123)"
                    className="px-3 py-2 rounded-xl border dark:bg-slate-700 dark:text-white"
                  />
                  <input
                    type="text"
                    required
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="Bank Name"
                    className="px-3 py-2 rounded-xl border dark:bg-slate-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Business Warehouse Address *</label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Plot 42, Textile City, Sector 18, Noida..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Company Profile Description</label>
                <textarea
                  rows={2}
                  value={companyProfile}
                  onChange={(e) => setCompanyProfile(e.target.value)}
                  placeholder="Tell us about your product range and manufacturing heritage..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#005723] hover:bg-[#00401A] text-white font-bold py-3 rounded-xl text-xs shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Store className="w-4 h-4 text-amber-300" />
                <span>Create Vendor ID & Register Account</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
