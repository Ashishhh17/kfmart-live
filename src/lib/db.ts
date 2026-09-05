import { db } from './firebase';
import { doc, setDoc, onSnapshot, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { Order, Product } from '../types';

const GLOBAL_DOC_ID = 'global';

// Safe LocalStorage helper to prevent browser QuotaExceededError
export const safeSetLocalStorage = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch (err: any) {
    if (err?.name === 'QuotaExceededError' || err?.code === 22) {
      console.warn('LocalStorage quota exceeded. Evicting temporary caches:', key);
      try {
        // Clear cached orders or big keys to free quota
        localStorage.removeItem('kfmart_orders');
        localStorage.removeItem('kfmart_cart');
        localStorage.setItem(key, value);
      } catch (innerErr) {
        console.warn('Unable to write to localStorage even after clearing cache:', innerErr);
      }
    }
  }
};

// ==================== GLOBAL METADATA STATE ====================
// Holds lightweight metadata (vendors, delivery fleet, settings, passwords) ~5KB total
export const getGlobalDocRef = () => doc(db, 'state', GLOBAL_DOC_ID);

export const subscribeToGlobalState = (callback: (data: any) => void) => {
  return onSnapshot(
    getGlobalDocRef(), 
    (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data());
      } else {
        callback(null);
      }
    },
    (err) => {
      console.warn('Firestore global state subscription fallback:', err.message);
      fetch('/api/state')
        .then(r => r.json())
        .then(res => {
          if (res.success && res.data) {
            callback(res.data);
          }
        })
        .catch(() => {});
    }
  );
};

export const updateGlobalState = async (updates: any) => {
  try {
    const ref = getGlobalDocRef();
    // Exclude products and orders arrays from global state doc to prevent 1MB overflow!
    const sanitized = { ...updates };
    delete sanitized.products;
    delete sanitized.orders;
    await setDoc(ref, sanitized, { merge: true });
  } catch (err) {
    console.warn('Direct Firestore update warning:', err);
  }
};

// ==================== DEDICATED REAL-TIME PRODUCTS COLLECTION ====================
// Each product is stored in its own document (products/{id}) to guarantee zero size overflow!

export const subscribeToProducts = (callback: (products: Product[]) => void) => {
  return onSnapshot(
    collection(db, 'products'),
    (snapshot) => {
      const productsList: Product[] = [];
      snapshot.forEach(docSnap => {
        productsList.push(docSnap.data() as Product);
      });
      callback(productsList);
    },
    (err) => {
      console.warn('Firestore products subscription fallback:', err.message);
      fetch('/api/state')
        .then(r => r.json())
        .then(res => {
          if (res.success && res.data && Array.isArray(res.data.products)) {
            callback(res.data.products);
          }
        })
        .catch(() => {});
    }
  );
};

export const saveProductToFirestore = async (product: Product) => {
  try {
    const ref = doc(db, 'products', product.id);
    await setDoc(ref, product);
  } catch (err) {
    console.warn('Direct Firestore saveProduct warning:', err);
  }
};

export const deleteProductFromFirestore = async (productId: string) => {
  try {
    const ref = doc(db, 'products', productId);
    await deleteDoc(ref);
  } catch (err) {
    console.warn('Direct Firestore deleteProduct warning:', err);
  }
};

// ==================== DEDICATED REAL-TIME ORDERS COLLECTION ====================
// This avoids the 1MB Firestore document limit of state/global and enables instant cross-phone sync!

export const subscribeToOrders = (callback: (orders: Order[]) => void) => {
  return onSnapshot(
    collection(db, 'orders'),
    (snapshot) => {
      const ordersList: Order[] = [];
      snapshot.forEach(docSnap => {
        ordersList.push(docSnap.data() as Order);
      });
      // Sort newest first
      ordersList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(ordersList);
    },
    (err) => {
      console.warn('Firestore orders collection subscription fallback:', err.message);
      // Fallback to API endpoint
      fetch('/api/orders')
        .then(r => r.json())
        .then(res => {
          if (res.success && Array.isArray(res.orders)) {
            callback(res.orders);
          }
        })
        .catch(() => {});
    }
  );
};

export const fetchOrdersFromFirestore = async (): Promise<Order[]> => {
  try {
    const snap = await getDocs(collection(db, 'orders'));
    const list: Order[] = [];
    snap.forEach(d => list.push(d.data() as Order));
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list;
  } catch (err) {
    console.warn('Error fetching orders from Firestore:', err);
    return [];
  }
};

export const saveOrderToFirestore = async (order: Order) => {
  try {
    const orderRef = doc(db, 'orders', order.id);
    await setDoc(orderRef, order);
  } catch (err) {
    console.warn('Direct Firestore saveOrder warning:', err);
  }
};

export const updateOrderInFirestore = async (orderId: string, updates: Partial<Order>) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await setDoc(orderRef, updates, { merge: true });
  } catch (err) {
    console.warn('Direct Firestore updateOrder warning:', err);
  }
};

export const deleteOrderFromFirestore = async (orderId: string) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await deleteDoc(orderRef);
  } catch (err) {
    console.warn('Direct Firestore deleteOrder warning:', err);
  }
};


