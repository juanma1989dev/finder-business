import { router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowRight,
    Minus,
    Plus,
    ShoppingBasket,
    Trash2,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const CartDrawer = ({ isOpen, onClose }: Props) => {
    const { cart } = usePage().props;

    const items = useMemo(() => {
        return Object.values(cart || {});
    }, [cart]);

    const totalPrice = useMemo(() => {
        return items.reduce(
            (acc, item) => acc + Number(item.price) * item.quantity,
            0,
        );
    }, [items]);

    const increment = (item: any) => {
        router.patch(
            `/cart/${item.key}`,
            { quantity: item.quantity + 1 },
            { preserveScroll: true },
        );
    };

    const decrement = (item: any) => {
        router.patch(
            `/cart/${item.key}`,
            { quantity: item.quantity - 1 },
            { preserveScroll: true },
        );
    };

    const removeItem = (key: string) => {
        router.delete(`/cart/${key}`, {
            preserveScroll: true,
        });
    };

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[9998] bg-gray-900/20 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{
                            type: 'spring',
                            damping: 30,
                            stiffness: 300,
                        }}
                        className="fixed top-0 right-0 z-[9999] flex h-[100dvh] w-full flex-col bg-white shadow-sm sm:max-w-[380px]"
                    >
                        {/* HEADER */}
                        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-purple-200 bg-white px-6 py-5">
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-base font-semibold tracking-tight text-purple-800 uppercase">
                                        Tu Pedido
                                    </h2>
                                    <span className="flex h-5 min-w-[20px] items-center justify-center rounded-lg bg-purple-600 px-1.5 text-[10px] font-semibold text-white">
                                        {items.length}
                                    </span>
                                </div>
                                <p className="text-[10px] leading-tight font-normal tracking-[0.1em] text-gray-500 uppercase">
                                    Resumen
                                </p>
                            </div>

                            <button
                                onClick={onClose}
                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50 text-purple-700 transition-all active:scale-95"
                            >
                                <X size={18} />
                            </button>
                        </header>

                        <div className="flex-1 space-y-2 overflow-y-auto p-3">
                            {items.length === 0 ? (
                                <div className="flex h-full flex-col items-center justify-center text-center">
                                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-gray-50 text-gray-300">
                                        <ShoppingBasket size={28} />
                                    </div>
                                    <p className="text-base font-semibold tracking-widest text-gray-700 uppercase">
                                        Carrito vacío
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {items.map((item) => (
                                        <motion.div
                                            layout
                                            key={item.key}
                                            className="group relative flex flex-col rounded-lg border border-purple-200 bg-purple-50 p-3 shadow-sm transition-all"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h3 className="text-sm leading-tight font-semibold text-purple-800 uppercase">
                                                        {item.name}
                                                    </h3>
                                                    <div className="mt-1 flex flex-wrap gap-1">
                                                        {item.variations?.map(
                                                            (v: any) => (
                                                                <span
                                                                    key={v.id}
                                                                    className="text-[10px] leading-tight font-normal text-gray-600 uppercase"
                                                                >
                                                                    {v.name}
                                                                </span>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() =>
                                                        removeItem(item.key)
                                                    }
                                                    className="text-gray-300 transition-colors hover:text-red-400"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>

                                            <div className="mt-4 flex items-center justify-between">
                                                <span className="text-sm font-semibold text-purple-800">
                                                    $
                                                    {(
                                                        Number(item.price) *
                                                        item.quantity
                                                    ).toFixed(2)}
                                                </span>

                                                <div className="flex items-center gap-1 rounded-lg border border-purple-200 bg-white p-1">
                                                    <button
                                                        onClick={() =>
                                                            decrement(item)
                                                        }
                                                        className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-50 text-purple-700 shadow-sm transition-all active:scale-95"
                                                    >
                                                        <Minus size={10} />
                                                    </button>
                                                    <span className="w-6 text-center text-[10px] font-semibold text-gray-700">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            increment(item)
                                                        }
                                                        className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-600 text-white shadow-sm transition-all active:scale-95"
                                                    >
                                                        <Plus size={10} />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {items.length > 0 && (
                            <div className="border-t border-purple-200 bg-white p-3 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
                                <div className="mb-4 flex items-end justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] leading-tight font-normal tracking-widest text-gray-500 uppercase">
                                            Subtotal
                                        </span>
                                        <span className="text-base font-semibold tracking-tighter text-purple-800">
                                            ${totalPrice.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="text-[10px] font-semibold text-green-600 uppercase">
                                        Envío calculado
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        onClose();
                                        router.visit('/shopping-cart/details');
                                    }}
                                    className="group flex w-full items-center justify-between rounded-lg bg-purple-600 p-1.5 pl-6 text-white transition-all active:scale-95"
                                >
                                    <span className="text-sm font-semibold tracking-wider uppercase">
                                        Finalizar orden
                                    </span>
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 transition-transform group-hover:translate-x-0.5">
                                        <ArrowRight size={18} />
                                    </div>
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body,
    );
};
