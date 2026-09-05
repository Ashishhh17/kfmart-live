import React, { useState } from 'react';
import { X, Printer, FileText, CheckCircle2, QrCode } from 'lucide-react';
import { Order } from '../../types';
import { Logo } from '../common/Logo';

interface OrderInvoiceModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderInvoiceModal: React.FC<OrderInvoiceModalProps> = ({ order, onClose }) => {
  const [printFormat, setPrintFormat] = useState<'thermal58' | 'standardA4'>('thermal58');

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const formattedTime = new Date(order.createdAt).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Inject print-specific style rules */}
      <style>{`
        @media print {
          @page {
            size: ${printFormat === 'thermal58' ? '58mm 130mm' : 'A4'};
            margin: ${printFormat === 'thermal58' ? '0mm' : '10mm'};
          }
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: #fff !important;
            color: #000 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body * {
            visibility: hidden !important;
          }
          .printable-invoice-container, .printable-invoice-container * {
            visibility: visible !important;
          }
          .printable-invoice-container {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: ${printFormat === 'thermal58' ? '58mm' : '100%'} !important;
            max-width: ${printFormat === 'thermal58' ? '58mm' : '100%'} !important;
            ${printFormat === 'thermal58' ? 'max-height: 130mm !important; overflow: hidden !important; padding: 2mm 2.5mm !important;' : 'padding: 0 !important;'}
            background: #fff !important;
            color: #000 !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
          }
        }
      `}</style>

      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full my-6 overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 relative flex flex-col max-h-[90vh]">
        
        {/* Modal Header & Controls (Hidden in Print) */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900/90 print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#005723]/10 flex items-center justify-center text-[#005723]">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">Print Invoice / Bill</h2>
              <p className="text-[11px] text-slate-500">Order #{order.id}</p>
            </div>
          </div>

          {/* Format Selector: 58mm*130mm thermal slip vs Standard A4 */}
          <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setPrintFormat('thermal58')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                printFormat === 'thermal58'
                  ? 'bg-[#005723] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              58mm × 130mm Thermal
            </button>
            <button
              type="button"
              onClick={() => setPrintFormat('standardA4')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                printFormat === 'standardA4'
                  ? 'bg-[#005723] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              A4 Sheet
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button 
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 bg-[#005723] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm hover:bg-[#00401A] transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print {printFormat === 'thermal58' ? '58mm Bill' : 'PDF'}</span>
            </button>
            <button 
              type="button"
              onClick={onClose} 
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Receipt Body */}
        <div className="p-4 overflow-y-auto flex-1 flex justify-center bg-slate-100 dark:bg-slate-950">
          
          {/* ============================================================ */}
          {/* 58mm × 130mm THERMAL RECEIPT SLIP FORMAT                     */}
          {/* ============================================================ */}
          {printFormat === 'thermal58' && (
            <div 
              id="printable-thermal-slip"
              className="printable-invoice-container bg-white text-black p-3 rounded-xl shadow-lg border border-slate-300 font-mono text-[9px] leading-tight select-text"
              style={{
                width: '58mm',
                maxWidth: '58mm',
                minWidth: '58mm',
                boxSizing: 'border-box'
              }}
            >
              {/* Header */}
              <div className="text-center space-y-0.5 pb-1.5 border-b border-dashed border-black">
                <div className="font-black text-xs tracking-wider">*** KF MART ***</div>
                <div className="text-[8px] font-bold">Lalgopalganj & Kunda Express</div>
                <div className="text-[7.5px]">Web: kfmart.in • Tel: 9161772664</div>
                <div className="text-[7.5px] uppercase font-bold pt-0.5">RETAIL CASH BILL / INVOICE</div>
              </div>

              {/* Order Info */}
              <div className="py-1.5 space-y-0.5 text-[8px] border-b border-dashed border-black">
                <div className="flex justify-between">
                  <span>BILL NO:</span>
                  <span className="font-bold">INV-{order.id.replace('ORD-', '')}</span>
                </div>
                <div className="flex justify-between">
                  <span>DATE:</span>
                  <span>{formattedDate} {formattedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span>CUSTOMER:</span>
                  <span className="font-bold truncate max-w-[110px]">{order.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span>PHONE:</span>
                  <span>{order.customerPhone}</span>
                </div>
                <div className="truncate text-[7.5px]">
                  <span>ADDR: {order.shippingAddress.street}, {order.shippingAddress.city} ({order.shippingAddress.pincode})</span>
                </div>
                <div className="flex justify-between font-bold pt-0.5">
                  <span>PAY MODE:</span>
                  <span>{order.paymentMethod} ({order.paymentStatus})</span>
                </div>
                {order.deliveryOTP && (
                  <div className="flex justify-between text-[8px] font-black bg-black text-white px-1 py-0.5 rounded-xs mt-0.5">
                    <span>DELIVERY OTP:</span>
                    <span>{order.deliveryOTP}</span>
                  </div>
                )}
              </div>

              {/* Items Table */}
              <div className="py-1 text-[8px] border-b border-dashed border-black">
                <div className="flex justify-between font-black pb-1 border-b border-black text-[7.5px]">
                  <span className="w-[52%]">ITEM</span>
                  <span className="w-[14%] text-center">QTY</span>
                  <span className="w-[17%] text-right">RATE</span>
                  <span className="w-[17%] text-right">AMT</span>
                </div>

                <div className="divide-y divide-dotted divide-slate-300">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-0.5">
                      <div className="font-bold truncate text-[8px]">
                        {item.product.name}
                        {item.selectedSize ? ` (${item.selectedSize})` : ''}
                      </div>
                      <div className="flex justify-between text-[7.5px] text-slate-700">
                        <span className="w-[52%] text-[7px] truncate text-slate-500">
                          {item.product.brand || 'KF Retail'}
                        </span>
                        <span className="w-[14%] text-center">{item.quantity}</span>
                        <span className="w-[17%] text-right">₹{item.product.sellingPrice}</span>
                        <span className="w-[17%] text-right font-bold">₹{item.product.sellingPrice * item.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="py-1.5 space-y-0.5 text-[8px] border-b border-dashed border-black">
                <div className="flex justify-between">
                  <span>SUBTOTAL:</span>
                  <span>₹{order.subtotal}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between">
                    <span>DISCOUNT:</span>
                    <span>-₹{order.discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>SHIPPING:</span>
                  <span>{order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}</span>
                </div>
                <div className="flex justify-between font-black text-[9.5px] pt-1 border-t border-black">
                  <span>NET TOTAL:</span>
                  <span>₹{order.totalAmount}</span>
                </div>
              </div>

              {/* Barcode / Tracking & Footer */}
              <div className="pt-1.5 text-center space-y-0.5 text-[7px] leading-tight">
                <div className="font-mono text-[8px] font-black tracking-widest bg-slate-100 p-0.5 rounded-xs">
                  ||| {order.shipmentTrackingNumber || order.id} |||
                </div>
                <div className="font-bold text-[7.5px] pt-0.5">
                  *** THANK YOU FOR SHOPPING! ***
                </div>
                <div>Easy 24-Hour Return / Exchange Available</div>
                <div>Support WhatsApp: +91 91617 72664</div>
                <div className="text-[6.5px] text-slate-500 pt-0.5">
                  Computer-generated slip • Valid without physical signature
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STANDARD A4 TAX INVOICE FORMAT                               */}
          {/* ============================================================ */}
          {printFormat === 'standardA4' && (
            <div 
              id="printable-standard-invoice"
              className="printable-invoice-container bg-white text-slate-900 p-6 rounded-2xl shadow-xl border border-slate-200 w-full max-w-xl text-xs space-y-5"
            >
              {/* Top Brand Header */}
              <div className="flex justify-between items-start border-b pb-4 border-slate-200">
                <div>
                  <Logo />
                  <p className="text-[11px] font-bold text-[#005723] mt-1">KF Mart Retail Private Limited</p>
                  <p className="text-[10px] text-slate-500">Website: <strong>kfmart.in</strong> • Tel: +91 91617 72664</p>
                  <p className="text-[10px] text-slate-500">Lalgopalganj, Prayagraj / Pratapgarh, UP</p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">TAX INVOICE</span>
                  <p className="font-extrabold text-slate-900 mt-1">Invoice #: INV-{order.id}</p>
                  <p className="text-[11px] text-slate-500">Date: {formattedDate}</p>
                  <p className="text-[11px] text-[#005723] font-bold uppercase mt-1">Payment: {order.paymentStatus}</p>
                  {order.deliveryOTP && (
                    <div className="inline-block mt-1 bg-[#005723]/10 text-[#005723] px-2 py-0.5 rounded-full font-bold text-[10px]">
                      Delivery OTP: {order.deliveryOTP}
                    </div>
                  )}
                </div>
              </div>

              {/* Customer & Shipping Details */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Billed & Shipped To:</p>
                  <p className="font-bold text-slate-900">{order.shippingAddress.fullName}</p>
                  <p className="text-slate-600">{order.shippingAddress.street}</p>
                  <p className="text-slate-600">{order.shippingAddress.city}, {order.shippingAddress.state} - <strong>{order.shippingAddress.pincode}</strong></p>
                  <p className="text-slate-600">Phone: {order.customerPhone}</p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Dispatch Summary:</p>
                  <p className="text-slate-600">Order ID: <strong>#{order.id}</strong></p>
                  <p className="text-slate-600">Payment Mode: <strong>{order.paymentMethod}</strong></p>
                  <p className="text-slate-600">Tracking: <strong>{order.shipmentTrackingNumber || 'In Dispatch'}</strong></p>
                  <p className="text-slate-600">Courier: <strong>{order.courierPartner || 'KF Express'}</strong></p>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] uppercase font-bold text-slate-400 bg-slate-50">
                    <th className="p-2">Item Description</th>
                    <th className="p-2 text-center">Qty</th>
                    <th className="p-2 text-right">Unit Price</th>
                    <th className="p-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {order.items.map((item, i) => (
                    <tr key={i}>
                      <td className="p-2 font-semibold text-slate-900">
                        <div>{item.product.name}</div>
                        {item.selectedSize && (
                          <span className="inline-block mt-0.5 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
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
              <div className="flex justify-end pt-2 border-t border-slate-200">
                <div className="w-60 space-y-1 text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900">₹{order.subtotal.toLocaleString()}</span>
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
                  <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                    <span>Grand Total</span>
                    <span className="text-[#005723]">₹{order.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Compliance Footer Note */}
              <div className="p-3 bg-slate-50 rounded-xl text-[10px] text-slate-500 space-y-1 text-center">
                <p>This is a computer-generated tax invoice issued by <strong>KF Mart Retail</strong> (kfmart.in).</p>
                <p>24-hour Return & Exchange policy applies. Customer Support WhatsApp: +91 91617 72664</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
