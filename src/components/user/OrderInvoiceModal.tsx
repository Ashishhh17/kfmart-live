import React from 'react';
import { X, Printer, ShieldCheck, Download, FileText } from 'lucide-react';
import { Order } from '../../types';
import { Logo } from '../common/Logo';

interface OrderInvoiceModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderInvoiceModal: React.FC<OrderInvoiceModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full my-8 overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 relative">
        
        {/* Header Control */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#1E3A8A]" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Retail Invoice / Order Receipt</h2>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrint}
              className="px-3 py-1.5 bg-[#1E3A8A] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm hover:bg-[#152865] transition-all"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF
            </button>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Sheet */}
        <div className="p-6 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 space-y-6 text-xs">
          
          {/* Top Brand Header */}
          <div className="flex justify-between items-start border-b pb-4 border-slate-200 dark:border-slate-800">
            <div>
              <Logo />
              <p className="text-[11px] font-bold text-[#1E3A8A] dark:text-amber-400 mt-1">KF Mart Retail Private Limited</p>
              <p className="text-[10px] text-slate-500">Website: <strong>kfmart.in</strong> • Customer Care: +91 91617 72664</p>
              <p className="text-[10px] text-slate-500">Lalgopalganj, Prayagraj / Pratapgarh, UP</p>
            </div>

            <div className="text-right">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">RETAIL INVOICE</span>
              <p className="font-extrabold text-slate-900 dark:text-white mt-1">Invoice #: INV-{order.id}</p>
              <p className="text-[11px] text-slate-500">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              <p className="text-[11px] text-emerald-600 font-bold uppercase mt-1">Payment Status: {order.paymentStatus}</p>
            </div>
          </div>

          {/* Customer & Shipping Details */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Billed & Shipped To:</p>
              <p className="font-bold text-slate-900 dark:text-white">{order.shippingAddress.fullName}</p>
              <p className="text-slate-600 dark:text-slate-300">{order.shippingAddress.street}</p>
              <p className="text-slate-600 dark:text-slate-300">{order.shippingAddress.city}, {order.shippingAddress.state} - <strong className="text-slate-900 dark:text-white">{order.shippingAddress.pincode}</strong></p>
              <p className="text-slate-600 dark:text-slate-300">Phone: {order.customerPhone}</p>
            </div>

            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Order Summary:</p>
              <p className="text-slate-600 dark:text-slate-300">Order ID: <strong>#{order.id}</strong></p>
              <p className="text-slate-600 dark:text-slate-300">Payment Mode: <strong>{order.paymentMethod}</strong></p>
              <p className="text-slate-600 dark:text-slate-300">Delivery Pincode: <strong>{order.shippingAddress.pincode}</strong></p>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-400 bg-slate-50 dark:bg-slate-800">
                <th className="p-2">Item Description</th>
                <th className="p-2 text-center">Qty</th>
                <th className="p-2 text-right">Unit Price</th>
                <th className="p-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {order.items.map((item, i) => (
                <tr key={i}>
                  <td className="p-2 font-semibold text-slate-900 dark:text-white">
                    <div>{item.product.name}</div>
                    {item.selectedSize && (
                      <span className="inline-block mt-0.5 text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/40 px-1.5 py-0.5 rounded">
                        Size: {item.selectedSize}
                      </span>
                    )}
                  </td>
                  <td className="p-2 text-center font-bold">{item.quantity}</td>
                  <td className="p-2 text-right">₹{item.product.sellingPrice.toLocaleString()}</td>
                  <td className="p-2 text-right font-extrabold">₹{(item.product.sellingPrice * item.quantity).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Invoice Totals */}
          <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="w-60 space-y-1 text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900 dark:text-white">₹{order.subtotal.toLocaleString()}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount</span>
                  <span>-₹{order.discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span>{order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                <span>Grand Total</span>
                <span className="text-[#1E3A8A] dark:text-amber-400">₹{order.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Compliance Footer Note */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-[10px] text-slate-500 space-y-1 text-center">
            <p>This is a computer-generated invoice issued directly by <strong>KF Mart Retail</strong> (kfmart.in).</p>
            <p className="flex items-center justify-center gap-2">
              <span>For support & queries:</span>
              <a
                href={`https://wa.me/919161772664?text=${encodeURIComponent(`Hello KF Mart, I have a query regarding Invoice #${order.id}.`)}`}
                target="_blank"
                rel="noreferrer"
                className="text-[#25D366] font-bold hover:underline inline-flex items-center gap-1"
              >
                WhatsApp +91 91617 72664
              </a>
              <span>• Email: support@kfmart.in</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
