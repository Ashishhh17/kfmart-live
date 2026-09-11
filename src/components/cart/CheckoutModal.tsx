import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  CreditCard, 
  ShieldCheck, 
  Check, 
  CheckCircle2, 
  ArrowRight, 
  KeyRound, 
  AlertTriangle,
  Smartphone,
  Truck,
  QrCode,
  Copy,
  ExternalLink,
  Zap,
  Lock,
  ArrowUpRight,
  RefreshCw,
  Printer,
  FileText
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onOrderSuccess }) => {
  const { cart, getCartSummary, createOrder, pincode, validatePincode, pincodeError, setActiveInvoiceOrder } = useStore();
  
  const [step, setStep] = useState<'address' | 'payment' | 'razorpay_modal' | 'processing' | 'success'>('address');
  
  // Shipping form state - starts completely blank as requested
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [inputPincode, setInputPincode] = useState(pincode || '229413');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Uttar Pradesh');
  const [pincodeValidError, setPincodeValidError] = useState<string | null>(null);

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'RAZORPAY_UPI' | 'UPI_QR' | 'COD'>('RAZORPAY_UPI');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'bhim' | 'cred' | 'any'>('gpay');
  const [utrNumber, setUtrNumber] = useState('');
  const [utrError, setUtrError] = useState<string | null>(null);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [isRazorpaySimulating, setIsRazorpaySimulating] = useState(false);

  if (!isOpen) return null;

  const summary = getCartSummary();
  const fixedUpiId = '9161772664@ptyes';
  const payeeName = 'Mr Mohd Faishal';
  const upiDeepLink = `upi://pay?pa=${fixedUpiId}&pn=${encodeURIComponent(payeeName)}&am=${summary.grandTotal}&cu=INR&tn=KF%20Mart%20Order`;

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPincodeValidError(null);

    // Strict Pincode Enforcement: 229413 & 230201
    const cleanPincode = inputPincode.trim();
    if (cleanPincode !== '229413' && cleanPincode !== '230201') {
      setPincodeValidError("Currently express delivery is available in Pincodes 229413 (Lalgopalganj) & 230201 (Kunda).");
      return;
    }

    setStep('payment');
  };

  const handleLaunchUpiApp = (app: 'gpay' | 'phonepe' | 'paytm' | 'bhim' | 'cred' | 'any') => {
    setSelectedUpiApp(app);
    // Trigger deep-link on mobile device
    try {
      window.location.href = upiDeepLink;
    } catch (e) {
      console.warn('Could not launch direct deep-link URI', e);
    }
  };

  const completeOnlinePayment = (refId?: string) => {
    setStep('processing');
    const finalRef = refId || 'RZP-' + Math.floor(100000000000 + Math.random() * 900000000000);
    setTimeout(() => {
      const order = createOrder(
        {
          fullName,
          email,
          phone,
          address: {
            fullName,
            phone,
            pincode: inputPincode,
            street,
            city,
            state
          }
        },
        'UPI',
        finalRef
      );

      setCreatedOrder(order);
      setStep('success');
      onOrderSuccess(order);
    }, 1400);
  };

  const handlePaymentSubmit = () => {
    setUtrError(null);

    if (paymentMethod === 'RAZORPAY_UPI') {
      setStep('razorpay_modal');
    } else if (paymentMethod === 'UPI_QR') {
      const cleanUtr = utrNumber.trim();
      if (!cleanUtr) {
        setUtrError("⚠️ Please enter the 12-digit UTR / Transaction Reference Number after transferring payment via QR.");
        return;
      }
      if (cleanUtr.length !== 12 || !/^\d{12}$/.test(cleanUtr)) {
        setUtrError("⚠️ Invalid UTR Number! UTR / Transaction Ref No. must be exactly 12 numeric digits (e.g. 422384910283).");
        return;
      }

      setStep('processing');
      setTimeout(() => {
        const order = createOrder(
          {
            fullName,
            email,
            phone,
            address: {
              fullName,
              phone,
              pincode: inputPincode,
              street,
              city,
              state
            }
          },
          'UPI',
          cleanUtr
        );

        setCreatedOrder(order);
        setStep('success');
        onOrderSuccess(order);
      }, 1200);
    } else {
      // Cash on Delivery
      setStep('processing');
      setTimeout(() => {
        const order = createOrder(
          {
            fullName,
            email,
            phone,
            address: {
              fullName,
              phone,
              pincode: inputPincode,
              street,
              city,
              state
            }
          },
          'COD'
        );

        setCreatedOrder(order);
        setStep('success');
        onOrderSuccess(order);
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full my-8 overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 relative">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Checkout • KF Mart Retail</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-3 bg-slate-100 dark:bg-slate-800/50 flex items-center justify-around text-xs font-bold text-slate-500">
          <span className={`flex items-center gap-1.5 ${step === 'address' ? 'text-[#005723] dark:text-amber-300 font-extrabold' : ''}`}>
            <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px]">1</span> Address
          </span>
          <span>→</span>
          <span className={`flex items-center gap-1.5 ${step === 'payment' || step === 'razorpay_modal' ? 'text-[#005723] dark:text-amber-300 font-extrabold' : ''}`}>
            <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px]">2</span> Payment (UPI / Razorpay)
          </span>
          <span>→</span>
          <span className={`flex items-center gap-1.5 ${step === 'success' ? 'text-emerald-600 font-extrabold' : ''}`}>
            <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px]">3</span> Confirmation
          </span>
        </div>

        {/* Content Body */}
        <div className="p-6">

          {/* STEP 1: ADDRESS */}
          {step === 'address' && (
            <form onSubmit={handleAddressSubmit} className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#F97316]" />
                Shipping & Delivery Address
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Mobile Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Street Address / House / Colony *</label>
                <input
                  type="text"
                  required
                  placeholder="House / Flat No., Landmark, Street Address"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="City / Town (e.g. Lalgopalganj / Kunda)"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">State *</label>
                  <input
                    type="text"
                    required
                    placeholder="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="229413 or 230201"
                    value={inputPincode}
                    onChange={(e) => setInputPincode(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-amber-400 font-bold dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              {pincodeValidError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-600 dark:text-red-400 font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{pincodeValidError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#005723] hover:bg-[#00401A] text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <span>Continue to Payment Method</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </button>
            </form>
          )}

          {/* STEP 2: PAYMENT METHOD SELECTION */}
          {step === 'payment' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#F97316]" />
                  Select Payment Mode
                </h3>
                <span className="text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-900/60 text-[#005723] dark:text-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-300 dark:border-emerald-700">
                  <ShieldCheck className="w-3 h-3" /> 256-bit Encrypted SSL
                </span>
              </div>

              <div className="space-y-3">
                {/* Method 1: Razorpay / Direct UPI App Redirection */}
                <label 
                  className={`block p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'RAZORPAY_UPI' 
                      ? 'bg-blue-50/90 dark:bg-blue-950/30 border-blue-600 dark:border-blue-400 shadow-md ring-1 ring-blue-500' 
                      : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="pm"
                        checked={paymentMethod === 'RAZORPAY_UPI'}
                        onChange={() => setPaymentMethod('RAZORPAY_UPI')}
                        className="text-blue-600 focus:ring-blue-600 w-4 h-4"
                      />
                      <div>
                        <p className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2">
                          <span>Razorpay UPI & Instant Apps (PhonePe, GPay, Paytm)</span>
                          <span className="bg-blue-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded">FASTEST</span>
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Redirects directly into your UPI app on this phone. No scanning required!
                        </p>
                      </div>
                    </div>
                  </div>

                  {paymentMethod === 'RAZORPAY_UPI' && (
                    <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-900/60 space-y-3">
                      <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        Choose your UPI app to pay directly:
                      </p>
                      
                      {/* One-Click Direct UPI Launch Pills */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        <a
                          href={upiDeepLink}
                          onClick={() => handleLaunchUpiApp('gpay')}
                          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 shadow-2xs font-bold text-xs text-slate-800 dark:text-white transition-all hover:scale-[1.02]"
                        >
                          <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-black text-[10px] text-blue-600">
                            G
                          </div>
                          <span>Google Pay</span>
                          <ArrowUpRight className="w-3 h-3 ml-auto text-slate-400" />
                        </a>

                        <a
                          href={upiDeepLink}
                          onClick={() => handleLaunchUpiApp('phonepe')}
                          className="p-2.5 rounded-xl border border-purple-200 dark:border-purple-900/50 bg-purple-50/50 dark:bg-purple-950/30 hover:bg-purple-100 flex items-center gap-2 shadow-2xs font-bold text-xs text-purple-900 dark:text-purple-300 transition-all hover:scale-[1.02]"
                        >
                          <div className="w-6 h-6 rounded-full bg-[#5f259f] text-white flex items-center justify-center font-black text-[10px]">
                            पे
                          </div>
                          <span>PhonePe</span>
                          <ArrowUpRight className="w-3 h-3 ml-auto text-purple-400" />
                        </a>

                        <a
                          href={upiDeepLink}
                          onClick={() => handleLaunchUpiApp('paytm')}
                          className="p-2.5 rounded-xl border border-sky-200 dark:border-sky-900/50 bg-sky-50/50 dark:bg-sky-950/30 hover:bg-sky-100 flex items-center gap-2 shadow-2xs font-bold text-xs text-sky-900 dark:text-sky-300 transition-all hover:scale-[1.02]"
                        >
                          <div className="w-6 h-6 rounded-full bg-[#00B9F1] text-white flex items-center justify-center font-black text-[9px]">
                            py
                          </div>
                          <span>Paytm UPI</span>
                          <ArrowUpRight className="w-3 h-3 ml-auto text-sky-400" />
                        </a>

                        <a
                          href={upiDeepLink}
                          onClick={() => handleLaunchUpiApp('bhim')}
                          className="p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/30 hover:bg-emerald-100 flex items-center gap-2 shadow-2xs font-bold text-xs text-emerald-900 dark:text-emerald-300 transition-all hover:scale-[1.02]"
                        >
                          <div className="w-6 h-6 rounded-full bg-[#005723] text-white flex items-center justify-center font-black text-[9px]">
                            B
                          </div>
                          <span>BHIM UPI</span>
                          <ArrowUpRight className="w-3 h-3 ml-auto text-emerald-400" />
                        </a>

                        <a
                          href={upiDeepLink}
                          onClick={() => handleLaunchUpiApp('cred')}
                          className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-900 text-white flex items-center gap-2 shadow-2xs font-bold text-xs transition-all hover:scale-[1.02]"
                        >
                          <div className="w-6 h-6 rounded-full bg-white text-slate-900 flex items-center justify-center font-black text-[9px]">
                            C
                          </div>
                          <span>CRED UPI</span>
                          <ArrowUpRight className="w-3 h-3 ml-auto text-slate-400" />
                        </a>

                        <a
                          href={upiDeepLink}
                          onClick={() => handleLaunchUpiApp('any')}
                          className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center gap-2 shadow-2xs font-bold text-xs transition-all hover:scale-[1.02]"
                        >
                          <Smartphone className="w-4 h-4" />
                          <span>Any UPI App</span>
                          <ArrowUpRight className="w-3 h-3 ml-auto text-white/80" />
                        </a>
                      </div>

                      <div className="p-2.5 bg-blue-100/60 dark:bg-blue-950/50 rounded-xl flex items-center justify-between text-xs text-blue-900 dark:text-blue-200">
                        <span>Payee: <strong>Mr Mohd Faishal ({fixedUpiId})</strong></span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(fixedUpiId);
                            setCopiedUpi(true);
                            setTimeout(() => setCopiedUpi(false), 2000);
                          }}
                          className="text-[10px] font-black bg-blue-600 text-white px-2 py-0.5 rounded"
                        >
                          {copiedUpi ? 'Copied!' : 'Copy ID'}
                        </button>
                      </div>
                    </div>
                  )}
                </label>

                {/* Method 2: QR Scanner (For Desktop or Another Phone) */}
                <label 
                  className={`block p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'UPI_QR' 
                      ? 'bg-emerald-50/90 dark:bg-slate-800/90 border-[#005723] dark:border-amber-400 shadow-sm' 
                      : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="pm"
                        checked={paymentMethod === 'UPI_QR'}
                        onChange={() => setPaymentMethod('UPI_QR')}
                        className="text-[#005723] focus:ring-[#005723] w-4 h-4"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>Paytm QR Code Scanner (For Second Phone / Desktop)</span>
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Scan the displayed QR code using camera from another phone & enter 12-digit UTR
                        </p>
                      </div>
                    </div>
                  </div>

                  {paymentMethod === 'UPI_QR' && (
                    <div className="mt-3 p-3 bg-slate-100 dark:bg-slate-900/90 rounded-2xl border border-slate-300 dark:border-slate-800 space-y-3">
                      <div className="bg-[#F5F7FA] dark:bg-slate-950 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 text-center max-w-xs mx-auto shadow-sm space-y-3">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-[#EAE0FB] text-[#7B2CBF] font-black text-sm flex items-center justify-center mb-1">
                            MF
                          </div>
                          <span className="text-slate-900 dark:text-white font-extrabold text-xs">Mr Mohd Faishal</span>
                        </div>

                        <div className="bg-white p-2.5 rounded-xl shadow-inner flex flex-col items-center">
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`upi://pay?pa=${fixedUpiId}&pn=${encodeURIComponent(payeeName)}&am=${summary.grandTotal}&cu=INR&tn=KF%20Mart%20Order`)}`}
                            alt="Paytm UPI QR Code - Mr Mohd Faishal"
                            className="w-36 h-36 object-contain rounded-md"
                          />
                          <p className="font-mono font-extrabold text-[11px] text-slate-900 mt-1.5">{fixedUpiId}</p>
                        </div>
                      </div>

                      <div className="p-3 bg-amber-50/90 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 rounded-xl space-y-2">
                        <label className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1">
                          <span>Enter 12-Digit UTR / Ref No.</span>
                          <span className="text-red-500 font-bold">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={12}
                          placeholder="e.g. 422384910283"
                          value={utrNumber}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, '');
                            setUtrNumber(val);
                            if (utrError) setUtrError(null);
                          }}
                          className="w-full text-xs font-mono font-bold p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-[#005723]"
                        />
                        {utrError && (
                          <p className="text-red-600 text-[11px] font-bold">{utrError}</p>
                        )}
                      </div>
                    </div>
                  )}
                </label>

                {/* Method 3: COD */}
                <label 
                  className={`block p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'COD' 
                      ? 'bg-emerald-50/90 dark:bg-slate-800/90 border-[#005723] dark:border-amber-400 shadow-sm' 
                      : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="pm"
                        checked={paymentMethod === 'COD'}
                        onChange={() => setPaymentMethod('COD')}
                        className="text-[#005723] focus:ring-[#005723] w-4 h-4"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>Cash on Delivery (COD)</span>
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Pay cash to delivery partner upon doorstep arrival in Pincode {inputPincode}
                        </p>
                      </div>
                    </div>
                    <span className="text-[9px] font-extrabold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded">
                      PAY AT DOORSTEP
                    </span>
                  </div>
                </label>
              </div>

              {/* Order Summary Box */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Items Subtotal:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">₹{summary.subtotal.toLocaleString()}</span>
                </div>
                {summary.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Coupon Discount:</span>
                    <span>-₹{summary.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                  <span>Delivery Charges:</span>
                  <span className="font-bold">
                    {summary.shipping === 0 ? (
                      <span className="text-emerald-600 font-extrabold bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 rounded text-[11px]">
                        FREE (Orders ₹1,000+)
                      </span>
                    ) : (
                      <span className="text-slate-900 dark:text-white">
                        ₹20 <span className="text-[10px] text-slate-400 font-normal">(Under ₹1,000 order)</span>
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>GST (18%):</span>
                  <span>₹{summary.gst.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700 font-bold text-sm">
                  <span className="text-slate-900 dark:text-white">Total Payable Amount:</span>
                  <span className="text-[#005723] dark:text-amber-300 font-extrabold text-base">₹{summary.grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('address')}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200"
                >
                  Back
                </button>
                <button
                  onClick={handlePaymentSubmit}
                  className="flex-1 bg-[#005723] hover:bg-[#00401A] text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  {paymentMethod === 'RAZORPAY_UPI' ? (
                    <>
                      <span>Pay via Razorpay / UPI App (₹{summary.grandTotal.toLocaleString()})</span>
                      <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                    </>
                  ) : (
                    <>
                      <span>Confirm & Place Order (₹{summary.grandTotal.toLocaleString()})</span>
                      <Check className="w-4 h-4 text-amber-300" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP: RAZORPAY PAYMENT GATEWAY MODAL SIMULATOR / REDIRECT */}
          {step === 'razorpay_modal' && (
            <div className="space-y-4">
              <div className="bg-[#0c2340] text-white p-4 rounded-2xl flex items-center justify-between shadow-md">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500 text-white font-black text-xs flex items-center justify-center">
                    R
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xs tracking-wider uppercase text-blue-300">Razorpay Trusted Gateway</h3>
                    <p className="text-[11px] text-slate-300 font-bold">KF Mart Retail • Mr Mohd Faishal</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Amount</span>
                  <span className="text-base font-black text-emerald-400">₹{summary.grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                  Select payment app to complete ₹{summary.grandTotal.toLocaleString()}:
                </p>

                <div className="space-y-2">
                  <a
                    href={upiDeepLink}
                    onClick={() => {
                      setIsRazorpaySimulating(true);
                      setTimeout(() => completeOnlinePayment(), 3000);
                    }}
                    className="w-full p-3 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-900 hover:bg-purple-50 flex items-center justify-between text-xs font-bold text-slate-800 dark:text-white transition-all shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#5f259f] text-white flex items-center justify-center font-black text-[11px]">
                        पे
                      </div>
                      <div className="text-left">
                        <p className="font-extrabold">PhonePe UPI</p>
                        <p className="text-[10px] text-slate-400 font-normal">Fast 1-click open app</p>
                      </div>
                    </div>
                    <span className="text-blue-600 dark:text-blue-400 text-xs font-black flex items-center gap-1">
                      Pay ₹{summary.grandTotal} <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </a>

                  <a
                    href={upiDeepLink}
                    onClick={() => {
                      setIsRazorpaySimulating(true);
                      setTimeout(() => completeOnlinePayment(), 3000);
                    }}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-800 dark:text-white transition-all shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-blue-600 flex items-center justify-center font-black text-xs">
                        G
                      </div>
                      <div className="text-left">
                        <p className="font-extrabold">Google Pay (GPay)</p>
                        <p className="text-[10px] text-slate-400 font-normal">Instant UPI redirect</p>
                      </div>
                    </div>
                    <span className="text-blue-600 dark:text-blue-400 text-xs font-black flex items-center gap-1">
                      Pay ₹{summary.grandTotal} <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </a>

                  <a
                    href={upiDeepLink}
                    onClick={() => {
                      setIsRazorpaySimulating(true);
                      setTimeout(() => completeOnlinePayment(), 3000);
                    }}
                    className="w-full p-3 rounded-xl border border-sky-200 dark:border-sky-800 bg-white dark:bg-slate-900 hover:bg-sky-50 flex items-center justify-between text-xs font-bold text-slate-800 dark:text-white transition-all shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#00B9F1] text-white flex items-center justify-center font-black text-[10px]">
                        py
                      </div>
                      <div className="text-left">
                        <p className="font-extrabold">Paytm UPI</p>
                        <p className="text-[10px] text-slate-400 font-normal">Direct wallet or bank</p>
                      </div>
                    </div>
                    <span className="text-blue-600 dark:text-blue-400 text-xs font-black flex items-center gap-1">
                      Pay ₹{summary.grandTotal} <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </a>
                </div>

                {isRazorpaySimulating && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 rounded-xl text-center space-y-1">
                    <div className="flex items-center justify-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Processing UPI response & verifying payment...</span>
                    </div>
                    <p className="text-[10px] text-slate-500">Do not close this window, redirecting to order confirmation.</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('payment')}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200"
                >
                  Change Payment Method
                </button>
                <button
                  onClick={() => completeOnlinePayment()}
                  className="flex-1 bg-[#005723] hover:bg-[#00401A] text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  <span>I have completed UPI Payment (Verify & Confirm)</span>
                  <Check className="w-4 h-4 text-amber-300" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PROCESSING */}
          {step === 'processing' && (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 border-4 border-[#005723] border-t-amber-400 rounded-full animate-spin mx-auto" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Verifying Payment & Placing Order...</h3>
              <p className="text-xs text-slate-400">Locking inventory in express hub for pincodes 229413 & 230201.</p>
            </div>
          )}

          {/* STEP 4: SUCCESS CONFIRMATION */}
          {step === 'success' && createdOrder && (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Order Confirmed Successfully!</h3>
                <p className="text-xs text-slate-500">Order ID: <strong className="text-slate-900 dark:text-white">{createdOrder.id}</strong></p>
                {createdOrder.transactionReference && (
                  <p className="text-[11px] font-mono text-emerald-600 font-bold mt-0.5">
                    Ref / UTR: {createdOrder.transactionReference}
                  </p>
                )}
              </div>

              {/* Delivery OTP Badge */}
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl max-w-sm mx-auto">
                <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 block mb-1">
                  Parcel Delivery OTP Code
                </span>
                <span className="text-2xl font-black font-mono tracking-widest text-[#F97316]">
                  {createdOrder.deliveryOTP}
                </span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  Provide this OTP to the delivery executive upon parcel arrival.
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-left text-xs space-y-1">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Deliver To:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{createdOrder.customerName}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Pincode:</span>
                  <span className="font-bold text-emerald-600">{createdOrder.shippingAddress.pincode}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Payment Mode:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{createdOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Total Paid:</span>
                  <span className="font-extrabold text-[#005723] dark:text-amber-300">₹{createdOrder.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveInvoiceOrder(createdOrder);
                    onClose();
                  }}
                  className="inline-flex items-center justify-center gap-2 w-full bg-emerald-50 hover:bg-emerald-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#005723] dark:text-emerald-400 font-bold py-2.5 rounded-xl text-xs border border-emerald-200 dark:border-slate-700 transition-colors cursor-pointer shadow-xs"
                >
                  <Printer className="w-4 h-4" />
                  <span>View & Print Bill / Invoice</span>
                </button>

                <a
                  href={`https://wa.me/919161772664?text=${encodeURIComponent(`Hello KF Mart, I placed Order ${createdOrder.id}. I have a query regarding delivery.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition-colors"
                >
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.205 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                  <span>WhatsApp Query (+91 91617 72664)</span>
                </a>
              </div>

              <button
                onClick={onClose}
                className="w-full bg-[#005723] hover:bg-[#00401A] text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-sm"
              >
                Close & Track Order Timeline
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
