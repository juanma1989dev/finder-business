import MainLayout from '@/layouts/main-layout';
import { useCartStore } from '@/store/cart.store';

export default function Details() {
    const items = useCartStore((s) => s.items);
    const updateNotes = useCartStore((s) => s.updateNotes);
    const totalPrice = useCartStore((s) => s.getTotalPrice());

    const getItemUnitPrice = (item: any) => {
        const basePrice = Number(item.price) || 0;

        const extrasTotal = (item.extras ?? []).reduce(
            (sum: number, e: any) => sum + (Number(e.price) || 0),
            0,
        );

        const variationsTotal = (item.variations ?? []).reduce(
            (sum: number, v: any) => sum + (Number(v.price) || 0),
            0,
        );

        return basePrice + extrasTotal + variationsTotal;
    };

    return (
        <MainLayout>
            <div className="mx-auto max-w-3xl p-6">
                <h1 className="mb-6 text-2xl font-bold">Checkout</h1>

                {items.length === 0 ? (
                    <p className="text-gray-500">Tu carrito está vacío</p>
                ) : (
                    <>
                        <ul className="space-y-4">
                            {items.map((item) => {
                                const unitPrice = getItemUnitPrice(item);

                                return (
                                    <li
                                        key={item.key}
                                        className="rounded-xl border bg-white p-4"
                                    >
                                        {/* HEADER */}
                                        <div className="flex justify-between">
                                            <div>
                                                <p className="font-medium">
                                                    {item.name +
                                                        ' - ' +
                                                        (item.variations ?? [])
                                                            .map(
                                                                (v: any) =>
                                                                    v.name,
                                                            )
                                                            .join(', ')}
                                                    {}
                                                </p>

                                                <p className="text-sm text-gray-500">
                                                    ${unitPrice.toFixed(2)} ×{' '}
                                                    {item.quantity}
                                                </p>
                                            </div>

                                            <span className="font-semibold">
                                                $
                                                {(
                                                    unitPrice *
                                                    (Number(item.quantity) || 0)
                                                ).toFixed(2)}
                                            </span>
                                        </div>

                                        {/* VARIACIONES */}
                                        {/* {(item.variations ?? []).length > 0 && (
                                            <div className="mt-2 text-xs text-gray-600">
                                                <span className="font-medium">
                                                    Variación:
                                                </span>{' '}
                                                {(item.variations ?? [])
                                                    .map((v: any) => v.name)
                                                    .join(', ')}
                                            </div>
                                        )} */}

                                        {/* EXTRAS */}
                                        {(item.extras ?? []).length > 0 && (
                                            <div className="mt-1 text-xs text-gray-600">
                                                <span className="font-medium">
                                                    Extras:
                                                </span>{' '}
                                                {(item.extras ?? [])
                                                    .map((e: any) => e.name)
                                                    .join(', ')}
                                            </div>
                                        )}

                                        {/* NOTAS */}
                                        <div className="mt-3">
                                            <textarea
                                                value={item.notes ?? ''}
                                                onChange={(e) =>
                                                    updateNotes(
                                                        item.key,
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Ej: sin picante, extra aderezo…"
                                                className="w-full resize-none rounded-lg border p-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                                                rows={2}
                                            />
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>

                        {/* TOTAL */}
                        <div className="mt-6 rounded-xl bg-gray-50 p-4">
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>
                        </div>

                        <button className="mt-6 w-full rounded-lg bg-green-600 py-3 font-semibold text-white hover:bg-green-700">
                            Confirmar pedido
                        </button>
                    </>
                )}
            </div>
        </MainLayout>
    );
}
