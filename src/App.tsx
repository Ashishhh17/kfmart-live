import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/common/Navbar';
import { TopHeaderInstallBar } from './components/common/TopHeaderInstallBar';
import { Footer } from './components/home/Footer';
import { HeroSlider } from './components/home/HeroSlider';
import { CategoryGrid } from './components/home/CategoryGrid';
import { TrustBar } from './components/home/TrustBar';
import { ProductCard } from './components/home/ProductCard';
import { CustomerReviews } from './components/home/CustomerReviews';
import { AppDownloadBanner } from './components/home/AppDownloadBanner';
import { VoiceSearchModal } from './components/common/VoiceSearchModal';
import { NotificationCenter } from './components/common/NotificationCenter';
import { ProductDetailModal } from './components/product/ProductDetailModal';
import { QuickViewModal } from './components/product/QuickViewModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/cart/CheckoutModal';
import { UserDashboard } from './components/user/UserDashboard';
import { OrderInvoiceModal } from './components/user/OrderInvoiceModal';
import { VendorRegistrationModal } from './components/vendor/VendorRegistrationModal';
import { DeliveryPartnerRegistrationModal } from './components/delivery/DeliveryPartnerRegistrationModal';
import { VendorDashboard } from './components/vendor/VendorDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { DeliveryExecutivePanel } from './components/delivery/DeliveryExecutivePanel';
import { WhatsAppWidget } from './components/common/WhatsAppWidget';
import { Product } from './types';
import { MapPin } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { 
    activeRole, 
    products, 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery,
    isVendorRegModalOpen,
    setIsVendorRegModalOpen,
    isDeliveryPartnerRegModalOpen,
    setIsDeliveryPartnerRegModalOpen,
    activeInvoiceOrder,
    setActiveInvoiceOrder,
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    pincode
  } = useStore();

  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'rating'>('popular');
  const [customerViewMode, setCustomerViewMode] = useState<'shop' | 'account'>('shop');

  // Filter products by category & search
  let displayedProducts = products;

  if (selectedCategory) {
    displayedProducts = displayedProducts.filter(p => p.category === selectedCategory);
  }

  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase();
    displayedProducts = displayedProducts.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q)
    );
  }

  // Sort
  if (sortBy === 'price-low') {
    displayedProducts = [...displayedProducts].sort((a, b) => a.sellingPrice - b.sellingPrice);
  } else if (sortBy === 'price-high') {
    displayedProducts = [...displayedProducts].sort((a, b) => b.sellingPrice - a.sellingPrice);
  } else if (sortBy === 'rating') {
    displayedProducts = [...displayedProducts].sort((a, b) => b.rating - a.rating);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 font-sans">
      {/* Top Black Header App Install Banner matching user screenshot */}
      <TopHeaderInstallBar />
      
      {/* Global Navbar */}
      <Navbar />

      {/* Primary Role Container */}
      <main className="flex-1">
        
        {/* ROLE 1: CUSTOMER PORTAL */}
        {activeRole === 'customer' && (
          <div>
            {/* View Sub-navigation toggle for Customer */}
            <div className="bg-white border-b border-slate-200 py-2">
              <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setCustomerViewMode('shop');
                      setSelectedCategory(null);
                    }}
                    className={`px-4 py-1.5 rounded-xl font-bold transition-all ${
                      customerViewMode === 'shop' 
                        ? 'bg-[#005723] text-white shadow-xs' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Marketplace Shop
                  </button>
                  <button
                    onClick={() => setCustomerViewMode('account')}
                    className={`px-4 py-1.5 rounded-xl font-bold transition-all ${
                      customerViewMode === 'account' 
                        ? 'bg-[#005723] text-white shadow-xs' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    User Dashboard & Orders
                  </button>
                </div>

                <div className="hidden sm:flex items-center gap-2 text-slate-500 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#005723]" />
                  <span>Showing products for Lalgopalganj (Pincode: <strong>{pincode}</strong>)</span>
                </div>
              </div>
            </div>

            {customerViewMode === 'account' ? (
              <UserDashboard />
            ) : (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* If user filtered by category or search query */}
                {selectedCategory || searchQuery.trim() !== '' ? (
                  <div className="py-6 space-y-6">
                    {/* Header Filter Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                      <div>
                        <h1 className="text-lg font-extrabold text-slate-900">
                          {selectedCategory ? `${selectedCategory} Collection` : `Search results for "${searchQuery}"`}
                        </h1>
                        <p className="text-xs text-slate-500">Showing {displayedProducts.length} verified products</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-slate-500">Sort By:</span>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value as any)}
                          className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-300"
                        >
                          <option value="popular">Most Popular</option>
                          <option value="price-low">Price: Low to High</option>
                          <option value="price-high">Price: High to Low</option>
                          <option value="rating">Highest Rated</option>
                        </select>
                      </div>
                    </div>

                    {/* Products Grid */}
                    {displayedProducts.length === 0 ? (
                      <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                        <p className="text-sm font-bold text-slate-700">No products found matching your criteria.</p>
                        <button
                          onClick={() => setSelectedCategory(null)}
                          className="mt-3 bg-[#005723] text-white font-bold px-4 py-2 rounded-xl text-xs"
                        >
                          Clear Filters
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {displayedProducts.map(product => (
                          <ProductCard 
                            key={product.id} 
                            product={product} 
                            onOpenDetails={setSelectedProductForDetail} 
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Standard Homepage Layout matching screenshot */
                  <div className="space-y-6 py-2">
                    
                    {/* 1. Hero Banner Slider */}
                    <HeroSlider />

                    {/* 2. Shop by Category Grid */}
                    <CategoryGrid />

                    {/* 3. Top Deals Of The Day Section */}
                    <section className="py-2">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-slate-900">
                          Top Deals Of The Day
                        </h2>
                        <button 
                          onClick={() => setSelectedCategory('Fashion')}
                          className="text-xs font-bold text-[#005723] hover:underline"
                        >
                          View All
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                        {products.map(product => (
                          <ProductCard 
                            key={product.id} 
                            product={product} 
                            onOpenDetails={setSelectedProductForDetail} 
                          />
                        ))}
                      </div>
                    </section>

                    {/* 4. Bottom Trust & Guarantee Bar */}
                    <TrustBar />

                    {/* 5. Customer Reviews */}
                    <CustomerReviews />

                    {/* 6. Mobile App Banner */}
                    <AppDownloadBanner />

                  </div>
                )}

              </div>
            )}
          </div>
        )}

        {/* ROLE 2: VENDOR PORTAL */}
        {activeRole === 'vendor' && <VendorDashboard />}

        {/* ROLE 3: ADMIN PORTAL */}
        {activeRole === 'admin' && <AdminDashboard />}

        {/* ROLE 4: DELIVERY EXECUTIVE PORTAL */}
        {activeRole === 'delivery' && <DeliveryExecutivePanel />}

      </main>

      {/* Global Modals & Drawers */}
      <ProductDetailModal 
        product={selectedProductForDetail} 
        onClose={() => setSelectedProductForDetail(null)} 
      />

      <QuickViewModal />

      <CartDrawer onProceedToCheckout={() => setIsCheckoutModalOpen(true)} />

      <CheckoutModal 
        isOpen={isCheckoutModalOpen} 
        onClose={() => setIsCheckoutModalOpen(false)} 
        onOrderSuccess={(order) => {
          setCustomerViewMode('account');
        }}
      />

      <OrderInvoiceModal 
        order={activeInvoiceOrder} 
        onClose={() => setActiveInvoiceOrder(null)} 
      />

      <VendorRegistrationModal 
        isOpen={isVendorRegModalOpen} 
        onClose={() => setIsVendorRegModalOpen(false)} 
      />

      <DeliveryPartnerRegistrationModal
        isOpen={isDeliveryPartnerRegModalOpen}
        onClose={() => setIsDeliveryPartnerRegModalOpen(false)}
      />

      <VoiceSearchModal />

      <NotificationCenter />

      {/* Floating WhatsApp Widget */}
      <WhatsAppWidget phoneNumber="919161772664" />

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainAppContent />
    </StoreProvider>
  );
}
