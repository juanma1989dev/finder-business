import MainLayout from '@/layouts/main-layout';
import { useCartStore } from '@/store/cart.store';
import { CartItem } from '@/types';
import { MessageSquare, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';

export default function Details() {
    const { items, updateNotes, updateQuantity, removeItem, getTotalPrice } =
        useCartStore();
    const totalPrice = getTotalPrice();

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

    return (
        <MainLayout>
            <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
                <header className="mb-8 flex items-center gap-3">
                    <div className="rounded-full bg-green-100 p-2 text-green-600">
                        <ShoppingBag className="h-5 w-5" />
                    </div>
                    <h1 className="text-xl font-black tracking-tight text-gray-900">
                        Mi Carrito
                    </h1>
                </header>

                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="mb-4 rounded-full bg-gray-50 p-6">
                            <ShoppingBag className="h-12 w-12 text-gray-300" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">
                            Tu carrito está vacío
                        </h2>
                        <p className="mt-2 text-gray-500">
                            ¿Hambre? Agrega algo delicioso para comenzar.
                        </p>
                        <button className="mt-6 rounded-xl bg-gray-900 px-6 py-3 font-bold text-white transition-all hover:bg-black">
                            Ver Menú
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* LISTA DE PRODUCTOS */}
                        <div className="space-y-4 lg:col-span-2">
                            {items.map((item) => {
                                const unitPrice = getItemUnitPrice(item);
                                return (
                                    <div
                                        key={item.key}
                                        className="group relative rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md"
                                    >
                                        <div className="flex gap-4">
                                            {/* Imagen Placeholder */}
                                            <div className="h-20 w-20 flex-shrink-0 rounded-xl bg-gray-100 object-cover" />

                                            <div className="flex flex-1 flex-col">
                                                <div className="flex justify-between">
                                                    <div>
                                                        <h3 className="font-bold text-gray-900">
                                                            {item.name}
                                                        </h3>
                                                        <p className="text-xs text-gray-500 italic">
                                                            {(
                                                                item.variations ??
                                                                []
                                                            )
                                                                .map(
                                                                    (v) =>
                                                                        v.name,
                                                                )
                                                                .join(', ')}
                                                        </p>
                                                    </div>
                                                    <span className="font-black text-gray-900">
                                                        $
                                                        {(
                                                            unitPrice *
                                                            item.quantity
                                                        ).toFixed(2)}
                                                    </span>
                                                </div>

                                                {/* EXTRAS TAGS */}
                                                {item.extras?.length > 0 && (
                                                    <div className="mt-2 flex flex-wrap gap-1">
                                                        {item.extras.map(
                                                            (e) => (
                                                                <span
                                                                    key={e.id}
                                                                    className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600 uppercase"
                                                                >
                                                                    + {e.name}
                                                                </span>
                                                            ),
                                                        )}
                                                    </div>
                                                )}

                                                {/* CONTROLES Y ACCIONES */}
                                                <div className="mt-4 flex items-center justify-between">
                                                    <div className="flex items-center gap-1 rounded-lg border border-gray-200 p-1">
                                                        <button
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    item.key,
                                                                    Math.max(
                                                                        1,
                                                                        item.quantity -
                                                                            1,
                                                                    ),
                                                                )
                                                            }
                                                            className="rounded-md p-1 hover:bg-gray-100"
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </button>
                                                        <span className="w-8 text-center text-sm font-bold">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    item.key,
                                                                    item.quantity +
                                                                        1,
                                                                )
                                                            }
                                                            className="rounded-md p-1 hover:bg-gray-100"
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                        </button>
                                                    </div>

                                                    <button
                                                        onClick={() =>
                                                            removeItem(item.key)
                                                        }
                                                        className="text-gray-400 transition-colors hover:text-red-500"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* NOTAS CON ICONO */}
                                        <div className="mt-4 flex items-start gap-2 rounded-xl bg-gray-50 p-3">
                                            <MessageSquare className="mt-1 h-3.5 w-3.5 text-gray-400" />
                                            <textarea
                                                value={item.notes ?? ''}
                                                onChange={(e) =>
                                                    updateNotes(
                                                        item.key,
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Instrucciones especiales..."
                                                className="w-full resize-none bg-transparent text-xs text-gray-600 focus:outline-none"
                                                rows={1}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* RESUMEN DE PAGO (SIDEBAR) */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-lg font-bold text-gray-900">
                                    Resumen
                                </h2>

                                <div className="space-y-3 border-b border-gray-100 pb-4">
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Subtotal</span>
                                        <span>${totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Envío</span>
                                        <span className="font-medium text-green-600">
                                            Gratis
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 flex justify-between text-xl font-black text-gray-900">
                                    <span>Total</span>
                                    <span>${totalPrice.toFixed(2)}</span>
                                </div>

                                <button className="mt-8 w-full rounded-2xl bg-green-600 py-2 font-bold text-white shadow-lg shadow-green-200 transition-all hover:bg-green-700 hover:shadow-none active:scale-95">
                                    Confirmar Pedido
                                </button>

                                {/* <p className="mt-4 text-center text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                                    Pago seguro 100%
                                </p> */}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
