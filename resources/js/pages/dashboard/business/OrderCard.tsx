import { useOrderStatus } from '@/hooks/useOrderStatus';
import { OrderStatus } from '@/types';
import { AlertTriangle, Clock, Loader2, Package } from 'lucide-react';

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

    const isLate = status === OrderStatus.PENDING && order.minutes_waiting > 10;

    console.log({ order });

    return (
        <div
            className={`relative flex flex-col rounded-lg bg-white p-3 shadow-sm transition-all duration-900 ${
                priority
                    ? 'animate-pulse border-2 border-purple-600 ring-4 ring-purple-50 hover:animate-none'
                    : 'border border-purple-100'
            }`}
        >
            {loading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/60 backdrop-blur-sm">
                    <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
                </div>
            )}

            <div className="flex items-start justify-between">
                <div>
                    <p className="text-[10px] leading-tight font-semibold tracking-widest text-gray-400 uppercase">
                        #{order.id}
                    </p>
                    <p className="text-sm leading-tight font-semibold text-purple-800">
                        {order.user?.name ?? ''}
                    </p>
                </div>

                <span className="flex items-center rounded-lg border border-purple-100 bg-purple-50 px-2 py-1 text-[10px] font-semibold text-purple-700 uppercase">
                    {labels[status]}
                </span>
            </div>

            <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    <Clock
                        className={`h-3.5 w-3.5 ${isLate ? 'text-amber-600' : 'text-gray-400'}`}
                    />
                    <span
                        className={`text-[11px] font-semibold ${isLate ? 'text-amber-700' : 'text-gray-600'}`}
                    >
                        {order.minutes_waiting ?? 0} MIN
                    </span>

                    {isLate && (
                        <div className="ml-1 flex items-center gap-1 rounded border border-amber-100 bg-amber-50 px-1.5 py-0.5">
                            <AlertTriangle className="h-3 w-3 text-amber-600" />
                            <span className="text-[9px] font-bold tracking-tighter text-amber-700 uppercase">
                                Retrasado
                            </span>
                        </div>
                    )}
                </div>

                <span className="text-base font-semibold text-gray-700">
                    ${order.total}
                </span>
            </div>

            {actions.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                    {actions.map((action: OrderStatus) => {
                        const isCritical =
                            action === OrderStatus.CANCELLED ||
                            action === OrderStatus.REJECTED;
                        return (
                            <button
                                key={action}
                                disabled={loading}
                                onClick={() => onChangeStatus(order.id, action)}
                                className={`flex-1 rounded-lg py-2.5 text-xs font-semibold text-white shadow-sm transition-all active:scale-95 ${
                                    isCritical
                                        ? 'bg-amber-600 hover:bg-amber-700'
                                        : 'bg-purple-600 hover:bg-purple-700'
                                }`}
                            >
                                {labels[action]}
                            </button>
                        );
                    })}
                </div>
            )}

            {status === OrderStatus.READY_FOR_PICKUP && (
                <div className="mt-4 flex flex-col items-center gap-2 rounded-lg border border-purple-100 bg-purple-50 px-3 py-3 text-center">
                    <div className="flex items-center gap-2 text-[10px] font-semibold tracking-wider text-purple-700 uppercase">
                        <Package className="h-4 w-4" />
                        <span>Esperando al repartidor</span>
                    </div>

                    {/* <div className="rounded-lg border border-purple-100 bg-white px-4 py-1.5 text-sm font-semibold text-purple-800 shadow-sm">
                        CÓDIGO:{' '}
                        <span className="ml-3 font-bold tracking-[0.4em]">
                            {order.code}
                        </span>
                    </div> */}
                </div>
            )}
        </div>
    );
}
