import { create } from "zustand";
import { dbProduct } from "@/types/type";
import { dbProductwihtoutAll } from "@/actions/product";

export interface CartItem extends dbProductwihtoutAll {
  cartQuantity: number;
}

interface ProductStore {
  cartItems: CartItem[];
  addItem: (item: dbProductwihtoutAll, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
}

export const useCart = create<ProductStore>((set) => ({
  cartItems: [],

  addItem: (item, quantity = 1) =>
    set((state) => {
      const existingItem = state.cartItems.find(
        (cartItem) => cartItem.id === item.id
      );

      if (existingItem) {
        return {
          cartItems: state.cartItems.map((cartItem) =>
            cartItem.id === item.id
              ? { ...cartItem, cartQuantity: cartItem.cartQuantity + quantity }
              : cartItem
          ),
        };
      }

      return {
        cartItems: [...state.cartItems, { ...item, cartQuantity: quantity }],
      };
    }),

  removeItem: (id) =>
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.id !== id),
    })),

  updateQuantity: (id, quantity) =>
    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.id === id
          ? { ...item, cartQuantity: Math.max(quantity, 1) }
          : item
      ),
    })),
}));

interface GlobalState {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useOpenStore = create<GlobalState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));
