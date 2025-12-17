import { useCartStore } from '@/store/cart.store';
import { router } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowRight,
    Minus,
    Plus,
    ShoppingBasket,
    Trash2,
    X,
} from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const CartDrawer = ({ isOpen, onClose }: Props) => {
    const { items, increment, decrement, removeItem, getTotalPrice } =
        useCartStore();
    const totalPrice = getTotalPrice();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay con desenfoque */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
                    />

                    {/* Contenedor del Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{
                            type: 'spring',
                            damping: 25,
                            stiffness: 200,
                        }}
                        className="fixed top-0 right-0 z-[70] flex h-full w-full max-w-md flex-col bg-gray-50 shadow-2xl"
                    >
                        {/* HEADER */}
                        <header className="flex items-center justify-between border-b bg-white p-5">
                            <div className="flex items-center gap-2">
                                <ShoppingBasket className="h-5 w-5 text-green-600" />
                                <h2 className="text-lg font-black tracking-tight text-gray-900">
                                    Tu pedido
                                </h2>
                                <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">
                                    {items.length}
                                </span>
                            </div>
                            <button
                                onClick={onClose}
                                className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900"
                            >
                                <X size={20} />
                            </button>
                        </header>

                        {/* LISTA DE ITEMS */}
                        <div className="flex-1 space-y-4 overflow-y-auto p-5">
                            {items.length === 0 ? (
                                <div className="flex h-full flex-col items-center justify-center text-center">
                                    <div className="mb-4 rounded-full bg-gray-100 p-4">
                                        <ShoppingBasket className="h-10 w-10 text-gray-300" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Aún no hay nada por aquí
                                    </p>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div
                                        key={item.key}
                                        className="relative flex flex-col rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                                    >
                                        <div className="flex justify-between gap-4">
                                            <div className="flex-1">
                                                <h3 className="text-sm font-bold text-gray-900">
                                                    {item.name}
                                                </h3>

                                                {/* Variaciones y Extras en formato Tag */}
                                                <div className="mt-1 flex flex-wrap gap-1">
                                                    {item.variations?.map(
                                                        (v: any) => (
                                                            <span
                                                                key={v.id}
                                                                className="text-[10px] font-semibold text-gray-400"
                                                            >
                                                                {v.name}
                                                            </span>
                                                        ),
                                                    )}
                                                    {item.extras?.map(
                                                        (e: any) => (
                                                            <span
                                                                key={e.id}
                                                                className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-600 uppercase"
                                                            >
                                                                + {e.name}
                                                            </span>
                                                        ),
                                                    )}
                                                </div>
                                            </div>

                                            <button
                                                onClick={() =>
                                                    removeItem(item.key)
                                                }
                                                className="text-gray-300 transition-colors hover:text-red-500"
                                            >
                                                <Trash2 size={16} />
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

                                            {/* Selector de cantidad minimalista */}
                                            <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-1">
                                                <button
                                                    onClick={() =>
                                                        decrement(item.key)
                                                    }
                                                    className="flex h-6 w-6 items-center justify-center rounded-lg bg-white shadow-sm transition-transform active:scale-90"
                                                >
                                                    <Minus
                                                        size={12}
                                                        className="text-gray-600"
                                                    />
                                                </button>
                                                <span className="min-w-[20px] text-center text-xs font-bold text-gray-900">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        increment(item.key)
                                                    }
                                                    className="flex h-6 w-6 items-center justify-center rounded-lg bg-white shadow-sm transition-transform active:scale-90"
                                                >
                                                    <Plus
                                                        size={12}
                                                        className="text-gray-600"
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* FOOTER ACCIONES */}
                        {items.length > 0 && (
                            <div className="space-y-4 border-t bg-white p-6 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
                                <div className="flex items-center justify-between px-1">
                                    <span className="text-sm font-medium text-gray-500">
                                        Subtotal del pedido
                                    </span>
                                    <span className="text-xl font-black text-gray-900">
                                        ${totalPrice.toFixed(2)}
                                    </span>
                                </div>

                                <button
                                    onClick={() => {
                                        onClose();
                                        router.visit('/shopping-cart/details');
                                    }}
                                    className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-green-600 py-2 text-sm font-black text-white transition-all hover:bg-green-700 active:scale-[0.98]"
                                >
                                    Ir a pagar
                                    <ArrowRight
                                        size={18}
                                        className="transition-transform group-hover:translate-x-1"
                                    />
                                </button>

                                <p className="text-center text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                                    Revisa tus productos antes de confirmar
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
