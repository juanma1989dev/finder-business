import {
    removeItem,
    updateItem,
} from '@/actions/App/Http/Controllers/CartController';
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
        updateItem(item.key, { quantity: item.quantity + 1 });
    };

    const decrement = (item: any) => {
        updateItem(item.key, { quantity: item.quantity - 1 });
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
                        className="fixed inset-0 z-[9998] bg-gray-900/20 backdrop-blur-[2px]"
                    />

                    {/* DRAWER CONTAINER */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{
                            type: 'spring',
                            damping: 30,
                            stiffness: 300,
                        }}
                        className="fixed top-0 right-0 z-[9999] flex h-[100dvh] w-full flex-col bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.05)] sm:max-w-[380px]"
                    >
                        {/* HEADER */}
                        <header className="flex items-center justify-between border-b border-gray-50 px-6 py-5">
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-lg font-black tracking-tight text-gray-900 uppercase">
                                        Tu Pedido
                                    </h2>
                                    <span className="flex h-5 min-w-[20px] items-center justify-center rounded-lg bg-purple-600 px-1.5 text-[10px] font-black text-white">
                                        {items.length}
                                    </span>
                                </div>
                                <p className="text-[9px] font-bold tracking-[0.1em] text-orange-500 uppercase">
                                    Resumen
                                </p>
                            </div>

                            <button
                                onClick={onClose}
                                className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 text-gray-400 transition-all hover:bg-orange-50 hover:text-orange-500 active:scale-95"
                            >
                                <X size={18} />
                            </button>
                        </header>

                        {/* LISTA DE PRODUCTOS */}
                        <div className="scrollbar-hide flex-1 space-y-3 overflow-y-auto px-4 py-4">
                            {items.length === 0 ? (
                                <div className="flex h-full flex-col items-center justify-center text-center">
                                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 text-gray-200">
                                        <ShoppingBasket size={28} />
                                    </div>
                                    <p className="text-[10px] font-black tracking-widest text-gray-300 uppercase">
                                        Carrito vacío
                                    </p>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <motion.div
                                        layout
                                        key={item.key}
                                        className="group relative flex flex-col rounded-xl border border-gray-100 bg-white p-4 transition-all hover:border-orange-100"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="text-[12px] leading-tight font-black text-gray-800 uppercase">
                                                    {item.name}
                                                </h3>
                                                <div className="mt-1 flex flex-wrap gap-x-2">
                                                    {item.variations?.map(
                                                        (v: any) => (
                                                            <span
                                                                key={v.id}
                                                                className="text-[9px] font-bold text-purple-500 uppercase"
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
                                                className="text-gray-200 transition-colors hover:text-red-400"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between">
                                            <span className="text-sm font-black text-gray-900">
                                                $
                                                {(
                                                    Number(item.price) *
                                                    item.quantity
                                                ).toFixed(2)}
                                            </span>

                                            <div className="flex items-center gap-1 rounded-lg border border-gray-100 bg-gray-50 p-1">
                                                <button
                                                    onClick={() =>
                                                        decrement(item)
                                                    }
                                                    className="flex h-6 w-6 items-center justify-center rounded-md bg-white shadow-sm transition-all hover:text-orange-500 active:scale-90"
                                                >
                                                    <Minus size={10} />
                                                </button>
                                                <span className="w-6 text-center text-[11px] font-black text-gray-700">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        increment(item)
                                                    }
                                                    className="flex h-6 w-6 items-center justify-center rounded-md bg-white shadow-sm transition-all hover:text-orange-500 active:scale-90"
                                                >
                                                    <Plus size={10} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* FOOTER */}
                        {items.length > 0 && (
                            <div className="border-t border-gray-50 bg-white px-6 py-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
                                <div className="mb-5 flex items-end justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black tracking-widest text-gray-400 uppercase">
                                            Subtotal
                                        </span>
                                        <span className="text-2xl font-black tracking-tighter text-gray-900">
                                            ${totalPrice.toFixed(2)}
                                        </span>
                                    </div>
                                    {/* <div className="text-[10px] font-bold text-green-500 uppercase">
                                        Envío gratis
                                    </div> */}
                                </div>

                                <button
                                    onClick={() => {
                                        onClose();
                                        router.visit('/shopping-cart/details');
                                    }}
                                    className="group flex w-full items-center justify-between rounded-xl bg-orange-500 p-1.5 pl-6 shadow-lg shadow-orange-100 transition-all hover:bg-orange-600 active:scale-[0.98]"
                                >
                                    <span className="text-[12px] font-black tracking-wider text-white uppercase">
                                        Finalizar orden
                                    </span>
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 text-white transition-transform group-hover:translate-x-0.5">
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
