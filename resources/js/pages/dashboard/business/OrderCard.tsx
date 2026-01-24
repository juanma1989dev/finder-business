import { useOrderStatus } from '@/hooks/useOrderStatus';
import { OrderStatus } from '@/types';
import { AlertTriangle, Clock, Zap } from 'lucide-react';

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
    const primaryAction = actions[0];

    const isLate = status === OrderStatus.PENDING && order.minutes_waiting > 10;

    console.log(flow, status, actions);

    return (
        <div
            className={`relative flex flex-col rounded-2xl bg-white p-4 shadow-sm transition ${
                priority ? 'ring-2 ring-indigo-500' : 'border border-slate-200'
            }`}
        >
            {/* ===== PRIORITY BADGE ===== */}
            {priority && (
                <span className="absolute -top-2 -right-2 flex items-center gap-1 rounded-full bg-indigo-600 px-3 py-1 text-xs font-black text-white shadow">
                    <Zap className="h-3 w-3" />
                    Siguiente
                </span>
            )}

            {/* ===== HEADER ===== */}
            <div className="flex justify-between">
                <div>
                    <p className="text-xs font-black text-slate-400">
                        #{order.id}
                    </p>
                    <p className="font-bold text-slate-900">
                        {order.user?.name ?? 'Cliente'}
                    </p>
                </div>

                <span className="rounded-lg bg-orange-50 px-2 py-1 text-xs font-black text-orange-600 uppercase">
                    {labels[status]}
                </span>
            </div>

            {/* ===== INFO ===== */}
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {order.minutes_waiting ?? 0} min
                    {isLate && (
                        <span className="ml-1 flex items-center gap-1 font-bold text-rose-600">
                            <AlertTriangle className="h-3 w-3" />
                            Retrasado
                        </span>
                    )}
                </span>

                <span className="text-lg font-black text-slate-900">
                    ${order.total}
                </span>
            </div>

            {/* ===== ACTION ===== */}
            {actions.length > 0 && (
                <div className="mt-3 flex flex-wrap justify-between gap-2">
                    {actions.map((action: OrderStatus) => (
                        <button
                            key={action}
                            disabled={loading}
                            onClick={() => onChangeStatus(order.id, action)}
                            className={`mt-4 w-full flex-1 rounded-xl py-3 text-xs font-black text-white ${
                                action === OrderStatus.CANCELLED ||
                                action === OrderStatus.REJECTED
                                    ? 'bg-rose-600'
                                    : 'bg-emerald-600'
                            }`}
                        >
                            {labels[action]}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
