import { useOrderStatus } from '@/hooks/useOrderStatus';
import { OrderStatus } from '@/types';
import { PackageSearch } from 'lucide-react';
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
            /* PALETA GRIS Y ESTRUCTURA DE ESTADO VACÍO */
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-purple-100 bg-white py-20 text-center">
                <div className="mb-4 rounded-lg bg-purple-50 p-4 text-gray-300 shadow-sm">
                    <PackageSearch size={40} />
                </div>
                <h3 className="text-base font-semibold text-gray-700 uppercase">
                    No hay pedidos en cola
                </h3>
                <p className="mt-1 text-[10px] font-normal tracking-widest text-gray-500 uppercase">
                    Los nuevos pedidos aparecerán automáticamente aquí
                </p>
            </div>
        );
    }

    return (
        /* CONFIGURACIÓN DE GRILLA RESPONSIVA Y GAP-4 */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedOrders.map((order, index) => (
                <OrderCard
                    key={order.id}
                    order={order}
                    priority={
                        index === 0 && order.status === OrderStatus.PENDING
                    }
                    loading={loadingOrderId === order.id}
                    onChangeStatus={onChangeStatus}
                />
            ))}
        </div>
    );
}
