import { CartItem } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type CartState = {
    items: CartItem[];

    // getters (estado derivado)
    getTotalItems: () => number;
    getTotalPrice: () => number;

    // actions
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    increment: (id: string) => void;
    decrement: (id: string) => void;
    clear: () => void;
    updateNotes: (id: string, notes: string) => void;
};

const CART_STORE_KEY = 'CART_STORE';

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            /* ================= GETTERS ================= */
            getTotalItems: () =>
                get().items.reduce((total, item) => total + item.quantity, 0),

            getTotalPrice: () =>
                get().items.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0,
                ),

            /* ================= ACTIONS ================= */
            addItem: (item) => {
                const existing = get().items.find((i) => i.id === item.id);

                if (existing) {
                    set({
                        items: get().items.map((i) =>
                            i.id === item.id
                                ? {
                                      ...i,
                                      quantity: i.quantity + item.quantity,
                                  }
                                : i,
                        ),
                    });
                } else {
                    set({ items: [...get().items, item] });
                }
            },

            increment: (id) =>
                set({
                    items: get().items.map((i) =>
                        i.id === id ? { ...i, quantity: i.quantity + 1 } : i,
                    ),
                }),

            decrement: (id) =>
                set({
                    items: get()
                        .items.map((i) =>
                            i.id === id
                                ? {
                                      ...i,
                                      quantity: i.quantity - 1,
                                  }
                                : i,
                        )
                        .filter((i) => i.quantity > 0),
                }),

            removeItem: (id) =>
                set({
                    items: get().items.filter((i) => i.id !== id),
                }),

            clear: () => set({ items: [] }),

            updateNotes: (id, notes) =>
                set({
                    items: get().items.map((item) =>
                        item.id === id ? { ...item, notes } : item,
                    ),
                }),
        }),
        {
            name: CART_STORE_KEY,
        },
    ),
);
