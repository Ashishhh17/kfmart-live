import React, { useState } from 'react';
import { 
  X, 
  KeyRound, 
  Lock, 
  CheckCircle2, 
  ShieldAlert, 
  Eye, 
  EyeOff, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Role } from '../../types';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  userIdentifier?: string;
  defaultUserId?: string;
  roleTitle?: string;
  accountTitle?: string;
  role?: Role;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  userIdentifier,
  defaultUserId,
  roleTitle,
  accountTitle,
  role
}) => {
  const { changePassword, activeRole } = useStore();

  const currentRole: Role = role || activeRole || 'customer';
  const targetId = userIdentifier || defaultUserId || (
    currentRole === 'admin' ? 'admin@kfmart.in' :
    currentRole === 'vendor' ? 'vendor@kfmart.in' :
    currentRole === 'delivery' ? 'delivery@kfmart.in' :
    'customer@kfmart.in'
  );
  const displayTitle = accountTitle || roleTitle || `${currentRole.toUpperCase()} Account`;

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // 1. Basic checks
    if (!oldPassword) {
      setError('Please enter your current (old) password.');
      return;
    }
    if (!newPassword) {
      setError('Please enter your new password.');
      return;
    }
    if (newPassword.length < 4) {
      setError('New password must be at least 4 characters.');
      return;
    }
    if (newPassword === oldPassword) {
      setError('New password cannot be identical to your old password.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation retype do not match. Please retype carefully.');
      return;
    }

    setIsSubmitting(true);

    const result = await changePassword(targetId, oldPassword, newPassword, currentRole);

    if (result.success) {
      setSuccess(result.message);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setIsSubmitting(false);
        setSuccess(null);
        onClose();
      }, 1500);
    } else {
      setIsSubmitting(false);
      setError(result.message);
    }
  };

  const handleReset = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError(null);
    setSuccess(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white relative overflow-hidden">
        
        {/* Header decoration */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleReset}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl bg-slate-100 dark:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="mb-5 space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-[#005723] dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-black rounded-full uppercase tracking-wider">
            <KeyRound className="w-3.5 h-3.5 text-amber-500" /> Security Settings
          </div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white">
            Change Password
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Updating password for <strong className="text-slate-800 dark:text-slate-200">{displayTitle}</strong> ({targetId}).
          </p>
        </div>

        {/* Success Alert */}
        {success ? (
          <div className="py-8 text-center space-y-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl animate-fadeIn">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
            <h3 className="text-sm font-black text-emerald-600 dark:text-emerald-400">
              Password Changed Successfully!
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 px-4">
              Your new password is now active. Only this new password will be required for upcoming logins.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Step 1: Old Password */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  1. Current (Old) Password *
                </span>
                <span className="text-[10px] text-slate-400 font-normal">To verify identity</span>
              </label>
              <div className="relative">
                <input
                  type={showOld ? 'text' : 'password'}
                  value={oldPassword}
                  onChange={(e) => {
                    setOldPassword(e.target.value);
                    setError(null);
                  }}
                  placeholder="Type current password"
                  required
                  autoComplete="current-password"
                  className="w-full px-3.5 py-2.5 text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-[#005723] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowOld(!showOld)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Step 2: New Password */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <KeyRound className="w-3.5 h-3.5 text-[#005723]" />
                  2. New Password *
                </span>
                <span className="text-[10px] text-slate-400 font-normal">Min 4 characters</span>
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setError(null);
                  }}
                  placeholder="Type new password"
                  required
                  autoComplete="new-password"
                  className="w-full px-3.5 py-2.5 text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-[#005723] pr-10 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Step 3: Retype / Confirm New Password */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#F97316]" />
                  3. Retype New Password *
                </span>
                <span className="text-[10px] text-slate-400 font-normal">Must match new password</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError(null);
                  }}
                  placeholder="Confirm new password by retyping"
                  required
                  autoComplete="new-password"
                  className="w-full px-3.5 py-2.5 text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-[#005723] pr-10 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 rounded-xl text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="w-1/3 py-3 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-2/3 py-3 text-xs font-extrabold text-white bg-[#005723] hover:bg-[#00401A] rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <KeyRound className="w-4 h-4" />
                <span>Update Password</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
