import { useOrderStatus } from '@/hooks/useOrderStatus';
import { OrderStatus } from '@/types';
import OrderCard from './OrderCard';

interface Props {
    orders: any[];
    loadingOrderId?: number | null;
    onChangeStatus: (orderId: number, status: OrderStatus) => void;
}

export default function GridOrders({
    orders,
    loadingOrderId,
    onChangeStatus,
}: Props) {
    const { flow } = useOrderStatus();

    const sortedOrders = [...orders].sort((a, b) => {
        // Pendientes primero
        if (
            a.status === OrderStatus.PENDING &&
            b.status !== OrderStatus.PENDING
        )
            return -1;
        if (
            a.status !== OrderStatus.PENDING &&
            b.status === OrderStatus.PENDING
        )
            return 1;

        // Más tiempo esperando primero
        return (b.minutes_waiting ?? 0) - (a.minutes_waiting ?? 0);
    });

    if (sortedOrders.length === 0) {
        return (
            <div className="col-span-full rounded-3xl border-2 border-dashed bg-white p-12 text-center">
                <p className="font-bold text-slate-500">
                    No hay pedidos en cola
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sortedOrders.map((order, index) => (
                <OrderCard
                    key={order.id}
                    order={order}
                    priority={index === 0}
                    loading={loadingOrderId === order.id}
                    onChangeStatus={onChangeStatus}
                />
            ))}
        </div>
    );
}
