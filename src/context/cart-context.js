"use client";

import { createContext, useContext, useEffect, useReducer, useState } from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "cold_flyer_cart";

const initialState = {
  items: [],
  isLoading: true,
};

function cartReducer(state, action) {
  switch (action.type) {
    case "LOAD_CART":
      return { ...state, items: action.payload, isLoading: false };

    case "ADD_ITEM": {
      const productId = action.payload.productId || action.payload.id;
      const existingIndex = state.items.findIndex(
        (item) => (item.productId || item.id) === productId,
      );

      if (existingIndex >= 0) {
        const newItems = [...state.items];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + action.payload.quantity,
        };
        return { ...state, items: newItems };
      }

      return { ...state, items: [...state.items, action.payload] };
    }

    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== id),
        };
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.id === id ? { ...item, quantity } : item,
        ),
      };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    case "CLEAR_CART":
      return { ...state, items: [] };

    default:
      return state;
  }
}

function loadFromStorage() {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveToStorage(items) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Failed to save cart to localStorage:", error);
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const items = loadFromStorage();
    dispatch({ type: "LOAD_CART", payload: items });
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      saveToStorage(state.items);
    }
  }, [state.items, isHydrated]);

  const addItem = (product, quantity = 1) => {
    const productId = product.id || product._id || product.slug;
    const cartItem = {
      id: `${productId}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      productId,
      productRef: product._id || product.id || product.slug,
      slug: product.slug,
      name: product.name,
      price: product.price,
      imageUrl: product.images?.[0]?.url || "",
      description: product.description || "",
      quantity,
    };
    dispatch({ type: "ADD_ITEM", payload: cartItem });
  };

  const updateQuantity = (id, quantity) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const removeItem = (id) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isLoading: state.isLoading,
        itemCount,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}