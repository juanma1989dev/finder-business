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
             * Agregar producto (o sumar si existe la misma configuración)
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
                                    ? {
                                          ...i,
                                          quantity: i.quantity + 1,
                                      }
                                    : i,
                            ),
                        };
                    }

                    return {
                        items: [
                            ...state.items,
                            {
                                ...normalized,
                                key,
                                quantity: 1,
                            },
                        ],
                    };
                }),

            /**
             * Incrementar cantidad de un item
             */
            increment: (key) =>
                set((state) => {
                    if (!state.items.some((i) => i.key === key)) {
                        console.warn(
                            '[cart.increment] key no encontrada:',
                            key,
                        );
                        return state;
                    }

                    return {
                        items: state.items.map((i) =>
                            i.key === key
                                ? {
                                      ...i,
                                      quantity: i.quantity + 1,
                                  }
                                : i,
                        ),
                    };
                }),

            /**
             * Decrementar cantidad (elimina si llega a 0)
             */
            decrement: (key) =>
                set((state) => {
                    if (!state.items.some((i) => i.key === key)) {
                        console.warn(
                            '[cart.decrement] key no encontrada:',
                            key,
                        );
                        return state;
                    }

                    return {
                        items: state.items
                            .map((i) =>
                                i.key === key
                                    ? {
                                          ...i,
                                          quantity: i.quantity - 1,
                                      }
                                    : i,
                            )
                            .filter((i) => i.quantity > 0),
                    };
                }),

            /**
             * Actualizar notas
             */
            updateNotes: (key, notes) =>
                set((state) => ({
                    items: state.items.map((i) =>
                        i.key === key ? { ...i, notes } : i,
                    ),
                })),

            /**
             * Eliminar item completo
             */
            removeItem: (key) =>
                set((state) => ({
                    items: state.items.filter((i) => i.key !== key),
                })),

            /**
             * Vaciar carrito
             */
            clearCart: () => set({ items: [] }),

            /**
             * Total con extras + variaciones (blindado)
             */
            getTotalPrice: () =>
                get().items.reduce((total, item) => {
                    const basePrice = Number(item.price) || 0;
                    const quantity = Number(item.quantity) || 0;

                    const extrasTotal = (item.extras ?? []).reduce(
                        (s, e) => s + (Number(e.price) || 0),
                        0,
                    );

                    // const variationsTotal = (item.variations ?? []).reduce(
                    //     (s, v) => s + (Number(v.price) || 0),
                    //     0,
                    // );

                    return total + (basePrice + extrasTotal) * quantity;
                }, 0),
        }),
        {
            name: SHOPPING_CART_KEY,
            // version: 1,

            /**
             * Solo persistimos items
             */
            partialize: (state) => ({
                items: state.items,
            }),

            // /**
            //  * 🔒 Migración segura de datos antiguos
            //  */
            // onRehydrateStorage: () => (state) => {
            //     state?.items.forEach((item) => {
            //         item.extras ??= [];
            //         item.variations ??= [];
            //         item.notes ??= '';
            //     });
            // },
        },
    ),
);
