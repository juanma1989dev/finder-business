import DashboardLayout from '@/layouts/dashboard-layout';
import { BreadcrumbItem, Business, Order, OrderStatus } from '@/types';
import { router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import GridOrders from './GridOrders';
import NotesDialog from './NotesDialog';
import Stat from './Stat';

enum Tabs {
    Todos = 'Todos',
    Pendiente = 'Pendiente',
    Confirmado = 'Confirmado',
    Entregado = 'Entregado',
}

const STATUSES_WITH_REASON = [OrderStatus.CANCELLED, OrderStatus.REJECTED];

interface Props {
    breadcrumbs: BreadcrumbItem[];
    orders: Order[];
    business: Business;
}

export default function Index({ breadcrumbs, orders, business }: Props) {
    const [isBusinessOpen, setIsBusinessOpen] = useState(
        Boolean(business?.is_open),
    );
    const [activeTab, setActiveTab] = useState<Tabs>(Tabs.Todos);
    const [search, setSearch] = useState('');
    const [loadingOrderId, setLoadingOrderId] = useState<number | null>(null);

    const [reasonDialog, setReasonDialog] = useState<{
        open: boolean;
        orderId?: number | null;
        status?: OrderStatus;
    }>({ open: false });

    const [noteText, setNoteText] = useState('');

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setReasonDialog({ open: false });
                setNoteText('');
            }

            if (e.key === 'Enter' && reasonDialog.open && noteText.trim()) {
                sendStatus(
                    reasonDialog.orderId!,
                    reasonDialog.status,
                    noteText,
                );
            }
        };

        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [reasonDialog, noteText]);

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

    const changeStatusOrder = (orderId: number, status?: OrderStatus) => {
        if (status && STATUSES_WITH_REASON.includes(status)) {
            setReasonDialog({ open: true, orderId, status });
            return;
        }
        sendStatus(orderId, status);
    };

    const sendStatus = (
        orderId: number,
        status?: OrderStatus,
        note?: string,
    ) => {
        setLoadingOrderId(orderId);

        router.patch(
            `/dashboard/orders/${orderId}/status`,
            { status, note },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Pedido actualizado');
                    setReasonDialog({ open: false });
                    setNoteText('');
                },
                onError: () => toast.error('Error al actualizar pedido'),
                onFinish: () => setLoadingOrderId(null),
            },
        );
    };

    const filteredOrders = useMemo(() => {
        return orders.filter((order: any) => {
            if (search) {
                const q = search.toLowerCase();
                if (
                    !order.id.toString().includes(q) &&
                    !order.user?.name?.toLowerCase().includes(q)
                )
                    return false;
            }

            if (activeTab === Tabs.Pendiente)
                return order.status === OrderStatus.PENDING;
            if (activeTab === Tabs.Confirmado)
                return order.status === OrderStatus.CONFIRMED;
            if (activeTab === Tabs.Entregado)
                return order.status === OrderStatus.DELIVERED;

            return true;
        });
    }, [orders, search, activeTab]);

    const pendingCount = orders.filter(
        (o) => o.status === OrderStatus.PENDING,
    ).length;

    const lateCount = orders.filter((o) => {
        return o.status === OrderStatus.PENDING;
        // return o.status === OrderStatus.PENDING && (o.minutes_waiting ?? 0) > 10
    }).length;

    return (
        <DashboardLayout breadcrumbs={breadcrumbs}>
            <div className="flex min-h-screen flex-col gap-4 bg-slate-50 p-3 sm:p-4 lg:p-6">
                <div className="sticky top-0 z-30 rounded-2xl bg-white p-3 shadow-sm sm:static">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-lg font-black">Pedidos</h1>
                            <p className="text-xs text-slate-500">
                                En tiempo real
                            </p>
                        </div>

                        <button
                            onClick={toggleBusiness}
                            className={`rounded-xl px-4 py-2 text-xs font-black ${
                                isBusinessOpen
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-rose-100 text-rose-700'
                            }`}
                        >
                            {isBusinessOpen ? 'Abierto' : 'Cerrado'}
                        </button>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2">
                        <Stat label="Pendientes" value={pendingCount} />
                        <Stat label="Retrasados" value={lateCount} danger />
                        <Stat label="Mostrados" value={filteredOrders.length} />
                    </div>
                </div>

                <div className="relative">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        className="w-full rounded-xl bg-white py-3 pr-4 pl-10 text-sm shadow-sm focus:ring-2 focus:ring-indigo-500"
                        placeholder="Buscar pedido o cliente…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1">
                    {Object.values(Tabs).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`rounded-xl px-4 py-2 text-xs font-black whitespace-nowrap ${
                                activeTab === tab
                                    ? 'bg-slate-900 text-white'
                                    : 'bg-white text-slate-500'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <GridOrders
                    orders={filteredOrders}
                    loadingOrderId={loadingOrderId}
                    onChangeStatus={changeStatusOrder}
                />
            </div>

            <NotesDialog
                open={reasonDialog.open}
                value={noteText}
                onChange={setNoteText}
                onClose={() =>
                    setReasonDialog({
                        open: false,
                        orderId: null,
                        status: undefined,
                    })
                }
                onConfirm={() =>
                    sendStatus(
                        reasonDialog.orderId!,
                        reasonDialog.status,
                        noteText,
                    )
                }
            />
        </DashboardLayout>
    );
}
