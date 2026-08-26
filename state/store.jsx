'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { appReducer, loadInitialState, STORAGE_KEY } from './reducer.js';

export { appReducer, loadInitialState };

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, null, loadInitialState);

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
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
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
