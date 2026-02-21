import { BusinessSearchFilters } from '@/types';
import { CircleX, Filter, MapPin, Search, Utensils } from 'lucide-react';
import { useEffect, useState } from 'react';

const distances = [
    { label: '5 km', value: 5 },
    { label: '10 km', value: 10 },
    { label: '15 km', value: 15 },
    { label: '20 km', value: 20 },
];

interface Props {
    categories: any[];
    filters: BusinessSearchFilters;
    onFiltersChange: (filters: BusinessSearchFilters) => void;
    foodTypes: any[];
}

export default function MainFilters({
    categories,
    filters,
    onFiltersChange,
    foodTypes,
}: Props) {
    const [localQuery, setLocalQuery] = useState(filters?.query || '');

    useEffect(() => {
        const handler = setTimeout(() => {
            if (filters) onFiltersChange({ ...filters, query: localQuery });
        }, 500);
        return () => clearTimeout(handler);
    }, [localQuery]);

    const handleFilterChange = (
        key: keyof BusinessSearchFilters,
        value: any,
    ) => {
        onFiltersChange({ ...filters, [key]: value || null });
    };

    return (
        <div className="mx-auto w-full space-y-3 p-1">
            <div className="rounded-2xl border border-gray-100 bg-white p-2 shadow-lg shadow-purple-900/5 transition-all sm:rounded-full">
                <div className="flex flex-col items-center gap-2 sm:flex-row">
                    <div className="group relative w-full sm:flex-[1.5]">
                        <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-orange-500" />
                        <input
                            type="text"
                            placeholder="¿Qué te apetece hoy?"
                            value={localQuery}
                            onChange={(e) => setLocalQuery(e.target.value)}
                            className="w-full rounded-xl border-none bg-gray-50/50 py-2.5 pr-10 pl-10 text-sm transition-all focus:ring-2 focus:ring-orange-500/20 sm:rounded-full"
                        />
                        {localQuery && (
                            <button
                                onClick={() => setLocalQuery('')}
                                className="absolute top-1/2 right-3 -translate-y-1/2"
                            >
                                <CircleX className="h-4 w-4 text-gray-300 hover:text-orange-500" />
                            </button>
                        )}
                    </div>

                    <div className="mx-1 hidden h-6 w-px bg-gray-100 sm:block" />

                    <div className="flex w-full items-center gap-2 sm:w-auto">
                        <div className="flex flex-1 cursor-pointer items-center gap-2 rounded-xl border border-purple-100/50 bg-purple-50/50 px-3 py-2 transition-colors hover:bg-purple-50 sm:flex-none sm:rounded-full">
                            <Filter className="h-3.5 w-3.5 text-purple-600" />
                            <select
                                value={filters?.category ?? ''}
                                onChange={(e) =>
                                    handleFilterChange(
                                        'category',
                                        e.target.value,
                                    )
                                }
                                className="min-w-[80px] cursor-pointer appearance-none bg-transparent text-[13px] font-semibold text-purple-900 focus:outline-none"
                            >
                                <option value="">Todas las categorías</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-1 cursor-pointer items-center gap-2 rounded-xl border border-orange-100/50 bg-orange-50/50 px-3 py-2 transition-colors hover:bg-orange-50 sm:flex-none sm:rounded-full">
                            <MapPin className="h-3.5 w-3.5 text-orange-600" />
                            <select
                                value={filters?.distance ?? ''}
                                onChange={(e) =>
                                    handleFilterChange(
                                        'distance',
                                        e.target.value,
                                    )
                                }
                                className="min-w-[80px] cursor-pointer appearance-none bg-transparent text-[13px] font-semibold text-orange-900 focus:outline-none"
                            >
                                <option value="">Distancia</option>
                                {distances.map((d) => (
                                    <option key={d.value} value={d.value}>
                                        {d.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="group relative">
                <div className="mb-3 flex items-center justify-between px-1">
                    <h3 className="flex items-center gap-2 text-sm font-extrabold tracking-widest text-gray-800 uppercase">
                        <span className="h-[2px] w-8 bg-purple-600"></span>
                        Especialidades
                    </h3>
                </div>

                <div className="relative overflow-hidden">
                    <div className="no-scrollbar flex gap-6 overflow-x-auto scroll-smooth px-1 pb-2">
                        <button
                            onClick={() => handleFilterChange('foodType', '')}
                            className="group flex min-w-[44px] flex-col items-center gap-2"
                        >
                            <div
                                className={`flex h-10 w-10 items-center justify-center rounded-2xl transition-all duration-300 ${
                                    !filters.foodType
                                        ? 'scale-105 bg-purple-600 text-white shadow-lg ring-4 shadow-purple-200 ring-purple-100'
                                        : 'border border-gray-100 bg-white text-purple-600 shadow-sm hover:border-purple-200'
                                } `}
                            >
                                <Utensils className="h-5 w-5" />
                            </div>
                            <span
                                className={`text-[11px] font-bold ${!filters.foodType ? 'text-purple-700' : 'text-gray-500'}`}
                            >
                                Todos
                            </span>
                        </button>

                        {/* Tipos de comida */}
                        {foodTypes.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() =>
                                    handleFilterChange('foodType', cat.id)
                                }
                                className="flex min-w-[44px] flex-col items-center gap-2"
                            >
                                <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-2xl text-2xl transition-all duration-300 ${
                                        filters.foodType === cat.id
                                            ? 'scale-105 bg-orange-500 text-white shadow-lg ring-4 shadow-orange-200 ring-orange-100'
                                            : 'border border-gray-100 bg-white shadow-sm hover:scale-105'
                                    } `}
                                >
                                    <span
                                        className={
                                            filters.foodType === cat.id
                                                ? 'brightness-125'
                                                : 'grayscale-[0.4]'
                                        }
                                    >
                                        {cat.icon}
                                    </span>
                                </div>
                                <span
                                    className={`text-[11px] font-bold ${filters.foodType === cat.id ? 'text-orange-700' : 'text-gray-500'}`}
                                >
                                    {cat.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
