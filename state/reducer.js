import { buildSeedWishlist } from '../data/seedWishlist.js';
import { getProduct } from '../lib/catalog.js';
import { inferPreferredSize } from '../lib/sizing.js';

export const STORAGE_KEY = 'myntra_quickcheck_state_v1';

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
    if (parsed && Array.isArray(parsed.wishlist)) {
      return {
        wishlist: parsed.wishlist,
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
    case 'ADD_TO_WISHLIST': {
      const { productId } = action;
      const exists = state.wishlist.some(w => w.productId === productId);
      if (exists) return state; // No-op on duplicate add

      const product = getProduct(productId);
      if (!product) return state;

      const newItem = {
        id: `wish_${productId}`,
        productId: productId,
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
      const { productId } = action;
      return {
        ...state,
        wishlist: state.wishlist.filter(w => w.productId !== productId)
      };
    }

    case 'INCREMENT_VIEW_COUNT': {
      const { productId } = action;
      return {
        ...state,
        wishlist: state.wishlist.map(w => {
          if (w.productId === productId) {
            return { ...w, viewCount: (w.viewCount || 0) + 1 };
          }
          return w;
        })
      };
    }

    case 'ADD_TO_BAG': {
      const { productId, selectedSize: passedSize, quantity = 1 } = action;
      const product = getProduct(productId);
      if (!product) return state;

      // Infer size if missing and product requires size per architecture.md §4
      let size = passedSize;
      if (!size) {
        size = inferPreferredSize(state.bag, product.department, product.garmentType);
      }

      // Check if item with same productId and size already exists in bag
      const existingIdx = state.bag.findIndex(b => b.productId === productId && b.selectedSize === size);

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
          id: `bag_${productId}_${size || 'nosize'}_${Date.now()}`,
          productId: productId,
          selectedSize: size,
          quantity: quantity,
          addedAt: new Date().toISOString(),
          product: product
        };
        newBag = [newBagItem, ...state.bag];
      }

      return {
        ...state,
        bag: newBag
      };
    }

    case 'REMOVE_FROM_BAG': {
      const { bagItemId } = action;
      return {
        ...state,
        bag: state.bag.filter(b => b.id !== bagItemId)
      };
    }

    case 'UPDATE_BAG_QUANTITY': {
      const { bagItemId, quantity } = action;
      // Ensure quantity never goes below 1 via stepper per edge_cases.md
      const safeQty = Math.max(1, quantity);
      return {
        ...state,
        bag: state.bag.map(b => {
          if (b.id === bagItemId) {
            return { ...b, quantity: safeQty };
          }
          return b;
        })
      };
    }

    case 'SET_CACHED_WHY_LINE': {
      const { productId, checkType, whyLine } = action;
      const key = `${productId}_${checkType}`;
      return {
        ...state,
        cachedWhyLines: {
          ...state.cachedWhyLines,
          [key]: whyLine
        }
      };
    }

    case 'SHOW_TOAST': {
      return {
        ...state,
        toast: {
          message: action.message,
          toastType: action.toastType || 'info',
          id: Date.now()
        }
      };
    }

    case 'HIDE_TOAST': {
      return {
        ...state,
        toast: null
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
