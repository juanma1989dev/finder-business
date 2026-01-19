import { usePage } from '@inertiajs/react';

type OrderStatus = string;

export function useOrderStatus() {
    const { orderStatus } = usePage().props as any;

    return {
        values: orderStatus.values as OrderStatus,
        labels: orderStatus.labels as Record<OrderStatus, string>,
        flow: orderStatus.flow as Record<OrderStatus, OrderStatus[]>,
    };
}
