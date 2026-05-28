"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const { itemId, type, slug, name, price, imageUrl } = item;
        if (!itemId) return;
        set((state) => {
          if (state.items.some((i) => i.itemId === itemId && i.type === type)) return state;
          return {
            items: [
              ...state.items,
              {
                id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
                itemId,
                type,
                slug,
                name,
                price,
                imageUrl,
                addedAt: new Date().toISOString(),
              },
            ],
          };
        });
      },

      removeItem: (itemId, type) =>
        set((state) => ({ items: state.items.filter((i) => !(i.itemId === itemId && i.type === type)) })),

      isInWishlist: (itemId, type) => get().items.some((i) => i.itemId === itemId && i.type === type),

      getCount: () => get().items.length,

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "cold_flyer_wishlist",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

export function useWishlist() {
  const items = useWishlistStore((s) => s.items);
  const addItem = useWishlistStore((s) => s.addItem);
  const removeItem = useWishlistStore((s) => s.removeItem);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist);
  const getCount = useWishlistStore((s) => s.getCount);
  const clearWishlist = useWishlistStore((s) => s.clearWishlist);

  return {
    items,
    wishlistCount: getCount(),
    addItem,
    removeItem,
    isInWishlist,
    getCount,
    clearWishlist,
  };
}

export { useWishlistStore };
