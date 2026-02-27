import { useOrderStatus } from '@/hooks/useOrderStatus';
import { OrderStatus } from '@/types';
import { AlertTriangle, Bike, CheckCircle, CheckCircle2, Clock, Loader2, Package, PackageCheck, Truck, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function OrderCard({
    order,
    priority,
    loading,
    onChangeStatus,
}: {
    order: any;
    priority?: boolean;
    loading?: boolean;
    onChangeStatus: (orderId: number, status: OrderStatus) => void;
}) {
    const { flow, labels } = useOrderStatus();
    const status = order.status;
    const actions = flow[status] ?? [];

    const statusIcons: Record<OrderStatus, any> = {
        [OrderStatus.PENDING]: Clock,
        [OrderStatus.CONFIRMED]: CheckCircle2,
        [OrderStatus.READY_FOR_PICKUP]: PackageCheck,
        [OrderStatus.DELIVERY_ASSIGNED]: Truck,
        [OrderStatus.PICKED_UP]: Bike,
        [OrderStatus.DELIVERED]: CheckCircle,
        [OrderStatus.CANCELLED]: XCircle,
        [OrderStatus.REJECTED]: XCircle,
    };

    const StatusIcon = statusIcons[status as OrderStatus] || Clock;

    const [minutesWaiting, setMinutesWaiting] = useState(0);

    useEffect(() => {
        const calculateTime = () => {
            const created = new Date(order.created_at).getTime();
            const now = new Date().getTime();
            setMinutesWaiting(Math.floor((now - created) / 60000));
        };

        calculateTime();
        const interval = setInterval(calculateTime, 60000);
        return () => clearInterval(interval);
    }, [order.created_at]);

    const isLate = status === OrderStatus.PENDING && minutesWaiting > 1;
    const isCriticalTime = status === OrderStatus.PENDING && minutesWaiting > 2;
    return (
        <div
            className={`group relative flex flex-col overflow-hidden rounded-2xl bg-white p-5 shadow-sm transition-all duration-500 hover:shadow-xl hover:shadow-purple-900/5 ${priority
                ? 'ring-2 ring-purple-600 animate-pulse'
                : 'border border-purple-100'
                }`}
        >
            {/* Glassmorphism Loading Overlay */}
            {loading && (
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/40 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="rounded-full bg-white p-3 shadow-lg">
                        <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
                    </div>
                </div>
            )}

            {/* Top Shine Effect */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent"></div>

            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                            #{order.id}
                        </span>
                        {priority && (
                            <span className="flex h-1.5 w-1.5 rounded-full bg-purple-600 animate-ping"></span>
                        )}
                    </div>
                    <p className="mt-0.5 text-base font-bold text-gray-900 line-clamp-1">
                        {order.user?.name ?? 'Cliente Invitado'}
                    </p>
                </div>

                <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-wider ${status === OrderStatus.PENDING ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                    status === OrderStatus.CONFIRMED ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                        status === OrderStatus.DELIVERED ? 'bg-green-100 text-green-700 border border-green-200' :
                            'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}>
                    <StatusIcon className="h-3 w-3" />
                    {labels[status]}
                </div>
            </div>

            <div className="mt-6 flex items-end justify-between">
                <div className="space-y-1.5">
                    {status !== OrderStatus.DELIVERED && (
                        <div className="flex items-center gap-2">
                            <div className={`rounded-lg p-1.5 ${isCriticalTime ? 'bg-red-50' : isLate ? 'bg-amber-50' : 'bg-gray-50'}`}>
                                <Clock
                                    className={`h-3.5 w-3.5 ${isCriticalTime ? 'text-red-600' : isLate ? 'text-amber-600' : 'text-gray-400'}`}
                                />
                            </div>
                            <span
                                className={`text-xs font-bold leading-none ${isCriticalTime ? 'text-red-600' : isLate ? 'text-amber-700' : 'text-gray-600'}`}
                            >
                                {minutesWaiting}m de espera
                            </span>
                        </div>
                    )}

                    {isLate && (
                        <div className="flex items-center gap-1.5 rounded-lg border border-amber-100 bg-amber-50/50 px-2.5 py-1 animate-bounce-subtle">
                            <AlertTriangle className="h-3 w-3 text-amber-600" />
                            <span className="text-[9px] font-bold tracking-tight text-amber-700 uppercase">
                                Latencia Crítica
                            </span>
                        </div>
                    )}
                </div>

                <div className="text-right">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total</p>
                    <p className="text-xl font-black text-purple-900 tracking-tight">
                        ${order.total}
                    </p>
                </div>
            </div>

            {actions.length > 0 && (
                <div className="mt-6 flex flex-col gap-2">
                    {actions.map((action: OrderStatus) => {
                        const isPrimary = action === OrderStatus.CONFIRMED || action === OrderStatus.READY_FOR_PICKUP || action === OrderStatus.DELIVERED;
                        const isCritical = action === OrderStatus.CANCELLED || action === OrderStatus.REJECTED;

                        return (
                            <button
                                key={action}
                                disabled={loading}
                                onClick={() => onChangeStatus(order.id, action)}
                                className={`relative flex items-center justify-center gap-2 overflow-hidden rounded-xl py-3 text-[10px] font-black uppercase tracking-widest transition-all duration-300 active:scale-[0.98] ${isPrimary
                                    ? 'bg-purple-600 text-white shadow-md shadow-purple-900/10 hover:bg-purple-700 hover:shadow-purple-900/20'
                                    : isCritical
                                        ? 'border-2 border-amber-100 bg-amber-50 text-amber-700 hover:bg-amber-100'
                                        : 'border-2 border-gray-100 bg-gray-50 text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {labels[action]}
                                {isPrimary && <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:animate-shimmer"></div>}
                            </button>
                        );
                    })}
                </div>
            )}

            {status === OrderStatus.READY_FOR_PICKUP && (
                <div className="mt-6 overflow-hidden rounded-xl border border-purple-100 bg-gradient-to-br from-purple-50 to-white p-4">
                    <div className="flex items-center justify-center gap-3">
                        <div className="relative">
                            <div className="absolute inset-0 animate-ping rounded-full bg-purple-400 opacity-20"></div>
                            <Package className="h-5 w-5 text-purple-600" />
                        </div>
                        <span className="text-[10px] font-bold tracking-widest text-purple-800 uppercase">
                            Esperando Repartidor
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
