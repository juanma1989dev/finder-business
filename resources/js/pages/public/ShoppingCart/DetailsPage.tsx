import MainLayout from '@/layouts/main-layout';
import { CartItem, SharedData } from '@/types';
import { router, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    ChevronRight,
    MessageSquare,
    Minus,
    Plus,
    ShoppingBag,
    Trash2,
} from 'lucide-react';
import { useCallback } from 'react';

function debounce<T extends (...args: any[]) => void>(
    fn: T,
    delay = 300,
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout>;

    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            fn(...args);
        }, delay);
    };
}

export default function DetailsPage() {
    const { cart } = usePage<SharedData>().props;
    const items = Object.values(cart);

    const {
        post,
        processing,
        transform,
        data: dataOrder,
    } = useForm({
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

    const totalPrice = items.reduce(
        (total, item) => total + getItemUnitPrice(item) * item.quantity,
        0,
    );

    const handleUpdateQuantity = (item: CartItem, quantity: number) => {
        router.patch(
            `/cart/${item.key}`,
            { quantity },
            {
                preserveScroll: true,
            },
        );
    };

    const handleRemoveItem = (item: CartItem) => {
        router.delete(`/cart/${item.key}`, {
            preserveScroll: true,
        });
    };

    const debouncedUpdateNotes = useCallback(
        debounce((key: string, notes: string) => {
            router.patch(
                `/cart/${key}`,
                { notes },
                {
                    preserveScroll: true,
                },
            );
        }, 300),
        [],
    );

    const handleUpdateNotes = (item: CartItem, notes: string) => {
        debouncedUpdateNotes(item.key, notes);
    };

    const handleConfirmOrder = () => {
        if (items.length === 0) return;

        transform((data) => ({
            ...data,
            items: items,
            total: totalPrice,
        }));

        console.log({ dataOrder });

        post('/shopping-cart', {
            preserveScroll: true,
            onSuccess: (res) => {
                console.log({ res });
            },
        });
    };

    return (
        <MainLayout>
            <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
                <header className="mb-8 flex items-center gap-4">
                    <button
                        onClick={() => window.history.back()}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-100 bg-white text-gray-400 shadow-sm transition-all hover:text-orange-500 active:scale-95"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-gray-900 uppercase">
                            Mi Carrito
                        </h1>
                        <p className="text-[10px] font-bold tracking-widest text-orange-500 uppercase">
                            Confirmación de pedido
                        </p>
                    </div>
                </header>

                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 text-gray-200">
                            <ShoppingBag size={32} />
                        </div>
                        <h2 className="text-lg font-black text-gray-900 uppercase">
                            El carrito está vacío
                        </h2>
                        <button
                            onClick={() => router.visit('/')}
                            className="mt-6 rounded-xl bg-gray-900 px-8 py-3 text-xs font-black text-white transition-all hover:bg-orange-600 active:scale-95"
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
                                        className="group relative rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-orange-200"
                                    >
                                        <div className="flex gap-4">
                                            {/* Imagen Miniatura */}
                                            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 text-gray-200">
                                                <ShoppingBag size={24} />
                                            </div>

                                            <div className="flex flex-1 flex-col">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className="text-sm font-black text-gray-900 uppercase">
                                                            {item.name}
                                                        </h3>
                                                        <div className="mt-1 flex flex-wrap gap-x-2">
                                                            {item.variations?.map(
                                                                (v) => (
                                                                    <span
                                                                        key={
                                                                            v.id
                                                                        }
                                                                        className="text-[10px] font-bold text-purple-500 uppercase"
                                                                    >
                                                                        {v.name}
                                                                    </span>
                                                                ),
                                                            )}
                                                        </div>
                                                    </div>
                                                    <span className="text-base font-black text-gray-900">
                                                        $
                                                        {(
                                                            unitPrice *
                                                            item.quantity
                                                        ).toFixed(2)}
                                                    </span>
                                                </div>

                                                {/* EXTRAS */}
                                                {item.extras &&
                                                    item.extras.length > 0 && (
                                                        <div className="mt-2 flex flex-wrap gap-1">
                                                            {item.extras.map(
                                                                (e) => (
                                                                    <span
                                                                        key={
                                                                            e.id
                                                                        }
                                                                        className="rounded-md border border-gray-100 bg-gray-50 px-2 py-0.5 text-[9px] font-bold text-gray-500 uppercase"
                                                                    >
                                                                        +{' '}
                                                                        {e.name}
                                                                    </span>
                                                                ),
                                                            )}
                                                        </div>
                                                    )}

                                                <div className="mt-4 flex items-center justify-between">
                                                    {/* Controles - rounded-xl */}
                                                    <div className="flex items-center gap-1 rounded-xl border border-gray-100 bg-gray-50 p-1">
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
                                                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-sm transition-all hover:text-orange-500 active:scale-90"
                                                        >
                                                            <Minus size={14} />
                                                        </button>
                                                        <span className="w-8 text-center text-xs font-black text-gray-700">
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
                                                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-sm transition-all hover:text-orange-500 active:scale-90"
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
                                                        className="text-gray-300 transition-colors hover:text-red-500"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* NOTAS */}
                                        <div className="mt-4 flex items-center gap-3 rounded-xl border border-transparent bg-gray-50 px-3 py-2 transition-all focus-within:border-orange-100 focus-within:bg-white">
                                            <MessageSquare
                                                size={14}
                                                className="text-orange-400"
                                            />
                                            <input
                                                defaultValue={item.notes ?? ''}
                                                onChange={(e) =>
                                                    handleUpdateNotes(
                                                        item,
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Instrucciones..."
                                                className="w-full bg-transparent text-[11px] font-bold text-gray-600 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* RESUMEN - Estilo Compacto Premium */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                                <div className="bg-purple-600 px-6 py-4">
                                    <span className="text-[10px] font-black tracking-[0.2em] text-purple-200 uppercase">
                                        Total Pedido
                                    </span>
                                    <div className="text-2xl font-black text-white">
                                        ${totalPrice.toFixed(2)}
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="space-y-3 border-b border-gray-50 pb-4">
                                        <div className="flex justify-between text-[11px] font-black uppercase">
                                            <span className="text-gray-400">
                                                Subtotal
                                            </span>
                                            <span className="text-gray-900">
                                                ${totalPrice.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-[11px] font-black uppercase">
                                            <span className="text-gray-400">
                                                Envío
                                            </span>
                                            <span className="text-orange-500">
                                                Gratis ************
                                            </span>
                                        </div>
                                    </div>

                                    {/* Botón Acción - Menos inflado */}
                                    <button
                                        disabled={processing}
                                        className="mt-6 flex w-full items-center justify-between rounded-xl bg-orange-500 p-1.5 pl-5 transition-all hover:bg-orange-600 active:scale-[0.98]"
                                        onClick={handleConfirmOrder}
                                    >
                                        <span className="text-[12px] font-black tracking-wider text-white uppercase">
                                            Confirmar Orden
                                        </span>
                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20 text-white">
                                            <ChevronRight size={18} />
                                        </div>
                                    </button>

                                    {/* <div className="mt-4 flex items-center justify-center gap-2">
                                        <ShieldCheck
                                            size={12}
                                            className="text-green-500"
                                        />
                                        <span className="text-[9px] font-black tracking-widest text-gray-300 uppercase">
                                            Seguro
                                        </span>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
