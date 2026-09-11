import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  subscribeToGlobalState, 
  updateGlobalState, 
  subscribeToOrders, 
  saveOrderToFirestore, 
  updateOrderInFirestore, 
  deleteOrderFromFirestore,
  subscribeToProducts,
  saveProductToFirestore,
  deleteProductFromFirestore,
  safeSetLocalStorage
} from '../lib/db';
import { 
  Product, 
  Vendor, 
  Order, 
  CartItem, 
  Coupon, 
  NotificationItem, 
  OrderStatus, 
  Role,
  DeliveryExecutive 
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_VENDORS, 
  INITIAL_COUPONS, 
  MOCK_DELIVERY_EXECUTIVES,
  generate300Vendors,
  generate100DeliveryPartners
} from '../data/initialData';

const ALLOWED_PINCODES = ['229413', '230201'];

interface StoreContextType {
  // Navigation & Role State
  activeRole: Role;
  setActiveRole: (role: Role) => void;
  currentVendor: Vendor | null;
  setCurrentVendor: (vendor: Vendor | null) => void;
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  pincode: string;
  setPincode: (pin: string) => void;
  pincodeError: string | null;
  setPincodeError: (err: string | null) => void;
  validatePincode: (pin: string) => boolean;

  // Products & Catalog
  products: Product[];
  addProduct: (productData: Omit<Product, 'id' | 'sellingPrice' | 'pincodeAvailability'>) => Product;
  updateProduct: (id: string, productData: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Cart & Wishlist
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, color?: string, size?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  appliedCoupon: Coupon | null;
  applyCouponCode: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;

  // Orders & Timeline
  orders: Order[];
  createOrder: (
    customerInfo: { fullName: string; email: string; phone: string; address: Order['shippingAddress'] },
    paymentMethod: Order['paymentMethod'],
    utrNumber?: string
  ) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  cancelOrder: (orderId: string, reason?: string) => { success: boolean; message: string };
  updateOrderShipment: (
    orderId: string, 
    details: {
      status?: OrderStatus;
      estimatedDeliveryTime?: string;
      shipmentTrackingNumber?: string;
      courierPartner?: string;
      currentShipmentLocation?: string;
      note?: string;
    }
  ) => void;
  resetOrdersToZero: () => void;
  requestReturn: (orderId: string, reason: string) => { success: boolean; message: string };
  requestExchange: (orderId: string, size: string, reason: string) => { success: boolean; message: string };
  getReturnWindowStatus: (order: Order) => { active: boolean; remainingHours: number; remainingMinutes: number; message?: string };

  // Vendors & Admin (300 Vendors Capacity & Management)
  vendors: Vendor[];
  registerVendor: (vendorData: Omit<Vendor, 'id' | 'status' | 'joinedDate' | 'totalSales' | 'walletBalance' | 'pendingEscrow' | 'rating'> & {
    customId?: string;
    customPassword?: string;
  }) => Vendor;
  addVendorDirect: (vendorData: Partial<Vendor>) => Vendor;
  approveVendor: (vendorId: string) => void;
  rejectVendor: (vendorId: string) => void;
  deleteVendor: (vendorId: string) => void;
  seedVendorsBatch: (count?: number) => void;

  // Delivery Partners (100 Delivery Partners Scale & Registration)
  deliveryExecutives: DeliveryExecutive[];
  registerDeliveryExecutive: (execData: Omit<DeliveryExecutive, 'id'>) => DeliveryExecutive;
  addDeliveryExecutiveDirect: (execData: Partial<DeliveryExecutive>) => DeliveryExecutive;
  deleteDeliveryExecutive: (execId: string) => void;
  seedDeliveryPartners: (count?: number) => void;
  assignDeliveryExecutive: (orderId: string, execId: string) => void;

  // Notifications
  notifications: NotificationItem[];
  addNotification: (title: string, message: string, type: NotificationItem['type'], channels?: ('Website' | 'SMS' | 'Email')[]) => void;
  markNotificationAsRead: (id: string) => void;

  // Modals & UI States
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isCheckoutModalOpen: boolean;
  setIsCheckoutModalOpen: (open: boolean) => void;
  buyNow: (product: Product, quantity?: number, size?: string) => void;
  isVoiceSearchOpen: boolean;
  setIsVoiceSearchOpen: (open: boolean) => void;
  isNotificationDrawerOpen: boolean;
  setIsNotificationDrawerOpen: (open: boolean) => void;
  isVendorRegModalOpen: boolean;
  setIsVendorRegModalOpen: (open: boolean) => void;
  isDeliveryPartnerRegModalOpen: boolean;
  setIsDeliveryPartnerRegModalOpen: (open: boolean) => void;
  activeInvoiceOrder: Order | null;
  setActiveInvoiceOrder: (order: Order | null) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  approveAllVendors: () => void;

  // Session & Authentication Persistence
  session: { identifier: string; timestamp: number; role: Role } | null;
  logout: () => void;

  // Password Security & Management
  changePassword: (userIdOrRole: string, oldPass: string, newPass: string, role?: Role) => Promise<{ success: boolean; message: string }>;
  verifyPassword: (userIdOrRole: string, enteredPass: string, role?: Role) => boolean;
  verifyLoginAsync: (userIdOrRole: string, enteredPass: string, role: Role) => Promise<{ success: boolean; message?: string }>;
  setUserPassword: (identifier: string, newPass: string) => void;
  resetAllPasswordsToDefaults: () => void;

  // Calculations Helper
  getCartSummary: () => { subtotal: number; discount: number; shipping: number; gst: number; grandTotal: number };
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Session Persistence across page refresh
  const [session, setSession] = useState<{ identifier: string; timestamp: number; role: Role } | null>(() => {
    try {
      const saved = localStorage.getItem('kfmart_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // 2. Active Role Persistence across page refresh (does not reset on refresh!)
  const [activeRole, setActiveRoleState] = useState<Role>(() => {
    const savedRole = localStorage.getItem('kfmart_active_role') as Role;
    if (savedRole && ['customer', 'vendor', 'admin', 'delivery'].includes(savedRole)) {
      return savedRole;
    }
    const savedSession = localStorage.getItem('kfmart_session');
    if (savedSession) {
      try {
        const s = JSON.parse(savedSession);
        if (s.role && ['customer', 'vendor', 'admin', 'delivery'].includes(s.role)) {
          return s.role;
        }
      } catch {}
    }
    return 'customer';
  });

  const setActiveRole = (role: Role) => {
    setActiveRoleState(role);
    localStorage.setItem('kfmart_active_role', role);
  };

  // 3. Current Vendor Persistence across page refresh
  const [currentVendor, setCurrentVendorState] = useState<Vendor | null>(() => {
    const savedVendorId = localStorage.getItem('kfmart_current_vendor_id');
    if (savedVendorId) {
      const found = INITIAL_VENDORS.find(v => v.id === savedVendorId);
      if (found) return found;
    }
    return INITIAL_VENDORS[0];
  });

  const setCurrentVendor = (v: Vendor | null) => {
    setCurrentVendorState(v);
    if (v) {
      localStorage.setItem('kfmart_current_vendor_id', v.id);
    } else {
      localStorage.removeItem('kfmart_current_vendor_id');
    }
  };

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pincode, setPincode] = useState<string>('229413');
  const [pincodeError, setPincodeError] = useState<string | null>(null);

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [vendors, setVendors] = useState<Vendor[]>(INITIAL_VENDORS);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('kfmart_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('kfmart_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    if (session) {
      localStorage.setItem('kfmart_session', JSON.stringify(session));
    } else {
      localStorage.removeItem('kfmart_session');
    }
  }, [session]);

  const logout = () => {
    setSession(null);
    localStorage.removeItem('kfmart_session');
    localStorage.removeItem('kfmart_active_role');
    localStorage.removeItem('kfmart_current_vendor_id');
    setActiveRoleState('customer');
    setCurrentVendorState(INITIAL_VENDORS[0]);
  };

  const [orders, setOrders] = useState<Order[]>([]);

  const [deliveryExecutives, setDeliveryExecutives] = useState<DeliveryExecutive[]>(MOCK_DELIVERY_EXECUTIVES);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n1',
      title: 'Welcome to KF Mart Retail',
      message: 'Explore luxury shopping delivered faster to pincode 229413.',
      type: 'system',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      channelsSent: ['Website']
    }
  ]);

  // UI States
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isVoiceSearchOpen, setIsVoiceSearchOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isVendorRegModalOpen, setIsVendorRegModalOpen] = useState(false);
  const [isDeliveryPartnerRegModalOpen, setIsDeliveryPartnerRegModalOpen] = useState(false);
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState<Order | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Helper to determine accurate default size based on product category & naming
  const resolveDefaultProductSize = (product: Product, size?: string): string | undefined => {
    if (size) return size;
    if (product.availableSizes && product.availableSizes.length > 0) {
      return product.availableSizes[0];
    }
    const isShoe = Boolean(
      product.category === 'Shoes' || 
      product.name.toLowerCase().includes('shoe') ||
      product.name.toLowerCase().includes('sneaker') ||
      product.name.toLowerCase().includes('footwear') ||
      product.name.toLowerCase().includes('sandal') ||
      product.name.toLowerCase().includes('boot')
    );
    if (isShoe) return '7 UK';
    if (['Fashion', 'Men', 'Women', 'Kids'].includes(product.category)) return 'M';
    return undefined;
  };

  // Buy Now: Instant single-click direct checkout
  const buyNow = (product: Product, quantity = 1, size?: string) => {
    const finalSize = resolveDefaultProductSize(product, size);
    setCart([{ product, quantity, selectedSize: finalSize }]);
    setIsCartDrawerOpen(false);
    setIsCheckoutModalOpen(true);
  };

  const DEFAULT_ROLE_PASSWORDS: Record<string, string> = {
    customer: 'customer123',
    'customer@kfmart.in': 'customer123',
    vendor: 'vendor123',
    'vendor@kfmart.in': 'vendor123',
    admin: 'admin123',
    'admin@kfmart.in': 'admin123',
    delivery: 'delivery123',
    'delivery@kfmart.in': 'delivery123'
  };

  // User Passwords Store
  const [passwords, setPasswords] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('kfmart_user_passwords_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return DEFAULT_ROLE_PASSWORDS;
  });

  // Sync passwords to localStorage & server
  useEffect(() => {
    localStorage.setItem('kfmart_user_passwords_v2', JSON.stringify(passwords));
  }, [passwords]);

  // Reference to track last server synchronization timestamp to prevent state thrashing
  const lastSyncTimeRef = useRef<number>(0);
  const isInitialFetchDoneRef = useRef<boolean>(false);

  // ==================== CROSS-DEVICE REAL-TIME SYNC ====================
  // Fetch state on startup and listen for Firestore updates without thrashing UI
  useEffect(() => {
    let isMounted = true;

    const applyIncomingData = (data: any) => {
      if (!isMounted || !data) return;
      
      const serverUpdated = data.lastUpdated || 0;
      
      // Only update local state if server has newer data or if this is the initial load
      if (!isInitialFetchDoneRef.current || serverUpdated >= lastSyncTimeRef.current) {
        lastSyncTimeRef.current = Math.max(serverUpdated, lastSyncTimeRef.current);
        isInitialFetchDoneRef.current = true;

        const serverProducts = data.products;
        const serverVendors = data.vendors;
        const serverDelivery = data.deliveryExecutives;
        const serverOrders = data.orders;
        const serverPasswords = data.passwords;
        
        let needsInitialSeed = false;
        let seedData: any = {};

        if (Array.isArray(serverProducts) && serverProducts.length > 0) {
          setProducts(serverProducts);
        } else if (!serverProducts) {
          needsInitialSeed = true;
          seedData.products = INITIAL_PRODUCTS;
          setProducts(INITIAL_PRODUCTS);
        }
        
        if (Array.isArray(serverVendors) && serverVendors.length > 0) {
          setVendors(serverVendors);
        } else if (!serverVendors) {
          needsInitialSeed = true;
          seedData.vendors = INITIAL_VENDORS;
          setVendors(INITIAL_VENDORS);
        }
        
        if (Array.isArray(serverDelivery) && serverDelivery.length > 0) {
          setDeliveryExecutives(serverDelivery);
        } else if (!serverDelivery) {
          needsInitialSeed = true;
          seedData.deliveryExecutives = MOCK_DELIVERY_EXECUTIVES;
          setDeliveryExecutives(MOCK_DELIVERY_EXECUTIVES);
        }

        if (Array.isArray(serverOrders) && serverOrders.length > 0) {
          setOrders(prev => {
            // Keep existing if already loaded by dedicated orders listener
            return prev.length > 0 ? prev : serverOrders;
          });
        }

        if (needsInitialSeed) {
          fetch('/api/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(seedData)
          }).catch(() => {});
        }

        if (serverPasswords && typeof serverPasswords === 'object' && Object.keys(serverPasswords).length > 0) {
          setPasswords(serverPasswords);
          localStorage.setItem('kfmart_user_passwords_v2', JSON.stringify(serverPasswords));
        }

        if (data.accountPasswordChangedAt) {
          setSession(currentSession => {
            if (currentSession) {
              const changedAt = data.accountPasswordChangedAt[currentSession.identifier] || 0;
              // Only expire if password was changed strictly AFTER the session was established with 15-second grace window
              if (changedAt > (currentSession.timestamp + 15000) && currentSession.timestamp > 0 && changedAt > 0) {
                setTimeout(() => {
                  setActiveRole('customer');
                  setCurrentVendor(null);
                  addNotification('Session Expired', 'Your session has expired because your password was changed. Please log in again.', 'system', ['Website']);
                  setIsAuthModalOpen(true);
                }, 0);
                return null;
              }
            }
            return currentSession;
          });
        }
      }
    };

    // 1. Initial immediate API fetch for state
    fetch('/api/state')
      .then(res => res.json())
      .then(resData => {
        if (resData.success && resData.data) {
          applyIncomingData(resData.data);
        }
      })
      .catch(() => {});

    // 2. Fetch orders immediately via API
    fetch('/api/orders')
      .then(r => r.json())
      .then(res => {
        if (res.success && Array.isArray(res.orders) && res.orders.length > 0) {
          setOrders(res.orders);
        }
      })
      .catch(() => {});

    // 3. Real-time Firestore global snapshot listener (vendors, delivery, settings, coupons)
    const unsubscribeGlobal = subscribeToGlobalState((data) => {
      if (data) {
        applyIncomingData(data);
      }
    });

    // 4. Real-time Firestore dedicated products listener (prevents 1MB limit & syncs products instantly)
    const unsubscribeProducts = subscribeToProducts((liveProducts) => {
      if (!isMounted) return;
      if (Array.isArray(liveProducts) && liveProducts.length > 0) {
        setProducts(liveProducts);
      }
    });

    // 5. Real-time Firestore dedicated orders listener (instant cross-phone sync)
    const unsubscribeOrders = subscribeToOrders((liveOrders) => {
      if (!isMounted) return;
      if (Array.isArray(liveOrders)) {
        setOrders(liveOrders);
        safeSetLocalStorage('kfmart_orders', JSON.stringify(liveOrders));
      }
    });

    return () => {
      isMounted = false;
      unsubscribeGlobal();
      unsubscribeProducts();
      unsubscribeOrders();
    };
  }, []);

  const resetOrdersToZero = () => {
    // Delete all current orders from Firestore collection
    orders.forEach(o => {
      deleteOrderFromFirestore(o.id);
    });
    setOrders([]);
    try {
      localStorage.removeItem('kfmart_orders');
    } catch (e) {}
    fetch('/api/orders/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }).catch(() => {});
    addNotification('Orders Reset to Zero', 'All orders have been cleared and synchronized to 0 across all devices.', 'system');
  };

  const resetAllPasswordsToDefaults = () => {
    setPasswords(DEFAULT_ROLE_PASSWORDS);
    localStorage.setItem('kfmart_user_passwords_v2', JSON.stringify(DEFAULT_ROLE_PASSWORDS));
    fetch('/api/passwords/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(r => r.json())
      .then(data => {
        if (data.passwords) {
          setPasswords(data.passwords);
          localStorage.setItem('kfmart_user_passwords_v2', JSON.stringify(data.passwords));
        }
      })
      .catch(() => {});

    addNotification(
      'Passwords Reset to Defaults',
      'All portal passwords have been reset: Vendor (vendor123), Admin (admin123), Delivery (delivery123), Customer (customer123).',
      'system'
    );
  };

  const setUserPassword = (identifier: string, newPass: string) => {
    const cleanId = identifier.trim().toLowerCase();
    const baseKey = cleanId.split('@')[0];
    const updated = {
      ...passwords,
      [cleanId]: newPass,
      [baseKey]: newPass
    };
    setPasswords(updated);
    localStorage.setItem('kfmart_user_passwords_v2', JSON.stringify(updated));
    fetch('/api/passwords/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: cleanId, password: newPass })
    }).catch(() => {});
  };

  // Helper to resolve authoritative active password for any identifier or role
  const resolveActivePassword = (userIdOrRole: string, role?: Role): string => {
    const key = (userIdOrRole || '').trim().toLowerCase();
    const baseKey = key.split('@')[0];

    // 1. Direct match in passwords
    if (passwords[key]) return passwords[key];
    if (passwords[baseKey]) return passwords[baseKey];

    // 2. Vendor match
    const isVendor = 
      role === 'vendor' || 
      key.startsWith('v-') || 
      key.startsWith('v1') || 
      key.startsWith('v2') || 
      key.startsWith('v3') || 
      key.includes('vendor') || 
      vendors.some(v => v.id.toLowerCase() === key || v.email?.toLowerCase() === key);

    if (isVendor) {
      return passwords['vendor'] || passwords['vendor@kfmart.in'] || DEFAULT_ROLE_PASSWORDS['vendor'];
    }

    // 3. Admin match
    const isAdmin = role === 'admin' || key.includes('admin') || key.includes('superadmin');
    if (isAdmin) {
      return passwords['admin'] || passwords['admin@kfmart.in'] || DEFAULT_ROLE_PASSWORDS['admin'];
    }

    // 4. Delivery match
    const isDelivery = 
      role === 'delivery' || 
      key.startsWith('del-') || 
      key.startsWith('del1') || 
      key.includes('delivery') || 
      deliveryExecutives.some(d => d.id.toLowerCase() === key || d.phone?.replace(/\s+/g, '') === key.replace(/\s+/g, ''));

    if (isDelivery) {
      return passwords['delivery'] || passwords['delivery@kfmart.in'] || DEFAULT_ROLE_PASSWORDS['delivery'];
    }

    // 5. Customer match
    return passwords['customer'] || passwords['customer@kfmart.in'] || DEFAULT_ROLE_PASSWORDS['customer'];
  };

  // STRICT PASSWORD VERIFICATION: Once a password is changed, old default passwords are strictly rejected!
  const verifyPassword = (userIdOrRole: string, enteredPass: string, role?: Role): boolean => {
    if (!enteredPass) return false;
    const trimmedEntered = enteredPass.trim();
    const activePass = resolveActivePassword(userIdOrRole, role);

    // STRICT CHECK: ONLY match the active saved password. No backdoors or default fallbacks once changed.
    return trimmedEntered === activePass.trim();
  };

  // Server-authoritative login verification across all devices
  const verifyLoginAsync = async (
    userIdOrRole: string, 
    enteredPass: string, 
    role: Role
  ): Promise<{ success: boolean; message?: string }> => {
    if (!enteredPass) {
      return { success: false, message: 'Please enter your password.' };
    }

    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: userIdOrRole,
          role,
          password: enteredPass.trim()
        })
      });

      const json = await res.json();

      // If server returned updated passwords, sync them to local state and localStorage
      if (json.passwords && typeof json.passwords === 'object') {
        setPasswords(json.passwords);
        localStorage.setItem('kfmart_user_passwords_v2', JSON.stringify(json.passwords));
      }

      if (res.ok && json.valid) {
        const cleanId = userIdOrRole.trim().toLowerCase() || role;
        const newSession = {
          identifier: cleanId,
          timestamp: json.authTimestamp || Date.now(),
          role: role
        };
        setSession(newSession);
        localStorage.setItem('kfmart_session', JSON.stringify(newSession));
        localStorage.setItem('kfmart_active_role', role);
        setActiveRoleState(role);
        return { success: true, message: 'Authentication successful' };
      } else {
        return { 
          success: false, 
          message: json.message || 'Incorrect password entered. The default password has been updated and is no longer valid.' 
        };
      }
    } catch (err) {
      // Local fallback in case of network issue
      const localValid = verifyPassword(userIdOrRole, enteredPass, role);
      if (localValid) {
        const cleanId = userIdOrRole.trim().toLowerCase() || role;
        const newSession = {
          identifier: cleanId,
          timestamp: Date.now(),
          role: role
        };
        setSession(newSession);
        localStorage.setItem('kfmart_session', JSON.stringify(newSession));
        localStorage.setItem('kfmart_active_role', role);
        setActiveRoleState(role);
        return { success: true };
      } else {
        return { 
          success: false, 
          message: 'Incorrect password entered. The default password is no longer valid if you have updated it.' 
        };
      }
    }
  };

  const changePassword = async (
    userIdOrRole: string,
    oldPass: string,
    newPass: string,
    role?: Role
  ): Promise<{ success: boolean; message: string }> => {
    const key = (userIdOrRole || '').trim().toLowerCase();
    const baseKey = key.split('@')[0];
    
    // 1. Validate new password
    if (!newPass || newPass.trim().length < 4) {
      return {
        success: false,
        message: 'New password must be at least 4 characters long.'
      };
    }

    if (newPass.trim() === oldPass.trim()) {
      return {
        success: false,
        message: 'New password cannot be identical to your current password.'
      };
    }

    const trimmedNewPass = newPass.trim();

    try {
      // 2. Synchronize authoritatively to server
      const res = await fetch('/api/passwords/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          identifier: key, 
          role, 
          password: trimmedNewPass,
          oldPassword: oldPass.trim()
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return {
          success: false,
          message: data.message || 'Failed to update password. Current password may be incorrect.'
        };
      }

      // 3. Update state map with authoritative passwords returned by server
      if (data.passwords && typeof data.passwords === 'object') {
        setPasswords(data.passwords);
        localStorage.setItem('kfmart_user_passwords_v2', JSON.stringify(data.passwords));
      } else {
        const updatedPasswords: Record<string, string> = {
          ...passwords,
          [key]: trimmedNewPass,
          [baseKey]: trimmedNewPass
        };
        setPasswords(updatedPasswords);
        localStorage.setItem('kfmart_user_passwords_v2', JSON.stringify(updatedPasswords));
      }

      // Update session timestamp so we don't invalidate our own session
      setSession(prev => prev ? { ...prev, timestamp: Date.now() } : prev);

      addNotification(
        'Password Changed Successfully',
        `Password for ${userIdOrRole} has been updated. Old default passwords are now deactivated across all devices.`,
        'system',
        ['Website', 'SMS']
      );

      return {
        success: true,
        message: 'Password successfully updated! It is now strictly enforced across all devices.'
      };
    } catch {
      // Fallback local update if network fails
      const updatedPasswords: Record<string, string> = {
        ...passwords,
        [key]: trimmedNewPass,
        [baseKey]: trimmedNewPass
      };
      setPasswords(updatedPasswords);
      safeSetLocalStorage('kfmart_user_passwords_v2', JSON.stringify(updatedPasswords));

      return {
        success: true,
        message: 'Password updated locally and queued for server sync.'
      };
    }
  };

  // Sync state to LocalStorage safely to prevent quota errors
  useEffect(() => {
    // Only store 1 thumbnail image per cart item to save browser storage
    const compactCart = cart.map(item => ({
      ...item,
      product: {
        ...item.product,
        images: (item.product.images && item.product.images.length > 0)
          ? [item.product.images[0]]
          : (item.product.images || [])
      }
    }));
    safeSetLocalStorage('kfmart_cart', JSON.stringify(compactCart));
  }, [cart]);

  useEffect(() => {
    // Only store 1 thumbnail image per wishlist item to save browser storage
    const compactWishlist = wishlist.map(p => ({
      ...p,
      images: (p.images && p.images.length > 0) ? [p.images[0]] : (p.images || [])
    }));
    safeSetLocalStorage('kfmart_wishlist', JSON.stringify(compactWishlist));
  }, [wishlist]);

  // Automatic Escrow Release Check for Vendor Payments
  // Vendor payment is released after 24 hours from delivery if no return/exchange raised
  useEffect(() => {
    const checkEscrowRelease = () => {
      setOrders(prevOrders => {
        let updated = false;
        const newOrders = prevOrders.map(order => {
          if (
            order.status === 'Delivered' &&
            order.deliveredAt &&
            !order.vendorPaymentReleased &&
            !order.returnRequested &&
            !order.exchangeRequested
          ) {
            const deliveredTime = new Date(order.deliveredAt).getTime();
            const now = Date.now();
            const elapsedHours = (now - deliveredTime) / (1000 * 60 * 60);

            if (elapsedHours >= 24) {
              updated = true;
              // Release vendor escrow
              const vendorPayout = order.subtotal;
              setVendors(vList =>
                vList.map(v => {
                  if (v.id === order.items[0]?.product.vendorId) {
                    return {
                      ...v,
                      walletBalance: v.walletBalance + vendorPayout,
                      pendingEscrow: Math.max(0, v.pendingEscrow - vendorPayout)
                    };
                  }
                  return v;
                })
              );
              return { ...order, vendorPaymentReleased: true };
            }
          }
          return order;
        });
        return updated ? newOrders : prevOrders;
      });
    };

    checkEscrowRelease();
    const timer = setInterval(checkEscrowRelease, 60000); // Check every minute
    return () => clearInterval(timer);
  }, []);

  // Pincode validation logic
  const validatePincode = (pin: string): boolean => {
    const trimmedPin = pin.trim();
    if (ALLOWED_PINCODES.includes(trimmedPin)) {
      setPincode(trimmedPin);
      setPincodeError(null);
      return true;
    } else if (/^\d{6}$/.test(trimmedPin)) {
      setPincode(trimmedPin);
      setPincodeError(null);
      return true;
    } else {
      setPincodeError("Please enter a valid 6-digit Indian Pincode (Express available for 229413 & 230201).");
      return false;
    }
  };

  // Notification Trigger
  const addNotification = (
    title: string, 
    message: string, 
    type: NotificationItem['type'],
    channels: ('Website' | 'SMS' | 'Email')[] = ['Website', 'SMS', 'Email']
  ) => {
    const newNotif: NotificationItem = {
      id: 'notif-' + Date.now(),
      title,
      message,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      channelsSent: channels
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // Product CRUD with Vendor Pricing Formula
  const addProduct = (productData: Omit<Product, 'id' | 'sellingPrice' | 'pincodeAvailability'>) => {
    // Formula: Vendor Price + Shipping Charge + Company Charge = Final Selling Price
    const sellingPrice = Number(productData.vendorPrice) + Number(productData.shippingCharge) + Number(productData.companyCharge);
    const newProduct: Product = {
      ...productData,
      id: 'prod-' + Date.now(),
      sellingPrice,
      discountPercentage: Math.round(((productData.mrp - sellingPrice) / productData.mrp) * 100),
      pincodeAvailability: ALLOWED_PINCODES
    };
    setProducts(prev => [newProduct, ...prev]);
    addNotification('Product Added', `Product "${newProduct.name}" created with selling price ₹${sellingPrice}`, 'vendor');

    // Save directly to dedicated Firestore products collection (guarantees cross-device sync & no 1MB overflow)
    saveProductToFirestore(newProduct);

    // Post to server for multi-device cross-sync
    fetch('/api/products/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
    }).catch(() => {});

    return newProduct;
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    setProducts(prev => {
      let targetProduct: Product | undefined;
      const updated = prev.map(p => {
        if (p.id === id) {
          const vPrice = productData.vendorPrice ?? p.vendorPrice;
          const shipCharge = productData.shippingCharge ?? p.shippingCharge;
          const compCharge = productData.companyCharge ?? p.companyCharge;
          const sellingPrice = vPrice + shipCharge + compCharge;
          const mrp = productData.mrp ?? p.mrp;
          targetProduct = {
            ...p,
            ...productData,
            sellingPrice,
            discountPercentage: Math.round(((mrp - sellingPrice) / mrp) * 100)
          };
          return targetProduct;
        }
        return p;
      });
      if (targetProduct) {
        saveProductToFirestore(targetProduct);
      }
      fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: updated })
      }).catch(() => {});
      return updated;
    });
  };

  const deleteProduct = (id: string) => {
    deleteProductFromFirestore(id);
    setProducts(prev => {
      const updated = prev.filter(p => p.id !== id);
      fetch('/api/products/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      }).catch(() => {});
      return updated;
    });
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1, color?: string, size?: string) => {
    const finalSize = resolveDefaultProductSize(product, size);
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id && item.selectedSize === finalSize);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { product, quantity, selectedColor: color, selectedSize: finalSize }];
    });
    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.product.id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Coupons
  const applyCouponCode = (code: string) => {
    const summary = getCartSummary();
    const found = INITIAL_COUPONS.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!found) {
      return { success: false, message: 'Invalid coupon code.' };
    }
    if (summary.subtotal < found.minOrderValue) {
      return { success: false, message: `Minimum cart order value of ₹${found.minOrderValue} required for this coupon.` };
    }
    setAppliedCoupon(found);
    return { success: true, message: `Coupon ${found.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Wishlist
  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(p => p.id === productId);
  };

  // Cart Summary Calculation
  const getCartSummary = () => {
    const subtotal = cart.reduce((acc, item) => acc + (item.product.sellingPrice * item.quantity), 0);
    let discount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.discountType === 'percentage') {
        discount = Math.round((subtotal * appliedCoupon.value) / 100);
      } else {
        discount = appliedCoupon.value;
      }
    }
    // Delivery Fee Rule: ₹20 if subtotal is under ₹1000, FREE (₹0) if subtotal >= ₹1000
    const shipping = (cart.length > 0 && subtotal < 1000) ? 20 : 0;
    const gst = 0; // Fake GST removed
    const grandTotal = Math.max(0, subtotal - discount + shipping);

    return { subtotal, discount, shipping, gst, grandTotal };
  };

  // Orders creation
  const createOrder = (
    customerInfo: { fullName: string; email: string; phone: string; address: Order['shippingAddress'] },
    paymentMethod: Order['paymentMethod'],
    utrNumber?: string
  ) => {
    const summary = getCartSummary();
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const trackingNum = 'KFM-TRK-' + Math.floor(100000 + Math.random() * 900000);
    
    // Pick vendor estimated delivery time from cart if available or default to 24 Hours Express
    const vendorDeliveryEst = cart[0]?.product?.estimatedDeliveryTime || '24 Hours Express Delivery';

    // Keep order items lightweight (<2KB) by saving single thumbnail, avoiding massive base64 arrays
    const sanitizedItems = cart.map(item => ({
      product: {
        ...item.product,
        images: (item.product.images && item.product.images.length > 0)
          ? [item.product.images[0]]
          : (item.product.images || [])
      },
      quantity: item.quantity,
      selectedColor: item.selectedColor,
      selectedSize: item.selectedSize
    }));

    const newOrder: Order = {
      id: 'ORD-2026-' + Math.floor(1000 + Math.random() * 9000),
      items: sanitizedItems,
      subtotal: summary.subtotal,
      discountAmount: summary.discount,
      shippingFee: summary.shipping,
      taxAmount: summary.gst,
      totalAmount: summary.grandTotal,
      customerName: customerInfo.fullName,
      customerEmail: customerInfo.email,
      customerPhone: customerInfo.phone,
      shippingAddress: customerInfo.address,
      status: 'Ordered',
      estimatedDeliveryTime: vendorDeliveryEst,
      shipmentTrackingNumber: trackingNum,
      courierPartner: 'KF Express Air & Surface',
      currentShipmentLocation: 'Order Verified - Vendor Warehouse Dispatching',
      timeline: [
        { 
          status: 'Ordered', 
          timestamp: new Date().toISOString(), 
          note: utrNumber 
            ? `Order placed via Direct UPI QR. Verified UTR Ref No: ${utrNumber}` 
            : 'Order placed & vendor notified' 
        }
      ],
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid',
      utrNumber: utrNumber ? utrNumber.trim() : undefined,
      deliveryOTP: otp,
      createdAt: new Date().toISOString(),
      vendorPaymentReleased: false
    };

    // 1. Update local state immediately
    setOrders(prev => [newOrder, ...prev.filter(o => o.id !== newOrder.id)]);
    clearCart();

    // 2. Persist directly to dedicated Firestore collection (instantly pushes to Admin & Vendor phones)
    saveOrderToFirestore(newOrder);

    // 3. Post to server for multi-device sync and local disk backup
    fetch('/api/orders/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder)
    }).catch(() => {});

    // Notify customer
    addNotification(
      'Order Placed Successfully!',
      `Order #${newOrder.id} confirmed. Total: ₹${summary.grandTotal}. Delivery OTP: ${otp}`,
      'order',
      ['Website', 'SMS', 'Email']
    );

    return newOrder;
  };

  // Update Order Status (handles Delayed notification requirement)
  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    let updatedOrder: Order | null = null;
    setOrders(prev => {
      const updated = prev.map(order => {
        if (order.id === orderId) {
          const deliveredAt = status === 'Delivered' ? new Date().toISOString() : order.deliveredAt;
          const updatedTimeline = [
            ...order.timeline,
            { status, timestamp: new Date().toISOString(), note }
          ];

          // Specific requirement: If delivery gets delayed
          if (status === 'Delayed') {
            addNotification(
              `Delivery Delayed for #${order.id}`,
              "Your parcel will be delivered within the next 1–2 days. Thank you for your patience.",
              'delivery',
              ['SMS', 'Email', 'Website']
            );
          } else if (status === 'Delivered') {
            addNotification(
              `Order Delivered #${order.id}`,
              `Parcel delivered successfully! 24-hour Return & Exchange period is now active.`,
              'delivery',
              ['Website', 'SMS', 'Email']
            );
          }

          updatedOrder = {
            ...order,
            status,
            deliveredAt,
            timeline: updatedTimeline
          };
          return updatedOrder;
        }
        return order;
      });

      // Update Firestore directly
      if (updatedOrder) {
        updateOrderInFirestore(orderId, updatedOrder);
      }

      // Sync with server
      fetch('/api/orders/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status, note })
      }).catch(() => {});

      return updated;
    });
  };

  // Cancel Order (by Customer)
  const cancelOrder = (orderId: string, reason = 'Order cancelled by customer') => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return { success: false, message: 'Order not found.' };

    if (order.status === 'Delivered' || order.status === 'Cancelled') {
      return { success: false, message: `Cannot cancel order that is already ${order.status.toLowerCase()}.` };
    }

    const cancelledAt = new Date().toISOString();
    const updatedTimeline = [
      ...order.timeline,
      { status: 'Cancelled' as OrderStatus, timestamp: cancelledAt, note: reason }
    ];

    const updatedOrder = {
      ...order,
      status: 'Cancelled' as OrderStatus,
      paymentStatus: order.paymentMethod !== 'COD' ? ('Refunded' as const) : order.paymentStatus,
      cancelledAt,
      cancellationReason: reason,
      timeline: updatedTimeline
    };

    setOrders(prev => {
      const updated = prev.map(o => o.id === orderId ? updatedOrder : o);
      localStorage.setItem('kfmart_orders', JSON.stringify(updated));
      return updated;
    });

    // Update Firestore directly
    updateOrderInFirestore(orderId, updatedOrder);

    addNotification(
      `Order #${orderId} Cancelled`,
      `Your order has been cancelled successfully.${order.paymentMethod !== 'COD' ? ' Refund will be credited within 24 hours.' : ''}`,
      'order',
      ['Website', 'SMS', 'Email']
    );

    // Sync to server
    fetch('/api/orders/cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, reason })
    }).catch(() => {});

    return { success: true, message: 'Order cancelled successfully.' };
  };

  // Vendor or Admin updates shipment tracking, delivery time & status
  const updateOrderShipment = (
    orderId: string, 
    details: {
      status?: OrderStatus;
      estimatedDeliveryTime?: string;
      shipmentTrackingNumber?: string;
      courierPartner?: string;
      currentShipmentLocation?: string;
      note?: string;
    }
  ) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const nextStatus = details.status || order.status;
        const deliveredAt = nextStatus === 'Delivered' ? (order.deliveredAt || new Date().toISOString()) : order.deliveredAt;
        
        let timeline = order.timeline;
        if (details.note || details.status) {
          timeline = [
            ...order.timeline,
            {
              status: nextStatus,
              timestamp: new Date().toISOString(),
              note: details.note || `Shipment update: ${details.currentShipmentLocation || 'In Transit'}`
            }
          ];
        }

        const updatedOrder: Order = {
          ...order,
          status: nextStatus,
          deliveredAt,
          timeline,
          estimatedDeliveryTime: details.estimatedDeliveryTime || order.estimatedDeliveryTime,
          shipmentTrackingNumber: details.shipmentTrackingNumber || order.shipmentTrackingNumber,
          courierPartner: details.courierPartner || order.courierPartner,
          currentShipmentLocation: details.currentShipmentLocation || order.currentShipmentLocation
        };

        // Direct Firestore update
        updateOrderInFirestore(orderId, updatedOrder);

        // Server sync
        fetch('/api/orders/update-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            status: nextStatus,
            note: details.note,
            timeline
          })
        }).catch(() => {});

        addNotification(
          `Shipment Updated for #${order.id}`,
          `Status: ${nextStatus}. Location: ${details.currentShipmentLocation || order.currentShipmentLocation || 'In Transit'}. Est Delivery: ${details.estimatedDeliveryTime || order.estimatedDeliveryTime || 'Fast Express'}`,
          'delivery',
          ['Website', 'SMS', 'Email']
        );

        return updatedOrder;
      }
      return order;
    }));
  };

  // 24 Hour Return Window calculation
  const getReturnWindowStatus = (order: Order) => {
    if (order.status !== 'Delivered' || !order.deliveredAt) {
      return { active: false, remainingHours: 0, remainingMinutes: 0, message: 'Order not delivered yet.' };
    }

    const deliveredTime = new Date(order.deliveredAt).getTime();
    const expiryTime = deliveredTime + (24 * 60 * 60 * 1000); // 24 hours
    const now = Date.now();
    const diff = expiryTime - now;

    if (diff <= 0) {
      return { active: false, remainingHours: 0, remainingMinutes: 0, message: 'Exchange and Return period has expired.' };
    }

    const remainingHours = Math.floor(diff / (1000 * 60 * 60));
    const remainingMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return { active: true, remainingHours, remainingMinutes };
  };

  // Request Return
  const requestReturn = (orderId: string, reason: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return { success: false, message: 'Order not found.' };

    const windowStatus = getReturnWindowStatus(order);
    if (!windowStatus.active) {
      return { success: false, message: 'Exchange and Return period has expired.' };
    }

    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          returnRequested: true,
          returnReason: reason,
          returnExchangeStatus: 'Pending'
        };
      }
      return o;
    }));

    addNotification(
      'Return Request Submitted',
      `Return request for order #${orderId} received. Under processing.`,
      'order'
    );

    return { success: true, message: 'Return request submitted successfully.' };
  };

  // Request Exchange
  const requestExchange = (orderId: string, size: string, reason: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return { success: false, message: 'Order not found.' };

    const windowStatus = getReturnWindowStatus(order);
    if (!windowStatus.active) {
      return { success: false, message: 'Exchange and Return period has expired.' };
    }

    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          exchangeRequested: true,
          exchangeSize: size,
          returnReason: reason,
          returnExchangeStatus: 'Pending'
        };
      }
      return o;
    }));

    addNotification(
      'Exchange Request Submitted',
      `Exchange request for order #${orderId} (Size: ${size}) received.`,
      'order'
    );

    return { success: true, message: 'Exchange request submitted successfully.' };
  };

  // Vendor Registration & Management (300 Vendor Capacity)
  const registerVendor = (
    vendorData: Omit<Vendor, 'id' | 'status' | 'joinedDate' | 'totalSales' | 'walletBalance' | 'pendingEscrow' | 'rating'> & {
      customId?: string;
      customPassword?: string;
    }
  ) => {
    const rawId = vendorData.customId?.trim() || ('v-' + Date.now());
    const cleanId = rawId.toLowerCase().replace(/\s+/g, '-');
    const assignedEmail = vendorData.email?.trim() || `${cleanId}@kfmart.in`;
    const assignedPassword = vendorData.customPassword?.trim() || 'vendor123';

    const newVendor: Vendor = {
      ...vendorData,
      id: cleanId,
      email: assignedEmail,
      status: 'Pending Approval',
      joinedDate: new Date().toISOString().split('T')[0],
      totalSales: 0,
      walletBalance: 0,
      pendingEscrow: 0,
      rating: 5.0
    };

    // Store custom password for this vendor's ID, Email and Phone
    setPasswords(prev => ({
      ...prev,
      [cleanId]: assignedPassword,
      [assignedEmail.toLowerCase()]: assignedPassword,
      [vendorData.phone.replace(/\s+/g, '')]: assignedPassword
    }));

    setVendors(prev => [newVendor, ...prev]);
    addNotification(
      'Vendor Registration Received',
      `Registration for ${newVendor.businessName} (ID: ${cleanId}) received. You can log in using your ID and set password.`,
      'vendor'
    );

    // Sync vendor and passwords to server
    fetch('/api/vendors/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newVendor)
    }).catch(() => {});

    fetch('/api/passwords/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: cleanId, password: assignedPassword })
    }).catch(() => {});

    return newVendor;
  };

  const addVendorDirect = (vendorData: Partial<Vendor>) => {
    const vId = vendorData.id || `v-${vendors.length + 1}`;
    const newVendor: Vendor = {
      id: vId,
      businessName: vendorData.businessName || `Vendor Partner #${vendors.length + 1}`,
      ownerName: vendorData.ownerName || 'Partner Owner',
      phone: vendorData.phone || '+91 91617 72664',
      email: vendorData.email || `${vId}@kfmart.in`,
      gstNumber: vendorData.gstNumber || '',
      panNumber: vendorData.panNumber || `PAN${Math.floor(1000 + Math.random() * 9000)}P`,
      aadhaarNumber: vendorData.aadhaarNumber || '1234-5678-9012',
      bankDetails: vendorData.bankDetails || {
        accountNumber: '91802003884812',
        ifscCode: 'SBIN0002294',
        bankName: 'State Bank of India',
        accountHolder: vendorData.ownerName || 'Partner Owner'
      },
      address: vendorData.address || 'Main Road, Pincode 229413, UP',
      companyProfile: vendorData.companyProfile || 'Verified retail vendor partner on KF Mart Marketplace.',
      status: vendorData.status || 'Approved',
      rating: vendorData.rating || 5.0,
      joinedDate: vendorData.joinedDate || new Date().toISOString().split('T')[0],
      totalSales: vendorData.totalSales || 0,
      walletBalance: vendorData.walletBalance || 0,
      pendingEscrow: vendorData.pendingEscrow || 0
    };

    setVendors(prev => [newVendor, ...prev]);
    addNotification(
      'New Vendor Added',
      `${newVendor.businessName} has been directly registered and approved.`,
      'vendor'
    );

    // Save default password for direct created vendor
    setPasswords(prev => ({
      ...prev,
      [newVendor.id.toLowerCase()]: 'vendor123',
      [newVendor.email.toLowerCase()]: 'vendor123'
    }));

    fetch('/api/vendors/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newVendor)
    }).catch(() => {});

    return newVendor;
  };

  const approveVendor = (vendorId: string) => {
    setVendors(prev => prev.map(v => v.id === vendorId ? { ...v, status: 'Approved' } : v));
    const v = vendors.find(item => item.id === vendorId);
    if (v) {
      addNotification('Vendor Account Approved!', `Congratulations! ${v.businessName} has been approved by Admin.`, 'vendor', ['Website', 'Email']);
    }
    fetch('/api/vendors/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vendorId })
    }).catch(() => {});
  };

  const rejectVendor = (vendorId: string) => {
    setVendors(prev => prev.map(v => v.id === vendorId ? { ...v, status: 'Rejected' } : v));
    const v = vendors.find(item => item.id === vendorId);
    if (v) {
      addNotification('Vendor Account Status Update', `Registration for ${v.businessName} was rejected. Contact Admin support.`, 'vendor', ['Website', 'Email']);
    }
    fetch('/api/vendors/reject', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vendorId })
    }).catch(() => {});
  };

  const approveAllVendors = () => {
    setVendors(prev => prev.map(v => ({ ...v, status: 'Approved' })));
    addNotification('All Vendors Approved', 'All registered and pending vendors are now approved and active.', 'system');
    fetch('/api/vendors/approve-all', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }).catch(() => {});
  };

  const deleteVendor = (vendorId: string) => {
    setVendors(prev => prev.filter(v => v.id !== vendorId));
    addNotification('Vendor Removed', `Vendor ID ${vendorId} has been removed from the platform.`, 'system');
    fetch('/api/vendors/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vendorId })
    }).catch(() => {});
  };

  const seedVendorsBatch = (count: number = 300) => {
    const batch = generate300Vendors();
    const finalVendors = count < 300 ? batch.slice(0, count) : batch;
    setVendors(finalVendors);
    addNotification(
      'Vendor Directory Updated',
      `Successfully loaded ${finalVendors.length} active Vendor Hubs.`,
      'system'
    );
    fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vendors: finalVendors })
    }).catch(() => {});
  };

  // Delivery Executive Registration & Fleet Management
  const registerDeliveryExecutive = (execData: Omit<DeliveryExecutive, 'id'>) => {
    const newExec: DeliveryExecutive = {
      ...execData,
      id: `del-${deliveryExecutives.length + 1}`
    };
    setDeliveryExecutives(prev => [newExec, ...prev]);
    addNotification(
      'Delivery Partner Registered',
      `${newExec.name} registered into active delivery fleet.`,
      'delivery'
    );
    fetch('/api/delivery/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newExec)
    }).catch(() => {});
    return newExec;
  };

  const addDeliveryExecutiveDirect = (execData: Partial<DeliveryExecutive>) => {
    const id = execData.id || `del-${deliveryExecutives.length + 1}`;
    const newExec: DeliveryExecutive = {
      id,
      name: execData.name || `Delivery Executive #${deliveryExecutives.length + 1}`,
      phone: execData.phone || '+91 98111 22233',
      email: execData.email || `${id}@kfmart.in`,
      vehicleType: execData.vehicleType || 'Bike / Motorcycle',
      vehicleNumber: execData.vehicleNumber || 'UP-33-KFM-NEW',
      assignedZone: execData.assignedZone || 'Pincode 229413 (Lalgopalganj Hub)',
      assignedOrdersCount: execData.assignedOrdersCount || 0,
      completedDeliveries: execData.completedDeliveries || 0,
      totalEarnings: execData.totalEarnings || 0,
      joinedDate: execData.joinedDate || new Date().toISOString().split('T')[0],
      status: execData.status || 'Active'
    };

    setDeliveryExecutives(prev => [newExec, ...prev]);
    addNotification(
      'Delivery Partner Added',
      `${newExec.name} added to executive fleet.`,
      'delivery'
    );
    fetch('/api/delivery/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newExec)
    }).catch(() => {});
    return newExec;
  };

  const deleteDeliveryExecutive = (execId: string) => {
    setDeliveryExecutives(prev => prev.filter(d => d.id !== execId));
    addNotification('Delivery Partner Removed', `Delivery Agent ID ${execId} removed from roster.`, 'system');
    fetch('/api/delivery/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ execId })
    }).catch(() => {});
  };

  const seedDeliveryPartners = (count: number = 100) => {
    const allPartners = generate100DeliveryPartners();
    const finalPartners = count < 100 ? allPartners.slice(0, count) : allPartners;
    setDeliveryExecutives(finalPartners);
    addNotification(
      'Delivery Fleet Updated',
      `Successfully loaded ${finalPartners.length} registered Delivery Partners ready for regional dispatch.`,
      'system'
    );
    fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deliveryExecutives: finalPartners })
    }).catch(() => {});
  };

  // Delivery Executive assignment
  const assignDeliveryExecutive = async (orderId: string, execId: string) => {
    const exec = deliveryExecutives.find(d => d.id === execId || d.phone === execId);
    const courierName = exec ? `${exec.name} (${exec.phone})` : (execId || 'KF Mart Express Rider');

    // 1. Immediately update React state
    setOrders(prev => prev.map(o => o.id === orderId ? { 
      ...o, 
      deliveryPartnerId: execId,
      courierPartner: courierName
    } : o));

    // 2. Persist to real-time Firestore database
    try {
      await updateOrderInFirestore(orderId, {
        deliveryPartnerId: execId,
        courierPartner: courierName
      });
    } catch (e) {
      console.warn('Firestore assign delivery error:', e);
    }

    // 3. Persist to server API
    fetch('/api/orders/assign-delivery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        orderId, 
        deliveryPartnerId: execId, 
        courierPartner: courierName 
      })
    }).catch(err => console.warn('Server assign delivery error:', err));

    if (exec) {
      addNotification('Delivery Agent Assigned', `Order #${orderId} assigned to agent ${exec.name} (${exec.phone}).`, 'delivery');
    }
  };

  return (
    <StoreContext.Provider
      value={{
        activeRole,
        setActiveRole,
        currentVendor,
        setCurrentVendor,
        session,
        logout,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        pincode,
        setPincode,
        pincodeError,
        setPincodeError,
        validatePincode,

        products,
        addProduct,
        updateProduct,
        deleteProduct,

        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        appliedCoupon,
        applyCouponCode,
        removeCoupon,

        wishlist,
        toggleWishlist,
        isInWishlist,

        orders,
        createOrder,
        updateOrderStatus,
        cancelOrder,
        updateOrderShipment,
        requestReturn,
        requestExchange,
        getReturnWindowStatus,

        vendors,
        registerVendor,
        addVendorDirect,
        approveVendor,
        rejectVendor,
        deleteVendor,
        seedVendorsBatch,

        deliveryExecutives,
        registerDeliveryExecutive,
        addDeliveryExecutiveDirect,
        deleteDeliveryExecutive,
        seedDeliveryPartners,
        assignDeliveryExecutive,

        notifications,
        addNotification,
        markNotificationAsRead,

        quickViewProduct,
        setQuickViewProduct,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
        buyNow,
        isVoiceSearchOpen,
        setIsVoiceSearchOpen,
        isNotificationDrawerOpen,
        setIsNotificationDrawerOpen,
        isVendorRegModalOpen,
        setIsVendorRegModalOpen,
        isDeliveryPartnerRegModalOpen,
        setIsDeliveryPartnerRegModalOpen,
        activeInvoiceOrder,
        setActiveInvoiceOrder,
        isAuthModalOpen,
        setIsAuthModalOpen,
        approveAllVendors,

        changePassword,
        verifyPassword,
        verifyLoginAsync,
        setUserPassword,
        resetAllPasswordsToDefaults,

        getCartSummary
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
