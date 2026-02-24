import { FlyTo } from '@/components/leaflet/FlyTo';
import { Map } from '@/components/leaflet/Map';
import { MapMarker } from '@/components/leaflet/MapMarker';
import { businessIcon } from '@/components/leaflet/icons';
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
import { Info, LoaderCircle, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
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

    const defaultCords = locations.NOCHIXTLAN.cords;

    const [mapReady, setMapReady] = useState(false);
    const [fromSelect, setFromSelect] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        location: business.location,
        address: business.address,
        cords: {
            lat: business?.cords?.coordinates?.[1] ?? defaultCords.lat,
            long: business?.cords?.coordinates?.[0] ?? defaultCords.long,
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

    return (
        <LayoutBusinessModules
            titleHead="Localización"
            headerTitle="Ubicación"
            headerDescription="Configura la localización física del negocio"
            buttonText="Guardar"
            icon={MapPin}
            onSubmit={handleSave}
            processing={processing}
            breadcrumbs={breadcrumbs}
        >
            <div className="space-y-6 lg:col-span-4">
                <Card className="rounded-lg border-purple-200 shadow-sm">
                    <CardContent className="space-y-4 p-3">
                        <div>
                            <Label className="mb-1 block text-[10px] font-semibold tracking-widest text-gray-500 uppercase">
                                Municipio / Localidad
                            </Label>

                            <Select
                                value={data.location}
                                onValueChange={(
                                    val: keyof typeof locations,
                                ) => {
                                    setFromSelect(true);

                                    setData({
                                        ...data,
                                        location: val,
                                        cords: locations[val].cords,
                                        address: '',
                                    });
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar…" />
                                </SelectTrigger>

                                <SelectContent>
                                    {Object.entries(locations).map(
                                        ([key, loc]) => (
                                            <SelectItem key={key} value={key}>
                                                {loc.name}
                                            </SelectItem>
                                        ),
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label className="mb-1 block text-[10px] font-semibold tracking-widest text-gray-500 uppercase">
                                Dirección
                            </Label>

                            <Input
                                value={data.address}
                                onChange={(e) =>
                                    setData('address', e.target.value)
                                }
                                placeholder="Calle, número, colonia…"
                            />

                            <div className="mt-3 flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-2">
                                <Info size={14} className="text-amber-600" />
                                <p className="flex text-sm text-amber-700">
                                    Ajusta el marcador para mayor precisión.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-2">
                            <div className="rounded-lg border bg-gray-50 p-2 text-center">
                                <span className="block text-[9px] text-gray-500 uppercase">
                                    Latitud
                                </span>
                                <span className="font-mono text-xs">
                                    {data.cords.lat.toFixed(6)}
                                </span>
                            </div>

                            <div className="rounded-lg border bg-gray-50 p-2 text-center">
                                <span className="block text-[9px] text-gray-500 uppercase">
                                    Longitud
                                </span>
                                <span className="font-mono text-xs">
                                    {data.cords.long.toFixed(6)}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="relative lg:col-span-8">
                <Card className="relative h-[520px] overflow-hidden rounded-lg p-0">
                    {!mapReady && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
                            <LoaderCircle className="animate-spin" />
                        </div>
                    )}

                    {mapReady && (
                        <Map center={[data.cords.lat, data.cords.long]}>
                            <MapMarker
                                position={[data.cords.lat, data.cords.long]}
                                draggable
                                icon={businessIcon}
                                onDragEnd={(lat, lng) => {
                                    setFromSelect(false);
                                    setData('cords', {
                                        lat: Number(lat.toFixed(6)),
                                        long: Number(lng.toFixed(6)),
                                    });
                                }}
                            />

                            <FlyTo
                                enabled={fromSelect}
                                position={[data.cords.lat, data.cords.long]}
                                zoom={16}
                            />
                        </Map>
                    )}
                </Card>
            </div>
        </LayoutBusinessModules>
    );
}
