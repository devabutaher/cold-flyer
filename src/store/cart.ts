/**
 * Zustand store for cart management
 * Replaces the old useReducer + useContext cart system
 * Provides hydration-safe state management with localStorage persistence
 */

"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export interface CartItem {
  id: string;
  productId: string;
  productRef: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isHydrated: boolean;
}

interface CartActions {
  // Hydration control
  setHydrated: (hydrated: boolean) => void;

  // Cart operations
  addItem: (product: {
    id?: string;
    _id?: string;
    slug: string;
    name: string;
    price: number;
    images?: Array<{ url: string }>;
    description?: string;
  }, quantity?: number) => void;

  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;

  // Computed
  getItemCount: () => number;
  getSubtotal: () => number;
  getTotal: (shippingCost?: number, vatRate?: number) => {
    subtotal: number;
    shipping: number;
    vat: number;
    total: number;
  };
}

const STORAGE_KEY = "cold_flyer_cart_v2";

export const useCartStore = create<CartState & CartActions>()(
  persist(
    immer((set, get) => ({
      // Initial state
      items: [],
      isHydrated: false,

      // Hydration control
      setHydrated: (hydrated) => set({ isHydrated: hydrated }),

      // Add item to cart
      addItem: (product, quantity = 1) => {
        const productId = product.id || product._id || "";
        const existingItem = get().items.find(
          (item) => item.productRef === productId
        );

        if (existingItem) {
          set((state) => {
            const item = state.items.find(
              (i) => i.productRef === productId
            );
            if (item) {
              item.quantity += quantity;
            }
          });
        } else {
          const cartItem: CartItem = {
            id: `${productId}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            productId,
            productRef: productId,
            slug: product.slug,
            name: product.name,
            price: product.price,
            imageUrl: product.images?.[0]?.url || "",
            description: product.description || "",
            quantity,
          };
          set((state) => {
            state.items.push(cartItem);
          });
        }
      },

      // Update item quantity
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          set((state) => {
            state.items = state.items.filter((item) => item.id !== id);
          });
          return;
        }
        set((state) => {
          const item = state.items.find((item) => item.id === id);
          if (item) {
            item.quantity = quantity;
          }
        });
      },

      // Remove item from cart
      removeItem: (id) => {
        set((state) => {
          state.items = state.items.filter((item) => item.id !== id);
        });
      },

      // Clear entire cart
      clearCart: () => {
        set({ items: [] });
      },

      // Get total item count
      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      // Get subtotal
      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },

      // Get full price breakdown
      getTotal: (shippingCost = 60, vatRate = 0.05) => {
        const subtotal = get().getSubtotal();
        const shipping = shippingCost;
        const vat = subtotal * vatRate;
        const total = subtotal + shipping + vat;
        return { subtotal, shipping, vat, total };
      },
    })),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => () => {
        // Mark hydration as complete after rehydration
        const store = get();
        if (!store.isHydrated) {
          store.setHydrated(true);
        }
      },
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
);

// React hook for SSR-safe cart access
export function useCart(): ReturnType<typeof useCartStore> & {
  isHydrated: boolean;
} {
  const store = useCartStore();
  const isHydrated = store.isHydrated;

  return {
    ...store,
    isHydrated,
  } as any;
}

// Pre-mount hydration component (use in root layout)
export function CartHydrationProvider({ children }: { children: React.ReactNode }) {
  // Force hydration on mount
  useCartStore.setState({ isHydrated: true }, false);
  return children;
}