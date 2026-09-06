import { Order } from '../types';

/**
 * Generates a clean, plain text bill summary suitable for WhatsApp or clipboard
 */
export const generateInvoicePlainText = (order: Order): string => {
  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const formattedTime = new Date(order.createdAt).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const itemsList = order.items
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.product.name}${item.selectedSize ? ` [Size: ${item.selectedSize}]` : ''} x ${item.quantity} = ₹${item.product.sellingPrice * item.quantity}`
    )
    .join('\n');

  return `*================================*
*🛒 KF MART - RETAIL CASH BILL*
*Lalgopalganj & Kunda Express*
*================================*
*Bill No:* INV-${order.id.replace('ORD-', '')}
*Date:* ${formattedDate} ${formattedTime}
*Customer:* ${order.customerName}
*Phone:* ${order.customerPhone}
*Address:* ${order.shippingAddress.street}, ${order.shippingAddress.city} - ${order.shippingAddress.pincode}
*Payment:* ${order.paymentMethod} (${order.paymentStatus})
${order.deliveryOTP ? `*DELIVERY OTP:* ${order.deliveryOTP}\n` : ''}*--------------------------------*
*ITEMS:*
${itemsList}
*--------------------------------*
Subtotal: ₹${order.subtotal}
${order.discountAmount > 0 ? `Discount: -₹${order.discountAmount}\n` : ''}Shipping Fee: ${order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}
*NET TOTAL AMOUNT: ₹${order.totalAmount}*
*--------------------------------*
*Tracking:* ${order.shipmentTrackingNumber || order.id}
*Courier:* ${order.courierPartner || 'KF Express 24h'}
*Helpline:* +91 91617 72664
*Website:* https://kfmart.in
*================================*
Thank you for shopping with KF Mart!`;
};

/**
 * Generates a standalone, self-contained HTML page for the invoice with embedded styles
 */
export const generateStandaloneInvoiceHtml = (
  order: Order,
  format: 'thermal58' | 'standardA4',
  autoPrint: boolean = false
): string => {
  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const formattedTime = new Date(order.createdAt).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });

  if (format === 'thermal58') {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>KF-Mart-Receipt-${order.id}</title>
  <style>
    @page {
      size: 58mm auto;
      margin: 0;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      margin: 0;
      padding: 0;
      background: #f1f5f9;
      font-family: "Courier New", Courier, monospace;
      color: #000;
    }
    .bill-wrapper {
      width: 58mm;
      max-width: 58mm;
      min-width: 58mm;
      margin: 0 auto;
      padding: 3mm 2.5mm;
      background: #fff;
      font-size: 9px;
      line-height: 1.25;
      color: #000;
      box-sizing: border-box;
    }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .text-left { text-align: left; }
    .font-bold { font-weight: bold; }
    .font-black { font-weight: 900; }
    .border-dashed { border-bottom: 1px dashed #000; padding-bottom: 4px; margin-bottom: 4px; }
    .border-solid { border-bottom: 1px solid #000; }
    .border-top-solid { border-top: 1px solid #000; padding-top: 4px; margin-top: 4px; }
    .row { display: flex; justify-content: space-between; margin-bottom: 1px; }
    .table-header { display: flex; font-weight: bold; border-bottom: 1px solid #000; padding-bottom: 2px; font-size: 8px; }
    .item-row { margin-top: 3px; font-size: 8px; }
    .item-name { font-weight: bold; font-size: 8.5px; }
    .item-details { display: flex; justify-content: space-between; font-size: 7.5px; }
    .otp-box { background: #000; color: #fff; padding: 2px 4px; font-weight: bold; display: flex; justify-content: space-between; margin: 3px 0; border-radius: 2px; }
    .barcode { font-family: monospace; letter-spacing: 2px; background: #eee; padding: 3px; text-align: center; font-weight: bold; margin: 4px 0; font-size: 8px; }
    .footer-text { font-size: 7px; text-align: center; line-height: 1.2; margin-top: 4px; }
    .no-print-bar {
      position: sticky;
      top: 0;
      background: #005723;
      color: #fff;
      padding: 10px;
      text-align: center;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 13px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      z-index: 1000;
    }
    .print-btn {
      background: #fff;
      color: #005723;
      border: none;
      padding: 6px 14px;
      font-weight: bold;
      border-radius: 6px;
      cursor: pointer;
      margin: 0 5px;
      font-size: 12px;
    }
    @media print {
      body {
        background: #fff;
      }
      .no-print-bar {
        display: none !important;
      }
      .bill-wrapper {
        margin: 0 !important;
        padding: 2mm 2.5mm !important;
        box-shadow: none !important;
        border: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="no-print-bar">
    <span>KF Mart 58mm Thermal Bill View</span>
    <button class="print-btn" onclick="window.print()">🖨️ Print Slip Now</button>
    <button class="print-btn" style="background:#e2e8f0; color:#334155;" onclick="window.close()">Close</button>
  </div>

  <div class="bill-wrapper">
    <div class="text-center border-dashed">
      <div class="font-black" style="font-size: 13px; letter-spacing: 1px;">*** KF MART ***</div>
      <div class="font-bold" style="font-size: 8.5px;">Lalgopalganj & Kunda Express</div>
      <div style="font-size: 7.5px;">Web: kfmart.in • Tel: +91 91617 72664</div>
      <div class="font-black" style="font-size: 8px; text-transform: uppercase; margin-top: 2px;">RETAIL CASH BILL / INVOICE</div>
    </div>

    <div class="border-dashed" style="font-size: 8px;">
      <div class="row">
        <span>BILL NO:</span>
        <span class="font-bold">INV-${order.id.replace('ORD-', '')}</span>
      </div>
      <div class="row">
        <span>DATE:</span>
        <span>${formattedDate} ${formattedTime}</span>
      </div>
      <div class="row">
        <span>CUSTOMER:</span>
        <span class="font-bold">${order.customerName}</span>
      </div>
      <div class="row">
        <span>PHONE:</span>
        <span>${order.customerPhone}</span>
      </div>
      <div style="font-size: 7.5px; margin-top: 1px;">
        ADDR: ${order.shippingAddress.street}, ${order.shippingAddress.city} (${order.shippingAddress.pincode})
      </div>
      <div class="row font-bold" style="margin-top: 2px;">
        <span>PAY MODE:</span>
        <span>${order.paymentMethod} (${order.paymentStatus})</span>
      </div>
      ${
        order.deliveryOTP
          ? `<div class="otp-box">
              <span>DELIVERY OTP:</span>
              <span>${order.deliveryOTP}</span>
            </div>`
          : ''
      }
    </div>

    <div class="border-dashed">
      <div class="table-header">
        <span style="width: 50%;">ITEM</span>
        <span style="width: 14%; text-align: center;">QTY</span>
        <span style="width: 18%; text-align: right;">RATE</span>
        <span style="width: 18%; text-align: right;">AMT</span>
      </div>
      ${order.items
        .map(
          (item) => `
        <div class="item-row">
          <div class="item-name">${item.product.name}${item.selectedSize ? ` (${item.selectedSize})` : ''}</div>
          <div class="item-details">
            <span style="width: 50%; color: #475569;">${item.product.brand || 'KF Retail'}</span>
            <span style="width: 14%; text-align: center;">${item.quantity}</span>
            <span style="width: 18%; text-align: right;">₹${item.product.sellingPrice}</span>
            <span style="width: 18%; text-align: right; font-weight: bold;">₹${item.product.sellingPrice * item.quantity}</span>
          </div>
        </div>
      `
        )
        .join('')}
    </div>

    <div class="border-dashed" style="font-size: 8px;">
      <div class="row">
        <span>SUBTOTAL:</span>
        <span>₹${order.subtotal}</span>
      </div>
      ${
        order.discountAmount > 0
          ? `<div class="row" style="color: #005723; font-weight: bold;">
              <span>DISCOUNT:</span>
              <span>-₹${order.discountAmount}</span>
            </div>`
          : ''
      }
      <div class="row">
        <span>SHIPPING:</span>
        <span>${order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}</span>
      </div>
      <div class="row font-black border-top-solid" style="font-size: 10px;">
        <span>NET TOTAL:</span>
        <span>₹${order.totalAmount}</span>
      </div>
    </div>

    <div class="footer-text">
      <div class="barcode">||| ${order.shipmentTrackingNumber || order.id} |||</div>
      <div class="font-bold" style="font-size: 8px;">*** THANK YOU FOR SHOPPING! ***</div>
      <div>Easy 24-Hour Return / Exchange Available</div>
      <div>WhatsApp Support: +91 91617 72664</div>
      <div style="font-size: 6.5px; color: #64748b; margin-top: 2px;">
        Computer-generated slip • Valid without physical signature
      </div>
    </div>
  </div>

  ${
    autoPrint
      ? `<script>
        window.addEventListener('load', function() {
          setTimeout(function() {
            window.focus();
            window.print();
          }, 300);
        });
      </script>`
      : ''
  }
</body>
</html>`;
  }

  // standardA4 format
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>KF-Mart-Tax-Invoice-${order.id}</title>
  <style>
    @page {
      size: A4;
      margin: 10mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      margin: 0;
      padding: 0;
      background: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 12px;
      line-height: 1.5;
      color: #1e293b;
    }
    .invoice-card {
      max-width: 210mm;
      margin: 20px auto;
      padding: 20mm 15mm;
      background: #fff;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      border-radius: 8px;
    }
    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #005723;
      padding-bottom: 15px;
      margin-bottom: 20px;
    }
    .brand-title {
      font-size: 20px;
      font-weight: 900;
      color: #005723;
      margin: 0;
    }
    .brand-sub {
      font-size: 11px;
      color: #64748b;
      margin: 2px 0;
    }
    .invoice-meta {
      text-align: right;
    }
    .invoice-badge {
      display: inline-block;
      background: #005723;
      color: #fff;
      font-size: 11px;
      font-weight: bold;
      padding: 3px 10px;
      border-radius: 4px;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 6px;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      background: #f8fafc;
      padding: 15px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      margin-bottom: 20px;
    }
    .section-label {
      font-size: 10px;
      font-weight: bold;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    th {
      background: #f1f5f9;
      color: #475569;
      font-size: 11px;
      text-transform: uppercase;
      font-weight: bold;
      padding: 10px;
      text-align: left;
      border-bottom: 2px solid #cbd5e1;
    }
    td {
      padding: 10px;
      border-bottom: 1px solid #e2e8f0;
    }
    .size-pill {
      display: inline-block;
      background: #ecfdf5;
      color: #065f46;
      font-size: 10px;
      font-weight: bold;
      padding: 1px 6px;
      border-radius: 4px;
      margin-left: 6px;
      border: 1px solid #a7f3d0;
    }
    .totals-box {
      margin-left: auto;
      width: 280px;
    }
    .total-line {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
      color: #475569;
    }
    .grand-total {
      display: flex;
      justify-content: space-between;
      font-size: 15px;
      font-weight: 900;
      color: #005723;
      border-top: 2px solid #005723;
      padding-top: 8px;
      margin-top: 4px;
    }
    .footer-box {
      margin-top: 30px;
      padding-top: 15px;
      border-top: 1px solid #e2e8f0;
      text-align: center;
      font-size: 11px;
      color: #64748b;
    }
    .no-print-bar {
      position: sticky;
      top: 0;
      background: #005723;
      color: #fff;
      padding: 12px;
      text-align: center;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 14px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      z-index: 1000;
    }
    .print-btn {
      background: #fff;
      color: #005723;
      border: none;
      padding: 7px 16px;
      font-weight: bold;
      border-radius: 6px;
      cursor: pointer;
      margin: 0 6px;
      font-size: 13px;
    }
    @media print {
      body {
        background: #fff;
      }
      .no-print-bar {
        display: none !important;
      }
      .invoice-card {
        margin: 0 !important;
        padding: 0 !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        max-width: 100% !important;
      }
    }
  </style>
</head>
<body>
  <div class="no-print-bar">
    <span>KF Mart Tax Invoice (A4 View)</span>
    <button class="print-btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
    <button class="print-btn" style="background:#e2e8f0; color:#334155;" onclick="window.close()">Close</button>
  </div>

  <div class="invoice-card">
    <div class="header-row">
      <div>
        <h1 class="brand-title">KF MART</h1>
        <div class="brand-sub font-bold">KF Mart Retail Private Limited</div>
        <div class="brand-sub">Website: <strong>kfmart.in</strong> • Tel: +91 91617 72664</div>
        <div class="brand-sub">Lalgopalganj, Prayagraj / Pratapgarh, Uttar Pradesh</div>
      </div>

      <div class="invoice-meta">
        <span class="invoice-badge">TAX INVOICE</span>
        <div style="font-weight: 800; font-size: 13px;">Invoice #: INV-${order.id}</div>
        <div style="color: #64748b; font-size: 11px;">Date: ${formattedDate}</div>
        <div style="color: #005723; font-weight: bold; font-size: 11px; margin-top: 2px;">
          Status: ${order.paymentStatus.toUpperCase()} (${order.paymentMethod})
        </div>
        ${
          order.deliveryOTP
            ? `<div style="display:inline-block; background:#ecfdf5; color:#065f46; border:1px solid #a7f3d0; padding:2px 8px; border-radius:4px; font-weight:bold; font-size:11px; margin-top:4px;">
                Delivery OTP: ${order.deliveryOTP}
              </div>`
            : ''
        }
      </div>
    </div>

    <div class="grid-2">
      <div>
        <div class="section-label">Billed & Shipped To:</div>
        <div style="font-weight: bold; color: #0f172a;">${order.shippingAddress.fullName}</div>
        <div style="color: #334155;">${order.shippingAddress.street}</div>
        <div style="color: #334155;">${order.shippingAddress.city}, ${order.shippingAddress.state} - <strong>${order.shippingAddress.pincode}</strong></div>
        <div style="color: #334155; margin-top: 2px;">Phone: <strong>${order.customerPhone}</strong></div>
      </div>

      <div style="text-align: right;">
        <div class="section-label">Dispatch & Logistics:</div>
        <div style="color: #334155;">Order ID: <strong>#${order.id}</strong></div>
        <div style="color: #334155;">Courier: <strong>${order.courierPartner || 'KF Express Logistics'}</strong></div>
        <div style="color: #334155;">Tracking No: <strong>${order.shipmentTrackingNumber || order.id}</strong></div>
        <div style="color: #334155;">Delivery Mode: <strong>${order.estimatedDeliveryTime || '24h Express'}</strong></div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Item Description</th>
          <th style="text-align: center; width: 60px;">Qty</th>
          <th style="text-align: right; width: 100px;">Unit Price</th>
          <th style="text-align: right; width: 110px;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${order.items
          .map(
            (item) => `
          <tr>
            <td>
              <div style="font-weight: 700; color: #0f172a;">
                ${item.product.name}
                ${item.selectedSize ? `<span class="size-pill">Size: ${item.selectedSize}</span>` : ''}
              </div>
              <div style="font-size: 10px; color: #64748b;">${item.product.brand || 'KF Retail'} • ${item.product.category}</div>
            </td>
            <td style="text-align: center; font-weight: bold;">${item.quantity}</td>
            <td style="text-align: right;">₹${item.product.sellingPrice.toLocaleString()}</td>
            <td style="text-align: right; font-weight: 800;">₹${(item.product.sellingPrice * item.quantity).toLocaleString()}</td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>

    <div class="totals-box">
      <div class="total-line">
        <span>Subtotal:</span>
        <span style="font-weight: 600; color: #0f172a;">₹${order.subtotal.toLocaleString()}</span>
      </div>
      ${
        order.discountAmount > 0
          ? `<div class="total-line" style="color: #059669; font-weight: 600;">
              <span>Promotional Discount:</span>
              <span>-₹${order.discountAmount.toLocaleString()}</span>
            </div>`
          : ''
      }
      <div class="total-line">
        <span>Express Delivery:</span>
        <span>${order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}</span>
      </div>
      <div class="grand-total">
        <span>Grand Total:</span>
        <span>₹${order.totalAmount.toLocaleString()}</span>
      </div>
    </div>

    <div class="footer-box">
      <div style="font-weight: bold; color: #334155;">KF Mart Retail • Customer Satisfaction Guaranteed</div>
      <div>24-Hour Return & Exchange Policy Applies • WhatsApp Support: +91 91617 72664</div>
      <div style="font-size: 9.5px; color: #94a3b8; margin-top: 4px;">
        This is a computer-generated tax invoice issued by KF Mart Retail Private Limited.
      </div>
    </div>
  </div>

  ${
    autoPrint
      ? `<script>
        window.addEventListener('load', function() {
          setTimeout(function() {
            window.focus();
            window.print();
          }, 300);
        });
      </script>`
      : ''
  }
</body>
</html>`;
};

/**
 * Strategy 1: Print via a dedicated hidden iframe.
 * Avoids any parent container modal clipping, overflow: hidden, or dark mode issues.
 */
export const printInvoiceViaIframe = (order: Order, format: 'thermal58' | 'standardA4'): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      let iframe = document.getElementById('kf-invoice-print-frame') as HTMLIFrameElement;
      if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.id = 'kf-invoice-print-frame';
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = 'none';
        iframe.style.visibility = 'hidden';
        document.body.appendChild(iframe);
      }

      const html = generateStandaloneInvoiceHtml(order, format, false);
      const doc = iframe.contentWindow?.document;
      if (!doc) {
        resolve(false);
        return;
      }

      doc.open();
      doc.write(html);
      doc.close();

      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
          resolve(true);
        } catch (e) {
          console.warn('Iframe print failed:', e);
          resolve(false);
        }
      }, 350);
    } catch (err) {
      console.warn('printInvoiceViaIframe exception:', err);
      resolve(false);
    }
  });
};

/**
 * Strategy 2: Open standalone print-ready view in a new tab.
 * 100% immune to iframe sandbox policies or missing window.print permissions!
 */
export const openInvoiceInNewTab = (order: Order, format: 'thermal58' | 'standardA4'): void => {
  try {
    const html = generateStandaloneInvoiceHtml(order, format, true);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const newWin = window.open(url, '_blank');
    if (!newWin) {
      // If browser blocked popup, download file instead
      downloadInvoiceHtml(order, format);
    }
  } catch (e) {
    console.warn('Failed to open invoice in new tab, falling back to download:', e);
    downloadInvoiceHtml(order, format);
  }
};

/**
 * Strategy 3: Download invoice as HTML file that can be opened in any browser or saved as PDF
 */
export const downloadInvoiceHtml = (order: Order, format: 'thermal58' | 'standardA4'): void => {
  const html = generateStandaloneInvoiceHtml(order, format, false);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `KF-Mart-Invoice-${order.id}-${format}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Strategy 4: Share complete itemized bill directly to WhatsApp
 */
export const shareInvoiceOnWhatsApp = (order: Order): void => {
  const message = encodeURIComponent(generateInvoicePlainText(order));
  window.open(`https://wa.me/?text=${message}`, '_blank');
};

/**
 * Strategy 5: Copy plain text bill to clipboard
 */
export const copyInvoiceToClipboard = async (order: Order): Promise<boolean> => {
  try {
    const text = generateInvoicePlainText(order);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    return true;
  } catch (err) {
    console.warn('Copy invoice failed:', err);
    return false;
  }
};
