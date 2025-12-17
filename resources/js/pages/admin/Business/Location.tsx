import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { locations } from '@/data/locations';
import { makeBreadCrumb } from '@/helpers';
import AppLayout from '@/layouts/app-layout';
import { Business } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import 'leaflet/dist/leaflet.css';
import { Save } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import { toast } from 'react-toastify';

/***************************** */
// function Routing({ from, to }: { from: [number, number]; to: [number, number] }) {
//     const map = useMap();

//     useEffect(() => {
//         if (!map) return;

//         const L = require('leaflet');
//         require('leaflet-routing-machine');

//         const control = L.Routing.control({
//             waypoints: [
//                 L.latLng(from[0], from[1]),
//                 L.latLng(to[0], to[1]),
//             ],
//             routeWhileDragging: false,
//             show: false, // no muestra panel lateral
//             addWaypoints: false,
//             draggableWaypoints: false,
//             lineOptions: {
//                 styles: [{ color: '#ff6600', weight: 5 }],
//             },
//         }).addTo(map);

//         return () => map.removeControl(control);
//     }, [map, from, to]);

//     return null;
// }

// function RouteExample() {
//     const start: [number, number] = [17.058, -96.721]; // Oaxaca
//     const end: [number, number] = [17.06, -96.72]; // Destino

//     return (
//         <MapContainer center={start} zoom={14} style={{ height: '500px', width: '100%' }}>
//             <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//             <Routing from={start} to={end} />
//         </MapContainer>
//     );
// }
/***************************** */

interface Props {
    business: Business;
}

interface FormLocationProps {
    location: string;
    address: string;
    cords: {
        lat: number;
        long: number;
    };
}

export default function Location({ business }: Props) {
    const breadcrumbs = makeBreadCrumb({
        text: `${business.name ?? ''} - Información general`,
        url: '/',
    });
    const defaultCords = locations.NOCHIXTLAN;

    const [mapReady, setMapReady] = useState(false);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);

    const formLocation = useForm<FormLocationProps>({
        location: business.location,
        address: business.address,
        cords: {
            lat: business?.cords?.coordinates?.[1] ?? defaultCords.cords.lat,
            long: business?.cords?.coordinates?.[0] ?? defaultCords.cords.long,
        },
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            if (mapContainerRef.current) {
                setMapReady(true);
            }
        }, 50);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (mapReady && mapRef.current) {
            setTimeout(() => {
                mapRef.current.invalidateSize();
            }, 300);
        }
    }, [mapReady]);

    const handleMarkerDragEnd = (e: any) => {
        const marker = e.target;
        const latlng = marker.getLatLng();
        const cords = { lat: latlng.lat, long: latlng.lng };
        formLocation.setData('cords', cords);
    };

    // Subcomponente para mover el mapa sin re-renderizar todo
    function MapUpdater({ position }: { position: [number, number] }) {
        const map = useMap();
        const hasMoved = useRef(false);

        useEffect(() => {
            if (!mapRef.current) {
                mapRef.current = map;
            }
        }, [map]);

        useEffect(() => {
            const timer = setTimeout(() => {
                map.invalidateSize();

                if (!hasMoved.current) {
                    // 🚀 Primer render: sin animación
                    map.setView(position, map.getZoom());
                    hasMoved.current = true;
                } else {
                    // 🎯 Cambios posteriores: con animación rápida
                    map.flyTo(position, map.getZoom(), {
                        animate: true,
                        duration: 0.4, // 400 ms
                    });
                }
            }, 150);

            return () => clearTimeout(timer);
        }, [position, map]);

        return null;
    }

    const handleClickSaveLocation = () => {
        formLocation.post(`/dashboard/business/${business.id}/location`, {
            onSuccess: ({ props }) => {
                const flashData = props?.flash as
                    | { success?: string }
                    | undefined;
                const success = flashData?.success;
                if (success) toast.success(success);
            },
            onError: (errors) => {
                toast.error(errors.general);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard - Nuevo negocio" />
            <div className="relative m-3 space-y-6 p-3">
                {/* Botón de guardar */}
                <Button
                    onClick={handleClickSaveLocation}
                    className="absolute top-0 right-2 cursor-pointer bg-orange-500 text-white hover:scale-105 hover:border-1 hover:bg-orange-700 hover:text-white"
                    variant={'outline'}
                    title="Guardar"
                >
                    <Save className="h-4 w-4" />
                </Button>

                {/* Selección de ubicación */}
                <div className="mt-5">
                    <Label htmlFor="location">Ubicación</Label>
                    <Select
                        name="location"
                        onValueChange={(location: keyof typeof locations) => {
                            const { cords } = locations[location];
                            formLocation.setData('location', location);
                            formLocation.setData('cords', {
                                lat: cords.lat,
                                long: cords.long,
                            });
                            formLocation.setData('address', '');
                        }}
                        value={formLocation.data.location}
                    >
                        <SelectTrigger>
                            <SelectValue
                                placeholder="Selecciona una ubicación"
                                defaultValue={formLocation.data.location}
                            />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.entries(locations).map(([key, data]) => (
                                <SelectItem key={key} value={key}>
                                    {data.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {formLocation.errors.location && (
                        <div className="mt-1 text-sm text-red-500">
                            {formLocation.errors.location}
                        </div>
                    )}
                </div>

                {/* Dirección */}
                <div>
                    <Label htmlFor="address">Dirección</Label>
                    <Input
                        id="address"
                        value={formLocation.data.address}
                        onChange={(e) =>
                            formLocation.setData('address', e.target.value)
                        }
                        placeholder="Escribe la dirección..."
                        autoComplete="off"
                    />
                    <span className="text-gray-700/90">
                        Ingresa la dirección completa y exacta de tu negocio
                        para mejorar su localización
                        <span className="font-semibold">(*Recomendado)</span>.
                    </span>
                    {formLocation.errors.address && (
                        <div className="mt-1 text-sm text-red-500">
                            {formLocation.errors.address}
                        </div>
                    )}
                </div>

                {/* Mapa */}
                <div
                    ref={mapContainerRef}
                    style={{ height: '550px', width: '100%' }}
                    className="mt-5 overflow-hidden rounded-lg shadow-lg"
                >
                    <p className="my-2 text-xl font-semibold">
                        Ubica en el mapa la dirección exacta de tu negocio
                    </p>
                    {mapReady && (
                        <MapContainer
                            center={[
                                formLocation.data.cords.lat,
                                formLocation.data.cords.long,
                            ]}
                            zoom={14}
                            style={{ height: '100%', width: '100%' }}
                            scrollWheelZoom={true}
                            attributionControl={false}
                            whenReady={() => {
                                setTimeout(() => {
                                    if (mapRef.current) {
                                        mapRef.current.invalidateSize();
                                    }
                                }, 300);
                            }}
                        >
                            <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png" />
                            <Marker
                                position={[
                                    formLocation.data.cords.lat,
                                    formLocation.data.cords.long,
                                ]}
                                draggable
                                eventHandlers={{ dragend: handleMarkerDragEnd }}
                            />
                            <MapUpdater
                                position={[
                                    formLocation.data.cords.lat,
                                    formLocation.data.cords.long,
                                ]}
                            />
                        </MapContainer>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
