import MainLayout from '@/layouts/main-layout';
import { Order } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Home, Printer } from 'lucide-react';

interface Props {
    order: Order;
    statusLabel: string;
}

export default function OrderPage({ order, statusLabel }: Props) {
    const formattedDateTime = new Date(order.created_at).toLocaleString(
        undefined,
        {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        },
    );

    const formatPrice = (value: string | number) => Number(value).toFixed(2);

    const totalProducts = order.items.reduce(
        (acc, item) => acc + item.quantity,
        0,
    );

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completado':
            case 'entregado':
                return 'bg-green-100 text-green-700';
            case 'pendiente':
                return 'bg-amber-100 text-amber-700';
            case 'cancelado':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-purple-100 text-purple-700';
        }
    };

    return (
        <MainLayout>
            <Head title={`Orden #${order.id}`} />

            <div className="flex justify-center bg-purple-50/30 py-12 print:bg-white">
                <div className="w-[380px] overflow-hidden rounded-xl border border-purple-100 bg-white shadow-sm print:border-none print:shadow-none">
                    <div className="bg-purple-600 px-5 py-5 text-white">
                        <div>
                            <p className="text-[10px] tracking-widest uppercase opacity-80">
                                Orden #{order.id}
                            </p>
                            <p className="mt-2 text-2xl font-semibold tracking-tight">
                                ${formatPrice(order.total)}
                            </p>
                        </div>
                    </div>

                    <div className="px-6 py-6">
                        <div className="flex items-center justify-between text-[10px] tracking-widest text-gray-500 uppercase">
                            <span>{formattedDateTime}</span>
                            <span
                                className={`rounded-full px-2 py-1 text-[9px] font-semibold ${getStatusColor(
                                    order.status,
                                )}`}
                            >
                                {statusLabel}
                            </span>
                        </div>

                        <div className="mt-4 text-[10px] tracking-widest text-gray-400 uppercase">
                            {totalProducts} productos en esta orden
                        </div>

                        <div className="mt-6 space-y-5">
                            {order.items?.map((item) => {
                                const unitPrice =
                                    Number(item.total_price) / item.quantity;

                                return (
                                    <div
                                        key={item.id}
                                        className="space-y-2 border-b border-purple-50 pb-4"
                                    >
                                        <div className="flex justify-between text-sm font-semibold text-gray-800">
                                            <div>
                                                <p>
                                                    {item.quantity}×{' '}
                                                    {item.product_name}
                                                </p>
                                                <p className="text-[10px] font-normal text-gray-400">
                                                    Precio unitario: $
                                                    {formatPrice(unitPrice)}
                                                </p>
                                            </div>

                                            <span className="text-purple-800">
                                                ${formatPrice(item.total_price)}
                                            </span>
                                        </div>

                                        {(item.variations?.length > 0 ||
                                            item.extras?.length > 0 ||
                                            item.notes) && (
                                            <div className="space-y-1 border-l border-purple-100 pl-3 text-[10px] text-gray-500 uppercase">
                                                {item.variations?.map((v) => (
                                                    <p key={v.id}>
                                                        • {v.variation_name}
                                                    </p>
                                                ))}

                                                {item.extras?.map((e) => (
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
                                );
                            })}
                        </div>

                        <div className="mt-8 space-y-2 border-t border-dashed border-purple-100 pt-5">
                            <Row label="Subtotal" value={order.subtotal} />
                            <Row label="Envío" value={order.shipping} />

                            <div className="mt-4 flex justify-between text-base font-semibold text-gray-900">
                                <span className="text-[11px] tracking-widest uppercase">
                                    Total
                                </span>
                                <span className="text-xl text-purple-900">
                                    ${formatPrice(order.total)}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => router.visit('/')}
                            className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 py-3 text-[11px] font-semibold tracking-widest text-white uppercase transition-all hover:bg-purple-700 active:scale-95 print:hidden"
                        >
                            <Home size={14} />
                            Volver al inicio
                        </button>

                        <button
                            onClick={() => window.print()}
                            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-purple-50 py-3 text-[11px] font-semibold tracking-widest text-purple-700 uppercase transition-all hover:bg-purple-100 active:scale-95 print:hidden"
                        >
                            <Printer size={14} />
                            Imprimir ticket
                        </button>

                        {/* <div className="mt-6 text-center text-[10px] tracking-widest text-gray-400 uppercase">
                            Gracias por su compra
                        </div> */}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

interface RowProps {
    label: string;
    value: string | number;
}

function Row({ label, value }: RowProps) {
    return (
        <div className="flex justify-between text-[11px] tracking-widest text-gray-500 uppercase">
            <span>{label}</span>
            <span className="font-semibold text-gray-700">
                ${Number(value).toFixed(2)}
            </span>
        </div>
    );
}
