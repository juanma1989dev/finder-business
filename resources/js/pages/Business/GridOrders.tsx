import { useOrderStatus } from '@/hooks/useOrderStatus';
import { OrderStatus } from '@/types';
import { PackageSearch } from 'lucide-react';
import OrderCard from '../dashboard/business/OrderCard';

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
            <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-purple-100 bg-white/50 py-24 text-center backdrop-blur-sm duration-500 animate-in fade-in zoom-in">
                <div className="relative mb-6">
                    <div className="absolute inset-0 animate-ping rounded-full bg-purple-100 opacity-20"></div>
                    <div className="relative rounded-2xl bg-gradient-to-br from-purple-50 to-white p-6 text-purple-300 shadow-inner">
                        <PackageSearch size={48} strokeWidth={1.5} />
                    </div>
                </div>
                <h3 className="text-lg font-bold tracking-tight text-purple-900 uppercase">
                    Bandeja Vacía
                </h3>
                <p className="mt-2 max-w-xs text-[11px] leading-relaxed font-medium tracking-widest text-gray-400 uppercase">
                    Estamos monitoreando tu negocio. <br />
                    Los nuevos pedidos apareceran aquí en cuanto lleguen.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 duration-1000 animate-in fade-in slide-in-from-bottom-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedOrders.map((order, index) => (
                <div
                    key={order.id}
                    className="transition-all duration-500"
                    style={{ animationDelay: `${index * 100}ms` }}
                >
                    <OrderCard
                        order={order}
                        priority={
                            index === 0 && order.status === OrderStatus.PENDING
                        }
                        loading={loadingOrderId === order.id}
                        onChangeStatus={onChangeStatus}
                    />
                </div>
            ))}
        </div>
    );
}
