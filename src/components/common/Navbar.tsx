import React, { useState } from 'react';
import { 
  Search, 
  Mic, 
  Heart, 
  ShoppingBag, 
  Bell, 
  MapPin, 
  User, 
  ChevronDown, 
  Store, 
  Menu, 
  X,
  Truck,
  ShieldCheck,
  PhoneCall,
  Sparkles,
  QrCode
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Logo } from './Logo';
import { PWAInstallButton } from './PWAInstallButton';
import { AuthModal } from './AuthModal';
import { WebsiteQRModal } from './WebsiteQRModal';
import { Category, Role } from '../../types';

const CATEGORIES: Category[] = [
  'Fashion', 'Footwear', 'Beauty', 'Accessories', 'Shoes', 
  'Electronics', 'Home', 'Kitchen', 'Furniture', 'Mobile', 
  'Laptop', 'Groceries', 'Kids', 'Books', 'Toys'
];

export const Navbar: React.FC = () => {
  const { 
    activeRole, 
    setActiveRole, 
    cart, 
    wishlist, 
    notifications, 
    pincode, 
    validatePincode,
    pincodeError,
    searchQuery, 
    setSearchQuery, 
    selectedCategory, 
    setSelectedCategory,
    setIsCartDrawerOpen,
    setIsVoiceSearchOpen,
    setIsNotificationDrawerOpen,
    setIsVendorRegModalOpen,
    products
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPincodeModalOpen, setIsPincodeModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [selectedAuthRole, setSelectedAuthRole] = useState<Role>('customer');
  const [tempPincode, setTempPincode] = useState(pincode);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Search auto-suggestions
  const filteredSuggestions = searchQuery.trim() !== '' 
    ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : [];

  const handlePincodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePincode(tempPincode)) {
      setIsPincodeModalOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      
      {/* Top Navbar Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Mobile Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div onClick={() => setSelectedCategory(null)} className="cursor-pointer">
              <Logo showTagline={true} />
            </div>
          </div>

          {/* Centered Search Bar with All Categories dropdown & Dark Green button */}
          <div className="hidden md:flex flex-1 max-w-2xl relative items-center gap-2">
            <div className="relative flex-1 flex items-center border-2 border-[#005723] rounded-lg overflow-hidden bg-white">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                placeholder="Search for products, brands and more..."
                className="w-full px-4 py-2.5 text-sm text-slate-900 focus:outline-none placeholder:text-slate-400 font-medium"
              />

              {/* Voice search mic */}
              <button 
                type="button"
                onClick={() => setIsVoiceSearchOpen(true)}
                title="Voice Search"
                className="p-1.5 text-slate-400 hover:text-[#005723] transition-colors"
              >
                <Mic className="w-4 h-4" />
              </button>

              {/* All Categories Dropdown inside Search Bar */}
              <div className="relative border-l border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                  className="px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1 min-w-[120px] justify-between"
                >
                  <span className="truncate">{selectedCategory || 'All Categories'}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {isCategoryMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-200 z-50 py-1 max-h-60 overflow-y-auto">
                    <button
                      onClick={() => { setSelectedCategory(null); setIsCategoryMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-100"
                    >
                      All Categories
                    </button>
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => { setSelectedCategory(cat); setIsCategoryMenuOpen(false); }}
                        className="w-full text-left px-4 py-1.5 text-xs text-slate-700 hover:bg-emerald-50 hover:text-[#005723]"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Dark Green Search Button */}
              <button 
                type="button"
                className="bg-[#005723] hover:bg-[#00401A] text-white px-4 py-2.5 flex items-center justify-center transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Top PWA Install Button beside search bar */}
            <div className="shrink-0">
              <PWAInstallButton variant="navbar" />
            </div>

            {/* Live Search Suggestions Dropdown */}
            {isSearchFocused && filteredSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
                <div className="px-3 py-2 bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Suggestions
                </div>
                {filteredSuggestions.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSearchQuery(item.name);
                      setIsSearchFocused(false);
                    }}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-emerald-50 cursor-pointer border-b border-slate-100 last:border-none"
                  >
                    <img src={item.images[0]} alt={item.name} className="w-8 h-8 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-900 truncate">{item.name}</p>
                      <p className="text-[10px] text-slate-500 capitalize">{item.category} • ₹{item.sellingPrice}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Header Controls: Deliver to, Login/Signup, Cart */}
          <div className="flex items-center gap-4 text-xs font-medium">
            
            {/* Deliver to Lalgopalganj */}
            <button 
              onClick={() => setIsPincodeModalOpen(true)}
              className="hidden lg:flex items-center gap-2 hover:text-[#005723] transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-[#005723] flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <span className="text-[11px] text-slate-500 block">Deliver to</span>
                <span className="font-bold text-slate-900 flex items-center gap-0.5">
                  Lalgopalganj <ChevronDown className="w-3 h-3 text-slate-500" />
                </span>
              </div>
            </button>

            {/* Login / Signup My Account */}
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-2 hover:text-[#005723] transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="hidden sm:block leading-tight">
                <span className="text-[11px] text-slate-500 block">Login / Signup</span>
                <span className="font-bold text-slate-900 flex items-center gap-0.5 capitalize">
                  {activeRole === 'customer' ? 'My Account' : `${activeRole} Portal`} <ChevronDown className="w-3 h-3 text-slate-500" />
                </span>
              </div>
            </button>

            {/* My Cart Button */}
            <button 
              onClick={() => setIsCartDrawerOpen(true)}
              className="flex items-center gap-2 text-slate-900 hover:text-[#005723] transition-colors"
            >
              <div className="relative w-9 h-9 rounded-full bg-emerald-50 text-[#005723] flex items-center justify-center shrink-0">
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#EAB308] text-slate-950 font-black text-[10px] rounded-full flex items-center justify-center border border-white">
                  {cartItemCount}
                </span>
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <span className="text-[10px] text-slate-500 block">My</span>
                <span className="font-bold text-slate-900">M Cart</span>
              </div>
            </button>

            {/* PWA Install Button */}
            <div className="hidden xl:block">
              <PWAInstallButton variant="navbar" />
            </div>

          </div>

        </div>

        {/* Mobile Search Input */}
        <div className="mt-2.5 md:hidden">
          <div className="relative w-full flex items-center border border-[#005723] rounded-lg overflow-hidden">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products, brands and more..."
              className="w-full px-3 py-2 text-xs text-slate-900 focus:outline-none"
            />
            <button className="bg-[#005723] text-white px-3 py-2">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Forest Green Navigation Bar exact to screenshot */}
      <div className="bg-[#005723] text-white">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          
          {/* Left All Categories Button & Nav Links */}
          <div className="flex items-center overflow-x-auto no-scrollbar">
            {/* All Categories Dropdown button */}
            <button
              onClick={() => setSelectedCategory(null)}
              className="bg-[#00401A] hover:bg-[#003013] px-4 py-3 font-extrabold text-xs flex items-center gap-2 shrink-0 border-r border-[#00481d]"
            >
              <Menu className="w-4 h-4" />
              <span>All Categories</span>
            </button>

            {/* Main Nav Items */}
            <nav className="flex items-center text-xs font-semibold whitespace-nowrap">
              <button 
                onClick={() => setSelectedCategory(null)} 
                className={`px-4 py-3 hover:bg-[#00401A] transition-colors ${selectedCategory === null ? 'bg-[#00401A] text-amber-300 font-bold' : 'text-white'}`}
              >
                Home
              </button>
              {['Categories', "Today's Deals", 'Best Sellers', 'New Arrivals', 'Track Order', 'Contact Us', 'Switch Role'].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    if (item === 'Track Order') {
                      setActiveRole('customer');
                    } else if (item === 'Switch Role') {
                      setIsAuthModalOpen(true);
                    } else if (item === 'Categories') {
                      setSelectedCategory('Fashion');
                    } else if (item === "Today's Deals") {
                      setSelectedCategory('Electronics');
                    } else {
                      setSelectedCategory(null);
                    }
                  }}
                  className={`px-4 py-3 hover:bg-[#00401A] transition-colors ${item === 'Switch Role' ? 'text-amber-300 font-extrabold bg-[#00401A]/60' : 'text-slate-100'}`}
                >
                  {item === 'Switch Role' ? 'Switch Role ⚡' : item}
                </button>
              ))}
            </nav>
          </div>

          {/* Right WhatsApp Support & Free Delivery Banner */}
          <div className="hidden lg:flex items-center gap-2 shrink-0 my-1">
            <button
              type="button"
              onClick={() => setIsQRModalOpen(true)}
              className="bg-[#00401A] hover:bg-[#003013] text-amber-300 px-3 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1.5 transition-all border border-emerald-500/30 cursor-pointer shadow-xs"
              title="Scan QR Code to open kfmart.in on mobile"
            >
              <QrCode className="w-3.5 h-3.5 text-amber-300" />
              <span>Website QR</span>
            </button>

            <a
              href="https://wa.me/919161772664?text=Hello%20KFMart%20Team%2C%20I%20have%20a%20query"
              target="_blank"
              rel="noreferrer"
              className="bg-[#25D366] hover:bg-[#20ba5a] text-white px-3 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-xs"
              title="Chat with KF Mart Support on WhatsApp: +91 91617 72664"
            >
              <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.205 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>WhatsApp Support (+91 91617 72664)</span>
            </a>

            <div className="flex items-center gap-1.5 bg-[#00401A] border border-amber-400/40 text-amber-300 px-3 py-1.5 rounded-full text-xs font-extrabold">
              <Truck className="w-4 h-4 text-amber-400" />
              <span>Free Delivery on ₹1,000+</span>
            </div>
          </div>

        </div>
      </div>

      {/* Pincode Check Modal */}
      {isPincodeModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#005723]" />
                <h3 className="text-base font-bold text-slate-900">Select Delivery Location</h3>
              </div>
              <button onClick={() => setIsPincodeModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-4">
              Enter your Pincode to check express delivery availability in Lalgopalganj & surrounding areas.
            </p>

            <form onSubmit={handlePincodeSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  maxLength={6}
                  value={tempPincode}
                  onChange={(e) => setTempPincode(e.target.value)}
                  placeholder="Enter 6-digit Pincode (e.g. 229413 or 230201)"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#005723] outline-none"
                />
                {pincodeError && (
                  <p className="text-xs text-red-500 font-medium mt-2 bg-red-50 p-2.5 rounded-lg border border-red-200">
                    {pincodeError}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-600 bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
                <span className="flex items-center gap-1 font-semibold text-[#005723]">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Hubs Serving Lalgopalganj
                </span>
                <span className="font-extrabold text-[#005723]">229413 & 230201</span>
              </div>

              <button
                type="submit"
                className="w-full bg-[#005723] hover:bg-[#00401A] text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-sm"
              >
                Apply Location
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative bg-white w-4/5 max-w-sm h-full p-5 overflow-y-auto z-10 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex justify-between items-center mb-6">
                <Logo />
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-6 h-6 text-slate-500" />
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Categories</p>
                <div className="space-y-1">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 rounded-lg"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Role switchers (Moved to Last) */}
              <div className="mb-6 pt-4 border-t border-slate-100">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Switch Role ⚡</p>
                <div className="grid grid-cols-2 gap-2">
                  {(['customer', 'vendor', 'admin', 'delivery'] as const).map(role => (
                    <button
                      key={role}
                      onClick={() => {
                        setSelectedAuthRole(role);
                        setIsAuthModalOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`px-3 py-2 text-xs font-semibold rounded-xl capitalize text-left transition-colors ${
                        activeRole === role
                          ? 'bg-[#005723] text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {role} Portal
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <p className="text-[11px] text-slate-500 text-center">kfmart.in • Har Dukaan, Ek Platform</p>
            </div>
          </div>
        </div>
      )}

      {/* Role Login Credentials Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialRole={selectedAuthRole}
      />

      {/* Website QR Code Modal */}
      <WebsiteQRModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        targetUrl="https://kfmart.in"
      />
    </header>
  );
};
