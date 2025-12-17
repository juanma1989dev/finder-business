import BusinessCard from '@/components/app/BusinessCard';
import MainFilters from '@/components/app/MainFilters';
import { useGeolocation } from '@/hooks/use-Geolocation';
import MainLayout from '@/layouts/main-layout';
import { type SharedData } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
    businesses: any;
    categories: any;
    filters: {
        q?: string;
        category?: string;
    };
}

interface Filters {
    query: string;
    category: string | null;
    distance: number | null;
}

const categorias = [
    { nombre: 'Hamburguesas', icon: '🍔' },
    { nombre: 'Pizza', icon: '🍕' },
    { nombre: 'Tacos', icon: '🌮' },
    { nombre: 'Postres', icon: '🍰' },
    { nombre: 'Bebidas', icon: '🥤' },
    { nombre: 'Frutas', icon: '🍎' },
];

export default function Index({ businesses, categories, filters }: Props) {
    const { auth, errors } = usePage<SharedData>().props;

    const [filtersUser, setFiltersUser] = useState<Filters>({
        query: filters.q || '',
        category: filters.category || null,
        distance: null,
    });

    const [ready, setReady] = useState(false);

    const {
        latitude,
        longitude,
        error,
        loading: loadingLocation,
    } = useGeolocation({
        enableHighAccuracy: true,
        timeout: 10000,
        enableIPFallback: true,
        cacheMinutes: 30,
    });

    useEffect(() => {
        if (loadingLocation) return;

        const queryFilters: any = {};
        if (filtersUser.query) queryFilters.q = filtersUser.query;
        if (filtersUser.category) queryFilters.category = filtersUser.category;
        if (filtersUser.distance) queryFilters.distance = filtersUser.distance;

        const headers: any = {};
        if (latitude !== null && longitude !== null) {
            headers['X-Latitude'] = latitude.toString();
            headers['X-Longitude'] = longitude.toString();
        }

        router.get('/', queryFilters, {
            headers,
            preserveState: true,
            preserveScroll: true,
            replace: true,
            onFinish: () => setReady(true),
        });
    }, [filtersUser, latitude, longitude, loadingLocation]);

    if (loadingLocation || !ready) {
        return (
            <MainLayout>
                <div className="w-full py-16 text-center">
                    <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-purple-600"></div>
                    <p className="text-gray-600">
                        Cargando negocios filtrados...
                    </p>
                    <p className="mt-2 text-sm text-gray-400">
                        Esto nos ayudará a mostrarte negocios cercanos
                    </p>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            {/* Errores de validación */}
            {Object.keys(errors).length > 0 && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <svg
                                className="h-5 w-5 text-red-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">
                                Hay errores en los filtros de búsqueda
                            </h3>
                            <div className="mt-2 text-sm text-red-700">
                                <ul className="list-disc space-y-1 pl-5">
                                    {Object.entries(errors).map(
                                        ([field, message]) => (
                                            <li key={field}>
                                                <strong className="capitalize">
                                                    {field}:
                                                </strong>{' '}
                                                {message}
                                            </li>
                                        ),
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Mensaje de error de geolocalización */}
            {error && (
                <div className="mb-4 rounded-lg bg-yellow-50 p-4 text-yellow-800">
                    <p className="text-sm">
                        ⚠️ {error}. Mostrando todos los negocios sin filtro de
                        distancia.
                    </p>
                </div>
            )}

            <MainFilters
                categories={categories}
                filters={filtersUser}
                onFiltersChange={setFiltersUser}
            />

            {/* Categorias */}
            <div className="no-scrollbar flex gap-6 overflow-x-auto pb-2">
                {categorias.map((cat, i) => (
                    <div
                        key={i}
                        className="group flex min-w-[50px] cursor-pointer flex-col items-center gap-2"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 bg-white text-2xl shadow-sm transition-colors">
                            {cat.icon}
                        </div>
                        <span className="text-xs font-semibold text-gray-600">
                            {cat.nombre}
                        </span>
                    </div>
                ))}
            </div>

            {/* Grid de negocios */}
            {businesses.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {businesses.map((business: any, index: number) => (
                        <BusinessCard
                            key={index}
                            business={business}
                            modeEdit={false}
                        />
                    ))}
                </div>
            ) : (
                <div className="py-16 text-center">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-pink-100">
                        <Search className="h-8 w-8 text-purple-400" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-gray-700">
                        No se encontraron resultados
                    </h3>
                    <p className="mx-auto max-w-md text-gray-500">
                        Intenta con otros términos de búsqueda o selecciona una
                        categoría diferente
                    </p>
                </div>
            )}
        </MainLayout>
    );
}
