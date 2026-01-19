import MainLayout from '@/layouts/main-layout';
import { Order } from '@/types';
import { Head } from '@inertiajs/react';
import { CheckCircle } from 'lucide-react';

interface Props {
    order: Order;
}

export default function OrderPage({ order }: Props) {
    return (
        <MainLayout>
            <Head title={`Orden #${order.id}`} />

            <div className="flex justify-center bg-gray-100 py-12 print:bg-white">
                <div className="w-[360px] overflow-hidden rounded-3xl bg-white shadow-xl print:shadow-none">
                    {/* HEADER */}
                    <div className="bg-gradient-to-r from-purple-600 via-fuchsia-600 to-orange-500 px-6 py-5 text-white">
                        <div className="flex items-center justify-between">
                            <h1 className="text-xs font-bold tracking-widest uppercase opacity-90">
                                Mi Negocio
                            </h1>
                            <CheckCircle size={18} className="opacity-90" />
                        </div>

                        <div className="mt-4">
                            <p className="text-[11px] uppercase opacity-80">
                                Orden #{order.id}
                            </p>
                            <p className="mt-1 text-3xl font-black tracking-tight">
                                ${order.total}
                            </p>
                        </div>
                    </div>

                    <div className="px-6 py-5 text-xs">
                        <div className="mb-4 flex justify-between text-[10px] tracking-wide text-gray-400 uppercase">
                            <span>
                                {new Date(
                                    order.created_at,
                                ).toLocaleDateString()}
                            </span>
                            <span className="font-semibold">
                                {order.status}
                            </span>
                        </div>

                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <div key={item.id}>
                                    <div className="flex justify-between font-semibold text-gray-900">
                                        <span>
                                            {item.quantity}× {item.product_name}
                                        </span>
                                        <span>${item.total_price}</span>
                                    </div>

                                    {(item.variations.length > 0 ||
                                        item.extras.length > 0 ||
                                        item.notes) && (
                                        <div className="mt-1 space-y-0.5 text-[10px] text-gray-500">
                                            {item.variations.map((v) => (
                                                <p key={v.id}>
                                                    • {v.variation_name}
                                                </p>
                                            ))}

                                            {item.extras.map((e) => (
                                                <p key={e.id}>
                                                    + {e.extra_name}
                                                </p>
                                            ))}

                                            {item.notes && (
                                                <p className="text-gray-400 italic">
                                                    "{item.notes}"
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 space-y-2 border-t border-dashed pt-4">
                            <Row label="Subtotal" value={order.subtotal} />
                            <Row label="Envío" value={order.shipping} />

                            <div className="mt-3 flex justify-between text-sm font-black tracking-tight">
                                <span>Total</span>
                                <span>${order.total}</span>
                            </div>
                        </div>

                        {/* <div className="mt-6 text-center text-[10px] text-gray-400">
                            Gracias por su compra 💜
                        </div> */}

                        {/* <button
                            onClick={() => window.print()}
                            className="mt-5 w-full rounded-xl bg-gray-900 py-2.5 text-xs font-bold text-white transition hover:bg-black print:hidden"
                        >
                            Imprimir ticket
                        </button> */}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between text-[11px] font-medium text-gray-600">
            <span>{label}</span>
            <span>${value}</span>
        </div>
    );
}
