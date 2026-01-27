import { Card, CardContent } from '@/components/ui/card';
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
import { Badge, Info, LoaderCircle, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import { toast } from 'react-toastify';
import { LayoutBusinessModules } from './LayoutBusinessModules';

interface Props {
    business: Business;
}

export default function Location({ business }: Props) {
    const breadcrumbs = makeBreadCrumb({
        text: 'Ubicación',
        url: '#',
    });

    // TIPOGRAFÍA: Tamaño Micro y Labels
    const labelStyle =
        'mb-1 block text-[10px] font-semibold uppercase tracking-widest text-gray-500 leading-tight';

    // IDENTIDAD VISUAL: Paleta Púrpura para Inputs
    const inputStyle =
        'h-9 rounded-lg border-purple-200 bg-white px-3 text-sm text-gray-700 shadow-sm transition focus:border-purple-600 focus:ring-1 focus:ring-purple-600/20';

    const defaultCords = locations.NOCHIXTLAN;
    const [mapReady, setMapReady] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
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
        put(`/dashboard/business/${business.id}-${business.slug}/location`, {
            preserveScroll: true,
            onSuccess: () =>
                toast.success('Ubicación actualizada correctamente'),
            onError: () => toast.error('Error al guardar'),
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
            headerTitle="Ubicación"
            headerDescription="Configura la localización física del negocio"
            buttonText="Guardar cambios"
            icon={MapPin}
            onSubmit={handleSave}
            processing={processing}
            breadcrumbs={breadcrumbs}
        >
            {/* Panel izquierdo: Col-span 4 */}
            <div className="space-y-6 lg:col-span-4">
                <Card className="rounded-lg border-purple-200 shadow-sm">
                    <CardContent className="space-y-4 p-3">
                        {/* Localidad */}
                        <div>
                            <Label className={labelStyle}>
                                Municipio / Localidad
                            </Label>
                            <Select
                                value={data.location}
                                onValueChange={(
                                    val: keyof typeof locations,
                                ) => {
                                    setData({
                                        ...data,
                                        location: val,
                                        cords: locations[val].cords,
                                        address: '',
                                    });
                                }}
                            >
                                <SelectTrigger className={inputStyle}>
                                    <SelectValue placeholder="Seleccionar…" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(locations).map(
                                        ([key, loc]) => (
                                            <SelectItem
                                                key={key}
                                                value={key}
                                                className="text-sm"
                                            >
                                                {loc.name}
                                            </SelectItem>
                                        ),
                                    )}
                                </SelectContent>
                            </Select>
                            {errors.location && (
                                <p className="mt-1 text-[10px] text-red-500">
                                    {errors.location}
                                </p>
                            )}
                        </div>

                        {/* Dirección */}
                        <div>
                            <Label className={labelStyle}>
                                Dirección física
                            </Label>
                            <div className="relative">
                                <Input
                                    value={data.address}
                                    onChange={(e) =>
                                        setData('address', e.target.value)
                                    }
                                    placeholder="Calle, número, colonia…"
                                    className={inputStyle}
                                />
                            </div>

                            {/* Alerta Amber: Alertas/Advertencias */}
                            <div className="mt-3 flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-2">
                                <Info
                                    size={14}
                                    className="mt-0.5 shrink-0 text-amber-600"
                                />
                                <p className="text-[10px] leading-tight font-normal text-amber-700">
                                    Ingresa la dirección y ajusta el marcador en
                                    el mapa para mayor precisión.
                                </p>
                            </div>
                        </div>

                        {/* Coordenadas GPS: Paleta Gris */}
                        <div className="pt-2">
                            <Label className={`${labelStyle} text-center`}>
                                Coordenadas GPS
                            </Label>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="rounded-lg border border-gray-200 bg-gray-50 p-2 text-center">
                                    <span className="block text-[9px] font-semibold text-gray-500 uppercase">
                                        Latitud
                                    </span>
                                    <span className="font-mono text-xs text-gray-700">
                                        {data.cords.lat.toFixed(6)}
                                    </span>
                                </div>
                                <div className="rounded-lg border border-gray-200 bg-gray-50 p-2 text-center">
                                    <span className="block text-[9px] font-semibold text-gray-500 uppercase">
                                        Longitud
                                    </span>
                                    <span className="font-mono text-xs text-gray-700">
                                        {data.cords.long.toFixed(6)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="relative lg:col-span-8">
                <Card className="relative h-[520px] overflow-hidden rounded-lg border-purple-200 p-0 shadow-sm lg:h-[600px]">
                    {!mapReady && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-sm">
                            <LoaderCircle className="animate-spin text-purple-600" />
                        </div>
                    )}

                    {mapReady && (
                        <MapContainer
                            center={[data.cords.lat, data.cords.long]}
                            zoom={16}
                            style={{ height: '100%', width: '100%' }}
                            attributionControl={false}
                            scrollWheelZoom
                        >
                            <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png" />

                            <Marker
                                position={[data.cords.lat, data.cords.long]}
                                draggable
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

                    {/* Badge de Tip: Paleta Púrpura */}
                    <div className="pointer-events-none absolute bottom-4 left-4 z-[400]">
                        <Badge className="border-purple-200 bg-purple-50 px-3 py-1 text-[10px] font-semibold tracking-tight text-purple-800 uppercase shadow-md backdrop-blur-sm">
                            Tip: arrastra el marcador para ajustar
                        </Badge>
                    </div>
                </Card>
            </div>
        </LayoutBusinessModules>
    );
}
