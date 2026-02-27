import { messaging, onMessage } from '@/firebase';
import { useNotification } from '@/hooks/use-notification';
import DashboardLayout from '@/layouts/dashboard-layout';
import { BreadcrumbItem, Business, Order, OrderStatus } from '@/types';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { Bell, Power, PowerOff } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import GridOrders from '../GridOrders';
import NotesDialog from '../NotesDialog';

const SOUND_NOTIFICATION = '/sounds/notification.mp3';

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
    const [loadingOrderId, setLoadingOrderId] = useState<number | null>(null);
    const [ordersState, setOrdersState] = useState<Order[]>(orders);

    const [reasonDialog, setReasonDialog] = useState<{
        open: boolean;
        orderId?: number | null;
        status?: OrderStatus;
    }>({ open: false });

    const [noteText, setNoteText] = useState('');
    const reloadTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const { playNotification } = useNotification();

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
            if (reloadTimeoutRef.current) {
                clearTimeout(reloadTimeoutRef.current);
            }
            const order = payload.data?.order
                ? JSON.parse(payload.data.order)
                : null;

            setActiveTab(Tabs.Todos);

            if (order) {
                if (order.status === OrderStatus.PENDING) {
                    playNotification({
                        withSound: true,
                        vibrationType: 'pulse',
                    });
                }
                syncOrdersDelta(order.id);
            } else {
                syncOrdersDelta();
            }
        });
    }, [playNotification]);

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
                    playNotification({
                        withSound: false,
                        vibrationType: 'short',
                    });
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
            if (activeTab === Tabs.Pendiente)
                return order.status === OrderStatus.PENDING;
            if (activeTab === Tabs.Confirmado)
                return order.status === OrderStatus.CONFIRMED;
            if (activeTab === Tabs.Entregado)
                return order.status === OrderStatus.DELIVERED;
            return order.status !== OrderStatus.DELIVERED;
        });
    }, [ordersState, activeTab]);

    const globalLateCount = useMemo(() => {
        const now = new Date().getTime();
        return ordersState.filter((order) => {
            const created = new Date(order.created_at).getTime();
            const minutes = (now - created) / 60000;
            return order.status === OrderStatus.PENDING && minutes > 1;
        }).length;
    }, [ordersState]);

    const pendingOrdersCount = useMemo(() => {
        return ordersState.filter(
            (order) => order.status === OrderStatus.PENDING,
        ).length;
    }, [ordersState]);

    const mergeOrders = (current: Order[], incoming: Order[]) => {
        const map = new Map<number, Order>();

        current.forEach((order) => {
            map.set(Number(order.id), order);
        });

        incoming.forEach((order) => {
            const id = Number(order.id);
            if (
                finalStatuses.includes(order.status) &&
                order.status !== OrderStatus.DELIVERED
            ) {
                map.delete(id);
            } else {
                map.set(id, order);
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

            const incomingOrders: Order[] = response.data?.orders ?? [];

            setOrdersState((current) => mergeOrders(current, incomingOrders));
        } catch (e) {
            console.error('Error :: ', e);
        }
    };

    return (
        <DashboardLayout breadcrumbs={breadcrumbs}>
            <div className="flex min-h-screen flex-col gap-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-50 via-white to-purple-50/20 p-2 sm:p-6 lg:p-4">
                <div className="sticky top-2 z-40 overflow-hidden rounded-2xl border border-white/40 bg-white/70 p-2 shadow-xl shadow-purple-900/5 backdrop-blur-xl sm:static sm:p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative">
                            <h1 className="bg-gradient-to-r from-purple-800 to-indigo-700 bg-clip-text text-xl font-extrabold tracking-tight text-transparent uppercase">
                                Panel de Pedidos
                            </h1>
                            <div className="mt-1 flex items-center gap-2">
                                <span className="h-1 w-8 rounded-full bg-purple-600"></span>
                                <p className="text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                                    {business.name} • Gestión en tiempo real
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={toggleBusiness}
                            className={`group relative flex cursor-pointer items-center gap-3 overflow-hidden rounded-xl px-4 py-2 text-xs font-bold uppercase transition-all duration-300 active:scale-95 ${
                                isBusinessOpen
                                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-200 hover:bg-purple-700 hover:shadow-purple-300'
                                    : 'border-2 border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                            }`}
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                {isBusinessOpen ? (
                                    <>
                                        Abierto
                                        <Power className="h-4 w-4 animate-pulse" />
                                    </>
                                ) : (
                                    <>
                                        Cerrado
                                        <PowerOff className="h-4 w-4" />
                                    </>
                                )}
                            </span>
                        </button>
                        {isBusinessOpen ? (
                            <p className="ml-2 text-sm text-purple-600">
                                Estás recibiendo pedidos en este momento.
                            </p>
                        ) : (
                            <p className="ml-2 text-sm text-amber-600">
                                No puedes recibir pedidos mientras el negocio no
                                esta activo.
                            </p>
                        )}
                    </div>
                </div>

                <div className="scrollbar-hide flex items-center gap-2 overflow-x-auto pb-1">
                    {Object.values(Tabs).map((tab) => {
                        const isActive = activeTab === tab;
                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`relative flex items-center gap-2 rounded-xl px-5 py-2.5 text-[11px] font-bold whitespace-nowrap uppercase transition-all duration-300 hover:scale-105 active:scale-95 ${
                                    isActive
                                        ? 'bg-purple-600 text-white shadow-md shadow-purple-200'
                                        : 'border border-purple-50 bg-white text-gray-500 shadow-sm hover:bg-purple-50/50'
                                }`}
                            >
                                {tab === Tabs.Todos && (
                                    <>
                                        {pendingOrdersCount > 0 ? (
                                            <Bell
                                                className={`h-3.5 w-3.5 ${globalLateCount > 0 ? 'text-red-400' : 'text-amber-400'}`}
                                                style={{
                                                    animation:
                                                        'ring 0.5s infinite',
                                                }}
                                            />
                                        ) : null}
                                    </>
                                )}
                                {tab}
                                {isActive && (
                                    <span className="flex h-1.5 w-1.5 animate-pulse rounded-full bg-white"></span>
                                )}
                            </button>
                        );
                    })}
                </div>

                <div className="relative min-h-[500px]">
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

            <style>{`
                @keyframes ring {
                    0% { transform: rotate(0); }
                    10% { transform: rotate(15deg); }
                    20% { transform: rotate(-15deg); }
                    30% { transform: rotate(10deg); }
                    40% { transform: rotate(-10deg); }
                    50% { transform: rotate(5deg); }
                    60% { transform: rotate(-5deg); }
                    70% { transform: rotate(0); }
                    100% { transform: rotate(0); }
                }
            `}</style>
        </DashboardLayout>
    );
}
