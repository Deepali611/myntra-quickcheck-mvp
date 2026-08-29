'use client';

import React, { createContext, useContext, useReducer, useEffect, useState, useCallback } from 'react';
import { appReducer, loadInitialState, STORAGE_KEY } from './reducer.js';
import { getProduct } from '../lib/catalog.js';

export { appReducer, loadInitialState };

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, null, loadInitialState);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => prev === msg ? null : prev);
    }, 2500);
  }, []);

  const toggleWishlist = useCallback((productOrId) => {
    if (!productOrId) return false;
    const targetId = typeof productOrId === 'object' ? productOrId?.id : productOrId;
    const rawId = String(targetId).replace(/^wish_/, '');
    const product = typeof productOrId === 'object' ? productOrId : getProduct(rawId);

    const isCurrentlyWishlisted = state?.wishlist?.some(item => 
      String(item.productId).replace(/^wish_/, '') === rawId || 
      String(item.id).replace(/^wish_/, '') === rawId
    );

    dispatch({ type: 'TOGGLE_WISHLIST', payload: product || rawId });

    const brand = product?.brand || 'Product';
    const msg = isCurrentlyWishlisted 
      ? `Removed ${brand} from Wishlist` 
      : `Saved ${brand} to Wishlist`;
      
    showToast(msg);
    return !isCurrentlyWishlisted;
  }, [state?.wishlist, dispatch, showToast]);

  // Sync to sessionStorage safely
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const toSave = {
        wishlist: state.wishlist,
        bag: state.bag,
        cachedWhyLines: state.cachedWhyLines
      };
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (err) {
      // Storage full / blocked -> ignore silently
    }
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch, toggleWishlist, toastMessage, showToast }}>
      {children}
      {/* Global Floating Toast Overlay */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '75px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#282c3f',
          color: '#ffffff',
          padding: '10px 18px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600',
          zIndex: 9999,
          boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none'
        }}>
          {toastMessage}
        </div>
      )}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
}
