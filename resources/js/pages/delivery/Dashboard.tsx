import { useOrderStatus } from '@/hooks/useOrderStatus';
import DashboardLayout from '@/layouts/dashboard-layout';
import { BreadcrumbItem, Order } from '@/types';
import { router } from '@inertiajs/react';
import {
    Bike,
    Check,
    Clock,
    Loader2,
    PackageSearch,
    Search,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';

export default function DeliveryDashboard({
    breadcrumbs,
    orders,
}: {
    breadcrumbs: BreadcrumbItem[];
    orders: Order[];
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<
        'Todos' | 'Confirmado' | 'En camino'
    >('Todos');
    const [processingId, setProcessingId] = useState<number | null>(null);

    const avanzarEstado = (orderId: number) => {
        setProcessingId(orderId);
        router.patch(
            `/delivery/orders/${orderId}/status`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Pedido actualizado');
                    setProcessingId(null);
                },
                onError: () => {
                    toast.error('Error al actualizar pedido');
                    setProcessingId(null);
                },
            },
        );
    };

    const filteredOrders = useMemo(() => {
        return orders.filter((order: any) => {
            if (searchTerm) {
                const q = searchTerm.toLowerCase();
                if (
                    !order.id.toString().includes(q) &&
                    !order.user?.name?.toLowerCase().includes(q)
                ) {
                    return false;
                }
            }
            if (activeTab === 'Confirmado') return order.status === 'confirmed';
            if (activeTab === 'En camino') return order.status === 'on_the_way';
            return true;
        });
    }, [orders, searchTerm, activeTab]);

    return (
        <DashboardLayout breadcrumbs={breadcrumbs}>
            <div className="flex min-h-screen flex-col gap-4 bg-purple-50/30 p-4 lg:p-6">
                {/* HEADER */}
                <div className="mb-2">
                    <h1 className="text-base font-semibold tracking-tight text-gray-700 uppercase">
                        Gestión de entregas
                    </h1>
                    <p className="text-[10px] leading-tight font-normal tracking-widest text-gray-500 uppercase">
                        Pedidos en tiempo real
                    </p>
                </div>

                {/* FILTER BAR */}
                <div className="flex flex-col gap-3 rounded-lg border border-purple-200 bg-white p-3 shadow-sm md:flex-row md:items-center">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            className="w-full rounded-lg border border-transparent bg-purple-50 py-2 pr-4 pl-10 text-sm font-normal text-gray-700 transition-all focus:border-purple-200 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                            placeholder="Buscar pedido o cliente..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-1 overflow-x-auto pb-1 md:pb-0">
                        {['Todos', 'Confirmado', 'En camino'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`rounded-lg px-4 py-1.5 text-[10px] font-semibold whitespace-nowrap uppercase transition-all active:scale-95 ${
                                    activeTab === tab
                                        ? 'bg-purple-600 text-white shadow-sm'
                                        : 'text-gray-500 hover:bg-purple-50'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* GRID RESPONSIVA - Configuración de grilla Finder */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredOrders.length === 0 ? (
                        <EmptyState />
                    ) : (
                        filteredOrders.map((order: any) => (
                            <DeliveryOrderCard
                                key={order.id}
                                pedido={order}
                                isProcessing={processingId === order.id}
                                avanzarEstado={avanzarEstado}
                            />
                        ))
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}

function DeliveryOrderCard({
    pedido,
    isProcessing,
    avanzarEstado,
}: {
    pedido: any;
    isProcessing: boolean;
    avanzarEstado: (id: number) => void;
}) {
    const { labels, flow } = useOrderStatus();
    const status = pedido.status;
    const nextStatuses: string[] = flow[status] ?? [];
    const nextMainStatus =
        nextStatuses.find((s) => s !== 'cancelled' && s !== 'rejected') ?? null;
    const canAdvance = Boolean(nextMainStatus);

    const advanceLabelMap: Record<string, string> = {
        on_the_way: 'Iniciar Entrega',
        delivered: 'Marcar Entregado',
    };

    return (
        <div
            className={`relative flex flex-col rounded-lg border border-purple-200 bg-white shadow-sm transition-all hover:shadow-md ${isProcessing ? 'animate-pulse' : ''}`}
        >
            {/* CAPA DE CARGA - Overlay dinámico */}
            {isProcessing && (
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/60 backdrop-blur-sm">
                    <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
                </div>
            )}

            <div className="space-y-4 p-3">
                <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                        <div className="rounded-lg border border-purple-100 bg-purple-50 p-2">
                            <Bike className="h-4 w-4 text-purple-700" />
                        </div>
                        <div>
                            <span className="text-[10px] leading-tight font-semibold text-gray-500 uppercase">
                                ID #{pedido.id}
                            </span>
                            <p className="text-sm leading-tight font-semibold text-purple-800">
                                {pedido.user?.name ?? 'Cliente'}
                            </p>
                        </div>
                    </div>
                    <span className="rounded-lg border border-amber-200 bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700 uppercase">
                        {labels[status]}
                    </span>
                </div>

                <div className="flex items-end justify-between">
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-600">
                        <Clock className="h-3.5 w-3.5 text-purple-600" />
                        <span>{pedido.minutes_waiting ?? 0} MIN ESPERA</span>
                    </div>
                    <span className="text-base font-semibold text-gray-700">
                        ${pedido.total}
                    </span>
                </div>
            </div>

            <div className="mt-auto border-t border-purple-50 p-2">
                {canAdvance ? (
                    <button
                        disabled={isProcessing}
                        onClick={() => avanzarEstado(pedido.id)}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 py-2.5 text-xs font-semibold text-white transition-all hover:bg-purple-700 active:scale-95 disabled:opacity-50"
                    >
                        <Check className="h-3.5 w-3.5" />
                        {advanceLabelMap[nextMainStatus!] || 'Siguiente'}
                    </button>
                ) : (
                    <div className="py-2 text-center">
                        <span className="text-[10px] font-semibold text-green-600 uppercase">
                            Finalizado
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="col-span-full flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-purple-100 bg-white py-16 text-center">
            <div className="mb-4 rounded-lg bg-purple-50 p-4 text-gray-300 shadow-sm">
                <PackageSearch size={32} />
            </div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase">
                No hay pedidos disponibles
            </h3>
            <p className="mt-1 text-[10px] font-normal tracking-widest text-gray-500 uppercase">
                Los nuevos pedidos aparecerán aquí
            </p>
        </div>
    );
}
