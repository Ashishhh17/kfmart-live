import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, onSnapshot, setDoc, getDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "infinite-jetty-kr7h4",
  appId: "1:377006469634:web:e92b7d922c65961911ed1b",
  apiKey: "AIzaSyAQgHKkDRt6CyZDwyFgFkzKBTlZOkg3oLo",
  authDomain: "infinite-jetty-kr7h4.firebaseapp.com",
  storageBucket: "infinite-jetty-kr7h4.firebasestorage.app",
  messagingSenderId: "377006469634"
};
const firebaseApp = initializeApp(firebaseConfig);
const firestoreDb = getFirestore(firebaseApp, "ai-studio-remixremixkfmart-fc386353-4a1f-44a7-9d50-a7748c3790a9");
const globalStateRef = doc(firestoreDb, 'state', 'global');


const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Persistent JSON Database Path
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-Memory Database cache loaded from or saved to disk
let serverDb: {
  products?: any[];
  vendors?: any[];
  deliveryExecutives?: any[];
  orders?: any[];
  passwords?: Record<string, string>;
  accountPasswordChangedAt?: Record<string, number>;
  passwordsLastUpdated?: number;
  passwordVersion?: number;
  coupons?: any[];
  lastUpdated?: number;
} = {
  products: [],
  vendors: [],
  deliveryExecutives: [],
  orders: [],
  passwords: {},
  accountPasswordChangedAt: {},
  passwordsLastUpdated: Date.now(),
  passwordVersion: 1,
  coupons: [],
  lastUpdated: 0
};

// Real-time Firestore sync & orders collection loader
async function loadDatabase() {
  try {
    // 1. Load global state (products, vendors, delivery, passwords)
    const snap = await getDoc(globalStateRef);
    if (snap.exists()) {
      const gData = snap.data() as any;
      serverDb = {
        ...serverDb,
        ...gData
      };
      console.log('Successfully loaded persistent marketplace database from Firestore.');
    } else {
      serverDb = {
        products: [],
        vendors: [],
        deliveryExecutives: [],
        orders: [],
        passwords: {
          customer: 'customer123',
          'customer@kfmart.in': 'customer123',
          vendor: 'vendor123',
          'vendor@kfmart.in': 'vendor123',
          admin: 'admin123',
          'admin@kfmart.in': 'admin123',
          delivery: 'delivery123',
          'delivery@kfmart.in': 'delivery123'
        },
        passwordsLastUpdated: Date.now(),
        passwordVersion: 1,
        accountPasswordChangedAt: {},
        coupons: [],
        lastUpdated: Date.now()
      };
      await setDoc(globalStateRef, { ...serverDb, orders: [] });
    }

    // 2. Load dedicated products collection (bypasses 1MB limit & syncs across all devices)
    try {
      const productsSnap = await getDocs(collection(firestoreDb, 'products'));
      if (!productsSnap.empty) {
        const loadedProducts: any[] = [];
        productsSnap.forEach(s => loadedProducts.push(s.data()));
        serverDb.products = loadedProducts;
        console.log(`Successfully loaded ${loadedProducts.length} products from Firestore products collection.`);
      }
    } catch (prodErr) {
      console.error('Error loading Firestore products collection:', prodErr);
    }

    // 3. Load dedicated orders collection (bypasses 1MB limit & syncs across all devices)
    try {
      const ordersSnap = await getDocs(collection(firestoreDb, 'orders'));
      const loadedOrders: any[] = [];
      ordersSnap.forEach(s => loadedOrders.push(s.data()));
      loadedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      serverDb.orders = loadedOrders;
      console.log(`Successfully loaded ${loadedOrders.length} orders from Firestore orders collection.`);
    } catch (orderErr) {
      console.error('Error loading Firestore orders collection:', orderErr);
      // Try loading from local disk file if available
      if (fs.existsSync(DB_FILE)) {
        try {
          const fileData = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
          if (Array.isArray(fileData.orders)) {
            serverDb.orders = fileData.orders;
          }
        } catch (e) {}
      }
    }
    
    // 4. Listen for global state changes from other containers or clients
    onSnapshot(globalStateRef, (docSnap) => {
      if (docSnap.exists()) {
        const d = docSnap.data() as any;
        serverDb.vendors = d.vendors || serverDb.vendors;
        serverDb.deliveryExecutives = d.deliveryExecutives || serverDb.deliveryExecutives;
        serverDb.passwords = d.passwords || serverDb.passwords;
        serverDb.passwordsLastUpdated = d.passwordsLastUpdated || serverDb.passwordsLastUpdated;
        serverDb.passwordVersion = d.passwordVersion || serverDb.passwordVersion;
        serverDb.accountPasswordChangedAt = d.accountPasswordChangedAt || serverDb.accountPasswordChangedAt;
        serverDb.coupons = d.coupons || serverDb.coupons;
        serverDb.lastUpdated = d.lastUpdated || Date.now();
      }
    });

    // 5. Listen for real-time products additions & updates across all devices
    onSnapshot(collection(firestoreDb, 'products'), (colSnap) => {
      if (!colSnap.empty) {
        const liveProducts: any[] = [];
        colSnap.forEach(s => liveProducts.push(s.data()));
        serverDb.products = liveProducts;
      }
    });

    // 6. Listen for real-time order creations & updates across all devices
    onSnapshot(collection(firestoreDb, 'orders'), (colSnap) => {
      const liveOrders: any[] = [];
      colSnap.forEach(s => liveOrders.push(s.data()));
      liveOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      serverDb.orders = liveOrders;
    });

  } catch (err) {
    console.error('Error loading Firestore database:', err);
  }
}

// Save database to disk and Firestore
function saveDatabase() {
  try {
    serverDb.lastUpdated = Date.now();
    // 1. Save snapshot to local disk
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(serverDb, null, 2), 'utf-8');
    } catch (diskErr) {
      console.warn('Disk save warning:', diskErr);
    }

    // 2. Save global metadata to Firestore WITHOUT heavy products & orders arrays (to prevent 1MB overflow)
    const statePayload = {
      vendors: serverDb.vendors || [],
      deliveryExecutives: serverDb.deliveryExecutives || [],
      passwords: serverDb.passwords || {},
      passwordsLastUpdated: serverDb.passwordsLastUpdated || Date.now(),
      passwordVersion: serverDb.passwordVersion || 1,
      accountPasswordChangedAt: serverDb.accountPasswordChangedAt || {},
      coupons: serverDb.coupons || [],
      lastUpdated: Date.now(),
      products: [], // Products stored in dedicated collection products/{id}
      orders: []    // Orders stored in dedicated collection orders/{id}
    };
    setDoc(globalStateRef, statePayload).catch(err => console.error('Firestore save error:', err));
  } catch (err) {
    console.error('Error saving Firestore:', err);
  }
}

loadDatabase();

// ==================== API ROUTES ====================

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), totalProducts: serverDb.products?.length || 0 });
});

// 2. Fetch full global synchronized state (for all devices)
app.get('/api/state', (req, res) => {
  // Set cache prevention headers
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  res.json({
    success: true,
    data: {
      products: serverDb.products || [],
      vendors: serverDb.vendors || [],
      deliveryExecutives: serverDb.deliveryExecutives || [],
      orders: serverDb.orders || [],
      passwords: serverDb.passwords || {},
      passwordsLastUpdated: serverDb.passwordsLastUpdated || Date.now(),
      passwordVersion: serverDb.passwordVersion || 1,
      accountPasswordChangedAt: serverDb.accountPasswordChangedAt || {},
      coupons: serverDb.coupons || [],
      lastUpdated: serverDb.lastUpdated || Date.now()
    }
  });
});

// 3. Full sync / backup endpoint from client
app.post('/api/sync', (req, res) => {
  const { products, vendors, deliveryExecutives, orders, coupons } = req.body;
  
  if (Array.isArray(products) && products.length > 0) {
    serverDb.products = products;
    products.forEach(p => {
      setDoc(doc(firestoreDb, 'products', p.id), p).catch(() => {});
    });
  }
  if (Array.isArray(vendors) && vendors.length > 0) {
    serverDb.vendors = vendors;
  }
  if (Array.isArray(deliveryExecutives) && deliveryExecutives.length > 0) {
    serverDb.deliveryExecutives = deliveryExecutives;
  }
  if (Array.isArray(orders)) {
    serverDb.orders = orders;
  }
  if (Array.isArray(coupons)) {
    serverDb.coupons = coupons;
  }

  saveDatabase();
  res.json({ success: true, message: 'Synchronized across all devices', lastUpdated: serverDb.lastUpdated });
});

// 4. Products APIs
app.post('/api/products/add', (req, res) => {
  const newProduct = req.body;
  if (!newProduct || !newProduct.name) {
    return res.status(400).json({ success: false, message: 'Invalid product data' });
  }

  if (!serverDb.products) serverDb.products = [];
  serverDb.products = [newProduct, ...serverDb.products.filter(p => p.id !== newProduct.id)];
  saveDatabase();

  setDoc(doc(firestoreDb, 'products', newProduct.id), newProduct).catch(err => {
    console.warn('Firestore product add warning:', err);
  });

  res.json({ success: true, product: newProduct, total: serverDb.products.length });
});

app.post('/api/products/delete', (req, res) => {
  const { id } = req.body;
  if (serverDb.products) {
    serverDb.products = serverDb.products.filter(p => p.id !== id);
    saveDatabase();
  }
  deleteDoc(doc(firestoreDb, 'products', id)).catch(err => {
    console.warn('Firestore product delete warning:', err);
  });
  res.json({ success: true, message: 'Product deleted from global catalog' });
});

// 5. Vendor APIs (Registration, Approval, Rejection)
app.post('/api/vendors/register', (req, res) => {
  const newVendor = req.body;
  if (!newVendor || !newVendor.id) {
    return res.status(400).json({ success: false, message: 'Invalid vendor data' });
  }

  if (!serverDb.vendors) serverDb.vendors = [];
  // Remove duplicate if exists
  serverDb.vendors = [newVendor, ...serverDb.vendors.filter(v => v.id !== newVendor.id)];
  saveDatabase();

  res.json({ success: true, vendor: newVendor, total: serverDb.vendors.length });
});

app.post('/api/vendors/approve', (req, res) => {
  const { vendorId } = req.body;
  if (serverDb.vendors) {
    serverDb.vendors = serverDb.vendors.map(v => v.id === vendorId ? { ...v, status: 'Approved' } : v);
    saveDatabase();
  }
  res.json({ success: true, message: 'Vendor approved globally' });
});

app.post('/api/vendors/reject', (req, res) => {
  const { vendorId } = req.body;
  if (serverDb.vendors) {
    serverDb.vendors = serverDb.vendors.map(v => v.id === vendorId ? { ...v, status: 'Rejected' } : v);
    saveDatabase();
  }
  res.json({ success: true, message: 'Vendor rejected globally' });
});

app.post('/api/vendors/delete', (req, res) => {
  const { vendorId } = req.body;
  if (serverDb.vendors) {
    serverDb.vendors = serverDb.vendors.filter(v => v.id !== vendorId);
    saveDatabase();
  }
  res.json({ success: true, message: 'Vendor removed globally' });
});

app.post('/api/vendors/approve-all', (req, res) => {
  if (serverDb.vendors) {
    serverDb.vendors = serverDb.vendors.map(v => ({ ...v, status: 'Approved' }));
    saveDatabase();
  }
  res.json({ success: true, message: 'All pending vendors approved successfully' });
});

// 6. Delivery Fleet APIs
app.post('/api/delivery/register', (req, res) => {
  const newRider = req.body;
  if (!newRider || !newRider.id) {
    return res.status(400).json({ success: false, message: 'Invalid delivery partner data' });
  }
  if (!serverDb.deliveryExecutives) serverDb.deliveryExecutives = [];
  serverDb.deliveryExecutives = [newRider, ...serverDb.deliveryExecutives.filter(d => d.id !== newRider.id)];
  saveDatabase();
  res.json({ success: true, rider: newRider, total: serverDb.deliveryExecutives.length });
});

app.post('/api/delivery/delete', (req, res) => {
  const { execId } = req.body;
  if (serverDb.deliveryExecutives) {
    serverDb.deliveryExecutives = serverDb.deliveryExecutives.filter(d => d.id !== execId);
    saveDatabase();
  }
  res.json({ success: true, message: 'Delivery partner removed globally' });
});

// 7. Orders APIs
app.get('/api/orders', async (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  try {
    const ordersSnap = await getDocs(collection(firestoreDb, 'orders'));
    const list: any[] = [];
    ordersSnap.forEach(s => list.push(s.data()));
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    serverDb.orders = list;
    return res.json({ success: true, orders: list });
  } catch (err) {
    return res.json({ success: true, orders: serverDb.orders || [] });
  }
});

app.post('/api/orders/create', async (req, res) => {
  const newOrder = req.body;
  if (!newOrder || !newOrder.id) {
    return res.status(400).json({ success: false, message: 'Invalid order data' });
  }

  if (!serverDb.orders) serverDb.orders = [];
  // Ensure no duplicate
  serverDb.orders = [newOrder, ...serverDb.orders.filter(o => o.id !== newOrder.id)];

  // 1. Persist directly to dedicated orders collection in Firestore
  try {
    const orderDocRef = doc(firestoreDb, 'orders', newOrder.id);
    await setDoc(orderDocRef, newOrder);
  } catch (err) {
    console.error('Error saving order to Firestore orders collection:', err);
  }

  // 2. Persist to disk and state
  saveDatabase();

  res.json({ success: true, order: newOrder, total: serverDb.orders.length });
});

app.post('/api/orders/reset', async (req, res) => {
  serverDb.orders = [];
  try {
    const ordersSnap = await getDocs(collection(firestoreDb, 'orders'));
    for (const d of ordersSnap.docs) {
      await deleteDoc(d.ref);
    }
  } catch (err) {
    console.error('Error resetting orders collection in Firestore:', err);
  }
  saveDatabase();
  res.json({ success: true, message: 'Orders reset to 0 across all devices', total: 0 });
});

app.post('/api/orders/update-status', async (req, res) => {
  const { orderId, status, note, timeline } = req.body;
  let updatedOrder: any = null;
  if (serverDb.orders) {
    serverDb.orders = serverDb.orders.map(o => {
      if (o.id === orderId) {
        const updatedTimeline = timeline || [
          ...(o.timeline || []),
          { status, timestamp: new Date().toISOString(), note: note || `Order marked as ${status}` }
        ];
        updatedOrder = {
          ...o,
          status,
          deliveredAt: status === 'Delivered' ? (o.deliveredAt || new Date().toISOString()) : o.deliveredAt,
          timeline: updatedTimeline
        };
        return updatedOrder;
      }
      return o;
    });
  }

  if (updatedOrder) {
    try {
      const orderDocRef = doc(firestoreDb, 'orders', orderId);
      await setDoc(orderDocRef, updatedOrder, { merge: true });
    } catch (err) {
      console.error('Error updating order in Firestore:', err);
    }
  }

  saveDatabase();
  res.json({ success: true, message: 'Order status updated globally' });
});

app.post('/api/orders/cancel', async (req, res) => {
  const { orderId, reason } = req.body;
  if (!orderId) {
    return res.status(400).json({ success: false, message: 'Order ID is required' });
  }

  let updatedOrder: any = null;
  if (serverDb.orders) {
    serverDb.orders = serverDb.orders.map(o => {
      if (o.id === orderId) {
        const updatedTimeline = [
          ...(o.timeline || []),
          { status: 'Cancelled', timestamp: new Date().toISOString(), note: reason || 'Order cancelled by customer' }
        ];
        updatedOrder = {
          ...o,
          status: 'Cancelled',
          paymentStatus: o.paymentMethod !== 'COD' ? 'Refunded' : o.paymentStatus,
          cancelledAt: new Date().toISOString(),
          cancellationReason: reason || 'Order cancelled by customer',
          timeline: updatedTimeline
        };
        return updatedOrder;
      }
      return o;
    });
  }

  if (updatedOrder) {
    try {
      const orderDocRef = doc(firestoreDb, 'orders', orderId);
      await setDoc(orderDocRef, updatedOrder, { merge: true });
    } catch (err) {
      console.error('Error cancelling order in Firestore:', err);
    }
  }

  saveDatabase();
  res.json({ success: true, message: 'Order cancelled successfully and synchronized globally' });
});

// 7. Password Management & Authoritative Authentication API - Strictly Enforced Globally
function getAuthoritativePassword(identifier: string, role?: string): string {
  const key = (identifier || '').trim().toLowerCase();
  const baseKey = key.split('@')[0];
  const r = (role || '').trim().toLowerCase();

  // 1. Direct match in serverDb.passwords
  if (serverDb.passwords && serverDb.passwords[key]) return serverDb.passwords[key];
  if (serverDb.passwords && serverDb.passwords[baseKey]) return serverDb.passwords[baseKey];

  // 2. Check vendor match
  if (
    r === 'vendor' || 
    key.startsWith('v-') || 
    key.startsWith('v1') || 
    key.startsWith('v2') || 
    key.startsWith('v3') || 
    key.includes('vendor') || 
    serverDb.vendors?.some(v => 
      v.id.toLowerCase() === key || 
      v.email?.toLowerCase() === key || 
      v.phone?.replace(/\s+/g, '') === key.replace(/\s+/g, '')
    )
  ) {
    return serverDb.passwords?.['vendor'] || serverDb.passwords?.['vendor@kfmart.in'] || 'vendor123';
  }

  // 3. Check admin match
  if (r === 'admin' || key.includes('admin') || key.includes('superadmin')) {
    return serverDb.passwords?.['admin'] || serverDb.passwords?.['admin@kfmart.in'] || 'admin123';
  }

  // 4. Check delivery match
  if (
    r === 'delivery' || 
    key.startsWith('del-') || 
    key.startsWith('del1') || 
    key.includes('delivery') || 
    serverDb.deliveryExecutives?.some(d => 
      d.id.toLowerCase() === key || 
      d.phone?.replace(/\s+/g, '') === key.replace(/\s+/g, '') ||
      d.email?.toLowerCase() === key
    )
  ) {
    return serverDb.passwords?.['delivery'] || serverDb.passwords?.['delivery@kfmart.in'] || 'delivery123';
  }

  // 5. Default to customer
  return serverDb.passwords?.['customer'] || serverDb.passwords?.['customer@kfmart.in'] || 'customer123';
}

function updateAuthoritativePassword(identifier: string, role: string | undefined, newPass: string) {
  if (!serverDb.passwords) serverDb.passwords = {};
  if (!serverDb.accountPasswordChangedAt) serverDb.accountPasswordChangedAt = {};

  const key = (identifier || '').trim().toLowerCase();
  const trimmed = newPass.trim();
  const now = Date.now();

  if (key) {
    serverDb.passwords[key] = trimmed;
    serverDb.accountPasswordChangedAt[key] = now;
    
    // Also update base key if it's an email
    const baseKey = key.split('@')[0];
    if (baseKey && baseKey !== key) {
      serverDb.passwords[baseKey] = trimmed;
      serverDb.accountPasswordChangedAt[baseKey] = now;
    }
  }

  serverDb.passwordsLastUpdated = now;
  serverDb.passwordVersion = (serverDb.passwordVersion || 1) + 1;
  saveDatabase();
}

// Authoritative Auth Verification endpoint (Zero-cache, real-time against database)
app.post('/api/auth/verify', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  const { identifier, role, password } = req.body;
  if (!password) {
    return res.status(400).json({ success: false, valid: false, message: 'Password is required' });
  }

  const expectedPass = getAuthoritativePassword(identifier || role || '', role);
  const isValid = password.trim() === expectedPass.trim();

  if (isValid) {
    const sessionToken = `kf_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    res.json({
      success: true,
      valid: true,
      role: role || 'customer',
      sessionToken,
      authTimestamp: Date.now(),
      passwordVersion: serverDb.passwordVersion || 1,
      passwordsLastUpdated: serverDb.passwordsLastUpdated || Date.now(),
      passwords: serverDb.passwords,
      message: 'Authentication successful'
    });
  } else {
    res.status(401).json({
      success: false,
      valid: false,
      passwords: serverDb.passwords,
      message: 'Incorrect password entered. Please enter your valid active password.'
    });
  }
});

// Authoritative Password Update endpoint (Immediate global sync & session invalidation)
app.post('/api/passwords/update', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  const { identifier, role, password, oldPassword } = req.body;
  if (!password || password.trim().length < 4) {
    return res.status(400).json({ success: false, message: 'New password must be at least 4 characters long' });
  }

  const targetId = identifier || role || 'customer';

  // If oldPassword is provided, verify it first against authoritative server records
  if (oldPassword) {
    const activePass = getAuthoritativePassword(targetId, role);
    if (oldPassword.trim() !== activePass.trim()) {
      return res.status(400).json({ success: false, message: 'Current (old) password does not match server records' });
    }
  }

  updateAuthoritativePassword(targetId, role, password);

  res.json({ 
    success: true, 
    message: 'Password updated globally and strictly enforced across all devices',
    passwords: serverDb.passwords,
    passwordsLastUpdated: serverDb.passwordsLastUpdated,
    passwordVersion: serverDb.passwordVersion,
    accountPasswordChangedAt: serverDb.accountPasswordChangedAt
  });
});

// Reset all passwords to system default endpoint
app.post('/api/passwords/reset', (req, res) => {
  const now = Date.now();
  serverDb.passwords = {
    customer: 'customer123',
    'customer@kfmart.in': 'customer123',
    user: 'customer123',
    'user@kfmart.in': 'customer123',
    vendor: 'vendor123',
    'vendor@kfmart.in': 'vendor123',
    admin: 'admin123',
    'admin@kfmart.in': 'admin123',
    superadmin: 'admin123',
    'superadmin@kfmart.in': 'admin123',
    delivery: 'delivery123',
    'delivery@kfmart.in': 'delivery123'
  };
  serverDb.passwordsLastUpdated = now;
  serverDb.passwordVersion = (serverDb.passwordVersion || 1) + 1;
  serverDb.accountPasswordChangedAt = {
    customer: now,
    vendor: now,
    admin: now,
    delivery: now
  };
  saveDatabase();
  res.json({
    success: true,
    message: 'All passwords have been reset to default configuration',
    passwords: serverDb.passwords,
    passwordsLastUpdated: serverDb.passwordsLastUpdated,
    passwordVersion: serverDb.passwordVersion
  });
});

// 8. Razorpay / UPI Intent Link Generator API
app.post('/api/payment/create-upi-intent', (req, res) => {
  const { amount, orderId, customerName } = req.body;
  const grandTotal = Number(amount) || 1;
  const payeeVPA = '9161772664@ptyes';
  const payeeName = 'Mr Mohd Faishal';
  const note = `KF-MART-${orderId || Date.now().toString().slice(-6)}`;

  // Universal UPI Intent URI standard (opens any UPI app on phone)
  const universalUri = `upi://pay?pa=${encodeURIComponent(payeeVPA)}&pn=${encodeURIComponent(payeeName)}&am=${grandTotal.toFixed(2)}&cu=INR&tn=${encodeURIComponent(note)}`;
  
  // Specific App deep link URIs
  const gpayUri = `tez://upi/pay?pa=${encodeURIComponent(payeeVPA)}&pn=${encodeURIComponent(payeeName)}&am=${grandTotal.toFixed(2)}&cu=INR&tn=${encodeURIComponent(note)}`;
  const phonepeUri = `phonepe://pay?pa=${encodeURIComponent(payeeVPA)}&pn=${encodeURIComponent(payeeName)}&am=${grandTotal.toFixed(2)}&cu=INR&tn=${encodeURIComponent(note)}`;
  const paytmUri = `paytmmp://pay?pa=${encodeURIComponent(payeeVPA)}&pn=${encodeURIComponent(payeeName)}&am=${grandTotal.toFixed(2)}&cu=INR&tn=${encodeURIComponent(note)}`;
  const credUri = `cred://upi/pay?pa=${encodeURIComponent(payeeVPA)}&pn=${encodeURIComponent(payeeName)}&am=${grandTotal.toFixed(2)}&cu=INR&tn=${encodeURIComponent(note)}`;

  res.json({
    success: true,
    payeeVPA,
    payeeName,
    amount: grandTotal,
    note,
    universalUri,
    apps: {
      gpay: gpayUri,
      phonepe: phonepeUri,
      paytm: paytmUri,
      cred: credUri
    },
    razorpayConfig: {
      key: 'rzp_test_KFMART2026',
      name: 'KF Mart Hyperlocal',
      description: `Order #${orderId || 'NEW'} - Express Delivery`,
      amount: grandTotal * 100, // paise
      currency: 'INR',
      prefill: {
        name: customerName || 'Customer',
        contact: '9161772664'
      }
    }
  });
});

// ==================== VITE MIDDLEWARE / STATIC ASSETS ====================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`KF Mart Full-Stack Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
