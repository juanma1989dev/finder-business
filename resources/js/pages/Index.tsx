import BusinessCard from '@/components/app/BusinessCard';
import MainFilters from '@/components/app/MainFilters';
import { Card, CardContent } from '@/components/ui/card';
import { useGeolocation } from '@/hooks/use-Geolocation';
import MainLayout from '@/layouts/main-layout';
import { router } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle,
    ChevronDown,
    ChevronUp,
    Circle,
    Search,
    Truck,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface Filters {
    query: string;
    category: string | null;
    distance: number | null;
    foodType: number | null;
}

interface Props {
    businesses: any[];
    categories: any[];
    filters: {
        q?: string;
        category?: string;
        distance?: number;
    };
    products: {
        categories: any[];
    };
    meta: {
        total: number;
        hasGeolocation: boolean;
        appliedFilters: string[];
    };
    activeOrder?: any;
}

const DEFAULT_DISTANCE = 5;

const STEPS = [
    { key: 'pending', label: 'Creado' },
    { key: 'confirmed', label: 'Confirmado' },
    { key: 'ready_for_pickup', label: 'Listo para recoger' },
    { key: 'picked_up', label: 'Recogido' },
    { key: 'on_the_way', label: 'En camino' },
    { key: 'delivered', label: 'Entregado' },
];

const STATUS_VIBRATION: Record<string, number | number[]> = {
    pending: 100,
    confirmed: [100, 50, 100],
    ready_for_pickup: [150, 50, 150],
    picked_up: [200, 50, 200],
    on_the_way: [300],
    delivered: [100, 50, 100, 50, 300],
};

const vibrate = (pattern: number | number[]) => {
    if ('vibrate' in navigator) {
        navigator.vibrate(pattern);
    }
};

export default function Index({
    businesses,
    categories,
    filters,
    products,
    meta,
    activeOrder,
}: Props) {
    const [loading, setLoading] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    const [filtersUser, setFiltersUser] = useState<Filters>({
        query: filters.q || '',
        category: filters.category || null,
        distance: filters.distance || DEFAULT_DISTANCE,
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
        timeout: 10000,
        enableIPFallback: true,
        cacheMinutes: 30,
    });

    const handleSearch = useCallback(() => {
        const queryFilters: any = {};
        if (filtersUser.query) queryFilters.q = filtersUser.query;
        if (filtersUser.category) queryFilters.category = filtersUser.category;
        if (filtersUser.distance) queryFilters.distance = filtersUser.distance;
        if (filtersUser.foodType) queryFilters.foodType = filtersUser.foodType;

        const headers: any = {};
        if (latitude && longitude) {
            headers['X-Latitude'] = latitude.toString();
            headers['X-Longitude'] = longitude.toString();
        }

        router.get('/', queryFilters, {
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
        if (loadingLocation) return;
        handleSearch();
    }, [filtersUser]);

    const lastStatusRef = useRef<string | null>(null);

    useEffect(() => {
        if (!activeOrder?.status) return;

        if (
            lastStatusRef.current &&
            lastStatusRef.current !== activeOrder.status
        ) {
            vibrate(STATUS_VIBRATION[activeOrder.status] ?? 100);
        }

        lastStatusRef.current = activeOrder.status;
    }, [activeOrder?.status]);

    /* 🔄 POLLING DEL PEDIDO */
    useEffect(() => {
        if (!activeOrder?.id) return;

        const interval = setInterval(() => {
            router.reload({
                only: ['activeOrder'],
                preserveScroll: true,
                replace: true,
            });
        }, 10000);

        return () => clearInterval(interval);
    }, [activeOrder?.id]);

    return (
        <MainLayout>
            {geoError && (
                <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
                    <div className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-amber-600" />
                        <p className="text-sm text-amber-700">
                            Habilita tu ubicación para mejores resultados.
                        </p>
                    </div>
                </div>
            )}

            {activeOrder?.id && (
                <div className="sticky top-14 z-40 mb-3">
                    <Card className="border-purple-200 bg-purple-50 p-0 shadow-sm">
                        <CardContent className="space-y-2 p-3">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold text-purple-800">
                                    Pedido #{activeOrder.id}
                                </p>

                                <button
                                    onClick={() => setCollapsed((v) => !v)}
                                    className="text-purple-700"
                                >
                                    {collapsed ? (
                                        <ChevronDown size={18} />
                                    ) : (
                                        <ChevronUp size={18} />
                                    )}
                                </button>
                            </div>

                            {!collapsed && (
                                <>
                                    <OrderTimeline
                                        status={activeOrder.status}
                                    />

                                    <button
                                        onClick={() =>
                                            router.get(
                                                `/orders/${activeOrder.id}`,
                                            )
                                        }
                                        className="w-full rounded-lg bg-purple-600 py-2 text-sm font-semibold text-white active:scale-95"
                                    >
                                        Ver seguimiento
                                    </button>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* ================= FILTROS ================= */}
            <div className="mb-4">
                <MainFilters
                    categories={categories}
                    filters={filtersUser}
                    onFiltersChange={setFiltersUser}
                    foodTypes={products.categories}
                />
            </div>

            {/* ================= LISTADO ================= */}
            <div className="relative min-h-[300px]">
                {loading && (
                    <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-sm" />
                )}

                {businesses.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {businesses.map((business: any) => (
                            <BusinessCard
                                key={business.id}
                                business={business}
                                modeEdit={false}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center py-14 text-center">
                        <Search className="mb-3 h-10 w-10 text-gray-300" />
                        <h3 className="text-base font-semibold text-gray-700">
                            No hay resultados
                        </h3>
                        <p className="text-sm text-gray-500">
                            Intenta ajustar tus filtros.
                        </p>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}

const STATUS_INDEX: Record<string, number> = {
    pending: 0,
    confirmed: 1,
    ready_for_pickup: 2,
    picked_up: 3,
    on_the_way: 4,
    delivered: 5,
};

function OrderTimeline({ status }: { status: string }) {
    const current = STATUS_INDEX[status] ?? 0;

    return (
        <div className="flex items-center justify-between gap-1">
            {STEPS.map((step, index) => {
                const completed = index < current;
                const active = index === current;

                return (
                    <div
                        key={step.key}
                        className="flex flex-col items-center gap-1 text-center"
                    >
                        {completed ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : active ? (
                            <Truck className="h-4 w-4 animate-pulse text-purple-700" />
                        ) : (
                            <Circle className="h-4 w-4 text-gray-300" />
                        )}
                        <span className="text-[10px] leading-tight text-gray-600">
                            {step.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
