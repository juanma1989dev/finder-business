import {
    AlertCircle,
    Bike,
    CheckCircle,
    ChevronDown,
    Circle,
    MapPin,
    ShieldCheck,
    Store,
    User,
} from 'lucide-react';
import {
    lazy,
    memo,
    Suspense,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';

import { useGeolocation } from '@/hooks/use-Geolocation';
import MainLayout from '@/layouts/main-layout';
import { BusinessSearchFilters } from '@/types';
import { router } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';

const MainFilters = lazy(() => import('@/components/app/MainFilters'));
const BusinessCard = lazy(() => import('@/components/app/BusinessCard'));

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
    items?: OrderItem[];
}

interface Props {
    businesses: any[];
    categories: any[];
    filters: { q?: string; category?: string; distance?: number };
    products: { categories: any[] };
    activeOrder?: Order;
}

const STEPS: { key: OrderStatus; label: string }[] = [
    { key: 'confirmed', label: 'Confirmado' },
    { key: 'ready_for_pickup', label: 'Por recoger' },
    { key: 'picked_up', label: 'Recogido' },
    { key: 'on_the_way', label: 'En camino' },
];

const STORAGE_KEY = 'active-order-expanded';

export default function Index({
    businesses,
    categories,
    filters,
    products,
    activeOrder,
}: Props) {
    const [loading, setLoading] = useState(false);
    const lastSearchKey = useRef<string | null>(null);

    const [orderDetail, setOrderDetail] = useState<Order | null>(null);

    const [filtersUser, setFiltersUser] = useState<BusinessSearchFilters>({
        query: filters.q || '',
        category: filters.category || null,
        distance: filters.distance || 5,
        foodType: null,
    });

    const [geoEnabled, setGeoEnabled] = useState(false);

    const {
        latitude,
        longitude,
        error: geoError,
        loading: loadingLocation,
    } = useGeolocation(
        geoEnabled
            ? { enableHighAccuracy: false, enableIPFallback: true }
            : (null as any),
    );

    useEffect(() => {
        const t = setTimeout(() => setGeoEnabled(true), 1500);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        if (activeOrder) {
            setOrderDetail({
                ...activeOrder,
                items: activeOrder.items ?? [],
            });
        }
    }, [activeOrder]);

    const handleSearch = useCallback(() => {
        setLoading(true);

        const params: any = {
            q: filtersUser.query,
            category: filtersUser.category,
            distance: filtersUser.distance,
            foodType: filtersUser.foodType,
        };

        const headers: any = {};

        if (typeof latitude === 'number' && typeof longitude === 'number') {
            headers['X-Latitude'] = latitude.toString();
            headers['X-Longitude'] = longitude.toString();
        }

        router.get('/', params, {
            headers,
            only: ['businesses', 'meta', 'filters'],
            preserveState: true,
            preserveScroll: true,
            replace: true,
            onFinish: () => setLoading(false),
        });
    }, [filtersUser, latitude, longitude]);

    useEffect(() => {
        if (loadingLocation) return;

        const searchKey = JSON.stringify({
            filtersUser,
            latitude,
            longitude,
        });

        if (lastSearchKey.current === searchKey) return;

        lastSearchKey.current = searchKey;

        const debounce = setTimeout(handleSearch, 120);
        return () => clearTimeout(debounce);
    }, [filtersUser, latitude, longitude, loadingLocation]);

    return (
        <MainLayout>
            <div className="flex h-full flex-col overflow-hidden">
                <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl">
                    {loadingLocation && (
                        <div className="mx-4 my-2 rounded-xl bg-blue-50 px-3 py-2 text-xs text-blue-600">
                            📍 Obteniendo tu ubicación…
                        </div>
                    )}

                    <div className="px-4 pt-2 pb-3">
                        <Suspense
                            fallback={
                                <div className="h-16 rounded-xl bg-gray-100" />
                            }
                        >
                            <MainFilters
                                categories={categories}
                                filters={filtersUser}
                                onFiltersChange={setFiltersUser}
                                foodTypes={products.categories}
                            />
                        </Suspense>
                    </div>

                    {geoError && (
                        <div className="mx-4 mb-2 flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-amber-600">
                            <AlertCircle size={12} />
                            <span className="text-[10px] font-bold">
                                Habilita el GPS
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto px-4 pb-40">
                    <Suspense fallback={<BusinessGridSkeleton />}>
                        {businesses.length === 0 && !loading ? (
                            <EmptyResults
                                distance={filtersUser.distance}
                                onIncreaseDistance={(newDistance) =>
                                    setFiltersUser((prev) => ({
                                        ...prev,
                                        distance: newDistance,
                                    }))
                                }
                            />
                        ) : (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                {businesses.map((b) => (
                                    <BusinessCard key={b.id} business={b} />
                                ))}
                            </div>
                        )}
                    </Suspense>
                </div>
            </div>

            {orderDetail && <ActiveOrderBar order={orderDetail} />}
        </MainLayout>
    );
}

interface EmptyResultsProps {
    distance: number | null;
    onIncreaseDistance: (newDistance: number) => void;
}
const EmptyResults = ({ distance, onIncreaseDistance }: EmptyResultsProps) => {
    const distanceParam = Number(distance);
    const suggestedDistance = Math.min(Number(distanceParam) * 2, 50);

    return (
        <div className="flex h-[50vh] flex-col items-center justify-center text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-purple-100">
                <AlertCircle className="h-7 w-7 text-purple-500" />
            </div>

            <p className="text-sm font-semibold text-purple-900">
                No encontramos resultados
            </p>

            <p className="mt-1 max-w-xs text-xs text-gray-500">
                Prueba ampliando la distancia de búsqueda.
            </p>

            {distanceParam < 40 && (
                <button
                    onClick={() => onIncreaseDistance(suggestedDistance)}
                    className="mt-4 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-md transition-all hover:bg-purple-700 active:scale-[0.97]"
                >
                    Buscar hasta {suggestedDistance} km
                </button>
            )}
        </div>
    );
};

const BusinessGridSkeleton = () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
            <div
                key={i}
                className="h-56 animate-pulse rounded-3xl bg-gray-200"
            />
        ))}
    </div>
);

const OrderTimeline = memo(({ status }: { status: OrderStatus }) => {
    const current = STEPS.findIndex((s) => s.key === status);

    return (
        <div className="flex items-start justify-between gap-1">
            {STEPS.map((step, index) => {
                const isCompleted = index < current;
                const isCurrent = index === current;
                const isPending = index > current;

                return (
                    <div
                        key={step.key}
                        className="flex flex-1 flex-col items-center"
                    >
                        <div className="mb-1 flex items-center justify-center">
                            {isCompleted ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : isCurrent ? (
                                <div className="relative">
                                    <div className="h-3 w-3 animate-pulse rounded-full bg-purple-600" />
                                    <div className="absolute inset-0 h-3 w-3 animate-ping rounded-full bg-purple-600 opacity-25" />
                                </div>
                            ) : (
                                <div className="h-3 w-3 rounded-full border-2 border-gray-300 bg-transparent" />
                            )}
                        </div>

                        <span
                            className={`text-center text-[10px] leading-tight font-semibold ${isCurrent ? 'text-purple-800' : isPending ? 'text-gray-300' : 'text-gray-600'} `}
                        >
                            {step.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
});

const OrderDetail = memo(({ order }: { order: Order }) => (
    <div className="space-y-2 rounded-lg border border-purple-200 bg-purple-50 p-1 shadow-sm">
        <div className="mb-4">
            <OrderTimeline status={order.status} />
        </div>
        <div className="space-y-2">
            {(order.items ?? []).map((item) => (
                <div
                    key={item.id}
                    className="flex justify-between text-sm font-normal text-gray-700"
                >
                    <span className="font-semibold text-purple-800">
                        {item.quantity}×
                    </span>
                    <span className="text-gray-600">{item.name}</span>
                </div>
            ))}
        </div>
    </div>
));

const ActiveOrderBar = memo(({ order }: { order: Order }) => {
    const [expanded, setExpanded] = useState<boolean>(() => {
        if (typeof window === 'undefined') return true;
        return sessionStorage.getItem(STORAGE_KEY) !== 'false';
    });

    const [visible, setVisible] = useState(true);

    useEffect(() => {
        sessionStorage.setItem(STORAGE_KEY, String(expanded));
    }, [expanded]);

    useEffect(() => {
        if (order.status === 'delivered') {
            const t = setTimeout(() => setVisible(false), 1200);
            return () => clearTimeout(t);
        }
    }, [order.status]);

    const CURRENT_STEP = STEPS.findIndex((s) => s.key === order.status);

    if (!visible) return null;

    return (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center p-1">
            <motion.div
                layout
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="pointer-events-auto w-full max-w-md overflow-hidden rounded-2xl border border-purple-200 bg-white/90 shadow-lg backdrop-blur-md"
            >
                <div
                    className="cursor-pointer px-4 py-3 select-none"
                    onClick={() => setExpanded(!expanded)}
                >
                    <div className="mx-auto mb-2 h-1.5 w-12 rounded-full bg-purple-200" />

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="flex items-center gap-3 pb-1 text-[10px] leading-tight font-bold tracking-wider text-purple-400 uppercase">
                                Pedido activo
                                {expanded === false && (
                                    <Circle className="h-2 w-2 animate-ping text-green-600" />
                                )}
                            </p>
                            <p className="text-sm font-bold text-purple-900">
                                ORDEN #{order.id} -{' '}
                                {STEPS[CURRENT_STEP]?.label ?? ''}
                            </p>
                        </div>
                        <motion.span
                            animate={{ rotate: expanded ? 180 : 0 }}
                            className="text-purple-500"
                        >
                            <ChevronDown size={20} />
                        </motion.span>
                    </div>
                </div>

                <AnimatePresence initial={false}>
                    {expanded && (
                        <motion.div
                            key="content"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                            <div className="max-h-[60vh] overflow-y-auto border-t border-purple-100 px-4 py-2">
                                <OrderDetail order={order} />
                            </div>

                            <div className="bg-purple-50/50 p-4">
                                <button className="w-full rounded-xl bg-purple-600 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-purple-700 active:scale-[0.98]">
                                    Ver seguimiento del pedido
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
});

const RuralDeliveryLanding = () => {
    return (
        <div className="min-h-screen bg-purple-50 font-sans">
            {/* HEADER STICKY */}
            <header className="sticky top-14 z-40 flex items-center justify-between border-b border-purple-200 bg-white/80 p-3 shadow-sm backdrop-blur-md">
                <h1 className="text-base font-semibold text-purple-800">
                    RuralDelivery
                </h1>
                <button className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition-transform active:scale-95">
                    Acceder
                </button>
            </header>

            <main className="space-y-4 p-3">
                {/* HERO SECTION */}
                <section className="relative overflow-hidden rounded-lg border border-purple-200 bg-white shadow-sm">
                    {/* Capa de Carga / Overlay simulado para estilo visual */}
                    <div className="flex flex-col items-center gap-4 p-4 md:flex-row md:p-8">
                        <div className="flex-1 space-y-3">
                            <h2 className="text-2xl leading-tight font-semibold text-purple-800">
                                El delivery que llega hasta el último kilómetro.
                            </h2>
                            <p className="text-sm font-normal text-gray-600">
                                Conectamos productores locales, repartidores
                                todoterreno y familias en zonas rurales con
                                tecnología diseñada para el campo.
                            </p>
                            <button className="rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-sm active:scale-95">
                                Comenzar ahora
                            </button>
                        </div>
                        <div className="flex h-48 w-full flex-1 items-center justify-center rounded-lg border border-purple-200 bg-purple-100">
                            {/* Imagen Hero - Representación visual */}
                            <MapPin
                                className="animate-pulse text-purple-700"
                                size={64}
                            />
                        </div>
                    </div>
                </section>

                {/* ALERTA INFORMATIVA (Paleta Amber) */}
                <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
                    <ShieldCheck className="text-amber-600" size={20} />
                    <p className="text-sm font-normal text-amber-700">
                        <span className="font-semibold">Seguridad Rural:</span>{' '}
                        Todos nuestros procesos están validados para zonas con
                        baja conectividad.
                    </p>
                </div>

                {/* SECCIÓN DE CUENTAS (Grilla Responsiva) */}
                <section>
                    <h3 className="mb-4 text-center text-base font-semibold text-gray-700">
                        Elige tu perfil en la red
                    </h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Cuenta Cliente */}
                        <div className="flex flex-col justify-between rounded-lg border border-purple-200 bg-white p-3 shadow-sm">
                            <div>
                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                                    <User
                                        className="text-purple-700"
                                        size={20}
                                    />
                                </div>
                                <h4 className="mb-1 text-sm font-semibold text-purple-800">
                                    Cuenta Cliente
                                </h4>
                                <p className="mb-3 text-sm text-gray-500">
                                    Compra productos frescos, insumos y
                                    medicinas sin salir de casa.
                                </p>
                                <ul className="mb-4 space-y-2">
                                    <li className="flex items-center gap-2 text-[10px] font-semibold text-gray-600 uppercase">
                                        <CheckCircle
                                            className="text-green-600"
                                            size={12}
                                        />{' '}
                                        Seguimiento GPS
                                    </li>
                                    <li className="flex items-center gap-2 text-[10px] font-semibold text-gray-600 uppercase">
                                        <CheckCircle
                                            className="text-green-600"
                                            size={12}
                                        />{' '}
                                        Pagos Offline
                                    </li>
                                </ul>
                            </div>
                            <button className="w-full rounded-lg border border-purple-600 py-2 text-sm font-semibold text-purple-600 active:scale-95">
                                Registrarme
                            </button>
                        </div>

                        {/* Cuenta Negocio */}
                        <div className="flex flex-col justify-between rounded-lg border border-purple-200 bg-white p-3 shadow-sm">
                            <div>
                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                                    <Store
                                        className="text-purple-700"
                                        size={20}
                                    />
                                </div>
                                <h4 className="mb-1 text-sm font-semibold text-purple-800">
                                    Cuenta Negocio
                                </h4>
                                <p className="mb-3 text-sm text-gray-500">
                                    Digitaliza tu tienda o granja y expande tu
                                    alcance a comunidades vecinas.
                                </p>
                                <ul className="mb-4 space-y-2">
                                    <li className="flex items-center gap-2 text-[10px] font-semibold text-gray-600 uppercase">
                                        <CheckCircle
                                            className="text-green-600"
                                            size={12}
                                        />{' '}
                                        Gestión de Stock
                                    </li>
                                    <li className="flex items-center gap-2 text-[10px] font-semibold text-gray-600 uppercase">
                                        <CheckCircle
                                            className="text-green-600"
                                            size={12}
                                        />{' '}
                                        Panel de Ventas
                                    </li>
                                </ul>
                            </div>
                            <button className="w-full rounded-lg border border-purple-600 py-2 text-sm font-semibold text-purple-600 active:scale-95">
                                Unir mi negocio
                            </button>
                        </div>

                        {/* Cuenta Delivery */}
                        <div className="flex flex-col justify-between rounded-lg border border-purple-200 bg-white p-3 shadow-sm">
                            <div>
                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                                    <Bike
                                        className="text-purple-700"
                                        size={20}
                                    />
                                </div>
                                <h4 className="mb-1 text-sm font-semibold text-purple-800">
                                    Cuenta Repartidor
                                </h4>
                                <p className="mb-3 text-sm text-gray-500">
                                    Sé el héroe de tu zona. Entrega pedidos en
                                    tu moto, bici o camioneta.
                                </p>
                                <ul className="mb-4 space-y-2">
                                    <li className="flex items-center gap-2 text-[10px] font-semibold text-gray-600 uppercase">
                                        <CheckCircle
                                            className="text-green-600"
                                            size={12}
                                        />{' '}
                                        Horarios Libres
                                    </li>
                                    <li className="flex items-center gap-2 text-[10px] font-semibold text-gray-600 uppercase">
                                        <CheckCircle
                                            className="text-green-600"
                                            size={12}
                                        />{' '}
                                        Cobro Semanal
                                    </li>
                                </ul>
                            </div>
                            <button className="w-full rounded-lg border border-purple-600 py-2 text-sm font-semibold text-purple-600 active:scale-95">
                                Empezar a ganar
                            </button>
                        </div>
                    </div>
                </section>

                {/* FOOTER INFO (Paleta Gris) */}
                <footer className="mt-8 border-t border-purple-200 pt-6 pb-4">
                    <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                            <p className="mb-2 text-sm font-semibold text-gray-700">
                                Compañía
                            </p>
                            <div className="flex flex-col space-y-1">
                                <span className="text-[10px] leading-tight text-gray-600">
                                    Sobre nosotros
                                </span>
                                <span className="text-[10px] leading-tight text-gray-600">
                                    Contacto rural
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="mb-2 text-sm font-semibold text-gray-700">
                                Ayuda
                            </p>
                            <div className="flex flex-col space-y-1">
                                <span className="text-[10px] leading-tight text-gray-600">
                                    Soporte 24/7
                                </span>
                                <span className="text-[10px] leading-tight text-gray-600">
                                    Zonas de Cobertura
                                </span>
                            </div>
                        </div>
                    </div>
                    <p className="text-center text-[10px] tracking-widest text-gray-300 uppercase">
                        © 2026 RuralDelivery Technology
                    </p>
                </footer>
            </main>
        </div>
    );
};
