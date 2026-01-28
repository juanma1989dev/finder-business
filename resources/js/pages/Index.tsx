import { router } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle,
    ChevronDown,
    ChevronUp,
    Search,
    Truck,
} from 'lucide-react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';

import BusinessCard from '@/components/app/BusinessCard';
import MainFilters from '@/components/app/MainFilters';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useGeolocation } from '@/hooks/use-Geolocation';
import MainLayout from '@/layouts/main-layout';

// --- Types ---
type OrderStatus =
    | 'pending'
    | 'confirmed'
    | 'ready_for_pickup'
    | 'picked_up'
    | 'on_the_way'
    | 'delivered';

interface OrderItem {
    id: string | number;
    quantity: number;
    name: string;
}
interface Order {
    id: string | number;
    status: OrderStatus;
    items: OrderItem[];
}

interface Props {
    businesses: any[];
    categories: any[];
    filters: { q?: string; category?: string; distance?: number };
    products: { categories: any[] };
    activeOrder?: Order;
}

const STEPS: { key: OrderStatus; label: string }[] = [
    { key: 'pending', label: 'Creado' },
    { key: 'confirmed', label: 'Confirmado' },
    { key: 'ready_for_pickup', label: 'Listo' },
    { key: 'picked_up', label: 'Recogido' },
    { key: 'on_the_way', label: 'En camino' },
    { key: 'delivered', label: 'Entregado' },
];

export default function Index({
    businesses,
    categories,
    filters,
    products,
    activeOrder,
}: Props) {
    const [loading, setLoading] = useState(false);
    const [collapsed, setCollapsed] = useState(true);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [orderDetail, setOrderDetail] = useState<Order | null>(null);
    const [filtersUser, setFiltersUser] = useState({
        query: filters.q || '',
        category: filters.category || null,
        distance: filters.distance || 5,
        foodType: null,
    });

    const isFirstRender = useRef(true);
    const {
        latitude,
        longitude,
        error: geoError,
        loading: loadingLocation,
    } = useGeolocation({
        enableHighAccuracy: true,
        enableIPFallback: true,
    });

    const handleSearch = useCallback(() => {
        setLoading(true);
        const params: any = {
            q: filtersUser.query,
            category: filtersUser.category,
            distance: filtersUser.distance,
            foodType: filtersUser.foodType,
        };

        const headers: any = {};
        if (latitude && longitude) {
            headers['X-Latitude'] = latitude.toString();
            headers['X-Longitude'] = longitude.toString();
        }

        router.get('/', params, {
            headers,
            preserveState: true,
            preserveScroll: true,
            replace: true,
            onFinish: () => setLoading(false),
        });
    }, [filtersUser, latitude, longitude]);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        if (!loadingLocation) handleSearch();
    }, [filtersUser, loadingLocation]);

    return (
        <MainLayout>
            <div className="flex h-full flex-col overflow-hidden">
                <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl">
                    <div className="px-4 pt-2 pb-3">
                        <MainFilters
                            categories={categories}
                            filters={filtersUser}
                            onFiltersChange={setFiltersUser}
                            foodTypes={products.categories}
                        />
                    </div>

                    {activeOrder?.id && (
                        <div className="px-4 pb-3">
                            <Card className="overflow-hidden border-none bg-indigo-600 shadow-lg ring-1 ring-white/20">
                                <CardContent className="p-0">
                                    <div
                                        className="flex cursor-pointer items-center justify-between p-3 text-white active:bg-indigo-700"
                                        onClick={() => setCollapsed(!collapsed)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <Truck
                                                    size={20}
                                                    className="animate-pulse"
                                                />
                                                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-200 opacity-75"></span>
                                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-100"></span>
                                                </span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold tracking-widest uppercase opacity-70">
                                                    En curso
                                                </span>
                                                <span className="text-sm font-bold">
                                                    {
                                                        STEPS.find(
                                                            (s) =>
                                                                s.key ===
                                                                activeOrder.status,
                                                        )?.label
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.get(
                                                        `/orders/${activeOrder.id}`,
                                                        {},
                                                        {
                                                            only: ['order'],
                                                            onSuccess: (p) => {
                                                                setOrderDetail(
                                                                    p.props
                                                                        .order as Order,
                                                                );
                                                                setShowOrderModal(
                                                                    true,
                                                                );
                                                            },
                                                        },
                                                    );
                                                }}
                                                className="rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold transition-all hover:bg-white/30"
                                            >
                                                Ver orden
                                            </button>
                                            {collapsed ? (
                                                <ChevronDown size={18} />
                                            ) : (
                                                <ChevronUp size={18} />
                                            )}
                                        </div>
                                    </div>
                                    {!collapsed && (
                                        <div className="border-t border-white/10 bg-white p-4">
                                            <OrderTimeline
                                                status={activeOrder.status}
                                            />
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {geoError && (
                        <div className="mx-4 mb-2 flex items-center justify-center gap-2 rounded-full bg-amber-50 py-1 text-amber-600 ring-1 ring-amber-100">
                            <AlertCircle size={12} />
                            <span className="text-[10px] font-bold">
                                Habilita el GPS para ver distancia real
                            </span>
                        </div>
                    )}
                </div>

                <div className="scrollbar-hide flex-1 overflow-y-auto px-4 pb-24">
                    {loading && businesses.length > 0 && (
                        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-1 animate-pulse bg-indigo-600" />
                    )}

                    <div className="relative py-2">
                        {businesses.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {businesses.map((b) => (
                                    <BusinessCard
                                        key={b.id}
                                        business={b}
                                        modeEdit={false}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 opacity-40">
                                <Search size={48} strokeWidth={1} />
                                <p className="mt-4 text-sm font-medium">
                                    Sin resultados por aquí
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Dialog open={showOrderModal} onOpenChange={setShowOrderModal}>
                <DialogContent className="fixed top-auto bottom-0 w-full max-w-none translate-y-0 gap-0 overflow-hidden rounded-t-[2.5rem] p-0 outline-none sm:top-1/2 sm:bottom-auto sm:max-w-md sm:-translate-y-1/2 sm:rounded-2xl">
                    <div className="flex flex-col bg-white pb-8">
                        <div className="mx-auto my-3 h-1.5 w-12 rounded-full bg-gray-200 sm:hidden" />
                        <DialogHeader className="px-6 py-4">
                            <DialogTitle className="text-xl font-black text-indigo-600 italic">
                                ORDEN #{orderDetail?.id}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="max-h-[70dvh] overflow-y-auto px-6">
                            {orderDetail && <OrderDetail order={orderDetail} />}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </MainLayout>
    );
}

const OrderTimeline = memo(({ status }: { status: OrderStatus }) => {
    const STATUS_INDEX: Record<string, number> = {
        pending: 0,
        confirmed: 1,
        ready_for_pickup: 2,
        picked_up: 3,
        on_the_way: 4,
        delivered: 5,
    };
    const current = STATUS_INDEX[status] ?? 0;

    return (
        <div className="flex w-full items-start justify-between">
            {STEPS.map((step, index) => (
                <div
                    key={step.key}
                    className="flex flex-1 flex-col items-center"
                >
                    <div className="relative flex w-full items-center justify-center">
                        {index !== 0 && (
                            <div
                                className={`absolute top-2 right-1/2 left-[-50%] h-[2px] ${index <= current ? 'bg-indigo-500' : 'bg-gray-100'}`}
                            />
                        )}
                        <div
                            className={`relative z-10 h-4 w-4 rounded-full border-2 bg-white transition-all duration-500 ${index < current ? 'border-green-500 bg-green-500' : index === current ? 'scale-110 border-indigo-600' : 'border-gray-200'}`}
                        >
                            {index < current && (
                                <CheckCircle className="h-full w-full p-0.5 text-white" />
                            )}
                            {index === current && (
                                <div className="m-0.5 h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-600" />
                            )}
                        </div>
                    </div>
                    <span
                        className={`mt-2 text-[7px] font-black tracking-tighter uppercase ${index === current ? 'text-indigo-600' : 'text-gray-400'}`}
                    >
                        {step.label}
                    </span>
                </div>
            ))}
        </div>
    );
});

const OrderDetail = memo(({ order }: { order: Order }) => (
    <div className="space-y-6">
        <div className="rounded-2xl bg-gray-50 p-4 ring-1 ring-black/5">
            <OrderTimeline status={order.status} />
        </div>
        <div>
            <h4 className="mb-3 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                Tus Productos
            </h4>
            <div className="space-y-3">
                {order.items.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center justify-between rounded-xl bg-white p-3 shadow-sm ring-1 ring-black/5"
                    >
                        <div className="flex items-center gap-3">
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-xs font-bold text-indigo-600">
                                {item.quantity}x
                            </span>
                            <span className="text-sm font-semibold text-gray-800">
                                {item.name}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
));
