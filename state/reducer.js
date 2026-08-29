import { buildSeedWishlist } from '../data/seedWishlist.js';
import { getProduct } from '../lib/catalog.js';
import { inferPreferredSize } from '../lib/sizing.js';

export const STORAGE_KEY = 'myntra_quickcheck_state_v2';

// Initial state factory with safe storage fallback
export function loadInitialState() {
  const seedWishlist = buildSeedWishlist();
  const defaultState = {
    wishlist: seedWishlist,
    bag: [],
    cachedWhyLines: {},
    toast: null
  };

  if (typeof window === 'undefined') return defaultState;

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.wishlist) && parsed.wishlist.length > 0) {
      // Re-hydrate product references with real scraped catalog
      const rehydratedWishlist = parsed.wishlist.map(item => {
        const freshProduct = getProduct(item.productId);
        return freshProduct ? { ...item, product: freshProduct } : item;
      }).filter(item => item.product);

      return {
        wishlist: rehydratedWishlist.length > 0 ? rehydratedWishlist : seedWishlist,
        bag: Array.isArray(parsed.bag) ? parsed.bag : [],
        cachedWhyLines: parsed.cachedWhyLines || {},
        toast: null
      };
    }
  } catch (err) {
    console.warn('[Storage Warning] sessionStorage blocked or corrupt, falling back to seed state:', err.message);
  }

  return defaultState;
}

// Pure Reducer Function
export function appReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_WISHLIST': {
      const p = action.payload || action.product;
      const targetId = p?.id || action.productId;
      if (!targetId) return state;

      const exists = state.wishlist.some(w => w.productId === targetId || w.id === targetId);
      if (exists) {
        return {
          ...state,
          wishlist: state.wishlist.filter(w => w.id !== targetId && w.productId !== targetId)
        };
      } else {
        const product = getProduct(targetId) || p;
        if (!product) return state;

        const newItem = {
          id: `wish_${product.id}`,
          productId: product.id,
          addedAt: new Date().toISOString(),
          viewCount: 1,
          purchased: false,
          product: product
        };

        return {
          ...state,
          wishlist: [newItem, ...state.wishlist]
        };
      }
    }

    case 'ADD_TO_WISHLIST': {
      const p = action.payload || action.product;
      const targetId = p?.id || action.productId;
      if (!targetId) return state;

      const exists = state.wishlist.some(w => w.productId === targetId || w.id === targetId);
      if (exists) return state;

      const product = getProduct(targetId) || p;
      if (!product) return state;

      const newItem = {
        id: `wish_${product.id}`,
        productId: product.id,
        addedAt: new Date().toISOString(),
        viewCount: 1,
        purchased: false,
        product: product
      };

      return {
        ...state,
        wishlist: [newItem, ...state.wishlist]
      };
    }

    case 'REMOVE_FROM_WISHLIST': {
      const targetId = action.payload || action.productId || action.id;
      return {
        ...state,
        wishlist: state.wishlist.filter(w => w.id !== targetId && w.productId !== targetId)
      };
    }

    case 'INCREMENT_VIEW_COUNT': {
      const targetId = action.payload || action.productId;
      return {
        ...state,
        wishlist: state.wishlist.map(w => {
          if (w.productId === targetId || w.id === targetId) {
            return { ...w, viewCount: (w.viewCount || 0) + 1 };
          }
          return w;
        })
      };
    }

    case 'ADD_TO_BAG': {
      const p = action.payload?.product || action.product || getProduct(action.payload || action.productId);
      const passedSize = action.payload?.size || action.selectedSize;
      const quantity = action.payload?.quantity || action.quantity || 1;

      if (!p) return state;

      let size = passedSize;
      if (!size) {
        size = inferPreferredSize(state.bag, p.department, p.garmentType);
      }

      const existingIdx = state.bag.findIndex(b => (b.productId === p.id || b.id === p.id) && b.selectedSize === size);

      let newBag;
      if (existingIdx >= 0) {
        newBag = state.bag.map((b, idx) => {
          if (idx === existingIdx) {
            return { ...b, quantity: b.quantity + quantity };
          }
          return b;
        });
      } else {
        const newBagItem = {
          id: `bag_${p.id}_${size || 'nosize'}_${Date.now()}`,
          productId: p.id,
          selectedSize: size || 'Standard',
          quantity: quantity,
          addedAt: new Date().toISOString(),
          product: p
        };
        newBag = [newBagItem, ...state.bag];
      }

      return {
        ...state,
        bag: newBag
      };
    }

    case 'REMOVE_FROM_BAG': {
      const targetId = action.payload || action.bagItemId;
      return {
        ...state,
        bag: state.bag.filter((b, idx) => b.id !== targetId && idx !== targetId)
      };
    }

    case 'UPDATE_BAG_QTY':
    case 'UPDATE_BAG_QUANTITY': {
      const targetIdx = action.payload?.index ?? action.index;
      const delta = action.payload?.delta ?? 0;
      const explicitQty = action.payload?.quantity ?? action.quantity;

      return {
        ...state,
        bag: state.bag.map((b, idx) => {
          if (idx === targetIdx || b.id === action.payload?.id) {
            const currentQty = b.quantity || 1;
            const newQty = explicitQty !== undefined ? explicitQty : Math.max(1, currentQty + delta);
            return { ...b, quantity: newQty };
          }
          return b;
        })
      };
    }

    case 'SET_CACHED_WHY_LINE': {
      const { productId, checkType, whyLine } = action.payload || action;
      const key = `${productId}_${checkType}`;
      return {
        ...state,
        cachedWhyLines: {
          ...state.cachedWhyLines,
          [key]: whyLine
        }
      };
    }

    case 'CLEAR_BAG': {
      return {
        ...state,
        bag: []
      };
    }

    default:
      return state;
  }
}
