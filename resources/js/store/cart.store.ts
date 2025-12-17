import { CartItem } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Clave única por producto + configuración
 */
const buildKey = (item: Omit<CartItem, 'key'>) =>
    `${item.id}-${JSON.stringify(item.extras ?? [])}-${JSON.stringify(
        item.variations ?? [],
    )}`;

interface CartState {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'key'>) => void;
    updateQuantity: (key: string, quantity: number) => void; // <-- Nueva
    increment: (key: string) => void;
    decrement: (key: string) => void;
    updateNotes: (key: string, notes: string) => void;
    removeItem: (key: string) => void;
    clearCart: () => void;
    getTotalPrice: () => number;
}
const SHOPPING_CART_KEY = 'cart-storage';

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            /**
             * AGREGAR PRODUCTO
             */
            addItem: (item) =>
                set((state) => {
                    const normalized = {
                        ...item,
                        extras: item.extras ?? [],
                        variations: item.variations ?? [],
                        notes: item.notes ?? '',
                    };

                    const key = buildKey(normalized);
                    const existing = state.items.find((i) => i.key === key);

                    if (existing) {
                        return {
                            items: state.items.map((i) =>
                                i.key === key
                                    ? { ...i, quantity: i.quantity + 1 }
                                    : i,
                            ),
                        };
                    }

                    return {
                        items: [
                            ...state.items,
                            { ...normalized, key, quantity: 1 },
                        ],
                    };
                }),

            /**
             * ACTUALIZAR CANTIDAD (Motor central)
             */
            updateQuantity: (key, quantity) =>
                set((state) => ({
                    items: state.items
                        .map((i) =>
                            i.key === key
                                ? { ...i, quantity: Math.max(0, quantity) }
                                : i,
                        )
                        .filter((i) => i.quantity > 0),
                })),

            /**
             * INCREMENTAR
             */
            increment: (key) => {
                const item = get().items.find((i) => i.key === key);
                if (item) get().updateQuantity(key, item.quantity + 1);
            },

            /**
             * DECREMENTAR
             */
            decrement: (key) => {
                const item = get().items.find((i) => i.key === key);
                if (item) get().updateQuantity(key, item.quantity - 1);
            },

            /**
             * NOTAS
             */
            updateNotes: (key, notes) =>
                set((state) => ({
                    items: state.items.map((i) =>
                        i.key === key ? { ...i, notes } : i,
                    ),
                })),

            /**
             * ELIMINAR ITEM
             */
            removeItem: (key) =>
                set((state) => ({
                    items: state.items.filter((i) => i.key !== key),
                })),

            /**
             * VACIAR
             */
            clearCart: () => set({ items: [] }),

            /**
             * TOTAL
             */
            getTotalPrice: () =>
                get().items.reduce((total, item) => {
                    const basePrice = Number(item.price) || 0;
                    const quantity = Number(item.quantity) || 0;
                    const extrasTotal = (item.extras ?? []).reduce(
                        (s, e) => s + (Number(e.price) || 0),
                        0,
                    );
                    const variationsTotal = (item.variations ?? []).reduce(
                        (s, v) => s + (Number(v.price) || 0),
                        0,
                    );
                    return (
                        total +
                        (basePrice + extrasTotal + variationsTotal) * quantity
                    );
                }, 0),
        }),
        {
            name: SHOPPING_CART_KEY,
            partialize: (state) => ({
                items: state.items,
            }),
        },
    ),
);
