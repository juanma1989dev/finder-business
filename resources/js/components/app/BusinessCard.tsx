import { Link } from '@inertiajs/react';
import { ArrowRight, MapPinned, Star } from 'lucide-react';

interface Props {
    business: any;
    modeEdit?: boolean;
}

export default function BusinessCard({ business, modeEdit }: Props) {
    return (
        <Link href={`/business/detail/${business.id}`} className="group block">
            <div className="relative overflow-hidden rounded-[2rem] border border-gray-100 bg-white p-2 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-900/10">
                {/* Imagen con Badge de Distancia */}
                <div className="relative h-48 overflow-hidden rounded-[1.6rem]">
                    <img
                        src={
                            business.cover_image
                                ? `/storage/${business.cover_image}`
                                : `/images/${business.category?.image}`
                        }
                        alt={business.nombre}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Overlay Gradiente para legibilidad */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

                    {/* Badge de Distancia flotante */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 shadow-sm backdrop-blur-md">
                        <div className="h-2 w-2 animate-pulse rounded-full bg-orange-500" />
                        <span className="text-[11px] font-bold text-gray-800">
                            {business.distance} km
                        </span>
                    </div>

                    {/* Badge de Categoría (Opcional si viene en la data) */}
                    <div className="absolute top-3 right-3 rounded-full bg-purple-600/90 px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase backdrop-blur-sm">
                        {business.category?.name || 'Popular'}
                    </div>
                </div>

                {/* Contenido de la Card */}
                <div className="space-y-3 p-3">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h3 className="truncate text-lg font-extrabold text-gray-900 transition-colors group-hover:text-purple-700">
                                {business.nombre}
                            </h3>
                            <div className="mt-0.5 flex items-center gap-1">
                                <Star className="h-3 w-3 fill-orange-400 text-orange-400" />
                                <span className="text-xs font-bold text-gray-600">
                                    4.8
                                </span>
                                <span className="text-[11px] font-medium text-gray-400">
                                    (120+ reseñas)
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Dirección con estilo minimalista */}
                    <div className="flex items-center gap-2 rounded-xl bg-gray-50 p-2 transition-colors group-hover:bg-purple-50/50">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-sm">
                            <MapPinned className="h-4 w-4 text-orange-600" />
                        </div>
                        <span className="truncate text-xs font-medium text-gray-500">
                            {business.address}
                        </span>
                    </div>

                    {/* Footer de la Card */}
                    <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] font-bold tracking-tighter text-purple-600 uppercase">
                            Abierto ahora
                        </span>

                        <div className="flex items-center gap-1 text-sm font-bold text-orange-600">
                            <span className="scale-0 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                                Ver local
                            </span>
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 text-orange-600 transition-all group-hover:bg-orange-500 group-hover:text-white">
                                <ArrowRight className="h-4 w-4" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
