import { create } from "zustand";
import { dbProductwihtoutAll } from "@/actions/product";

export interface CartItem extends dbProductwihtoutAll {
  cartQuantity: number;
  selectedUnit?: string | null;
  unitLabel?: string | null;
}

interface ProductStore {
  cartItems: CartItem[];
  addItem: (item: dbProductwihtoutAll, quantity?: number, selectedUnit?: string | null, unitLabel?: string | null) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
}

export const useCart = create<ProductStore>((set) => ({
  cartItems: [],

  addItem: (item, quantity = 1, selectedUnit = null, unitLabel = null) =>
    set((state) => {
      // unique cart key = product id + unit (so 2kg and 5kg are separate cart items)
      const cartKey = selectedUnit ? `${item.id}-${selectedUnit}${unitLabel}` : item.id;
      const existingItem = state.cartItems.find((cartItem) => cartItem.id === cartKey);

      if (existingItem) {
        return {
          cartItems: state.cartItems.map((cartItem) =>
            cartItem.id === cartKey
              ? { ...cartItem, cartQuantity: cartItem.cartQuantity + quantity }
              : cartItem
          ),
        };
      }

      return {
        cartItems: [
          ...state.cartItems,
          { ...item, id: cartKey, cartQuantity: quantity, selectedUnit, unitLabel },
        ],
      };
    }),

  removeItem: (id) =>
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.id !== id),
    })),

  updateQuantity: (id, quantity) =>
    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.id === id ? { ...item, cartQuantity: Math.max(quantity, 1) } : item
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