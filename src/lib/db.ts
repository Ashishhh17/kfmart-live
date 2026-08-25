import { db } from './firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

const GLOBAL_DOC_ID = 'global';

// Using a single document for global state for drop-in replacement of db.json
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
      console.warn('Firestore subscription fallback:', err.message);
      // If client firestore listener encounters an issue, fallback to API
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
    await setDoc(ref, updates, { merge: true });
  } catch (err) {
    console.warn('Direct Firestore update warning:', err);
  }
};

