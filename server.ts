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

app.post('/api/orders/assign-delivery', async (req, res) => {
  const { orderId, deliveryPartnerId, courierPartner } = req.body;
  if (!orderId || !deliveryPartnerId) {
    return res.status(400).json({ success: false, message: 'Order ID and Delivery Partner ID are required' });
  }

  let assignedOrder: any = null;
  if (serverDb.orders) {
    serverDb.orders = serverDb.orders.map(o => {
      if (o.id === orderId) {
        assignedOrder = {
          ...o,
          deliveryPartnerId,
          courierPartner: courierPartner || o.courierPartner || 'KF Mart Express Rider'
        };
        return assignedOrder;
      }
      return o;
    });
    saveDatabase();
  }

  try {
    const orderDocRef = doc(firestoreDb, 'orders', orderId);
    await setDoc(orderDocRef, { 
      deliveryPartnerId, 
      courierPartner: courierPartner || (assignedOrder ? assignedOrder.courierPartner : 'KF Mart Express Rider')
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore assign delivery error:', err);
  }

  res.json({ success: true, message: 'Delivery partner assigned globally', order: assignedOrder });
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

// 9. Dedicated Invoice & Direct Print Route (100% reliable across browsers, mobile & POS)
app.get(['/invoice/:orderId', '/api/invoice/:orderId'], async (req, res) => {
  const { orderId } = req.params;
  const format = req.query.format === 'standardA4' ? 'standardA4' : 'thermal58';
  const autoPrint = req.query.print === '1' || req.query.print === 'true';

  let order = serverDb.orders?.find(o => o.id === orderId);
  if (!order) {
    try {
      const snap = await getDoc(doc(firestoreDb, 'orders', orderId));
      if (snap.exists()) {
        order = snap.data() as any;
      }
    } catch (e) {
      console.warn('Firestore invoice fetch error:', e);
    }
  }

  if (!order) {
    return res.status(404).send(`
      <!DOCTYPE html>
      <html>
      <head><title>Order Not Found - KF Mart</title><style>body{font-family:sans-serif;text-align:center;padding:50px;color:#334155;}</style></head>
      <body>
        <h2>Order #${orderId} Not Found</h2>
        <p>This order could not be located in KF Mart database.</p>
        <a href="/" style="display:inline-block;margin-top:20px;padding:10px 20px;background:#005723;color:#fff;text-decoration:none;border-radius:8px;">Back to KF Mart</a>
      </body>
      </html>
    `);
  }

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const formattedTime = new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  if (format === 'thermal58') {
    const itemsRows = (order.items || []).map((item: any) => `
      <div style="margin-top:3px;font-size:8px;">
        <div style="font-weight:bold;font-size:8.5px;">${item.product?.name || 'Item'}${item.selectedSize ? ' (' + item.selectedSize + ')' : ''}</div>
        <div style="display:flex;justify-content:space-between;font-size:7.5px;color:#475569;">
          <span style="width:50%;">${item.product?.brand || 'KF Retail'}</span>
          <span style="width:14%;text-align:center;">${item.quantity}</span>
          <span style="width:18%;text-align:right;">₹${item.product?.sellingPrice || 0}</span>
          <span style="width:18%;text-align:right;font-weight:bold;color:#000;">₹${(item.product?.sellingPrice || 0) * item.quantity}</span>
        </div>
      </div>
    `).join('');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>KF-Mart-Receipt-${order.id}</title>
  <style>
    @page { size: 58mm auto; margin: 0; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body { margin: 0; padding: 0; background: #f1f5f9; font-family: "Courier New", Courier, monospace; color: #000; }
    .bill-wrapper { width: 58mm; max-width: 58mm; min-width: 58mm; margin: 0 auto; padding: 3mm 2.5mm; background: #fff; font-size: 9px; line-height: 1.25; }
    .text-center { text-align: center; }
    .border-dashed { border-bottom: 1px dashed #000; padding-bottom: 4px; margin-bottom: 4px; }
    .row { display: flex; justify-content: space-between; margin-bottom: 1px; }
    .no-print-bar { position: sticky; top: 0; background: #005723; color: #fff; padding: 10px; text-align: center; font-family: sans-serif; font-size: 13px; z-index: 1000; }
    .print-btn { background: #fff; color: #005723; border: none; padding: 6px 14px; font-weight: bold; border-radius: 6px; cursor: pointer; margin: 0 5px; font-size: 12px; }
    @media print { body { background: #fff; } .no-print-bar { display: none !important; } .bill-wrapper { margin: 0 !important; padding: 2mm 2.5mm !important; } }
  </style>
</head>
<body>
  <div class="no-print-bar">
    <span>KF Mart 58mm POS Thermal Bill</span>
    <button class="print-btn" onclick="window.print()">🖨️ Print Slip</button>
    <button class="print-btn" style="background:#e2e8f0;color:#334155;" onclick="window.close()">Close</button>
  </div>
  <div class="bill-wrapper">
    <div class="text-center border-dashed">
      <div style="font-size:13px;font-weight:900;letter-spacing:1px;">*** KF MART ***</div>
      <div style="font-size:8.5px;font-weight:bold;">Lalgopalganj & Kunda Express</div>
      <div style="font-size:7.5px;">Web: kfmart.in • Tel: +91 91617 72664</div>
      <div style="font-size:8px;font-weight:900;text-transform:uppercase;margin-top:2px;">RETAIL CASH BILL / INVOICE</div>
    </div>
    <div class="border-dashed" style="font-size:8px;">
      <div class="row"><span>BILL NO:</span><span style="font-weight:bold;">INV-${order.id.replace('ORD-', '')}</span></div>
      <div class="row"><span>DATE:</span><span>${formattedDate} ${formattedTime}</span></div>
      <div class="row"><span>CUSTOMER:</span><span style="font-weight:bold;">${order.customerName}</span></div>
      <div class="row"><span>PHONE:</span><span>${order.customerPhone}</span></div>
      <div style="font-size:7.5px;margin-top:1px;">ADDR: ${order.shippingAddress?.street}, ${order.shippingAddress?.city} (${order.shippingAddress?.pincode})</div>
      <div class="row" style="font-weight:bold;margin-top:2px;"><span>PAY MODE:</span><span>${order.paymentMethod} (${order.paymentStatus})</span></div>
      ${order.deliveryOTP ? `<div style="background:#000;color:#fff;padding:2px 4px;font-weight:bold;display:flex;justify-content:space-between;margin:3px 0;border-radius:2px;"><span>DELIVERY OTP:</span><span>${order.deliveryOTP}</span></div>` : ''}
    </div>
    <div class="border-dashed">
      <div style="display:flex;font-weight:bold;border-bottom:1px solid #000;padding-bottom:2px;font-size:7.5px;">
        <span style="width:50%;">ITEM</span>
        <span style="width:14%;text-align:center;">QTY</span>
        <span style="width:18%;text-align:right;">RATE</span>
        <span style="width:18%;text-align:right;">AMT</span>
      </div>
      ${itemsRows}
    </div>
    <div class="border-dashed" style="font-size:8px;">
      <div class="row"><span>SUBTOTAL:</span><span>₹${order.subtotal}</span></div>
      ${order.discountAmount > 0 ? `<div class="row" style="color:#005723;font-weight:bold;"><span>DISCOUNT:</span><span>-₹${order.discountAmount}</span></div>` : ''}
      <div class="row"><span>SHIPPING:</span><span>${order.shippingFee === 0 ? 'FREE' : '₹' + order.shippingFee}</span></div>
      <div class="row" style="font-size:10px;font-weight:900;border-top:1px solid #000;padding-top:4px;margin-top:4px;">
        <span>NET TOTAL:</span><span>₹${order.totalAmount}</span>
      </div>
    </div>
    <div style="font-size:7px;text-align:center;line-height:1.2;margin-top:4px;">
      <div style="font-family:monospace;letter-spacing:2px;background:#eee;padding:3px;font-weight:bold;margin:4px 0;font-size:8px;">||| ${order.shipmentTrackingNumber || order.id} |||</div>
      <div style="font-weight:bold;font-size:8px;">*** THANK YOU FOR SHOPPING! ***</div>
      <div>Easy 24-Hour Return / Exchange Available</div>
      <div>WhatsApp Support: +91 91617 72664</div>
      <div style="font-size:6.5px;color:#64748b;margin-top:2px;">Computer-generated slip • Valid without physical signature</div>
    </div>
  </div>
  ${autoPrint ? `<script>window.addEventListener('load',function(){setTimeout(function(){window.focus();window.print();},300);});</script>` : ''}
</body>
</html>`;
    return res.send(html);
  }

  // Standard A4
  const a4Items = (order.items || []).map((item: any) => `
    <tr>
      <td style="padding:10px;border-bottom:1px solid #e2e8f0;">
        <div style="font-weight:700;color:#0f172a;">${item.product?.name || 'Item'}${item.selectedSize ? ' (Size: ' + item.selectedSize + ')' : ''}</div>
        <div style="font-size:10px;color:#64748b;">${item.product?.brand || 'KF Retail'} • ${item.product?.category || ''}</div>
      </td>
      <td style="padding:10px;border-bottom:1px solid #e2e8f0;text-align:center;font-weight:bold;">${item.quantity}</td>
      <td style="padding:10px;border-bottom:1px solid #e2e8f0;text-align:right;">₹${item.product?.sellingPrice || 0}</td>
      <td style="padding:10px;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:800;">₹${(item.product?.sellingPrice || 0) * item.quantity}</td>
    </tr>
  `).join('');

  const a4Html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>KF-Mart-Tax-Invoice-${order.id}</title>
  <style>
    @page { size: A4; margin: 10mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body { margin: 0; padding: 0; background: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 12px; color: #1e293b; }
    .invoice-card { max-width: 210mm; margin: 20px auto; padding: 20mm 15mm; background: #fff; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border-radius: 8px; }
    .header-row { display: flex; justify-content: space-between; border-bottom: 2px solid #005723; padding-bottom: 15px; margin-bottom: 20px; }
    .no-print-bar { position: sticky; top: 0; background: #005723; color: #fff; padding: 12px; text-align: center; font-size: 14px; z-index: 1000; }
    .print-btn { background: #fff; color: #005723; border: none; padding: 7px 16px; font-weight: bold; border-radius: 6px; cursor: pointer; margin: 0 6px; font-size: 13px; }
    @media print { body { background: #fff; } .no-print-bar { display: none !important; } .invoice-card { margin: 0 !important; padding: 0 !important; box-shadow: none !important; } }
  </style>
</head>
<body>
  <div class="no-print-bar">
    <span>KF Mart Tax Invoice (A4 View)</span>
    <button class="print-btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
    <button class="print-btn" style="background:#e2e8f0;color:#334155;" onclick="window.close()">Close</button>
  </div>
  <div class="invoice-card">
    <div class="header-row">
      <div>
        <h1 style="font-size:22px;font-weight:900;color:#005723;margin:0;">KF MART</h1>
        <div style="font-size:11px;font-weight:bold;color:#64748b;">KF Mart Retail Private Limited</div>
        <div style="font-size:11px;color:#64748b;">Website: <strong>kfmart.in</strong> • Tel: +91 91617 72664</div>
        <div style="font-size:11px;color:#64748b;">Lalgopalganj, Prayagraj / Pratapgarh, UP</div>
      </div>
      <div style="text-align:right;">
        <span style="background:#005723;color:#fff;font-size:11px;font-weight:bold;padding:3px 10px;border-radius:4px;">TAX INVOICE</span>
        <div style="font-weight:800;font-size:13px;margin-top:4px;">Invoice #: INV-${order.id}</div>
        <div style="color:#64748b;font-size:11px;">Date: ${formattedDate}</div>
        <div style="color:#005723;font-weight:bold;font-size:11px;margin-top:2px;">Status: ${(order.paymentStatus || '').toUpperCase()} (${order.paymentMethod})</div>
        ${order.deliveryOTP ? `<div style="display:inline-block;background:#ecfdf5;color:#065f46;border:1px solid #a7f3d0;padding:2px 8px;border-radius:4px;font-weight:bold;font-size:11px;margin-top:4px;">Delivery OTP: ${order.deliveryOTP}</div>` : ''}
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;background:#f8fafc;padding:15px;border-radius:8px;border:1px solid #e2e8f0;margin-bottom:20px;">
      <div>
        <div style="font-size:10px;font-weight:bold;color:#94a3b8;text-transform:uppercase;">Billed & Shipped To:</div>
        <div style="font-weight:bold;color:#0f172a;margin-top:4px;">${order.shippingAddress?.fullName}</div>
        <div style="color:#334155;">${order.shippingAddress?.street}</div>
        <div style="color:#334155;">${order.shippingAddress?.city}, ${order.shippingAddress?.state} - <strong>${order.shippingAddress?.pincode}</strong></div>
        <div style="color:#334155;margin-top:2px;">Phone: <strong>${order.customerPhone}</strong></div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:10px;font-weight:bold;color:#94a3b8;text-transform:uppercase;">Dispatch & Logistics:</div>
        <div style="color:#334155;margin-top:4px;">Order ID: <strong>#${order.id}</strong></div>
        <div style="color:#334155;">Courier: <strong>${order.courierPartner || 'KF Express Logistics'}</strong></div>
        <div style="color:#334155;">Tracking No: <strong>${order.shipmentTrackingNumber || order.id}</strong></div>
        <div style="color:#334155;">Delivery Mode: <strong>${order.estimatedDeliveryTime || '24h Express'}</strong></div>
      </div>
    </div>
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
      <thead>
        <tr style="background:#f1f5f9;color:#475569;font-size:11px;text-transform:uppercase;">
          <th style="padding:10px;text-align:left;border-bottom:2px solid #cbd5e1;">Item Description</th>
          <th style="padding:10px;text-align:center;width:60px;border-bottom:2px solid #cbd5e1;">Qty</th>
          <th style="padding:10px;text-align:right;width:100px;border-bottom:2px solid #cbd5e1;">Unit Price</th>
          <th style="padding:10px;text-align:right;width:110px;border-bottom:2px solid #cbd5e1;">Total</th>
        </tr>
      </thead>
      <tbody>${a4Items}</tbody>
    </table>
    <div style="margin-left:auto;width:280px;">
      <div style="display:flex;justify-content:space-between;padding:4px 0;color:#475569;"><span>Subtotal:</span><span style="font-weight:600;color:#0f172a;">₹${order.subtotal}</span></div>
      ${order.discountAmount > 0 ? `<div style="display:flex;justify-content:space-between;padding:4px 0;color:#059669;font-weight:600;"><span>Promotional Discount:</span><span>-₹${order.discountAmount}</span></div>` : ''}
      <div style="display:flex;justify-content:space-between;padding:4px 0;color:#475569;"><span>Express Delivery:</span><span>${order.shippingFee === 0 ? 'FREE' : '₹' + order.shippingFee}</span></div>
      <div style="display:flex;justify-content:space-between;font-size:15px;font-weight:900;color:#005723;border-top:2px solid #005723;padding-top:8px;margin-top:4px;">
        <span>Grand Total:</span><span>₹${order.totalAmount}</span>
      </div>
    </div>
    <div style="margin-top:30px;padding-top:15px;border-top:1px solid #e2e8f0;text-align:center;font-size:11px;color:#64748b;">
      <div style="font-weight:bold;color:#334155;">KF Mart Retail • Customer Satisfaction Guaranteed</div>
      <div>24-Hour Return & Exchange Policy Applies • WhatsApp Support: +91 91617 72664</div>
      <div style="font-size:9.5px;color:#94a3b8;margin-top:4px;">This is a computer-generated tax invoice issued by KF Mart Retail Private Limited.</div>
    </div>
  </div>
  ${autoPrint ? `<script>window.addEventListener('load',function(){setTimeout(function(){window.focus();window.print();},300);});</script>` : ''}
</body>
</html>`;
  return res.send(a4Html);
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
