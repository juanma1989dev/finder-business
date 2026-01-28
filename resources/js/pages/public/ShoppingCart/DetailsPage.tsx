import MainLayout from '@/layouts/main-layout';
import { CartItem, SharedData } from '@/types';
import { router, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    ChevronRight,
    Loader2,
    MessageSquare,
    Minus,
    Plus,
    ShoppingBag,
    Trash2,
} from 'lucide-react';
import { useCallback } from 'react';

// ... (Función debounce se mantiene igual)

export default function DetailsPage() {
    const { cart } = usePage<SharedData>().props;
    const items = Object.values(cart);

    const { post, processing, transform } = useForm({
        total: 0,
        items: [] as CartItem[],
    });

    const getItemUnitPrice = (item: CartItem) => {
        const basePrice = Number(item.price) || 0;
        const extrasTotal = (item.extras ?? []).reduce(
            (sum, e) => sum + (Number(e.price) || 0),
            0,
        );
        const variationsTotal = (item.variations ?? []).reduce(
            (sum, v) => sum + (Number(v.price) || 0),
            0,
        );
        return basePrice + extrasTotal + variationsTotal;
    };

    function debounce<T extends (...args: any[]) => void>(
        fn: T,
        delay: number,
    ) {
        let timer: ReturnType<typeof setTimeout> | null = null;

        return (...args: Parameters<T>) => {
            if (timer) {
                clearTimeout(timer);
            }

            timer = setTimeout(() => {
                fn(...args);
            }, delay);
        };
    }

    const totalPrice = items.reduce(
        (total, item) => total + getItemUnitPrice(item) * item.quantity,
        0,
    );

    const handleUpdateQuantity = (item: CartItem, quantity: number) => {
        router.patch(
            `/cart/${item.key}`,
            { quantity },
            { preserveScroll: true },
        );
    };

    const handleRemoveItem = (item: CartItem) => {
        router.delete(`/cart/${item.key}`, { preserveScroll: true });
    };

    const debouncedUpdateNotes = useCallback(
        debounce((key: string, notes: string) => {
            router.patch(`/cart/${key}`, { notes }, { preserveScroll: true });
        }, 300),
        [],
    );

    const handleUpdateNotes = (item: CartItem, notes: string) => {
        debouncedUpdateNotes(item.key, notes);
    };

    const handleConfirmOrder = () => {
        if (items.length === 0) return;
        transform((data) => ({ ...data, items: items, total: totalPrice }));
        post('/shopping-cart', { preserveScroll: true });
    };

    return (
        <MainLayout showFloatShoppingCart={false}>
            {processing && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/60 backdrop-blur-sm">
                    <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
                </div>
            )}

            <div className="mx-auto max-w-5xl p-3 sm:p-6 lg:p-8">
                <header className="mb-6 flex items-center gap-4">
                    <button
                        onClick={() => window.history.back()}
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-purple-100 bg-white text-purple-600 shadow-sm transition-all active:scale-95"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight text-gray-700 uppercase">
                            Mi Carrito
                        </h1>
                        <p className="text-[10px] font-semibold tracking-widest text-purple-600 uppercase">
                            Confirmación de pedido
                        </p>
                    </div>
                </header>

                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-purple-100 bg-purple-50/30 py-20 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-white text-gray-300 shadow-sm">
                            <ShoppingBag size={32} />
                        </div>
                        <h2 className="text-base font-semibold text-gray-700 uppercase">
                            El carrito está vacío
                        </h2>
                        <button
                            onClick={() => router.visit('/')}
                            className="mt-6 rounded-lg bg-purple-600 px-8 py-3 text-sm font-semibold text-white transition-all active:scale-95"
                        >
                            VER PRODUCTOS
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className="space-y-3 lg:col-span-2">
                            {items.map((item) => {
                                const unitPrice = getItemUnitPrice(item);
                                return (
                                    <div
                                        key={item.key}
                                        className="group relative rounded-lg border border-purple-100 bg-white p-3 shadow-sm transition-all hover:border-purple-200"
                                    >
                                        <div className="flex gap-4">
                                            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-200">
                                                <ShoppingBag size={24} />
                                            </div>

                                            <div className="flex flex-1 flex-col">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className="text-sm leading-tight font-semibold text-purple-800">
                                                            {item.name}
                                                        </h3>
                                                        <div className="mt-1 flex flex-wrap gap-x-2">
                                                            {item.variations?.map(
                                                                (v) => (
                                                                    <span
                                                                        key={
                                                                            v.id
                                                                        }
                                                                        className="text-[10px] font-semibold text-purple-500 uppercase"
                                                                    >
                                                                        {v.name}
                                                                    </span>
                                                                ),
                                                            )}
                                                        </div>
                                                    </div>
                                                    <span className="text-sm font-semibold text-gray-700">
                                                        $
                                                        {(
                                                            unitPrice *
                                                            item.quantity
                                                        ).toFixed(2)}
                                                    </span>
                                                </div>

                                                {item.extras &&
                                                    item.extras.length > 0 && (
                                                        <div className="mt-2 flex flex-wrap gap-1">
                                                            {item.extras.map(
                                                                (e) => (
                                                                    <span
                                                                        key={
                                                                            e.id
                                                                        }
                                                                        className="rounded-lg border border-purple-50 bg-purple-50 px-2 py-0.5 text-[9px] font-semibold text-purple-600 uppercase"
                                                                    >
                                                                        +{' '}
                                                                        {e.name}
                                                                    </span>
                                                                ),
                                                            )}
                                                        </div>
                                                    )}

                                                <div className="mt-4 flex items-center justify-between">
                                                    <div className="flex items-center gap-1 rounded-lg border border-purple-100 bg-purple-50 p-1">
                                                        <button
                                                            onClick={() =>
                                                                handleUpdateQuantity(
                                                                    item,
                                                                    Math.max(
                                                                        1,
                                                                        item.quantity -
                                                                            1,
                                                                    ),
                                                                )
                                                            }
                                                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-purple-600 shadow-sm active:scale-90"
                                                        >
                                                            <Minus size={14} />
                                                        </button>
                                                        <span className="w-8 text-center text-xs font-semibold text-purple-800">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() =>
                                                                handleUpdateQuantity(
                                                                    item,
                                                                    item.quantity +
                                                                        1,
                                                                )
                                                            }
                                                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-purple-600 shadow-sm active:scale-90"
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>

                                                    <button
                                                        onClick={() =>
                                                            handleRemoveItem(
                                                                item,
                                                            )
                                                        }
                                                        className="text-gray-300 transition-colors hover:text-amber-600"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-3 flex items-center gap-3 rounded-lg border border-transparent bg-purple-50/50 px-3 py-2 transition-all focus-within:border-purple-200 focus-within:bg-white">
                                            <MessageSquare
                                                size={14}
                                                className="text-purple-400"
                                            />
                                            <input
                                                defaultValue={item.notes ?? ''}
                                                onChange={(e) =>
                                                    handleUpdateNotes(
                                                        item,
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Instrucciones adicionales..."
                                                className="w-full bg-transparent text-[11px] font-normal text-gray-600 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* RESUMEN - Paleta Púrpura/Amber */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-20 overflow-hidden rounded-lg border border-purple-200 bg-white shadow-sm">
                                <div className="bg-purple-600 px-6 py-4">
                                    <span className="text-[10px] leading-tight font-semibold tracking-widest text-purple-200 uppercase">
                                        Total Pedido
                                    </span>
                                    <div className="text-2xl font-semibold text-white">
                                        ${totalPrice.toFixed(2)}
                                    </div>
                                </div>

                                <div className="space-y-4 p-6">
                                    <div className="space-y-3 border-b border-purple-50 pb-4">
                                        <div className="flex justify-between text-[11px] font-semibold tracking-wider uppercase">
                                            <span className="text-gray-500">
                                                Subtotal
                                            </span>
                                            <span className="text-gray-700">
                                                ${totalPrice.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-[11px] font-semibold tracking-wider uppercase">
                                            <span className="text-gray-500">
                                                Envío
                                            </span>
                                            <span className="text-amber-600 italic">
                                                Gratis
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        disabled={processing}
                                        onClick={handleConfirmOrder}
                                        className="flex w-full items-center justify-between rounded-lg bg-amber-600 p-1.5 pl-5 transition-all hover:bg-amber-700 active:scale-95 disabled:opacity-50"
                                    >
                                        <span className="text-xs font-semibold tracking-widest text-white uppercase">
                                            Confirmar Orden
                                        </span>
                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20 text-white">
                                            <ChevronRight size={18} />
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
