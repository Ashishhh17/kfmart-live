import { db } from './firebase';
import { doc, getDoc, setDoc, onSnapshot, collection } from 'firebase/firestore';

const GLOBAL_DOC_ID = 'global_state';

// Using a single document for global state for drop-in replacement of db.json
export const getGlobalDocRef = () => doc(db, 'state', GLOBAL_DOC_ID);

export const subscribeToGlobalState = (callback: (data: any) => void) => {
  return onSnapshot(getGlobalDocRef(), (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    } else {
      callback(null);
    }
  });
};

export const updateGlobalState = async (updates: any) => {
  const ref = getGlobalDocRef();
  await setDoc(ref, updates, { merge: true });
};
