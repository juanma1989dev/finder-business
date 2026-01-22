import BusinessCard from '@/components/app/BusinessCard';
import MainFilters from '@/components/app/MainFilters';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Map, MapControls } from '@/components/ui/map';
import { Switch } from '@/components/ui/switch';
import { useGeolocation } from '@/hooks/use-Geolocation';
import MainLayout from '@/layouts/main-layout';
import { SharedData } from '@/types';
import { router, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    AlertTriangle,
    DollarSign,
    MapPin,
    Search,
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
}

const DEFAULT_DISTANCE = 5;

const GridOverlayLoader = () => (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-purple-600" />
            <span className="text-sm font-medium text-gray-600">
                Actualizando resultados...
            </span>
        </div>
    </div>
);

export default function Index({
    businesses,
    categories,
    filters,
    products,
    meta,
}: Props) {
    // const [route, setRoute] = useState<[number, number][]>([]);

    // const origin = [-97.219956, 17.4568381]; // 1 ,
    // // const waypoint = [-97.2284531, 17.4624704]; // 2
    // const destination = [-97.2208918, 17.4595263]; // 3
    // useEffect(() => {
    //     const getRoute = async () => {
    //         try {
    //             // La URL ahora lleva los 3 puntos separados por punto y coma (;)
    //             const url = `https://router.project-osrm.org/route/v1/driving/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?overview=full&geometries=geojson`;
    //             // const url = `https://router.project-osrm.org/route/v1/driving/${origin[0]},${origin[1]};${waypoint[0]},${waypoint[1]};${destination[0]},${destination[1]}?overview=full&geometries=geojson`;

    //             // http://router.project-osrm.org/route/v1/driving/13.388860,52.517037;13.397634,52.529407;13.428555,52.523219?overview=false

    //             const query = await fetch(url);
    //             const data = await query.json();

    //             if (data.routes && data.routes[0]) {
    //                 setRoute(data.routes[0].geometry.coordinates);
    //             }
    //         } catch (error) {
    //             console.error(
    //                 'Error al calcular la ruta por Soledad Etla:',
    //                 error,
    //             );
    //         }
    //     };

    //     getRoute();
    // }, []);

    const { auth } = usePage<SharedData>().props;
    const { user } = auth;

    // console.log({ user });

    const [loading, setLoading] = useState(false);
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

    const updateFilters = (newFilters: Filters) => {
        setLoading(true);
        setFiltersUser(newFilters);
    };

    const handleClearFilters = () => {
        updateFilters({
            query: '',
            category: null,
            distance: DEFAULT_DISTANCE,
            foodType: null,
        });
    };

    const hasActiveFilters =
        filtersUser.query || filtersUser.category || filtersUser.distance;

    if (loadingLocation && !loading) {
        return <GridOverlayLoader />;
    }

    const labelDeliveryIsAvailable = user.is_available
        ? 'Disponible'
        : 'No disponible';

    const handleChangeAvailability = () => {
        router.patch(
            '/delivery/availability',
            {
                status: !user.is_available,
            },
            {
                onSuccess: () => {
                    user.is_available = !user.is_available;
                },
                onError: () => {
                    user.is_available = !user.is_available;
                },
            },
        );
    };

    const hasActiveOrder = false; // user.active_order !== null; // boolean  - Cuando hay una entrega activa

    const playBlockedSound = () => {
        const audio = new Audio('/sounds/blocked.mp3');
        audio.volume = 0.6;
        audio.play().catch(() => {});
    };

    return (
        <>
            {user.type === 'delivery' ? (
                <MainLayout>
                    <div className="space-y-2 p-2">
                        {/* Header simple */}
                        <Card className="rounded-xl py-2">
                            <CardContent className="flex items-center justify-between p-2">
                                {/* Perfil */}
                                <div className="flex items-center gap-2">
                                    <img
                                        src="https://i.pravatar.cc/100"
                                        alt="Repartidor"
                                        className="h-10 w-10 rounded-full"
                                    />
                                    <div>
                                        <p className="font-medium">
                                            {user.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Repartidor
                                        </p>
                                    </div>
                                </div>

                                {/* Switch */}
                                <div
                                    className={`flex items-center gap-2 rounded-lg border px-2 py-1 ${hasActiveOrder ? 'cursor-not-allowed opacity-60' : ''}`}
                                >
                                    <Label
                                        htmlFor="disponibilidad"
                                        className="text-xs"
                                    >
                                        {user.is_available
                                            ? 'Recibiendo pedidos'
                                            : 'No recibir pedidos'}
                                    </Label>
                                    <div
                                        onClick={() => {
                                            if (hasActiveOrder) {
                                                playBlockedSound();
                                            }
                                        }}
                                        className={
                                            hasActiveOrder
                                                ? 'cursor-not-allowed'
                                                : ''
                                        }
                                    >
                                        <Switch
                                            id="disponibilidad"
                                            checked={user.is_available}
                                            disabled={hasActiveOrder}
                                            onCheckedChange={
                                                handleChangeAvailability
                                            }
                                            className="focus-visible:ring-orange-500 data-[state=checked]:bg-orange-500"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Mapa simple (clave en zona rural) */}
                        <Card className="overflow-hidden rounded-xl p-0">
                            <div className="h-80 bg-gray-200">
                                <Map
                                    center={[-97.2275336, 17.4606859]}
                                    zoom={16}
                                    theme="light"
                                >
                                    <MapControls
                                        position="bottom-right"
                                        showZoom
                                        showLocate
                                    />
                                </Map>
                            </div>
                            {/* <CardContent className="flex justify-between p-2 text-xs">
                                <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" /> 3.2 km
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" /> 10 min
                                </div>
                            </CardContent> */}
                        </Card>

                        {/* Oferta clara y directa */}
                        <Card className="rounded-xl py-2">
                            <CardContent className="space-y-2 p-2">
                                <p className="font-medium">Nueva entrega</p>
                                <p className="text-sm text-muted-foreground">
                                    Tienda local → Cliente
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1 font-semibold">
                                        <DollarSign className="h-4 w-4" />{' '}
                                        $30,000
                                    </div>
                                    <Button className="rounded-lg bg-orange-500 px-2 hover:bg-orange-600">
                                        Aceptar
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pedido activo */}
                        <Card className="rounded-xl py-2">
                            <CardContent className="space-y-2 p-2">
                                <p className="font-medium">Pedido en curso</p>
                                <p className="text-sm text-muted-foreground">
                                    2 productos + bebida
                                </p>
                                <div className="flex gap-2 pt-1">
                                    <Button className="flex-1 rounded-lg bg-green-600 hover:bg-green-700">
                                        Llegué
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        className="flex-1 rounded-lg"
                                    >
                                        <AlertTriangle className="mr-1 h-4 w-4" />{' '}
                                        Problema
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Ganancias simples */}
                        {/* <Card className="rounded-xl">
                            <CardContent className="p-3">
                                <p className="text-sm">Ganancia hoy</p>
                                <p className="text-xl font-semibold text-green-600">
                                    $95,000
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Objetivo diario casi logrado
                                </p>
                            </CardContent>
                        </Card> */}
                    </div>
                </MainLayout>
            ) : (
                <MainLayout>
                    {geoError && (
                        <div className="mb-4 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
                            <AlertCircle className="h-5 w-5 flex-shrink-0 text-amber-600" />
                            <div>
                                <h4 className="font-semibold text-amber-800">
                                    No pudimos obtener tu ubicación
                                </h4>
                                <p className="mt-1 text-sm text-amber-700">
                                    {businesses.length > 0
                                        ? 'Mostrando negocios disponibles. Habilita la ubicación para ver los más cercanos.'
                                        : 'Habilita la ubicación para ver negocios cercanos.'}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Filtros principales */}
                    <MainFilters
                        categories={categories}
                        filters={filtersUser}
                        onFiltersChange={updateFilters}
                        foodTypes={products.categories}
                    />

                    {/* Categorías de productos */}

                    {/* Grid de negocios */}
                    <div className="min-h-[400px]">
                        {loading && <GridOverlayLoader />}
                        {businesses.length > 0 ? (
                            <>
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <p className="text-sm text-gray-600">
                                            <span className="font-semibold text-gray-900">
                                                {meta.total}
                                            </span>{' '}
                                            {businesses.length === 1
                                                ? 'negocio encontrado'
                                                : 'negocios encontrados'}
                                        </p>
                                        {latitude && longitude && (
                                            <span className="flex items-center gap-1 rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700">
                                                <MapPin className="h-3 w-3" />
                                                Cerca de ti
                                            </span>
                                        )}
                                        {hasActiveFilters && (
                                            <button
                                                onClick={handleClearFilters}
                                                className="ml-12 cursor-pointer text-sm text-gray-600 text-purple-500 transition-colors duration-200 hover:text-gray-900 hover:text-purple-700"
                                            >
                                                Limpiar filtros
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {businesses.map((business: any) => (
                                        <BusinessCard
                                            key={business.id}
                                            business={business}
                                            modeEdit={false}
                                        />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center py-16 text-center">
                                <Search className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                                <h3 className="mb-2 text-lg font-semibold text-gray-700">
                                    No hay resultados
                                </h3>
                                <p className="mb-4 text-gray-500">
                                    {hasActiveFilters
                                        ? 'Intenta ajustar tus filtros de búsqueda.'
                                        : geoError
                                          ? 'Habilita tu ubicación para ver negocios cercanos.'
                                          : 'No hay negocios disponibles.'}
                                </p>
                                {hasActiveFilters && (
                                    <button
                                        onClick={handleClearFilters}
                                        className="rounded-lg bg-purple-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-purple-700"
                                    >
                                        Limpiar filtros
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                    {/* <Card className="h-[500px] w-[800px] overflow-hidden bg-red-700 p-0">
                <Map center={[-97.2275336, 17.4606859]} zoom={14} theme="light">
                    <MapRoute
                        coordinates={route}
                        color="#3b82f6"
                        width={4}
                        opacity={0.8}
                    />

                    <MapControls
                        position="bottom-right"
                        showZoom
                        showLocate
                        showFullscreen
                    />
                </Map>
            </Card> */}
                </MainLayout>
            )}
        </>
    );
}
