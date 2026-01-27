import MainLayout from '@/layouts/main-layout';
import { Order } from '@/types';
import { Head } from '@inertiajs/react';
import { CheckCircle, Printer } from 'lucide-react';

interface Props {
    order: Order;
}

export default function OrderPage({ order }: Props) {
    return (
        <MainLayout>
            <Head title={`Orden #${order.id}`} />

            <div className="flex justify-center bg-purple-50/30 py-12 print:bg-white">
                <div className="w-[360px] overflow-hidden rounded-lg border border-purple-100 bg-white shadow-sm print:border-none print:shadow-none">
                    {/* HEADER - Identidad Púrpura (Pedidos) */}
                    <div className="bg-purple-600 px-6 py-6 text-white">
                        <div className="flex items-center justify-between">
                            <h1 className="text-[10px] font-semibold tracking-widest uppercase opacity-90">
                                Mi Negocio
                            </h1>
                            <CheckCircle size={16} className="opacity-90" />
                        </div>

                        <div className="mt-4">
                            <p className="text-[10px] font-normal tracking-widest uppercase opacity-80">
                                Orden #{order.id}
                            </p>
                            <p className="mt-1 text-3xl font-semibold tracking-tight">
                                ${order.total}
                            </p>
                        </div>
                    </div>

                    {/* CUERPO DEL TICKET */}
                    <div className="px-6 py-5">
                        {/* Status y Fecha - Tamaño Micro / Paleta Gris */}
                        <div className="mb-6 flex justify-between text-[10px] leading-tight font-normal tracking-widest text-gray-500 uppercase">
                            <span>
                                {new Date(
                                    order.created_at,
                                ).toLocaleDateString()}
                            </span>
                            <span className="font-semibold text-purple-700">
                                {order.status}
                            </span>
                        </div>

                        {/* LISTADO DE ITEMS */}
                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <div key={item.id} className="space-y-1">
                                    <div className="flex justify-between text-sm font-semibold text-gray-700">
                                        <span className="leading-tight">
                                            {item.quantity}× {item.product_name}
                                        </span>
                                        <span className="font-semibold text-purple-800">
                                            ${item.total_price}
                                        </span>
                                    </div>

                                    {/* Personalizaciones - Micro Texto leading-tight */}
                                    {(item.variations.length > 0 ||
                                        item.extras.length > 0 ||
                                        item.notes) && (
                                        <div className="space-y-0.5 border-l border-purple-50 pl-4 text-[10px] leading-tight font-normal tracking-wide text-gray-500 uppercase">
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
                                                <p className="text-gray-400 normal-case italic">
                                                    "{item.notes}"
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* TOTALES - Estructura Stack space-y-2 */}
                        <div className="mt-8 space-y-2 border-t border-dashed border-purple-100 pt-4">
                            <Row label="Subtotal" value={order.subtotal} />
                            <Row label="Envío" value={order.shipping} />

                            <div className="mt-3 flex justify-between text-base font-semibold tracking-tight text-gray-800">
                                <span className="self-center text-[10px] tracking-widest uppercase">
                                    Total
                                </span>
                                <span className="text-xl text-purple-900">
                                    ${order.total}
                                </span>
                            </div>
                        </div>

                        {/* ACCIÓN PRINT */}
                        <button
                            onClick={() => window.print()}
                            className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-purple-50 py-3 text-[10px] font-semibold tracking-widest text-purple-700 uppercase transition-all hover:bg-purple-100 active:scale-95 print:hidden"
                        >
                            <Printer size={14} />
                            Imprimir ticket
                        </button>

                        <div className="mt-6 text-center text-[10px] font-normal tracking-widest text-gray-400 uppercase">
                            Gracias por su compra
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between text-[10px] font-normal tracking-widest text-gray-500 uppercase">
            <span>{label}</span>
            <span className="font-semibold text-gray-700">${value}</span>
        </div>
    );
}
