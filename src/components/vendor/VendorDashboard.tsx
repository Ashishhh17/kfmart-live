import React, { useState, useRef } from 'react';
import { 
  Store, 
  Package, 
  Plus, 
  DollarSign, 
  Wallet, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Calculator, 
  Tag, 
  TrendingUp,
  Boxes,
  Truck,
  Building,
  Sparkles,
  Users,
  KeyRound,
  Upload,
  Image as ImageIcon,
  Camera,
  Trash2,
  Check,
  Layers,
  Link as LinkIcon,
  Eye,
  ShoppingBag,
  Star,
  FileText
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Category, Product } from '../../types';
import { ChangePasswordModal } from '../common/ChangePasswordModal';

// Curated high-resolution presets by category for quick 1-click photo selection
const CATEGORY_IMAGE_PRESETS: Partial<Record<Category, { title: string; url: string }[]>> = {
  Men: [
    { title: 'Royal Silk Kurta Pajama', url: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop' },
    { title: 'Cotton Casual Shirt', url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop' },
    { title: 'Traditional Nehru Jacket', url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop' },
    { title: 'Handcrafted Leather Jutti/Shoes', url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop' }
  ],
  Women: [
    { title: 'Banarasi Zari Silk Saree', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop' },
    { title: 'Designer Anarkali Suit', url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop' },
    { title: 'Hand-Embroidered Lehenga', url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop' },
    { title: 'Traditional Kundan Jewellery', url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop' }
  ],
  Kids: [
    { title: 'Kids Festive Kurta Pajama', url: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=800&auto=format&fit=crop' },
    { title: 'Printed Cotton Frock Set', url: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=800&auto=format&fit=crop' },
    { title: 'Kids Casual Shoes', url: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=800&auto=format&fit=crop' }
  ],
  Fashion: [
    { title: 'Handmade Leather Handbag', url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop' },
    { title: 'Gold-Tone Classic Watch', url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop' },
    { title: 'UV Protection Sunglasses', url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop' }
  ],
  Footwear: [
    { title: 'Leather Mojari & Jutti', url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop' },
    { title: 'Sneakers & Sports Shoes', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop' }
  ],
  Accessories: [
    { title: 'Handcrafted Wallet & Belt', url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop' },
    { title: 'Designer Sunglasses', url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop' }
  ],
  Shoes: [
    { title: 'Running & Training Shoes', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop' },
    { title: 'Formal Oxford Shoes', url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop' }
  ],
  Electronics: [
    { title: 'Wireless ANC Earbuds', url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800&auto=format&fit=crop' },
    { title: 'AMOLED Smart Fitness Watch', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop' },
    { title: 'Portable Bluetooth Speaker', url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=800&auto=format&fit=crop' }
  ],
  Home: [
    { title: 'Handwoven Cotton Bedsheet', url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=800&auto=format&fit=crop' },
    { title: 'Handcrafted Ceramic Dinner Set', url: 'https://images.unsplash.com/photo-1614771111467-3a1e94474775?q=80&w=800&auto=format&fit=crop' },
    { title: 'Traditional Brass Diya Lamp', url: 'https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?q=80&w=800&auto=format&fit=crop' }
  ],
  Kitchen: [
    { title: 'Stainless Steel Cookware Set', url: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=800&auto=format&fit=crop' },
    { title: 'Ceramic Spice Jars', url: 'https://images.unsplash.com/photo-1614771111467-3a1e94474775?q=80&w=800&auto=format&fit=crop' }
  ],
  Furniture: [
    { title: 'Sheesham Wood Table & Chair', url: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=800&auto=format&fit=crop' }
  ],
  Beauty: [
    { title: 'Ayurvedic Hair & Skin Elixir', url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop' },
    { title: 'Organic Herbal Face Wash', url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop' },
    { title: 'Luxury Attar / Eau De Parfum', url: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=800&auto=format&fit=crop' }
  ],
  Health: [
    { title: 'Immunity & Herbal Supplements', url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop' }
  ],
  Sports: [
    { title: 'Cricket & Sports Fitness Kit', url: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?q=80&w=800&auto=format&fit=crop' }
  ],
  Books: [
    { title: 'Inspirational & Educational Books', url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop' }
  ],
  Mobile: [
    { title: '5G Android Smartphone', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop' },
    { title: 'Armor Protection Mobile Case', url: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=800&auto=format&fit=crop' }
  ],
  Laptop: [
    { title: 'Ultra-Slim Fast Performance Laptop', url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800&auto=format&fit=crop' }
  ],
  Groceries: [
    { title: 'Organic Sharbati Whole Wheat Flour', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=800&auto=format&fit=crop' },
    { title: 'Cold Pressed Pure Mustard Oil', url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=800&auto=format&fit=crop' },
    { title: 'Royal Basmati Rice & Whole Spices', url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop' }
  ],
  Toys: [
    { title: 'Educational & Fun Kids Toys', url: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?q=80&w=800&auto=format&fit=crop' }
  ],
  'Gift Items': [
    { title: 'Celebration Festive Gift Hamper', url: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=800&auto=format&fit=crop' }
  ],
  'Seasonal Products': [
    { title: 'Seasonal Festive Special Product', url: 'https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?q=80&w=800&auto=format&fit=crop' }
  ]
};

export const VendorDashboard: React.FC = () => {
  const { 
    currentVendor, 
    setCurrentVendor,
    vendors,
    setIsVendorRegModalOpen,
    products, 
    addProduct, 
    deleteProduct, 
    orders, 
    updateOrderShipment,
    setActiveInvoiceOrder 
  } = useStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'add-product' | 'orders' | 'wallet'>('overview');
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  // New Product Form state with AUTOMATIC PRICING FORMULA
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('Men');
  const [brand, setBrand] = useState('Royal Threads');
  const [description, setDescription] = useState('');
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState('24 Hours Express');
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['S', 'M', 'L', 'XL', 'XXL']);
  
  // Multi-Image & Upload State
  const [uploadedImages, setUploadedImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop'
  ]);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [imageTab, setImageTab] = useState<'upload' | 'presets' | 'url'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Pricing Formula Variables
  const [vendorPrice, setVendorPrice] = useState<number>(2000);
  const [shippingCharge, setShippingCharge] = useState<number>(150);
  const [companyCharge, setCompanyCharge] = useState<number>(450);
  const [mrp, setMrp] = useState<number>(4999);
  const [stock, setStock] = useState<number>(20);

  // Selected Order Edit State
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<any>('Shipped');
  const [editDeliveryTime, setEditDeliveryTime] = useState('24 Hours Express Delivery');
  const [editTrackingNum, setEditTrackingNum] = useState('');
  const [editCourier, setEditCourier] = useState('KF Express Air');
  const [editLocation, setEditLocation] = useState('Lucknow Dispatch Center');
  const [editNote, setEditNote] = useState('Parcel packed and handed over to courier partner.');

  // Computed Selling Price Formula
  const finalSellingPrice = Number(vendorPrice) + Number(shippingCharge) + Number(companyCharge);

  const activeVendor = currentVendor || vendors.find(v => v.status === 'Approved') || vendors[0];

  // Helper to handle multiple image file upload via FileReader
  const processFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        setUploadFeedback('Please select valid image files (JPG, PNG, WebP).');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          setUploadedImages(prev => {
            if (prev.includes(result)) return prev;
            return [...prev, result];
          });
          setUploadFeedback('Image uploaded successfully!');
          setTimeout(() => setUploadFeedback(null), 2500);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const handleAddCustomUrl = () => {
    if (customImageUrl.trim()) {
      setUploadedImages(prev => [...prev, customImageUrl.trim()]);
      setCustomImageUrl('');
      setUploadFeedback('Image URL added!');
      setTimeout(() => setUploadFeedback(null), 2000);
    }
  };

  const handleSelectPreset = (url: string) => {
    setUploadedImages(prev => {
      if (prev.includes(url)) return prev;
      return [url, ...prev];
    });
    setUploadFeedback('Sample product photo selected!');
    setTimeout(() => setUploadFeedback(null), 2000);
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages(prev => {
      const next = prev.filter((_, i) => i !== index);
      return next.length > 0 ? next : ['https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop'];
    });
  };

  const handleSetAsPrimary = (index: number) => {
    setUploadedImages(prev => {
      const selected = prev[index];
      const rest = prev.filter((_, i) => i !== index);
      return [selected, ...rest];
    });
  };

  if (!activeVendor) {
    return (
      <div className="py-12 text-center text-slate-500">
        <Store className="w-12 h-12 mx-auto mb-2 opacity-30" />
        <p className="text-sm font-bold">No vendor account available.</p>
        <button
          type="button"
          onClick={() => setIsVendorRegModalOpen(true)}
          className="mt-4 px-4 py-2 bg-[#005723] text-white font-bold rounded-xl text-xs"
        >
          + Register First Vendor
        </button>
      </div>
    );
  }

  // Locked state if pending approval
  if (activeVendor.status !== 'Approved') {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl text-center space-y-4">
        <div className="w-16 h-16 bg-amber-500/10 text-[#F97316] rounded-full flex items-center justify-center mx-auto animate-pulse">
          <Clock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
          Your account is awaiting Admin Approval.
        </h2>
        <p className="text-xs text-slate-500">
          Vendor portal access for <strong>{activeVendor.businessName}</strong> is locked until Admin verifies your documents.
        </p>
      </div>
    );
  }

  const vendorProducts = products.filter(p => p.vendorId === activeVendor.id || p.vendorName === activeVendor.businessName);

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure at least one image is present
    const finalImages = uploadedImages.length > 0 
      ? uploadedImages 
      : ['https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop'];

    const isFashionOrShoes = ['Men', 'Women', 'Kids', 'Fashion', 'Shoes'].includes(category);

    addProduct({
      name,
      category,
      brand,
      description: description || `Premium ${name} by ${activeVendor.businessName}. Guaranteed authentic craftsmanship delivered in 24 hours.`,
      images: finalImages,
      availableSizes: isFashionOrShoes ? selectedSizes : undefined,
      vendorId: activeVendor.id,
      vendorName: activeVendor.businessName,
      vendorRating: activeVendor.rating,
      vendorPrice: Number(vendorPrice),
      shippingCharge: Number(shippingCharge),
      companyCharge: Number(companyCharge),
      mrp: Number(mrp),
      rating: 4.9,
      reviewsCount: 1,
      stock: Number(stock),
      estimatedDeliveryTime,
      specifications: {
        'Material': 'Handpicked Quality',
        'Vendor Code': activeVendor.id,
        'Hub Location': 'Lalgopalganj & Kunda Express Hub'
      }
    });

    setName('');
    setDescription('');
    setActiveTab('products');
  };

  return (
    <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Top Vendor Header with 300 Vendor Switcher & Add New Button */}
      <div className="bg-gradient-to-r from-slate-900 via-[#003816] to-slate-900 rounded-3xl p-6 text-white shadow-xl mb-8 flex flex-wrap items-center justify-between gap-4 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-400 text-slate-950 font-black text-[10px] uppercase px-2 py-0.5 rounded-md">
              Verified Vendor Hub
            </span>
            <span className="text-xs text-emerald-300 font-mono font-bold">
              ID: {activeVendor.id}
            </span>
          </div>
          <h1 className="text-2xl font-black">{activeVendor.businessName}</h1>
          <p className="text-xs text-slate-400">
            {activeVendor.ownerName} • {activeVendor.phone} • {activeVendor.address}
          </p>
        </div>

        {/* Change Password & Quick Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsChangePasswordOpen(true)}
            className="px-3.5 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span>Change Password</span>
          </button>

          <button
            onClick={() => setIsVendorRegModalOpen(true)}
            className="px-3.5 py-2 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Building className="w-3.5 h-3.5" />
            <span>+ Create Custom Vendor ID</span>
          </button>

          {/* Quick Switch to any of the 300 Active Vendors */}
          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-2xl border border-slate-700">
            <Users className="w-4 h-4 text-amber-400" />
            <select
              value={activeVendor.id}
              onChange={(e) => {
                const found = vendors.find(v => v.id === e.target.value);
                if (found) setCurrentVendor(found);
              }}
              className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer max-w-[160px] truncate"
            >
              {vendors.map(v => (
                <option key={v.id} value={v.id} className="bg-slate-900 text-white">
                  {v.businessName} ({v.id})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* TABS HEADER */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          {[
            { id: 'overview', label: 'Overview', icon: <Store className="w-4 h-4" /> },
            { id: 'products', label: `Products (${vendorProducts.length})`, icon: <Package className="w-4 h-4" /> },
            { id: 'add-product', label: '+ Upload Product with Photo & Pricing', icon: <Camera className="w-4 h-4 text-amber-500" /> },
            { id: 'orders', label: `Dispatch Orders (${orders.length})`, icon: <Truck className="w-4 h-4" /> },
            { id: 'wallet', label: 'Escrow & Wallet', icon: <Wallet className="w-4 h-4" /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#005723] text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Sales</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">₹{activeVendor.totalSales.toLocaleString()}</span>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Available Wallet</span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">₹{activeVendor.walletBalance.toLocaleString()}</span>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 p-5 rounded-3xl shadow-xs">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Pending Escrow
              </span>
              <span className="text-2xl font-black text-[#F97316]">₹{activeVendor.pendingEscrow.toLocaleString()}</span>
              <span className="text-[10px] text-slate-500 block mt-1">Released after 24h return window</span>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Active Products</span>
              <span className="text-2xl font-black text-[#005723] dark:text-emerald-400">{vendorProducts.length}</span>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCTS MANAGER */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Vendor Catalog ({vendorProducts.length})</h2>
            <button
              onClick={() => setActiveTab('add-product')}
              className="bg-[#005723] hover:bg-[#00401A] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add New Product
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {vendorProducts.map(p => (
              <div key={p.id} className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-2 relative overflow-hidden group">
                <div className="relative h-40 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-700">
                  <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  {p.images.length > 1 && (
                    <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-xs">
                      <Layers className="w-3 h-3" /> {p.images.length} Photos
                    </span>
                  )}
                  <span className="absolute top-2 left-2 bg-[#005723] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                    {p.category}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{p.name}</h4>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-700/50 rounded-xl text-[11px] space-y-1">
                  <div className="flex justify-between text-slate-500"><span>Vendor Price:</span> <strong>₹{p.vendorPrice}</strong></div>
                  <div className="flex justify-between text-slate-500"><span>Delivery Fee:</span> <strong>₹{p.shippingCharge}</strong></div>
                  <div className="flex justify-between text-slate-500"><span>KF Fee:</span> <strong>₹{p.companyCharge}</strong></div>
                  <div className="flex justify-between text-xs font-extrabold text-[#005723] dark:text-emerald-400 border-t border-slate-200 dark:border-slate-600 pt-1">
                    <span>Selling Price:</span> <span>₹{p.sellingPrice}</span>
                  </div>
                </div>
                <button
                  onClick={() => deleteProduct(p.id)}
                  className="w-full text-center text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 py-1.5 rounded-xl transition-colors cursor-pointer"
                >
                  Delete Item
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD PRODUCT FORM WITH PHOTO UPLOAD & AUTOMATIC PRICING */}
      {activeTab === 'add-product' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Form (2 cols) */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
            
            <div className="flex items-center gap-2 border-b pb-3 border-slate-200 dark:border-slate-700">
              <div className="p-2 bg-emerald-500/10 rounded-xl text-[#005723] dark:text-emerald-400">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Upload Product with Photos & Pricing
                </h2>
                <p className="text-xs text-slate-500">
                  Upload photos from your phone/device, pick sample images, and set your vendor pricing.
                </p>
              </div>
            </div>

            <form onSubmit={handleAddProductSubmit} className="space-y-5 text-xs">
              
              {/* Product Basic Info */}
              <div>
                <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  Product Title / Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Royal Mulberry Banarasi Silk Saree or Premium Cotton Kurta"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white font-bold text-xs outline-none focus:ring-2 focus:ring-[#005723]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => {
                      const newCat = e.target.value as Category;
                      setCategory(newCat);
                      const presets = CATEGORY_IMAGE_PRESETS[newCat];
                      if (presets && presets.length > 0) {
                        setUploadedImages([presets[0].url]);
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-[#005723]"
                  >
                    {['Men', 'Women', 'Kids', 'Fashion', 'Electronics', 'Home', 'Beauty', 'Mobile', 'Groceries'].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. Royal Threads or Handcrafted"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-[#005723]"
                  />
                </div>
              </div>

              {/* Garment / Apparel Size Options Selector */}
              {['Men', 'Women', 'Kids', 'Fashion', 'Shoes'].includes(category) && (
                <div className="p-3 bg-blue-50/70 dark:bg-slate-900/80 rounded-2xl border border-blue-200/80 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-[#005723] dark:text-amber-400" />
                      Available Garment Sizes:
                    </span>
                    <span className="text-[10px] text-slate-500">Shoppers will be able to choose from selected sizes</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['S', 'M', 'L', 'XL', 'XXL'].map(sz => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => {
                          setSelectedSizes(prev => 
                            prev.includes(sz) ? prev.filter(s => s !== sz) : [...prev, sz]
                          );
                        }}
                        className={`min-w-[48px] py-1.5 px-3 rounded-xl font-black text-xs transition-all border ${
                          selectedSizes.includes(sz)
                            ? 'bg-[#005723] text-white border-[#005723] shadow-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {sz} {selectedSizes.includes(sz) ? '✓' : '+'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ============================================================ */}
              {/* COMPREHENSIVE PRODUCT IMAGE UPLOAD SECTION */}
              {/* ============================================================ */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-black text-slate-900 dark:text-white">
                    <ImageIcon className="w-4 h-4 text-[#005723] dark:text-emerald-400" />
                    <span>Product Images & Gallery ({uploadedImages.length} photos)</span>
                  </div>

                  {/* Mode switcher tabs */}
                  <div className="flex items-center p-1 bg-slate-200/80 dark:bg-slate-800 rounded-xl gap-1">
                    <button
                      type="button"
                      onClick={() => setImageTab('upload')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        imageTab === 'upload' ? 'bg-white dark:bg-slate-700 text-[#005723] dark:text-emerald-400 shadow-xs' : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Upload className="w-3 h-3" />
                      <span>Upload File / Camera</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setImageTab('presets')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        imageTab === 'presets' ? 'bg-white dark:bg-slate-700 text-[#005723] dark:text-emerald-400 shadow-xs' : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>Sample Presets</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setImageTab('url')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        imageTab === 'url' ? 'bg-white dark:bg-slate-700 text-[#005723] dark:text-emerald-400 shadow-xs' : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <LinkIcon className="w-3 h-3" />
                      <span>Image URL</span>
                    </button>
                  </div>
                </div>

                {uploadFeedback && (
                  <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 rounded-xl text-[11px] font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{uploadFeedback}</span>
                  </div>
                )}

                {/* Sub-Tab 1: Device File Upload / Camera & Drag-and-Drop */}
                {imageTab === 'upload' && (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                      isDragging 
                        ? 'border-[#005723] bg-emerald-500/10 scale-[1.01]' 
                        : 'border-slate-300 dark:border-slate-700 hover:border-[#005723] hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-[#005723] dark:text-emerald-400 flex items-center justify-center">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-extrabold text-xs text-slate-800 dark:text-slate-200">
                        Click to Choose Photos or Drag & Drop Here
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Supports Camera photos, JPG, PNG, WebP (Upload multiple photos)
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-[#005723] text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-xs">
                      <Camera className="w-3 h-3" /> Select From Device / Camera
                    </span>
                  </div>
                )}

                {/* Sub-Tab 2: 1-Click Sample Presets */}
                {imageTab === 'presets' && (
                  <div className="space-y-2">
                    <p className="text-[11px] text-slate-500">
                      Select one of our high quality sample photos for <strong>{category}</strong>:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {CATEGORY_IMAGE_PRESETS[category]?.map((preset, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleSelectPreset(preset.url)}
                          className="group relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-[#005723] transition-all bg-slate-100 dark:bg-slate-800"
                        >
                          <img src={preset.url} alt={preset.title} className="w-full h-20 object-cover group-hover:scale-105 transition-transform" />
                          <div className="p-1.5 bg-white dark:bg-slate-800 text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate">
                            {preset.title}
                          </div>
                          <span className="absolute top-1 right-1 bg-[#005723] text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                            <Plus className="w-3 h-3" />
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sub-Tab 3: Direct Web Image URL */}
                {imageTab === 'url' && (
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={customImageUrl}
                      onChange={(e) => setCustomImageUrl(e.target.value)}
                      placeholder="Paste online image link (e.g. https://...)"
                      className="flex-1 px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomUrl}
                      className="px-4 py-2 bg-[#005723] text-white rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>
                )}

                {/* Uploaded Photos Thumbnails & Primary Selector */}
                {uploadedImages.length > 0 && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                      Selected Product Photos ({uploadedImages.length}): First photo is Cover Image
                    </label>
                    <div className="flex flex-wrap gap-2.5">
                      {uploadedImages.map((img, idx) => (
                        <div
                          key={idx}
                          className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 group bg-slate-100 dark:bg-slate-800 ${
                            idx === 0 ? 'border-[#005723] ring-2 ring-emerald-500/20' : 'border-slate-300 dark:border-slate-700'
                          }`}
                        >
                          <img src={img} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />
                          
                          {/* Badge for Cover / Primary */}
                          {idx === 0 && (
                            <span className="absolute top-1 left-1 bg-[#005723] text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded shadow-xs">
                              Cover
                            </span>
                          )}

                          {/* Action Overlay */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                            {idx !== 0 && (
                              <button
                                type="button"
                                title="Set as Cover Photo"
                                onClick={() => handleSetAsPrimary(idx)}
                                className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 cursor-pointer"
                              >
                                <Check className="w-3 h-3" />
                              </button>
                            )}
                            <button
                              type="button"
                              title="Delete Photo"
                              onClick={() => handleRemoveImage(idx)}
                              className="p-1 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* AUTOMATIC PRICING FORMULA SECTION */}
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-3">
                <div className="flex items-center gap-1.5 text-[#F97316] font-extrabold text-xs uppercase tracking-wider">
                  <Calculator className="w-4 h-4" />
                  <span>Automatic Transparent Price Calculation Matrix</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                      1. Vendor Payout Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={vendorPrice}
                      onChange={(e) => setVendorPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white font-bold font-mono"
                    />
                    <span className="text-[10px] text-slate-400">Amount vendor receives</span>
                  </div>
                  <div>
                    <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                      2. Shipping Fee (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={shippingCharge}
                      onChange={(e) => setShippingCharge(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white font-bold font-mono"
                    />
                    <span className="text-[10px] text-slate-400">Delivery & packaging</span>
                  </div>
                  <div>
                    <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                      3. Marketplace Fee (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={companyCharge}
                      onChange={(e) => setCompanyCharge(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white font-bold font-mono"
                    />
                    <span className="text-[10px] text-slate-400">KF Mart platform share</span>
                  </div>
                </div>

                {/* Calculated Result */}
                <div className="p-3.5 bg-white dark:bg-slate-800 rounded-xl border border-amber-500/40 flex justify-between items-center shadow-xs">
                  <div>
                    <span className="font-bold text-slate-700 dark:text-slate-300 block">Final Computed Customer Price:</span>
                    <span className="text-[10px] text-slate-400">₹{vendorPrice} + ₹{shippingCharge} + ₹{companyCharge}</span>
                  </div>
                  <span className="text-xl font-black text-[#005723] dark:text-emerald-400">
                    ₹{finalSellingPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* MRP and Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                    Original MRP Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={finalSellingPrice}
                    value={mrp}
                    onChange={(e) => setMrp(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white font-bold font-mono"
                  />
                  <span className="text-[10px] text-emerald-600 font-bold">
                    {Math.round(((mrp - finalSellingPrice) / mrp) * 100)}% Discount for shoppers
                  </span>
                </div>
                <div>
                  <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                    Initial Stock Units *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white font-bold font-mono"
                  />
                  <span className="text-[10px] text-slate-400">Inventory ready in shop</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  Promised Delivery Duration (Vendor Dispatch Speed) *
                </label>
                <input
                  type="text"
                  required
                  value={estimatedDeliveryTime}
                  onChange={(e) => setEstimatedDeliveryTime(e.target.value)}
                  placeholder="e.g. 24 Hours Express, 1-2 Days"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  Product Description & Highlights
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe material, fitting, fabric, and special care instructions..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#005723] hover:bg-[#00401A] text-white font-black py-3.5 rounded-2xl text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-amber-300" />
                <span>Publish Product with Photos to Marketplace</span>
              </button>
            </form>
          </div>

          {/* Live Preview Card (1 col) */}
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <Eye className="w-4 h-4 text-[#005723]" />
              <span>Live Buyer Card Preview</span>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-4 shadow-md space-y-3 sticky top-24">
              <div className="relative h-52 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900">
                <img
                  src={uploadedImages[0] || 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop'}
                  alt={name || 'Product Preview'}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 bg-[#005723] text-white text-[10px] font-black px-2 py-0.5 rounded-md">
                  {category}
                </span>
                <span className="absolute top-2 right-2 bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-slate-950" /> 4.9
                </span>
                <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1">
                  <Truck className="w-3 h-3 text-emerald-400" /> {estimatedDeliveryTime}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">{brand || activeVendor.businessName}</span>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white line-clamp-1">
                  {name || 'Your Product Title Will Appear Here'}
                </h3>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-lg font-black text-[#005723] dark:text-emerald-400">
                  ₹{finalSellingPrice.toLocaleString()}
                </span>
                <span className="text-xs text-slate-400 line-through">
                  ₹{mrp.toLocaleString()}
                </span>
                <span className="text-[10px] font-black text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded">
                  {Math.round(((mrp - finalSellingPrice) / mrp) * 100)}% OFF
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 text-[11px] space-y-1">
                <div className="flex justify-between text-slate-500">
                  <span>Vendor Store:</span>
                  <strong className="text-slate-800 dark:text-slate-200">{activeVendor.businessName}</strong>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Stock Quantity:</span>
                  <strong className="text-emerald-600">{stock} In Stock</strong>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Delivery Zone:</span>
                  <strong className="text-slate-800 dark:text-slate-200">229413 & 230201</strong>
                </div>
              </div>

              <div className="p-2 bg-emerald-50 dark:bg-slate-900/60 rounded-xl border border-emerald-200 dark:border-emerald-800/40 text-[10px] text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                <span>24-Hour Return Window & OTP Delivery Protection included</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ORDERS & SHIPMENT TRACKING MANAGEMENT TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#F97316]" />
                Vendor Order Dispatch & Delivery Tracking
              </h2>
              <p className="text-xs text-slate-500">
                Write expected delivery time, update shipment tracking number, live location and order status.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Orders List */}
            <div className="lg:col-span-1 space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Customer Orders ({orders.length})
              </h3>
              {orders.length === 0 ? (
                <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border text-center text-xs text-slate-500">
                  No customer orders received yet. All devices synchronized at 0 orders.
                </div>
              ) : (
                orders.map(ord => {
                  const isSelected = selectedOrderId === ord.id;
                  return (
                    <div
                      key={ord.id}
                      onClick={() => {
                        setSelectedOrderId(ord.id);
                        setEditStatus(ord.status);
                        setEditDeliveryTime(ord.estimatedDeliveryTime || '24 Hours Express');
                        setEditTrackingNum(ord.shipmentTrackingNumber || 'KFM-TRK-' + Math.floor(100000 + Math.random() * 900000));
                        setEditCourier(ord.courierPartner || 'KF Express');
                        setEditLocation(ord.currentShipmentLocation || 'Lucknow Warehouse Hub');
                      }}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2.5 ${
                        isSelected 
                          ? 'border-[#005723] dark:border-emerald-400 bg-emerald-50/80 dark:bg-slate-800 shadow-md' 
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">#{ord.id}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-[#F97316]">
                          {ord.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">Customer: {ord.customerName}</p>
                      
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span>₹{ord.totalAmount}</span>
                        <span className="text-[#005723] dark:text-emerald-400 text-[10px]">{ord.estimatedDeliveryTime || '24h Express'}</span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveInvoiceOrder(ord);
                        }}
                        className="w-full py-1.5 px-2.5 bg-[#005723] hover:bg-[#00401A] text-white rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-300" />
                        <span>View / Print Tax Invoice</span>
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Edit Shipment Form */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Update Order Delivery Tracking & Status
                </h3>
                {selectedOrderId && (
                  <button
                    type="button"
                    onClick={() => {
                      const found = orders.find(o => o.id === selectedOrderId);
                      if (found) setActiveInvoiceOrder(found);
                    }}
                    className="px-3 py-1 bg-[#005723] hover:bg-[#00401A] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-300" />
                    <span>View Full Tax Invoice</span>
                  </button>
                )}
              </div>
              
              {selectedOrderId ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateOrderShipment(selectedOrderId, {
                      status: editStatus,
                      estimatedDeliveryTime: editDeliveryTime,
                      shipmentTrackingNumber: editTrackingNum,
                      courierPartner: editCourier,
                      currentShipmentLocation: editLocation,
                      note: editNote
                    });
                    alert(`Order #${selectedOrderId} shipment details updated successfully!`);
                  }}
                  className="space-y-4 text-xs"
                >
                  <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl font-bold flex justify-between items-center">
                    <span>Editing Order: #{selectedOrderId}</span>
                    <span className="text-[#005723] dark:text-emerald-400">Live Status: {editStatus}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold block mb-1">Order Status *</label>
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-700 dark:text-white font-bold"
                      >
                        <option value="Ordered">Ordered (Received)</option>
                        <option value="Packed">Packed by Vendor</option>
                        <option value="Shipped">Shipped / Dispatched</option>
                        <option value="Out for Delivery">Out for Delivery (Rider OTP)</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold block mb-1">Vendor Delivery Duration / Time *</label>
                      <input
                        type="text"
                        required
                        value={editDeliveryTime}
                        onChange={(e) => setEditDeliveryTime(e.target.value)}
                        placeholder="e.g. 24 Hours Express, 1-2 Days"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-700 dark:text-white font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold block mb-1">Shipment Tracking Number *</label>
                      <input
                        type="text"
                        required
                        value={editTrackingNum}
                        onChange={(e) => setEditTrackingNum(e.target.value)}
                        placeholder="e.g. KFM-TRK-982134"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-700 dark:text-white font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="font-bold block mb-1">Courier Partner *</label>
                      <input
                        type="text"
                        required
                        value={editCourier}
                        onChange={(e) => setEditCourier(e.target.value)}
                        placeholder="e.g. KF Express, Delhivery"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-700 dark:text-white font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold block mb-1">Current Shipment Hub / Location *</label>
                    <input
                      type="text"
                      required
                      value={editLocation}
                      onChange={(e) => setEditLocation(e.target.value)}
                      placeholder="e.g. Lucknow Hub, In Transit to Lalgopalganj"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-700 dark:text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="font-bold block mb-1">Status Timeline Note</label>
                    <textarea
                      rows={2}
                      value={editNote}
                      onChange={(e) => setEditNote(e.target.value)}
                      placeholder="e.g. Package inspected and loaded into courier van."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 dark:bg-slate-700 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#005723] hover:bg-[#00401A] text-white font-bold py-3 rounded-xl text-xs shadow-md cursor-pointer"
                  >
                    Save & Update Shipment Timeline
                  </button>
                </form>
              ) : (
                <div className="p-12 text-center text-slate-400">
                  <Truck className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p>Click on any order from the left column to edit delivery tracking & duration.</p>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

      {/* WALLET TAB */}
      {activeTab === 'wallet' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#005723] to-[#003816] rounded-3xl p-6 text-white space-y-4">
            <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider block">Vendor Escrow Balance</span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black">₹{activeVendor.walletBalance.toLocaleString()}</span>
              <span className="text-xs text-emerald-200">Ready for instant payout</span>
            </div>
            <p className="text-xs text-emerald-100 max-w-md">
              Your payments are credited automatically after the customer's 24-hour return period expires.
            </p>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        defaultUserId={activeVendor.email || activeVendor.id}
        accountTitle={`Vendor Portal (${activeVendor.businessName})`}
        role="vendor"
      />

    </div>
  );
};
