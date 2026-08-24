const fs = require('fs');

let serverCode = fs.readFileSync('server.ts', 'utf-8');

const imports = `import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';

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
`;

serverCode = serverCode.replace(/import express from 'express';[\s\S]*?import { createServer as createViteServer } from 'vite';/, imports);

const loadDbRegex = /\/\/ Load database from file[\s\S]*?function saveDatabase\(\) {[\s\S]*?console\.error\('Error saving db\.json:', err\);\n  }\n}/;

const newDbLogic = `// Real-time Firestore sync
async function loadDatabase() {
  try {
    const snap = await getDoc(globalStateRef);
    if (snap.exists()) {
      serverDb = snap.data() as any;
      console.log('Successfully loaded persistent marketplace database from Firestore.');
    } else {
      serverDb = {
        products: [],
        vendors: [],
        deliveryExecutives: [],
        orders: [],
        passwords: {
          customer: 'customer123',
          vendor: 'vendor123',
          admin: 'admin123',
          delivery: 'delivery123'
        },
        passwordsLastUpdated: Date.now(),
        passwordVersion: 1,
        accountPasswordChangedAt: {},
        coupons: [],
        lastUpdated: Date.now()
      };
      await setDoc(globalStateRef, serverDb);
    }
    
    // Listen for changes from other containers or clients
    onSnapshot(globalStateRef, (docSnap) => {
      if (docSnap.exists()) {
        serverDb = docSnap.data() as any;
      }
    });
  } catch (err) {
    console.error('Error loading Firestore database:', err);
  }
}

// Save database to Firestore
function saveDatabase() {
  try {
    serverDb.lastUpdated = Date.now();
    setDoc(globalStateRef, serverDb).catch(err => console.error('Firestore save error:', err));
  } catch (err) {
    console.error('Error saving Firestore:', err);
  }
}`;

serverCode = serverCode.replace(loadDbRegex, newDbLogic);

fs.writeFileSync('server.ts', serverCode);
console.log('Patched server.ts');
