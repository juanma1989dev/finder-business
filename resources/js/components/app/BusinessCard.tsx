import { Link } from '@inertiajs/react';
import { MapPinned } from 'lucide-react';
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from '../ui/select';

interface Props {
    business: any;
    modeEdit?: boolean;
}

export default function BusinessCard({ business, modeEdit }: Props) {
    return (
        <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-red-800 bg-white shadow-sm transition-all duration-300">
            <div className="absolute top-2 right-2 z-10">
                {/* <Select onValueChange={(value) => console.log(value)}>
                    <SelectTrigger className="text-gray/90 w-full rounded-lg border-none bg-white/80 px-3 py-1.5 transition duration-200 hover:bg-white/90">
                        <SelectValue
                            placeholder="Sin lista asignada"
                            className="text-white/90"
                        />
                    </SelectTrigger>

                    <SelectContent className="rounded-lg border border-white/10 bg-gray-800 text-white shadow-lg">
                        <SelectItem
                            value="opcion1"
                            className="rounded-md px-2 py-1 transition-colors duration-150 hover:bg-white/10"
                        >
                            Opción 1
                        </SelectItem>
                        <SelectItem
                            value="opcion2"
                            className="rounded-md px-2 py-1 transition-colors duration-150 hover:bg-white/10"
                        >
                            Opción 2
                        </SelectItem>
                        <SelectItem
                            value="opcion3"
                            className="rounded-md px-2 py-1 transition-colors duration-150 hover:bg-white/10"
                        >
                            Opción 3
                        </SelectItem>
                    </SelectContent>
                </Select> */}
            </div>

            <div className="relative h-48 overflow-hidden">
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
                {/* <div className="absolute top-3 right-3 flex items-center space-x-1 rounded-full bg-white/90 px-2 py-1 shadow-sm backdrop-blur-sm">
                    <Star className="h-3 w-3 fill-current text-yellow-500" /> 5
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
