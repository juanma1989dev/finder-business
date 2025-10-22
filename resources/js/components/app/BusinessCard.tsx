import { Link } from '@inertiajs/react';
import { Edit, MapPinned } from 'lucide-react';

interface Props {
    business: any;
    modeEdit?: boolean;
}

export default function BusinessCard({ business, modeEdit }: Props) {
    return (
        <div className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300">
            <div className="relative h-48 overflow-hidden">
                {modeEdit && (
                    <Link
                        href={`/dashboard/business/edit/${business.id}`}
                        className="absolute top-3 right-3 cursor-pointer"
                        title="Editar negocio"
                    >
                        <span className="inline-block rounded-full bg-orange-600 px-3 py-1 text-xs font-semibold hover:scale-105 hover:bg-orange-700">
                            <Edit className="h-4 w-4 text-white" />
                        </span>
                    </Link>
                )}

                <Link href={`/business/detail/${business.id}`} className="">
                    <img
                        src={
                            business.cover_image
                                ? `/storage/${business.cover_image}`
                                : `/images/${business.category.image}`
                        }
                        alt={business?.category.name}
                        className="h-full w-full object-cover transition-transform duration-300"
                    />
                </Link>
                {/* <div className="absolute top-3 right-3 flex items-center space-x-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 shadow-sm">
                                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                            <span className="text-gray-700 text-xs font-semibold">{negocio.rating}</span>
                                        </div> */}
                <div className="absolute bottom-3 left-3">
                    <span className="inline-block rounded-full bg-orange-600 px-3 py-1 text-xs text-white shadow-sm">
                        {business?.category.name}
                    </span>
                </div>
            </div>

            {/* Contenido */}
            <div className="p-5">
                <div className="m-0 w-full p-0 text-sm font-medium text-gray-500">
                    A {business.distance} km de distancia
                </div>
                <Link href={`/business/detail/${business.id}`} className="">
                    <h3 className="items-cente mb-2 flex inline-block text-lg font-bold text-orange-600 hover:underline">
                        {business.name}
                    </h3>
                </Link>

                <p className="mb-4 text-sm leading-relaxed text-gray-600">
                    {business.description}
                </p>

                <div className="mb-4 space-y-2">
                    <div className="text-md flex items-center space-x-2">
                        <MapPinned className="mt-0.5 h-4 w-4 text-orange-600" />
                        <span className="text-gray-500">
                            {business.address}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
