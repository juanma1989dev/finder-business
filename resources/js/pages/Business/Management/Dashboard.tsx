import { messaging, onMessage } from '@/firebase';
import DashboardLayout from '@/layouts/dashboard-layout';
import { BreadcrumbItem, Business, Order, OrderStatus } from '@/types';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { Power, PowerOff, Search } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import GridOrders from '../GridOrders';
import NotesDialog from '../NotesDialog';
import Stat from '../Stat';

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
    final_statuses: string[];
}

export default function Index({
    breadcrumbs,
    orders,
    business,
    final_statuses,
}: Props) {
    const [isBusinessOpen, setIsBusinessOpen] = useState(
        Boolean(business?.is_open),
    );

    const finalStatuses = final_statuses;

    const [activeTab, setActiveTab] = useState<Tabs>(Tabs.Todos);
    const [search, setSearch] = useState('');
    const [loadingOrderId, setLoadingOrderId] = useState<number | null>(null);
    const [ordersState, setOrdersState] = useState<Order[]>(orders);

    const [reasonDialog, setReasonDialog] = useState<{
        open: boolean;
        orderId?: number | null;
        status?: OrderStatus;
    }>({ open: false });

    const [noteText, setNoteText] = useState('');

    const reloadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);

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

    useEffect(() => {
        if (!messaging) return;

        return onMessage(messaging, (payload) => {
            toast.success(
                <div className="flex flex-col gap-1">
                    <p className="font-bold">
                        {payload.data?.title || 'Nuevo Pedido'}
                    </p>
                    <p className="text-xs">{payload.data?.body}</p>
                </div>,
            );

            if (reloadTimeoutRef.current) {
                clearTimeout(reloadTimeoutRef.current);
            }
            const order = payload.data?.order
                ? JSON.parse(payload.data.order)
                : null;

            if (order) {
                setOrdersState((prev) => mergeOrders(prev, [order]));
            } else {
                syncOrdersDelta();
            }
        });
    }, []);

    const toggleBusiness = () => {
        const old = isBusinessOpen;
        setIsBusinessOpen(!old);

        router.patch(
            `/dashboard/business/${business.id}-${business.slug}/opening-hours`,
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
                    setReasonDialog({ open: false });
                    setNoteText('');
                    syncOrdersDelta(orderId);
                },
                onError: () => toast.error('Error al actualizar pedido'),
                onFinish: () => setLoadingOrderId(null),
            },
        );
    };

    const filteredOrders = useMemo(() => {
        return ordersState.filter((order: any) => {
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
    }, [ordersState, search, activeTab]);

    const mergeOrders = (current: Order[], incoming: Order[]) => {
        const map = new Map<number, Order>();

        current.forEach((order) => {
            map.set(order.id, order);
        });

        incoming.forEach((order) => {
            if (finalStatuses.includes(order.status)) {
                map.delete(order.id);
            } else {
                map.set(order.id, order);
            }
        });

        return Array.from(map.values());
    };

    const syncOrdersDelta = async (orderId?: number) => {
        try {
            const response = await axios.get('/dashboard/orders/delta', {
                params: {
                    orderId: orderId,
                },
                withCredentials: true,
            });

            console.log('Sync Orders Delta :: ', {
                lastSyncAt,
                orderId,
            });
            console.log('Delta Sync :: ', response.data);

            const incomingOrders: Order[] = response.data?.orders ?? [];

            if (incomingOrders.length) {
                const newestDate = incomingOrders
                    .map((o: Order) => new Date(o.updated_at).getTime())
                    .sort((a, b) => b - a)[0];

                setLastSyncAt(new Date(newestDate).toISOString());
            }

            setOrdersState((current) => mergeOrders(current, incomingOrders));
        } catch (e) {
            console.error('Error :: ', e);
        }
    };

    const pendingCount = ordersState.filter(
        (o) => o.status === OrderStatus.PENDING,
    ).length;
    const lateCount = ordersState.filter(
        (o) => o.status === OrderStatus.PENDING,
    ).length;

    return (
        <DashboardLayout breadcrumbs={breadcrumbs}>
            <div className="flex min-h-screen flex-col gap-3 bg-purple-50/30 p-2 sm:p-2 lg:p-4">
                <div className="sticky top-14 z-40 rounded-lg border border-purple-200 bg-white p-2 shadow-sm sm:static">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-base font-semibold tracking-tight text-purple-800 uppercase">
                                Pedidos
                            </h1>
                            <p className="text-[10px] font-normal tracking-widest text-gray-500 uppercase">
                                Gestión de tus pedidos.
                            </p>
                        </div>

                        <button
                            onClick={toggleBusiness}
                            className={`flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-[10px] font-semibold uppercase transition-all active:scale-95 ${
                                isBusinessOpen
                                    ? 'bg-purple-600 text-white shadow-sm'
                                    : 'border border-amber-200 bg-amber-50 text-amber-700'
                            }`}
                        >
                            {isBusinessOpen ? (
                                <>
                                    Abierto <Power className="h-3.5 w-3.5" />
                                </>
                            ) : (
                                <>
                                    Cerrado <PowerOff className="h-3.5 w-3.5" />
                                </>
                            )}
                        </button>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2">
                        <Stat label="Pendientes" value={pendingCount} />
                        <Stat label="Retrasados" value={lateCount} danger />
                        <Stat label="Filtrados" value={filteredOrders.length} />
                    </div>
                </div>

                <div className="relative">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        className="w-full rounded-lg border border-purple-200 bg-white py-3 pr-4 pl-10 text-sm font-normal text-gray-700 shadow-sm transition-all focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                        placeholder="Buscar pedido o cliente…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
                    {Object.values(Tabs).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`rounded-lg px-4 py-2 text-[10px] font-semibold whitespace-nowrap uppercase transition-all active:scale-95 ${
                                activeTab === tab
                                    ? 'bg-purple-600 text-white shadow-sm'
                                    : 'border border-purple-100 bg-white text-gray-500 hover:bg-purple-50'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="relative min-h-[400px]">
                    <GridOrders
                        orders={filteredOrders}
                        loadingOrderId={loadingOrderId}
                        onChangeStatus={changeStatusOrder}
                    />
                </div>
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
