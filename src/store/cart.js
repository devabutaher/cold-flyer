"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      couponLoading: false,
      _hydrated: false,

      setHydrated: (val) => set({ _hydrated: val }),

      addItem: (product, quantity = 1) => {
        const productId = product.id || product._id || "";
        if (!productId || productId.length < 20) return;
        set((state) => {
          const idx = state.items.findIndex((item) => item.productId === productId);
          if (idx >= 0) {
            const updated = [...state.items];
            updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + quantity };
            return { items: updated };
          }
          return {
            items: [
              ...state.items,
              {
                id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
                productId,
                productRef: productId,
                slug: product.slug,
                name: product.name,
                price: product.price,
                imageUrl: product.images?.[0]?.url || "",
                description: product.description || "",
                quantity,
              },
            ],
          };
        });
      },

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((item) => item.id !== id)
              : state.items.map((item) => (item.id === id ? { ...item, quantity } : item)),
        })),

      removeItem: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),

      clearCart: () => set({ items: [], coupon: null }),

      getItemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

      getSubtotal: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

      getTotal: (shippingCost = 60, vatRate = 0.05) => {
        const subtotal = get().getSubtotal();
        const shipping = shippingCost;
        const vat = subtotal * vatRate;
        return { subtotal, shipping, vat, total: subtotal + shipping + vat };
      },

      setCouponLoading: (val) => set({ couponLoading: val }),

      applyCoupon: (applied) => set({ coupon: applied }),

      removeCoupon: () => set({ coupon: null }),
    }),
    {
      name: "cold_flyer_cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items, coupon: state.coupon }),
    },
  ),
);

export function useCart() {
  const items = useCartStore((s) => s.items);
  const _hydrated = useCartStore((s) => s._hydrated);
  const coupon = useCartStore((s) => s.coupon);
  const couponLoading = useCartStore((s) => s.couponLoading);
  const setHydrated = useCartStore((s) => s.setHydrated);
  const addItem = useCartStore((s) => s.addItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const getItemCount = useCartStore((s) => s.getItemCount);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const getTotal = useCartStore((s) => s.getTotal);
  const applyCoupon = useCartStore((s) => s.applyCoupon);
  const setCouponLoading = useCartStore((s) => s.setCouponLoading);
  const removeCoupon = useCartStore((s) => s.removeCoupon);

  return {
    items,
    itemCount: getItemCount(),
    isHydrated: _hydrated,
    setHydrated,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    getItemCount,
    getSubtotal,
    getTotal,
    coupon,
    couponLoading,
    applyCoupon,
    setCouponLoading,
    removeCoupon,
  };
}

export { useCartStore };

export function CartHydrationProvider({ children }) {
  return <>{children}</>;
}
