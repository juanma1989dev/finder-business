import { CircleX, Filter, MapPin, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

const distances = [
    { label: '5 km', value: 5 },
    { label: '10 km', value: 10 },
    { label: '15 km', value: 15 },
    { label: '20 km', value: 20 },
];

// Tipo para los filtros
export interface Filters {
    query: string;
    category: string | null;
    distance: number | null;
}

interface Props {
    categories: any[];
    filters: Filters;
    onFiltersChange: (filters: Filters) => void;
}

export default function MainFilters({
    categories,
    filters,
    onFiltersChange,
}: Props) {
    // Estado local para el input (debounce)
    const [localQuery, setLocalQuery] = useState(filters?.query || '');

    // Efecto de debounce (500ms)
    useEffect(() => {
        const handler = setTimeout(() => {
            if (filters) {
                onFiltersChange({ ...filters, query: localQuery });
            }
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [localQuery]);

    const handleCategoryChange = (value: string) => {
        onFiltersChange({
            ...filters,
            category: value || null,
        });
    };

    const handleDistanceChange = (value: string) => {
        onFiltersChange({
            ...filters,
            distance: value ? Number(value) : null,
        });
    };

    return (
        <div className="mb-4 rounded-2xl border border-gray-100 bg-white p-2 shadow-sm">
            <div className="flex w-full flex-col items-center gap-4 text-black sm:flex-row">
                {/* 🔎 Búsqueda */}
                <div className="relative w-full max-w-md flex-1">
                    <Search className="absolute top-1/2 left-2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar negocios..."
                        value={localQuery}
                        onChange={(e) => setLocalQuery(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 py-1 pr-2 pl-10 text-gray-700 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-orange-600"
                    />
                    <CircleX
                        className="absolute top-1/2 right-2 h-5 w-5 -translate-y-1/2 transform text-gray-400"
                        onClick={() => setLocalQuery('')}
                    />
                </div>

                {/* Categorías */}
                <div className="flex w-full items-center sm:w-auto">
                    <span className="mr-2">Categoria</span>
                    <div className="flex w-full items-center space-x-2 rounded-xl border border-gray-200 bg-gray-50 px-2 py-1 sm:w-auto">
                        <Filter className="h-4 w-4 text-gray-500" />
                        <select
                            value={filters?.category ?? ''}
                            onChange={(e) =>
                                handleCategoryChange(e.target.value)
                            }
                            className="w-full cursor-pointer bg-transparent font-medium text-gray-700 focus:outline-none sm:w-auto"
                        >
                            <option value="">Todas</option>
                            {categories.map((cat: any) => (
                                <option
                                    key={cat?.id}
                                    value={cat?.id}
                                    className="bg-white"
                                >
                                    {cat?.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Distancia */}
                <div className="flex w-full items-center sm:w-auto">
                    <span className="mr-2">Distancia</span>
                    <div className="flex w-full items-center space-x-2 rounded-xl border border-gray-200 bg-gray-50 px-2 py-1 sm:w-auto">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <select
                            value={filters?.distance ?? ''}
                            onChange={(e) =>
                                handleDistanceChange(e.target.value)
                            }
                            className="w-full cursor-pointer bg-transparent font-medium text-gray-700 focus:outline-none sm:w-auto"
                        >
                            {distances.map((distance) => (
                                <option
                                    key={distance.value}
                                    value={distance.value}
                                    className="bg-white"
                                >
                                    {distance.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}
