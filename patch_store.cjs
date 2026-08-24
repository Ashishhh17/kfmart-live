const fs = require('fs');

let code = fs.readFileSync('src/context/StoreContext.tsx', 'utf-8');

// Add import
code = code.replace(
  "import React, { createContext, useContext, useState, useEffect, useRef } from 'react';",
  "import React, { createContext, useContext, useState, useEffect, useRef } from 'react';\nimport { subscribeToGlobalState } from '../lib/db';"
);

// Replace setInterval with onSnapshot
const fetchGlobalStateDef = /const fetchGlobalState = async \(\) => \{[\s\S]*?\}\n    \};\n\n    fetchGlobalState\(\);\n\n    \/\/ Background polling every 5 seconds that ONLY updates if server timestamp has changed\n    const pollInterval = setInterval\(\(\) => \{\n      fetchGlobalState\(\);\n    \}, 5000\);\n\n    return \(\) => \{\n      isMounted = false;\n      clearInterval\(pollInterval\);\n    \};/;

const replacement = `const unsubscribe = subscribeToGlobalState((data) => {
      if (!isMounted || !data) return;
      
      const serverUpdated = data.lastUpdated || 0;
      
      // Only update local state if server has newer data or if this is the initial load
      if (!isInitialFetchDoneRef.current || serverUpdated > lastSyncTimeRef.current) {
        lastSyncTimeRef.current = serverUpdated;
        isInitialFetchDoneRef.current = true;

        const serverProducts = data.products;
        const serverVendors = data.vendors;
        const serverDelivery = data.deliveryExecutives;
        const serverOrders = data.orders;
        const serverPasswords = data.passwords;
        
        let needsInitialSeed = false;
        let seedData: any = {};

        if (serverProducts && serverProducts.length > 0) {
          setProducts(serverProducts);
        } else {
          needsInitialSeed = true;
          seedData.products = INITIAL_PRODUCTS;
          setProducts(INITIAL_PRODUCTS);
        }
        
        if (serverVendors && serverVendors.length > 0) {
          setVendors(serverVendors);
        } else {
          needsInitialSeed = true;
          seedData.vendors = INITIAL_VENDORS;
          setVendors(INITIAL_VENDORS);
        }
        
        if (serverDelivery && serverDelivery.length > 0) {
          setDeliveryExecutives(serverDelivery);
        } else {
          needsInitialSeed = true;
          seedData.deliveryExecutives = MOCK_DELIVERY_EXECUTIVES;
          setDeliveryExecutives(MOCK_DELIVERY_EXECUTIVES);
        }

        if (Array.isArray(serverOrders) && serverOrders.length > 0) {
          setOrders(serverOrders);
        } else {
          setOrders([]);
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
              if (changedAt > currentSession.timestamp) {
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
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };`;

code = code.replace(fetchGlobalStateDef, replacement);

fs.writeFileSync('src/context/StoreContext.tsx', code);
console.log('Patched StoreContext.tsx');
