import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, ShieldCheck, MapPin } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const { 
    cart, 
    isCartDrawerOpen, 
    setIsCartDrawerOpen, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart,
    getCartSummary,
    appliedCoupon,
    applyCouponCode,
    removeCoupon,
    pincode
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  if (!isCartDrawerOpen) return null;

  const summary = getCartSummary();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    const res = applyCouponCode(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
        onClick={() => setIsCartDrawerOpen(false)}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl z-10 flex flex-col border-l border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#1E3A8A] dark:text-amber-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Shopping Cart</h2>
            <span className="text-xs bg-amber-500/10 text-[#F97316] font-bold px-2 py-0.5 rounded-full">
              {cart.length} items
            </span>
          </div>
          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-red-500 hover:text-red-700 font-bold px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                title="Remove all items from cart"
              >
                Clear All
              </button>
            )}
            <button 
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Deliver to Pincode Note */}
        <div className="px-4 py-2 bg-blue-50 dark:bg-slate-800/60 text-xs font-semibold text-[#1E3A8A] dark:text-amber-300 flex items-center justify-between border-b border-blue-100 dark:border-slate-800">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#F97316]" />
            Delivering to Pincode: <strong>{pincode}</strong>
          </span>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded">Eligible</span>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <ShoppingBag className="w-16 h-16 mx-auto mb-3 opacity-20" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Your shopping cart is empty.</p>
              <p className="text-xs text-slate-400 mt-1">Explore our luxury catalog and add items!</p>
            </div>
          ) : (
            cart.map(item => (
              <div 
                key={item.product.id}
                className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 flex gap-3"
              >
                <img 
                  src={item.product.images[0]} 
                  alt={item.product.name} 
                  className="w-16 h-20 rounded-xl object-cover"
                />

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-1">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{item.product.name}</h4>
                      <button 
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-400 capitalize">{item.product.brand} • {item.product.category}</p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                      ₹{(item.product.sellingPrice * item.quantity).toLocaleString()}
                    </span>

                    <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 overflow-hidden">
                      <button 
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="px-2 py-0.5 text-xs font-bold text-slate-600 dark:text-slate-200 hover:bg-slate-100"
                      >
                        -
                      </button>
                      <span className="px-2 py-0.5 text-xs font-bold text-slate-900 dark:text-white">{item.quantity}</span>
                      <button 
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="px-2 py-0.5 text-xs font-bold text-slate-600 dark:text-slate-200 hover:bg-slate-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Order Summary */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 space-y-3">
            
            {/* Coupon Code Input */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-xl text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-4 h-4" />
                    <span>Coupon <strong>{appliedCoupon.code}</strong> Applied!</span>
                  </div>
                  <button onClick={removeCoupon} className="text-xs font-bold text-red-500 hover:underline">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Coupon Code (FIRST10 / KFMART10)"
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-[#1E3A8A] text-white px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-blue-900 transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && <p className="text-[11px] text-red-500 mt-1">{couponError}</p>}
            </div>

            {/* Free Delivery Threshold Alert */}
            {summary.subtotal < 1000 ? (
              <div className="bg-[#005723]/10 border border-[#005723]/20 rounded-2xl p-3 text-xs text-[#005723] space-y-1.5">
                <div className="flex justify-between items-center font-bold text-[11px]">
                  <span>Add ₹{(1000 - summary.subtotal).toLocaleString()} more for FREE Delivery!</span>
                  <span className="text-amber-600">₹{summary.subtotal} / ₹1,000</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-[#005723] rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (summary.subtotal / 1000) * 100)}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-500">
                  Delivery fee is ₹20 for orders under ₹1,000 • FREE delivery on orders ₹1,000 & above!
                </p>
              </div>
            ) : (
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-2.5 text-xs text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-between">
                <span>🎉 FREE Delivery Unlocked!</span>
                <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-black">₹0 FEE</span>
              </div>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900 dark:text-white">₹{summary.subtotal.toLocaleString()}</span>
              </div>
              {summary.discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Coupon Discount</span>
                  <span className="font-semibold">-₹{summary.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span>Shipping Fee</span>
                <span className="font-semibold">
                  {summary.shipping === 0 ? (
                    <strong className="text-emerald-600 dark:text-emerald-400 font-extrabold bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 rounded-md text-[11px]">
                      FREE (Orders ₹1,000+)
                    </strong>
                  ) : (
                    <span className="text-slate-900 dark:text-white font-bold">
                      ₹20 <span className="text-[10px] text-slate-400 font-normal">(Under ₹1,000)</span>
                    </span>
                  )}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Estimated Taxes & Handling</span>
                <span>₹{summary.gst.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-sm font-extrabold text-slate-900 dark:text-white">
                <span>Grand Total</span>
                <span className="text-base text-[#1E3A8A] dark:text-amber-400">₹{summary.grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Proceed to Checkout Button */}
            <button
              onClick={() => {
                setIsCartDrawerOpen(false);
                onProceedToCheckout();
              }}
              className="w-full bg-[#1E3A8A] hover:bg-blue-900 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
