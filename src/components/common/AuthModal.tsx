import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Store, 
  ShieldCheck, 
  Truck, 
  Mail, 
  CheckCircle2, 
  ArrowRight, 
  Lock, 
  Sparkles, 
  KeyRound, 
  ShieldAlert, 
  Eye, 
  EyeOff, 
  RotateCcw,
  UserPlus,
  Building,
  Phone
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Role } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: Role;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialRole }) => {
  const { 
    setActiveRole, 
    setCurrentVendor, 
    vendors, 
    verifyPassword, 
    verifyLoginAsync,
    changePassword,
    registerVendor,
    resetAllPasswordsToDefaults
  } = useStore();
  
  const [activeTab, setActiveTab] = useState<'login' | 'create_vendor' | 'change_password'>('login');
  const [selectedRole, setSelectedRole] = useState<Role>(initialRole || 'customer');

  // Sync initialRole if modal opens with specific role
  useEffect(() => {
    if (initialRole) {
      setSelectedRole(initialRole);
    }
  }, [initialRole, isOpen]);
  
  // Credentials Configuration
  const credentialsConfig = {
    customer: {
      title: 'Customer / Buyer Account',
      defaultId: 'customer@kfmart.in',
      defaultPass: 'customer123',
      name: 'KF Mart Shopper',
      subtitle: 'Primary shopping portal for Lalgopalganj & Kunda (Pincodes 229413 & 230201)',
      icon: <User className="w-5 h-5 text-emerald-600" />,
      color: 'bg-[#005723]'
    },
    vendor: {
      title: 'Vendor Portal (300 Vendors Ready)',
      defaultId: 'vendor@kfmart.in',
      defaultPass: 'vendor123',
      name: 'Royal Threads India',
      subtitle: 'Product listing, pricing calculator, inventory & escrow payout',
      icon: <Store className="w-5 h-5 text-amber-500" />,
      color: 'bg-amber-500'
    },
    admin: {
      title: 'Super Admin HQ Portal',
      defaultId: 'admin@kfmart.in',
      defaultPass: 'admin123',
      name: 'KF Mart Super Admin',
      subtitle: 'Full marketplace governance, 300 vendor approvals & 100 rider dispatch',
      icon: <ShieldCheck className="w-5 h-5 text-purple-500" />,
      color: 'bg-purple-500'
    },
    delivery: {
      title: 'Delivery Partner (100 Riders Fleet)',
      defaultId: 'delivery@kfmart.in',
      defaultPass: 'delivery123',
      name: 'Rajesh Kumar Express Agent',
      subtitle: 'OTP delivery verification, parcel tracking & daily UPI earnings',
      icon: <Truck className="w-5 h-5 text-emerald-500" />,
      color: 'bg-emerald-500'
    }
  };

  const currentConfig = credentialsConfig[selectedRole];
  
  // Login Form States - Default to visible letters so user sees typed characters!
  const [inputId, setInputId] = useState(currentConfig.defaultId);
  const [inputPassword, setInputPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Create Vendor Custom ID & Password States
  const [newVendorId, setNewVendorId] = useState('');
  const [newVendorBusinessName, setNewVendorBusinessName] = useState('');
  const [newVendorOwnerName, setNewVendorOwnerName] = useState('');
  const [newVendorPhone, setNewVendorPhone] = useState('');
  const [newVendorPassword, setNewVendorPassword] = useState('');
  const [showNewVendorPassword, setShowNewVendorPassword] = useState(false);
  const [createVendorSuccess, setCreateVendorSuccess] = useState(false);
  const [createVendorError, setCreateVendorError] = useState('');

  // Change Password Form States
  const [changeOldPassword, setChangeOldPassword] = useState('');
  const [changeNewPassword, setChangeNewPassword] = useState('');
  const [changeConfirmPassword, setChangeConfirmPassword] = useState('');
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [changeSuccessMessage, setChangeSuccessMessage] = useState('');
  const [changeErrorMessage, setChangeErrorMessage] = useState('');
  const [resetDefaultsMessage, setResetDefaultsMessage] = useState('');

  // Update inputs when selectedRole changes
  useEffect(() => {
    const config = credentialsConfig[selectedRole];
    setInputId(config.defaultId);
    setInputPassword('');
    setErrorMessage('');
    setChangeOldPassword('');
    setChangeNewPassword('');
    setChangeConfirmPassword('');
    setChangeErrorMessage('');
    setChangeSuccessMessage('');
  }, [selectedRole]);

  if (!isOpen) return null;

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setInputPassword('');
    setErrorMessage('');
    setChangeErrorMessage('');
    setChangeSuccessMessage('');
  };

  // Sign In Handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedId = inputId.trim().toLowerCase();
    const trimmedPass = inputPassword.trim();

    if (!trimmedPass) {
      setErrorMessage('Please type your password manually.');
      return;
    }

    if (!trimmedId) {
      setErrorMessage('Please enter your User ID, Email, or Phone number.');
      return;
    }

    // Authoritative verification against active custom/role password across devices
    const authResult = await verifyLoginAsync(trimmedId, trimmedPass, selectedRole);

    if (authResult.success) {
      setActiveRole(selectedRole);

      // If vendor logging in, set active vendor
      if (selectedRole === 'vendor') {
        const foundVendor = vendors.find(v => 
          v.id.toLowerCase() === trimmedId || 
          v.email.toLowerCase() === trimmedId || 
          v.phone.replace(/\s+/g, '') === trimmedId.replace(/\s+/g, '')
        );
        if (foundVendor) {
          setCurrentVendor(foundVendor);
        } else if (vendors.length > 0) {
          setCurrentVendor(vendors[0]);
        }
      }

      setLoginSuccess(true);
      setErrorMessage('');
      setTimeout(() => {
        setLoginSuccess(false);
        onClose();
      }, 800);
    } else {
      setErrorMessage(
        authResult.message || 
        'Incorrect password. If you recently changed your password, the old default password is no longer valid.'
      );
    }
  };

  // Create Custom Vendor ID & Password Handler
  const handleCreateVendorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCreateVendorError('');
    
    if (!newVendorBusinessName.trim()) {
      setCreateVendorError('Please enter your Business / Shop name.');
      return;
    }
    if (!newVendorPhone.trim()) {
      setCreateVendorError('Please enter a valid phone number.');
      return;
    }
    if (!newVendorPassword || newVendorPassword.trim().length < 4) {
      setCreateVendorError('Password must be at least 4 characters long.');
      return;
    }

    const chosenId = newVendorId.trim() 
      ? newVendorId.trim().toLowerCase().replace(/\s+/g, '-') 
      : ('v-' + newVendorBusinessName.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 15) || `v-${Date.now()}`);

    const created = registerVendor({
      businessName: newVendorBusinessName.trim(),
      customId: chosenId,
      customPassword: newVendorPassword.trim(),
      ownerName: newVendorOwnerName.trim() || 'Store Owner',
      phone: newVendorPhone.trim(),
      email: `${chosenId}@kfmart.in`,
      address: 'Main Market, Lalgopalganj / Kunda',
      companyProfile: `Vendor account for ${newVendorBusinessName.trim()}`
    });

    setCurrentVendor(created);
    setActiveRole('vendor');
    setCreateVendorSuccess(true);

    setTimeout(() => {
      setCreateVendorSuccess(false);
      onClose();
    }, 1600);
  };

  // Change Password Handler
  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangeErrorMessage('');
    setChangeSuccessMessage('');

    const trimmedId = inputId.trim();
    const trimmedOld = changeOldPassword.trim();
    const trimmedNew = changeNewPassword.trim();
    const trimmedConfirm = changeConfirmPassword.trim();

    // 1. Validation checks
    if (!trimmedOld) {
      setChangeErrorMessage('Please enter your current (old) password.');
      return;
    }

    if (!trimmedNew) {
      setChangeErrorMessage('Please enter a new password.');
      return;
    }

    if (trimmedNew.length < 4) {
      setChangeErrorMessage('New password must be at least 4 characters long.');
      return;
    }

    if (trimmedNew === trimmedOld) {
      setChangeErrorMessage('New password cannot be identical to your old password.');
      return;
    }

    if (trimmedNew !== trimmedConfirm) {
      setChangeErrorMessage('New password and confirmation retype do not match. Please retype carefully.');
      return;
    }

    // Target identifier can be the entered ID or selected role
    const targetIdentifier = trimmedId || (
      selectedRole === 'admin' ? 'admin@kfmart.in' :
      selectedRole === 'vendor' ? 'vendor@kfmart.in' :
      selectedRole === 'delivery' ? 'delivery@kfmart.in' :
      'customer@kfmart.in'
    );

    // 2. Perform Password Change (Verifies old pass first and synchronizes globally)
    const result = await changePassword(targetIdentifier, trimmedOld, trimmedNew, selectedRole);

    if (result.success) {
      setChangeSuccessMessage('Password changed successfully! You must now use only your new password to log in.');
      setChangeOldPassword('');
      setChangeNewPassword('');
      setChangeConfirmPassword('');

      // Auto switch back to login tab after 2 seconds
      setTimeout(() => {
        setActiveTab('login');
        setInputPassword('');
        setChangeSuccessMessage('');
      }, 2000);
    } else {
      setChangeErrorMessage(result.message);
    }
  };

  const handleResetAllDefaults = () => {
    resetAllPasswordsToDefaults();
    setResetDefaultsMessage('All passwords successfully reset to system default configuration.');
    setTimeout(() => {
      setResetDefaultsMessage('');
    }, 3000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white relative overflow-hidden my-auto">
        
        {/* Background glow accent */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br from-[#005723] to-[#F97316] opacity-10 rounded-full blur-2xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl bg-slate-100 dark:bg-slate-800 transition-colors z-10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="mb-4 space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-[#005723] dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-black rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Account Security & Portal Access
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            {activeTab === 'login' && 'Sign In to Your Account'}
            {activeTab === 'create_vendor' && 'Create Custom Vendor ID & Password'}
            {activeTab === 'change_password' && 'Change Account Password'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {activeTab === 'login' && 'Enter your registered User ID and manually type your Password to continue.'}
            {activeTab === 'create_vendor' && 'Choose your own Vendor ID / Username and set a custom password for your shop.'}
            {activeTab === 'change_password' && 'Confirm your current old password, enter your new password, and retype to confirm.'}
          </p>
        </div>

        {/* Mode Selector 3 Tabs */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-4 gap-1">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMessage('');
              setChangeErrorMessage('');
            }}
            className={`flex-1 py-2 px-1 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'login'
                ? 'bg-white dark:bg-slate-700 text-[#005723] dark:text-emerald-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>1. Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('create_vendor');
              setSelectedRole('vendor');
              setCreateVendorError('');
            }}
            className={`flex-1 py-2 px-1 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'create_vendor'
                ? 'bg-white dark:bg-slate-700 text-[#005723] dark:text-emerald-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5 text-amber-500" />
            <span>2. Create Vendor ID</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('change_password');
              setErrorMessage('');
              setChangeErrorMessage('');
            }}
            className={`flex-1 py-2 px-1 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'change_password'
                ? 'bg-white dark:bg-slate-700 text-[#005723] dark:text-emerald-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-[#F97316]" />
            <span>3. Change Password</span>
          </button>
        </div>

        {/* Role Selector Tabs (Visible in Login and Change Password tabs) */}
        {activeTab !== 'create_vendor' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {(['customer', 'vendor', 'admin', 'delivery'] as const).map(role => {
              const config = credentialsConfig[role];
              const isSelected = selectedRole === role;

              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleRoleSelect(role)}
                  className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
                    isSelected 
                      ? 'border-[#005723] dark:border-emerald-400 bg-emerald-50/80 dark:bg-slate-800 shadow-md scale-[1.02]' 
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="p-1.5 rounded-xl bg-white dark:bg-slate-700 shadow-xs">
                      {config.icon}
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-[#005723] dark:text-emerald-400" />}
                  </div>
                  <div>
                    <span className="text-xs font-black capitalize block text-slate-900 dark:text-white">
                      {role}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      {config.name}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* ================= TAB 1: LOGIN ================= */}
        {activeTab === 'login' && (
          <>
            {loginSuccess ? (
              <div className="py-8 text-center space-y-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <h3 className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                  Logged in successfully!
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Entering <strong>{currentConfig.title}</strong>...
                </p>
              </div>
            ) : (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                
                {/* Active Role Credentials Input Box */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-700 shadow-xs">
                        {currentConfig.icon}
                      </div>
                      <div>
                        <h3 className="text-xs font-extrabold text-slate-900 dark:text-white">
                          {currentConfig.title}
                        </h3>
                        <p className="text-[11px] text-slate-500 line-clamp-1">
                          {currentConfig.subtitle}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Lock className="w-3 h-3 text-slate-500" /> Enter Password
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1 flex items-center gap-1">
                        <Mail className="w-3 h-3 text-[#F97316]" /> User ID / Email / Phone *
                      </label>
                      <input
                        type="text"
                        value={inputId}
                        onChange={(e) => {
                          setInputId(e.target.value);
                          setErrorMessage('');
                        }}
                        placeholder="e.g. user@kfmart.in or phone"
                        required
                        className="w-full px-3 py-2 text-xs font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-[#005723]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Lock className="w-3 h-3 text-[#F97316]" /> Password *
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="text-[10px] text-[#005723] dark:text-emerald-400 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                        >
                          {showLoginPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          <span>{showLoginPassword ? 'Hide' : 'Show'}</span>
                        </button>
                      </label>
                      <div className="relative">
                        <input
                          type={showLoginPassword ? 'text' : 'password'}
                          value={inputPassword}
                          onChange={(e) => {
                            setInputPassword(e.target.value);
                            setErrorMessage('');
                          }}
                          placeholder="Enter your password"
                          required
                          autoComplete="current-password"
                          className="w-full px-3 py-2 text-xs font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-[#005723] font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-3 rounded-xl text-xs flex items-start gap-2 border bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-300">
                    <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                    <span className="font-semibold">{errorMessage}</span>
                  </div>
                )}

                {/* Reset Notification */}
                {resetDefaultsMessage && (
                  <div className="p-2.5 rounded-xl text-xs flex items-center gap-2 border bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span className="font-bold">{resetDefaultsMessage}</span>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-1">
                  <button
                    type="submit"
                    className="w-full bg-[#005723] hover:bg-[#00401A] text-white font-extrabold py-3.5 rounded-2xl text-xs shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-300" />
                    <span>Sign In to {selectedRole.toUpperCase()} Account</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Quick Links */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('create_vendor');
                      setSelectedRole('vendor');
                    }}
                    className="text-[#005723] dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-amber-500" />
                    <span>Create Your Own Vendor ID</span>
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('change_password');
                        setErrorMessage('');
                      }}
                      className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                      <span>Change Password</span>
                    </button>
                  </div>
                </div>

              </form>
            )}
          </>
        )}

        {/* ================= TAB 2: CREATE VENDOR ID & SET PASSWORD ================= */}
        {activeTab === 'create_vendor' && (
          <>
            {createVendorSuccess ? (
              <div className="py-8 text-center space-y-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <h3 className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                  Vendor ID & Password Created!
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Welcome to KF Mart Vendor Network. Signing you in automatically...
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreateVendorSubmit} className="space-y-3.5 text-xs">
                <div className="p-3 bg-amber-50 dark:bg-slate-800/80 rounded-2xl border border-amber-200 dark:border-slate-700 text-amber-900 dark:text-amber-300 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Store className="w-4 h-4 text-amber-600" />
                    <span>Vendor Self-Registration & Custom ID Portal</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Create your own custom Vendor ID and set your secure secret password for your shop.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      1. Choose Custom Vendor ID / Username *
                    </label>
                    <input
                      type="text"
                      value={newVendorId}
                      onChange={(e) => setNewVendorId(e.target.value)}
                      placeholder="e.g. v-royal-boutique or my_shop"
                      className="w-full px-3 py-2 text-xs font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-[#005723] font-mono"
                    />
                    <span className="text-[10px] text-slate-400 block mt-0.5">Custom ID for direct vendor login</span>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center justify-between">
                      <span>2. Set Custom Password *</span>
                      <button
                        type="button"
                        onClick={() => setShowNewVendorPassword(!showNewVendorPassword)}
                        className="text-[10px] text-[#005723] dark:text-emerald-400 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        {showNewVendorPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{showNewVendorPassword ? 'Hide' : 'Show'}</span>
                      </button>
                    </label>
                    <input
                      type={showNewVendorPassword ? 'text' : 'password'}
                      required
                      value={newVendorPassword}
                      onChange={(e) => setNewVendorPassword(e.target.value)}
                      placeholder="Enter secure password"
                      className="w-full px-3 py-2 text-xs font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-[#005723] font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Business / Shop Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newVendorBusinessName}
                      onChange={(e) => {
                        setNewVendorBusinessName(e.target.value);
                        if (!newVendorId) {
                          setNewVendorId('v-' + e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 14));
                        }
                      }}
                      placeholder="e.g. Royal Sarees & Fabrics"
                      className="w-full px-3 py-2 text-xs font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-[#005723]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Owner Name & Phone Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={newVendorPhone}
                      onChange={(e) => setNewVendorPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full px-3 py-2 text-xs font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-[#005723]"
                    />
                  </div>
                </div>

                {createVendorError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 rounded-xl text-xs flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 shrink-0 text-red-500" />
                    <span className="font-semibold">{createVendorError}</span>
                  </div>
                )}

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('login')}
                    className="w-1/3 py-3 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Back to Login</span>
                  </button>

                  <button
                    type="submit"
                    className="w-2/3 bg-[#005723] hover:bg-[#00401A] text-white font-extrabold py-3 rounded-2xl text-xs shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4 text-amber-300" />
                    <span>Create Vendor ID & Log In</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </form>
            )}
          </>
        )}

        {/* ================= TAB 3: CHANGE PASSWORD ================= */}
        {activeTab === 'change_password' && (
          <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              
              <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Changing Password for: <strong className="text-[#005723] dark:text-emerald-400">{currentConfig.name} ({inputId})</strong>
                  </span>
                </div>
              </div>

              {/* Step 1: Confirm Current (Old) Password */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                    1. Confirm Current (Old) Password *
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowOldPass(!showOldPass)}
                    className="text-[10px] text-[#005723] dark:text-emerald-400 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    {showOldPass ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showOldPass ? 'Hide' : 'Show Letters'}</span>
                  </button>
                </label>
                <input
                  type={showOldPass ? 'text' : 'password'}
                  value={changeOldPassword}
                  onChange={(e) => {
                    setChangeOldPassword(e.target.value);
                    setChangeErrorMessage('');
                  }}
                  placeholder="Enter your current password"
                  required
                  className="w-full px-3 py-2 text-xs font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-[#005723] font-mono"
                />
              </div>

              {/* Step 2: New Password */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <KeyRound className="w-3.5 h-3.5 text-[#005723]" />
                    2. New Password *
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="text-[10px] text-[#005723] dark:text-emerald-400 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    {showNewPass ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showNewPass ? 'Hide' : 'Show'}</span>
                  </button>
                </label>
                <input
                  type={showNewPass ? 'text' : 'password'}
                  value={changeNewPassword}
                  onChange={(e) => {
                    setChangeNewPassword(e.target.value);
                    setChangeErrorMessage('');
                  }}
                  placeholder="Enter your new password (min 4 chars)"
                  required
                  className="w-full px-3 py-2 text-xs font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-[#005723] font-mono"
                />
              </div>

              {/* Step 3: Retype New Password */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#F97316]" />
                    3. Retype New Password *
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="text-[10px] text-[#005723] dark:text-emerald-400 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    {showConfirmPass ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showConfirmPass ? 'Hide' : 'Show'}</span>
                  </button>
                </label>
                <input
                  type={showConfirmPass ? 'text' : 'password'}
                  value={changeConfirmPassword}
                  onChange={(e) => {
                    setChangeConfirmPassword(e.target.value);
                    setChangeErrorMessage('');
                  }}
                  placeholder="Retype new password to confirm"
                  required
                  className="w-full px-3 py-2 text-xs font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-[#005723] font-mono"
                />
              </div>
            </div>

            {/* Error Message */}
            {changeErrorMessage && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 rounded-xl text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 text-red-500" />
                <span className="font-semibold">{changeErrorMessage}</span>
              </div>
            )}

            {/* Success Message */}
            {changeSuccessMessage && (
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
                <span className="font-bold">{changeSuccessMessage}</span>
              </div>
            )}

            {/* Reset All Defaults Confirmation */}
            {resetDefaultsMessage && (
              <div className="p-3 bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-blue-300 rounded-xl text-xs flex items-center gap-2 border border-blue-200 dark:border-slate-700">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                <span>{resetDefaultsMessage}</span>
              </div>
            )}

            {/* Submit / Actions */}
            <div className="pt-1 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  setChangeErrorMessage('');
                }}
                className="w-1/3 py-3 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Back to Login</span>
              </button>

              <button
                type="submit"
                className="w-2/3 bg-[#005723] hover:bg-[#00401A] text-white font-extrabold py-3 rounded-2xl text-xs shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                <span>Confirm & Update Password</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Reset to Factory Defaults Button */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Want to reset all system passwords?</span>
              <button
                type="button"
                onClick={handleResetAllDefaults}
                className="text-[11px] font-bold text-red-600 hover:text-red-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All Passwords to Defaults</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
