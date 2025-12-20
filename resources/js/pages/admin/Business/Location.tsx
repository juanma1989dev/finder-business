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
import { Badge, Image as ImageIcon, Info, LoaderCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
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

    const labelStyle =
        'mb-1 block text-[10px] font-semibold uppercase tracking-widest text-slate-500';

    const inputStyle =
        'h-9 rounded-lg border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20';

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
            icon={ImageIcon}
            onSubmit={handleSave}
            processing={processing}
            breadcrumbs={breadcrumbs}
        >
            {/* Panel izquierdo */}
            <div className="space-y-6 lg:col-span-4">
                <Card className="rounded-2xl border-slate-200 shadow-sm">
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
                                {/* <Navigation
                                    size={14}
                                    className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                                /> */}
                                <Input
                                    value={data.address}
                                    onChange={(e) =>
                                        setData('address', e.target.value)
                                    }
                                    placeholder="Calle, número, colonia…"
                                    className={`pl-9 ${inputStyle}`}
                                />
                            </div>

                            <div className="mt-2 flex gap-2 rounded-lg border border-blue-100 bg-blue-50/60 p-2">
                                <Info
                                    size={14}
                                    className="mt-0.5 shrink-0 text-blue-500"
                                />
                                <p className="text-[10px] leading-tight text-blue-700">
                                    Ingresa la dirección y ajusta el marcador en
                                    el mapa para mayor precisión.
                                </p>
                            </div>
                        </div>

                        {/* Coordenadas */}
                        <div className="pt-2">
                            <Label className={`${labelStyle} text-center`}>
                                Coordenadas GPS
                            </Label>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-center">
                                    <span className="block text-[9px] font-semibold text-slate-400 uppercase">
                                        Latitud
                                    </span>
                                    <span className="font-mono text-xs text-slate-700">
                                        {data.cords.lat.toFixed(6)}
                                    </span>
                                </div>
                                <div className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-center">
                                    <span className="block text-[9px] font-semibold text-slate-400 uppercase">
                                        Longitud
                                    </span>
                                    <span className="font-mono text-xs text-slate-700">
                                        {data.cords.long.toFixed(6)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Mapa */}
            <div className="relative lg:col-span-8">
                <Card className="relative h-[520px] overflow-hidden rounded-2xl border-slate-200 shadow-sm lg:h-[600px]">
                    {!mapReady && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-50">
                            <LoaderCircle className="animate-spin text-orange-500" />
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

                    <div className="pointer-events-none absolute bottom-4 left-4 z-[400]">
                        <Badge className="border-none bg-white/90 px-3 py-1 text-[10px] font-semibold tracking-tight text-slate-800 uppercase shadow-md backdrop-blur">
                            Tip: arrastra el marcador para ajustar
                        </Badge>
                    </div>
                </Card>
            </div>
        </LayoutBusinessModules>
    );
}
