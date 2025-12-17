import { Link } from '@inertiajs/react';
import { MapPinned } from 'lucide-react';

interface Props {
    business: any;
    modeEdit?: boolean;
}

export default function BusinessCard({ business, modeEdit }: Props) {
    return (
        <Link href={`/business/detail/${business.id}`} className="">
            <div className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:shadow-xl">
                <div className="relative h-44 overflow-hidden">
                    <img
                        src={
                            business.cover_image
                                ? `/storage/${business.cover_image}`
                                : `/images/${business.category.image}`
                        }
                        alt={business.nombre}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* <div className="absolute right-3 bottom-3 rounded-full bg-white/90 p-2 shadow-md backdrop-blur-sm">
                            <ShoppingCart className="h-4 w-4 text-orange-500" />
                        </div> */}
                </div>
                <div className="space-y-2 p-4">
                    <h3 className="truncate font-bold text-gray-900">
                        {business.nombre}
                    </h3>
                    <div className="flex items-center gap-1">
                        <span className="text-sm text-gray-500">
                            A {business.distance} km de distancia
                        </span>
                        {/* <Star className="h-4 w-4 fill-current text-orange-400" />
                            <Star className="h-4 w-4 fill-current text-orange-400" />
                            <Star className="h-4 w-4 fill-current text-orange-400" />
                            <Star className="h-4 w-4 fill-current text-orange-400" />
                            <Star className="h-4 w-4 fill-current text-orange-400" /> */}
                    </div>
                    <h3 className="items-cente mb-2 flex inline-block text-base font-bold text-orange-600">
                        {business.name}
                    </h3>
                    <div className="flex items-center justify-between border-t pt-2">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                            <MapPinned className="mr-2 h-3 w-3 text-orange-600" />
                            <span className="text-gray-500">
                                {business.address}
                            </span>
                        </div>
                        {/* <span className="rounded-md border border-green-100 bg-green-50 px-2 py-1 text-xs font-bold text-green-600">
                                Envío
                            </span> */}
                    </div>
                </div>
            </div>
        </Link>
    );
}
