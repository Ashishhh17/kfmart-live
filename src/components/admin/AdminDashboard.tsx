import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Package, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Truck, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign, 
  Tag, 
  FileText,
  UserCheck,
  Building,
  Trash2,
  Plus,
  Sparkles,
  Search,
  Phone,
  Mail,
  MapPin,
  Bike,
  Check,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  KeyRound
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { OrderStatus, Vendor, DeliveryExecutive } from '../../types';
import { ChangePasswordModal } from '../common/ChangePasswordModal';

export const AdminDashboard: React.FC = () => {
  const { 
    vendors, 
    approveVendor, 
    approveAllVendors,
    rejectVendor, 
    deleteVendor,
    seedVendorsBatch,
    setIsVendorRegModalOpen,
    orders, 
    updateOrderStatus, 
    products, 
    deleteProduct,
    deliveryExecutives, 
    deleteDeliveryExecutive,
    seedDeliveryPartners,
    setIsDeliveryPartnerRegModalOpen,
    assignDeliveryExecutive,
    setActiveInvoiceOrder,
    resetOrdersToZero
  } = useStore();

  const [activeTab, setActiveTab] = useState<'vendors' | 'orders' | 'products' | 'delivery'>('vendors');
  const [vendorSearch, setVendorSearch] = useState('');
  const [deliverySearch, setDeliverySearch] = useState('');
  const [vendorPage, setVendorPage] = useState(1);
  const [deliveryPage, setDeliveryPage] = useState(1);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const itemsPerPage = 12;

  const pendingVendors = vendors.filter(v => v.status === 'Pending Approval');
  const approvedVendors = vendors.filter(v => v.status === 'Approved');

  // Filtered vendors
  const filteredVendors = vendors.filter(v => {
    const q = vendorSearch.toLowerCase();
    return (
      v.businessName.toLowerCase().includes(q) ||
      v.ownerName.toLowerCase().includes(q) ||
      v.email.toLowerCase().includes(q) ||
      v.phone.includes(q) ||
      v.id.toLowerCase().includes(q) ||
      v.address.toLowerCase().includes(q)
    );
  });

  const totalVendorPages = Math.ceil(filteredVendors.length / itemsPerPage) || 1;
  const paginatedVendors = filteredVendors.slice((vendorPage - 1) * itemsPerPage, vendorPage * itemsPerPage);

  // Filtered delivery executives
  const filteredDelivery = deliveryExecutives.filter(d => {
    const q = deliverySearch.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      d.phone.includes(q) ||
      d.id.toLowerCase().includes(q) ||
      (d.assignedZone && d.assignedZone.toLowerCase().includes(q)) ||
      (d.vehicleType && d.vehicleType.toLowerCase().includes(q))
    );
  });

  const totalDeliveryPages = Math.ceil(filteredDelivery.length / itemsPerPage) || 1;
  const paginatedDelivery = filteredDelivery.slice((deliveryPage - 1) * itemsPerPage, deliveryPage * itemsPerPage);

  return (
    <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Top Admin Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#003816] to-slate-900 rounded-3xl p-6 text-white shadow-xl mb-8 flex flex-wrap items-center justify-between gap-4 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-400 text-slate-950 font-black text-[10px] uppercase px-2.5 py-0.5 rounded-md flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> SUPER ADMIN HQ
            </span>
            <span className="text-xs text-emerald-300 font-medium">Live Synchronized Marketplace</span>
          </div>
          <h1 className="text-xl font-black tracking-tight">Marketplace Operations Command Center</h1>
        </div>

          {/* Tab Controls */}
        <div className="flex items-center gap-1.5 bg-white/10 p-1.5 rounded-2xl backdrop-blur-md flex-wrap">
          {[
            { id: 'vendors', label: `Vendors (${vendors.length})` },
            { id: 'delivery', label: `Delivery Fleet (${deliveryExecutives.length})` },
            { id: 'orders', label: `Orders (${orders.length})` },
            { id: 'products', label: `Catalog (${products.length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id ? 'bg-[#005723] text-white shadow-md' : 'text-slate-300 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setIsChangePasswordOpen(true)}
            className="px-3.5 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ml-1"
            title="Change Admin Password"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Change Password</span>
          </button>
        </div>
      </div>

      {/* VENDORS MANAGEMENT TAB */}
      {activeTab === 'vendors' && (
        <div className="space-y-6">
          
          {/* Header Action Bar with Add New Button */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Building className="w-5 h-5 text-[#005723]" />
                Vendor Directory ({vendors.length} Registered Partners)
              </h2>
              <p className="text-xs text-slate-500">
                Manage retail vendors, approve registrations, or onboard verified local sellers.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setIsVendorRegModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#005723] hover:bg-[#00401A] text-white text-xs font-extrabold flex items-center gap-2 shadow-md transition-all"
              >
                <Plus className="w-4 h-4 text-amber-300" />
                <span>+ Add New Vendor</span>
              </button>
            </div>
          </div>

          {/* Pending Approvals Section if any */}
          {pendingVendors.length > 0 && (
            <div className="bg-amber-50/70 dark:bg-amber-950/20 p-5 rounded-3xl border border-amber-200 dark:border-amber-800/50 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xs font-black text-amber-900 dark:text-amber-300 uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  Pending Verification & Approvals ({pendingVendors.length})
                </h3>
                <button
                  type="button"
                  onClick={approveAllVendors}
                  className="px-3 py-1 bg-[#005723] hover:bg-[#00401A] text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Approve All ({pendingVendors.length})
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {pendingVendors.map(vendor => (
                  <div 
                    key={vendor.id}
                    className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-amber-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">{vendor.businessName}</h4>
                      <p className="text-slate-500">Owner: {vendor.ownerName} • Phone: {vendor.phone}</p>
                      <p className="text-slate-500">Email: {vendor.email} • ID: <strong className="font-mono">{vendor.id}</strong></p>
                      <p className="text-[11px] text-slate-400 mt-1">{vendor.address}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => approveVendor(vendor.id)}
                        className="bg-[#005723] hover:bg-emerald-700 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1 shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => rejectVendor(vendor.id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vendors Search & Grid */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={vendorSearch}
                  onChange={(e) => {
                    setVendorSearch(e.target.value);
                    setVendorPage(1);
                  }}
                  placeholder="Search verified vendors by business name, owner, email, ID, or location..."
                  className="w-full pl-9 pr-4 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-[#005723]"
                />
              </div>
              <span className="text-xs font-bold text-slate-500">
                Showing {filteredVendors.length} of {vendors.length} vendors
              </span>
            </div>

            {/* Vendor Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {paginatedVendors.map(v => (
                <div 
                  key={v.id} 
                  className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 text-xs flex flex-col justify-between hover:border-emerald-400/50 transition-colors"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-mono text-[10px] font-bold text-[#005723] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                        {v.id}
                      </span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        v.status === 'Approved' 
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                      }`}>
                        {v.status}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-slate-900 dark:text-white text-sm line-clamp-1">{v.businessName}</h4>
                    <p className="text-slate-600 dark:text-slate-300 font-medium">Owner: {v.ownerName}</p>
                    <p className="text-slate-500 flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" /> {v.phone}</p>
                    <p className="text-slate-500 flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" /> {v.email}</p>
                    <p className="text-slate-500 line-clamp-1 flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400 shrink-0" /> {v.address}</p>

                    <div className="pt-1 flex items-center justify-between text-[11px] font-bold border-t border-slate-200 dark:border-slate-800">
                      <span className="text-slate-500">Sales: ₹{(v.totalSales || 0).toLocaleString()}</span>
                      <span className="text-amber-600 dark:text-amber-400 font-extrabold">★ {v.rating || 5.0}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Verified Partner</span>
                    <button
                      type="button"
                      onClick={() => deleteVendor(v.id)}
                      className="text-red-500 hover:text-red-700 text-[10px] font-bold flex items-center gap-1 p-1 hover:bg-red-50 dark:hover:bg-red-950/40 rounded transition-colors"
                      title="Remove Vendor"
                    >
                      <Trash2 className="w-3 h-3" /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalVendorPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  disabled={vendorPage === 1}
                  onClick={() => setVendorPage(p => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-xl border text-xs font-bold disabled:opacity-40 flex items-center gap-1 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>

                <span className="text-xs font-bold text-slate-500">
                  Page {vendorPage} of {totalVendorPages}
                </span>

                <button
                  type="button"
                  disabled={vendorPage === totalVendorPages}
                  onClick={() => setVendorPage(p => Math.min(totalVendorPages, p + 1))}
                  className="px-3 py-1.5 rounded-xl border text-xs font-bold disabled:opacity-40 flex items-center gap-1 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DELIVERY EXECUTIVES FLEET TAB */}
      {activeTab === 'delivery' && (
        <div className="space-y-6">
          
          {/* Header Action Bar */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-500" />
                Delivery Partner Fleet ({deliveryExecutives.length} Active Riders)
              </h2>
              <p className="text-xs text-slate-500">
                Regional dispatch partners covering Pincode 229413 (Lalgopalganj), Kunda, Nawabganj & Prayagraj Highway.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setIsDeliveryPartnerRegModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#005723] hover:bg-[#00401A] text-white text-xs font-extrabold flex items-center gap-2 shadow-md transition-all"
              >
                <Plus className="w-4 h-4 text-amber-300" />
                <span>+ Add New Delivery Partner</span>
              </button>
            </div>
          </div>

          {/* Delivery Fleet Search & Grid */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={deliverySearch}
                  onChange={(e) => {
                    setDeliverySearch(e.target.value);
                    setDeliveryPage(1);
                  }}
                  placeholder="Search delivery partners by name, phone, zone, vehicle..."
                  className="w-full pl-9 pr-4 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-[#005723]"
                />
              </div>
              <span className="text-xs font-bold text-slate-500">
                Showing {filteredDelivery.length} of {deliveryExecutives.length} riders
              </span>
            </div>

            {/* Delivery Partner Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {paginatedDelivery.map(exec => (
                <div 
                  key={exec.id} 
                  className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 text-xs flex flex-col justify-between hover:border-amber-400/50 transition-colors"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-mono text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded">
                        {exec.id}
                      </span>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        {exec.status}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">{exec.name}</h4>
                    <p className="text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" /> {exec.phone}
                    </p>
                    <p className="text-slate-500 flex items-center gap-1">
                      <Bike className="w-3 h-3 text-slate-400" /> {exec.vehicleType || 'Bike'} ({exec.vehicleNumber || 'UP-33-REG'})
                    </p>
                    <p className="text-slate-500 line-clamp-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" /> {exec.assignedZone || 'Pincode 229413'}
                    </p>

                    <div className="pt-1 flex items-center justify-between text-[11px] font-bold border-t border-slate-200 dark:border-slate-800">
                      <span className="text-slate-500">Done: {exec.completedDeliveries || 0} orders</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">Earned: ₹{(exec.totalEarnings || 0).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">Active Fleet Rider</span>
                    <button
                      type="button"
                      onClick={() => deleteDeliveryExecutive(exec.id)}
                      className="text-red-500 hover:text-red-700 text-[10px] font-bold flex items-center gap-1 p-1 hover:bg-red-50 dark:hover:bg-red-950/40 rounded transition-colors"
                      title="Remove Rider"
                    >
                      <Trash2 className="w-3 h-3" /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalDeliveryPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  disabled={deliveryPage === 1}
                  onClick={() => setDeliveryPage(p => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-xl border text-xs font-bold disabled:opacity-40 flex items-center gap-1 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>

                <span className="text-xs font-bold text-slate-500">
                  Page {deliveryPage} of {totalDeliveryPages}
                </span>

                <button
                  type="button"
                  disabled={deliveryPage === totalDeliveryPages}
                  onClick={() => setDeliveryPage(p => Math.min(totalDeliveryPages, p + 1))}
                  className="px-3 py-1.5 rounded-xl border text-xs font-bold disabled:opacity-40 flex items-center gap-1 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ORDERS MANAGEMENT TAB */}
      {activeTab === 'orders' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-[#005723]" />
                All Placed Orders & Tax Invoices ({orders.length})
              </h2>
              <p className="text-xs text-slate-500">
                View real-time customer orders, print official GST Tax Invoices, and update dispatch tracking.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {orders.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to reset all order data to 0 across all devices?')) {
                      resetOrdersToZero();
                    }
                  }}
                  className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-rose-200 dark:border-rose-800"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Reset Orders to 0 (Sync All)</span>
                </button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="p-12 text-center bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 space-y-3">
                <Package className="w-10 h-10 mx-auto text-slate-400" />
                <div>
                  <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Zero Orders in Database (0 Active)</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                    All connected devices are synchronized to 0 orders. When any customer places an order via Website, UPI, or Buy Now, it will immediately display here and in the Vendor portal.
                  </p>
                </div>
              </div>
            ) : (
              orders.map(order => (
                <div key={order.id} className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-3">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white text-sm">Order #{order.id}</span>
                      <span className="text-slate-500 ml-2">Customer: <strong>{order.customerName}</strong> ({order.customerPhone})</span>
                      <span className="text-slate-500 ml-2">Pincode: <strong>{order.shippingAddress?.pincode}</strong></span>
                      <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                        {order.paymentMethod || 'UPI / Razorpay'} ({order.paymentStatus})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#005723] dark:text-emerald-400">Total: ₹{order.totalAmount}</span>
                      <button
                        type="button"
                        onClick={() => setActiveInvoiceOrder(order)}
                        className="px-3 py-1.5 bg-[#005723] hover:bg-[#00401A] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-300" />
                        <span>View / Print Tax Invoice</span>
                      </button>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-wrap gap-3 items-center">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Items:</span>
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                        <span className="w-2 h-2 rounded-full bg-[#005723]"></span>
                        <span>{item.product?.name || 'Item'} (x{item.quantity}) - ₹{item.product?.sellingPrice * item.quantity}</span>
                      </div>
                    ))}
                    {order.deliveryOTP && (
                      <div className="ml-auto text-xs font-mono font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded">
                        Delivery OTP: {order.deliveryOTP}
                      </div>
                    )}
                  </div>

                  {/* Status Updater Buttons */}
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-slate-500">Current Status: <strong className="text-slate-900 dark:text-white">{order.status}</strong></span>

                    <div className="flex flex-wrap gap-1.5">
                      {(['Ordered', 'Packed', 'Shipped', 'Out For Delivery', 'Delivered', 'Cancelled'] as OrderStatus[]).map(status => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => updateOrderStatus(order.id, status)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                            order.status === status
                              ? 'bg-[#005723] text-white shadow-xs'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          Set {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Assign Delivery Partner */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-bold text-slate-500">Assign Delivery Executive ({deliveryExecutives.length} Available):</span>
                    <select
                      value={order.deliveryPartnerId || ''}
                      onChange={(e) => assignDeliveryExecutive(order.id, e.target.value)}
                      className="px-3 py-1.5 rounded-xl border dark:bg-slate-700 dark:text-white text-xs max-w-xs"
                    >
                      <option value="">Select Agent...</option>
                      {deliveryExecutives.map(exec => (
                        <option key={exec.id} value={exec.id}>{exec.name} - {exec.phone} ({exec.assignedZone})</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* PRODUCTS / CATALOG TAB */}
      {activeTab === 'products' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-[#005723]" />
              Marketplace Catalog Management ({products.length} Products)
            </h2>
            <span className="text-xs text-slate-500 font-semibold">Moderated listing across 300 vendor hubs</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {products.map(product => (
              <div 
                key={product.id}
                className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <img src={product.images[0]} alt={product.name} className="w-full h-32 object-cover rounded-xl mb-2" />
                  <span className="text-[10px] font-bold uppercase bg-amber-500/10 text-[#F97316] px-2 py-0.5 rounded">
                    {product.category}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 mt-1">{product.name}</h4>
                  <p className="text-[10px] text-slate-500">Vendor: {product.vendorName}</p>
                  <p className="text-xs font-extrabold text-[#005723] dark:text-amber-400 mt-1">₹{product.sellingPrice.toLocaleString()}</p>
                </div>

                <button
                  type="button"
                  onClick={() => deleteProduct(product.id)}
                  className="w-full mt-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 font-bold py-1.5 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-red-200 dark:border-red-900 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove Product
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        defaultUserId="admin@kfmart.in"
        accountTitle="Super Admin HQ"
        role="admin"
      />

    </div>
  );
};
