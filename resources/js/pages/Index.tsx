import { router, usePage } from '@inertiajs/react';
import { AlertCircle, CheckCircle, Search } from 'lucide-react';
import {
    lazy,
    memo,
    Suspense,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';

import BusinessCard from '@/components/app/BusinessCard';
const MainFilters = lazy(() => import('@/components/app/MainFilters'));

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

import { useGeolocation } from '@/hooks/use-Geolocation';
import MainLayout from '@/layouts/main-layout';
import { SharedData } from '@/types';

/* ---------------- TYPES ---------------- */

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

/* ---------------- CONSTANTS ---------------- */

const STEPS: { key: OrderStatus; label: string }[] = [
    { key: 'pending', label: 'Creado' },
    { key: 'confirmed', label: 'Confirmado' },
    { key: 'ready_for_pickup', label: 'Listo para recoger' },
    { key: 'picked_up', label: 'Recogido' },
    { key: 'on_the_way', label: 'En camino' },
    { key: 'delivered', label: 'Entregado' },
];

/* ---------------- PAGE ---------------- */

export default function Index({
    businesses,
    categories,
    filters,
    products,
    activeOrder,
}: Props) {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    const isFirstRender = useRef(true);

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

    /* ---------------- GEOLOCATION (DEFERRED) ---------------- */

    const [geoEnabled, setGeoEnabled] = useState(false);

    const {
        latitude,
        longitude,
        error: geoError,
        loading: loadingLocation,
    } = useGeolocation(
        geoEnabled
            ? { enableHighAccuracy: true, enableIPFallback: true }
            : null,
    );

    useEffect(() => {
        const t = setTimeout(() => setGeoEnabled(true), 1000);
        return () => clearTimeout(t);
    }, []);

    /* ---------------- SEARCH ---------------- */

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

        if (!loadingLocation) {
            handleSearch();
        }
    }, [filtersUser]);

    /* ---------------- SKELETON STATE ---------------- */

    const showSkeleton =
        loading || (businesses.length === 0 && loadingLocation);

    /* ---------------- RENDER ---------------- */

    return (
        <MainLayout>
            <div className="flex h-full flex-col overflow-hidden">
                {/* HEADER */}
                <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl">
                    <div className="px-4 pt-2 pb-3">
                        <Suspense fallback={<div className="h-16" />}>
                            <MainFilters
                                categories={categories}
                                filters={filtersUser}
                                onFiltersChange={setFiltersUser}
                                foodTypes={products.categories}
                            />
                        </Suspense>
                    </div>

                    {geoError && (
                        <div className="mx-4 mb-2 flex items-center gap-2 rounded-full bg-amber-50 py-1 text-amber-600">
                            <AlertCircle size={12} />
                            <span className="text-[10px] font-bold">
                                Habilita el GPS para ver distancia real
                            </span>
                        </div>
                    )}
                </div>

                {/* CONTENT */}
                <div className="flex-1 overflow-y-auto px-4 pb-24">
                    <div className="py-2">
                        {showSkeleton ? (
                            <BusinessGridSkeleton />
                        ) : businesses.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {businesses.map((b) => (
                                    <BusinessCard key={b.id} business={b} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center py-20 opacity-40">
                                <Search size={48} />
                                <p className="mt-4 text-sm">
                                    Sin resultados por aquí
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showOrderModal && (
                <Dialog open={showOrderModal} onOpenChange={setShowOrderModal}>
                    <DialogContent className="bottom-0 w-full rounded-t-3xl p-0 sm:max-w-md">
                        <DialogHeader className="p-4">
                            <DialogTitle>ORDEN #{orderDetail?.id}</DialogTitle>
                        </DialogHeader>
                        {orderDetail && <OrderDetail order={orderDetail} />}
                    </DialogContent>
                </Dialog>
            )}
        </MainLayout>
    );
}

/* ---------------- SKELETON ---------------- */

const BusinessGridSkeleton = () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
            <div
                key={i}
                className="animate-pulse rounded-[2rem] border bg-white p-2"
            >
                <div className="h-48 rounded-[1.6rem] bg-gray-200" />
                <div className="space-y-3 p-3">
                    <div className="h-4 w-3/4 rounded bg-gray-200" />
                    <div className="h-3 w-1/2 rounded bg-gray-200" />
                    <div className="h-8 rounded bg-gray-100" />
                </div>
            </div>
        ))}
    </div>
);

/* ---------------- COMPONENTS ---------------- */

const OrderTimeline = memo(({ status }: { status: OrderStatus }) => {
    const current = STEPS.findIndex((s) => s.key === status);

    return (
        <div className="flex justify-between">
            {STEPS.map((step, index) => (
                <div key={step.key} className="flex flex-col items-center">
                    <div className="h-3 w-3 rounded-full border">
                        {index < current && (
                            <CheckCircle className="h-full w-full" />
                        )}
                    </div>
                    <span className="mt-1 text-[8px]">{step.label}</span>
                </div>
            ))}
        </div>
    );
});

const OrderDetail = memo(({ order }: { order: Order }) => (
    <div className="space-y-4 p-4">
        <OrderTimeline status={order.status} />
        {order.items.map((item) => (
            <div key={item.id} className="flex justify-between">
                <span>{item.quantity}x</span>
                <span>{item.name}</span>
            </div>
        ))}
    </div>
));
