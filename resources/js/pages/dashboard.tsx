import { useOrderStatus } from '@/hooks/useOrderStatus';
import DashboardLayout from '@/layouts/dashboard-layout';
import { BreadcrumbItem, Business, Order } from '@/types';
import { router } from '@inertiajs/react';
import { Bike, Clock, Power, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';

export default function DashboardBusiness({
    breadcrumbs,
    orders,
    business,
}: {
    breadcrumbs: BreadcrumbItem[];
    orders: Order[];
    business: Business;
}) {
    const [isBusinessOpen, setIsBusinessOpen] = useState(
        Boolean(business?.is_open),
    );
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<
        'Todos' | 'Pendiente' | 'Confirmado'
    >('Todos');

    const { labels } = useOrderStatus();

    const toggleBusiness = () => {
        const old = isBusinessOpen;

        setIsBusinessOpen(!old);

        router.post(
            '/dashboard/business/manage-opening',
            { id: business.id, status: !old },
            {
                onError: () => {
                    setIsBusinessOpen(old);
                    toast.error('No se pudo actualizar el negocio');
                },
            },
        );
    };

    const avanzarEstado = (orderId: number, status?: string) => {
        router.patch(
            `/dashboard/orders/${orderId}/status`,
            {
                status,
            },
            {
                preserveScroll: true,
                onSuccess: () => toast.success('Pedido actualizado'),
                onError: () => toast.error('Error al actualizar pedido'),
            },
        );
    };

    /* =======================
        FILTERS
        ======================= */

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

            if (activeTab === 'Pendiente') return order.status === 'pending';
            if (activeTab === 'Confirmado') return order.status === 'confirmed';

            return true;
        });
    }, [orders, searchTerm, activeTab]);

    /* =======================
        RENDER
        ======================= */

    return (
        <DashboardLayout breadcrumbs={breadcrumbs}>
            <div className="flex min-h-screen flex-col gap-4 bg-slate-50 p-4 lg:p-6">
                {/* HEADER */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-black">
                            Gestión de pedidos
                        </h1>
                        <p className="text-sm text-slate-500">
                            Control en tiempo real
                        </p>
                    </div>

                    <button
                        onClick={toggleBusiness}
                        className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold ${
                            isBusinessOpen
                                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                : 'border-rose-200 bg-rose-50 text-rose-700'
                        }`}
                    >
                        <Power className="h-4 w-4" />
                        {isBusinessOpen ? 'Abierto' : 'Cerrado'}
                    </button>
                </div>

                {/* FILTER BAR */}
                <div className="flex flex-col gap-3 rounded-2xl border bg-white p-3 shadow-sm md:flex-row md:items-center">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            className="w-full rounded-xl bg-slate-100 py-2 pr-4 pl-10 text-sm focus:ring-2 focus:ring-indigo-500"
                            placeholder="Buscar pedido o cliente..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-1">
                        {['Todos', 'Pendiente', 'Confirmado'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`rounded-lg px-4 py-2 text-xs font-bold uppercase ${
                                    activeTab === tab
                                        ? 'bg-slate-900 text-white'
                                        : 'text-slate-500 hover:bg-slate-100'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* GRID */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredOrders.length === 0 ? (
                        <EmptyState />
                    ) : (
                        filteredOrders.map((order: any) => (
                            <BusinessOrderCard
                                key={order.id}
                                pedido={order}
                                avanzarEstado={avanzarEstado}
                            />
                        ))
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}

/* =======================
    ORDER CARD
    ======================= */

function BusinessOrderCard({
    pedido,
    avanzarEstado,
}: {
    pedido: any;
    avanzarEstado: (id: number, status?: string) => void;
}) {
    const { flow, labels } = useOrderStatus();

    const statusOrder = pedido.status;

    const isLate = statusOrder === 'pending' && pedido.minutes_waiting > 10;

    const flowActions = flow[statusOrder] ?? [];

    return (
        <div
            className={`flex flex-col rounded-2xl border bg-white ${
                isLate
                    ? 'border-rose-400 ring-2 ring-rose-100'
                    : 'border-slate-200'
            }`}
        >
            {/* HEADER */}
            <div className="p-4">
                <div className="flex justify-between">
                    <div className="flex gap-3">
                        <div className="rounded-lg bg-orange-100 p-2">
                            <Bike className="h-4 w-4 text-orange-600" />
                        </div>
                        <div>
                            <span className="text-[10px] font-black text-slate-400">
                                #{pedido.id}
                            </span>
                            <p className="font-bold text-slate-900">
                                {pedido.user?.name ?? 'Cliente'}
                            </p>
                        </div>
                    </div>

                    <span className="rounded-full bg-orange-50 px-2 py-1 text-[10px] font-black text-orange-600 uppercase">
                        {labels[statusOrder]}
                    </span>
                </div>

                <div className="mt-4 flex justify-between">
                    <div className="flex items-center gap-1 text-xs font-bold text-slate-400">
                        <Clock className="h-4 w-4" />
                        {pedido.minutes_waiting ?? 0} min
                    </div>
                    <span className="text-lg font-black">${pedido.total}</span>
                </div>
            </div>

            {/* ACTIONS */}
            <div className="mt-auto flex gap-2 border-t p-2">
                {flowActions.map((action: string) => (
                    <button
                        key={action}
                        onClick={() => avanzarEstado(pedido.id, action)}
                        className="flex-1 rounded-xl bg-rose-600 py-2 text-xs font-bold text-white"
                    >
                        {labels[action]}
                    </button>
                ))}
            </div>
        </div>
    );
}

/* =======================
    EMPTY
    ======================= */

function EmptyState() {
    return (
        <div className="col-span-full rounded-3xl border-2 border-dashed bg-white p-16 text-center">
            <p className="font-bold text-slate-500">No hay pedidos activos</p>
        </div>
    );
}
