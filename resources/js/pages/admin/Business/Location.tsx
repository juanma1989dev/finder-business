import { Card } from '@/components/ui/card';
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
import { Business } from '@/types';
import { useForm } from '@inertiajs/react';
import 'leaflet/dist/leaflet.css';
import {
    Badge,
    Image as ImageIcon,
    Info,
    LoaderCircle,
    Navigation,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import { toast } from 'react-toastify';
import { LayoutBusinessModules } from './LayoutBusinessModules';

interface Props {
    business: Business;
}

export default function Location({ business }: Props) {
    const breadcrumbs = makeBreadCrumb({
        text: `${business.name ?? ''} - Ubicación`,
        url: '/',
    });

    const defaultCords = locations.NOCHIXTLAN;
    const [mapReady, setMapReady] = useState(false);
    const mapRef = useRef<any>(null);

    const { data, setData, post, processing, errors } = useForm({
        location: business.location,
        address: business.address,
        cords: {
            lat: business?.cords?.coordinates?.[1] ?? defaultCords.cords.lat,
            long: business?.cords?.coordinates?.[0] ?? defaultCords.cords.long,
        },
    });

    useEffect(() => {
        const timer = setTimeout(() => setMapReady(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const handleSave = () => {
        post(`/dashboard/business/${business.id}/location`, {
            onSuccess: () =>
                toast.success('Ubicación actualizada correctamente'),
            onError: (err) => toast.error(err.general || 'Error al guardar'),
        });
    };

    function MapUpdater({ position }: { position: [number, number] }) {
        const map = useMap();
        useEffect(() => {
            map.flyTo(position, map.getZoom(), {
                animate: true,
                duration: 0.5,
            });
        }, [position, map]);
        return null;
    }

    return (
        <LayoutBusinessModules
            titleHead="Localización"
            headerTitle="Localización"
            headerDescription="Configura la ubicación de tu negocio"
            buttonText="Guardar"
            icon={ImageIcon}
            onSubmit={handleSave}
            processing={false}
            breadcrumbs={breadcrumbs}
        >
            {/* Panel de Controles (Izquierda) */}
            <div className="space-y-4 lg:col-span-4">
                <Card className="space-y-5 rounded-2xl border-gray-200/60 p-4 shadow-sm">
                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold tracking-wider text-gray-500 uppercase">
                            Municipio / Localidad
                        </Label>
                        <Select
                            value={data.location}
                            onValueChange={(val: keyof typeof locations) => {
                                setData({
                                    ...data,
                                    location: val,
                                    cords: locations[val].cords,
                                    address: '',
                                });
                            }}
                        >
                            <SelectTrigger className="h-10 rounded-xl border-gray-200 text-sm focus:ring-orange-500">
                                <SelectValue placeholder="Selecciona localidad" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                {Object.entries(locations).map(([key, loc]) => (
                                    <SelectItem
                                        key={key}
                                        value={key}
                                        className="cursor-pointer text-sm"
                                    >
                                        {loc.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.location && (
                            <p className="text-[10px] text-red-500">
                                {errors.location}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold tracking-wider text-gray-500 uppercase">
                            Dirección Física
                        </Label>
                        <div className="relative">
                            <Navigation
                                className="absolute top-3 left-3 text-gray-400"
                                size={14}
                            />
                            <Input
                                value={data.address}
                                onChange={(e) =>
                                    setData('address', e.target.value)
                                }
                                placeholder="Calle, número, colonia..."
                                className="h-10 rounded-xl border-gray-200 pl-9 text-xs"
                            />
                        </div>
                        <div className="flex gap-2 rounded-xl border border-blue-100 bg-blue-50/50 p-2.5">
                            <Info
                                size={14}
                                className="mt-0.5 shrink-0 text-blue-500"
                            />
                            <p className="text-[10px] leading-tight text-blue-700">
                                Para mejores resultados, ingresa la dirección
                                exacta y luego ajusta el pin en el mapa.
                            </p>
                        </div>
                        {errors.address && (
                            <p className="text-[10px] text-red-500">
                                {errors.address}
                            </p>
                        )}
                    </div>

                    <div className="border-t border-gray-100 pt-2">
                        <Label className="mb-3 block text-center text-[11px] font-bold text-gray-400 uppercase">
                            Coordenadas GPS
                        </Label>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="rounded-lg border border-gray-100 bg-gray-50 p-2 text-center">
                                <span className="block text-[9px] font-bold text-gray-400 uppercase">
                                    Latitud
                                </span>
                                <span className="font-mono text-xs text-gray-700">
                                    {data.cords.lat.toFixed(6)}
                                </span>
                            </div>
                            <div className="rounded-lg border border-gray-100 bg-gray-50 p-2 text-center">
                                <span className="block text-[9px] font-bold text-gray-400 uppercase">
                                    Longitud
                                </span>
                                <span className="font-mono text-xs text-gray-700">
                                    {data.cords.long.toFixed(6)}
                                </span>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Panel del Mapa (Derecha) */}
            <div className="relative h-[500px] lg:col-span-8 lg:h-[600px]">
                <Card className="relative h-full w-full overflow-hidden rounded-2xl border-gray-200/60 shadow-sm">
                    {!mapReady && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-50">
                            <LoaderCircle className="animate-spin text-orange-500" />
                        </div>
                    )}

                    {mapReady && (
                        <MapContainer
                            center={[data.cords.lat, data.cords.long]}
                            zoom={16}
                            style={{ height: '100%', width: '100%' }}
                            attributionControl={false}
                            scrollWheelZoom={true}
                        >
                            <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png" />

                            <Marker
                                position={[data.cords.lat, data.cords.long]}
                                draggable={true}
                                eventHandlers={{
                                    dragend: (e) => {
                                        const latlng = e.target.getLatLng();
                                        setData('cords', {
                                            lat: latlng.lat,
                                            long: latlng.lng,
                                        });
                                    },
                                }}
                            />
                            <MapUpdater
                                position={[data.cords.lat, data.cords.long]}
                            />
                        </MapContainer>
                    )}

                    {/* Overlay de ayuda sobre el mapa */}
                    <div className="pointer-events-none absolute bottom-4 left-4 z-[400]">
                        <Badge className="border-none bg-white/90 px-3 py-1 text-[10px] font-bold tracking-tighter text-gray-800 uppercase shadow-md backdrop-blur">
                            Tip: Arrastra el marcador azul para mayor precisión
                        </Badge>
                    </div>
                </Card>
            </div>
        </LayoutBusinessModules>
    );
}
