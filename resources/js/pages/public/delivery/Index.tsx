import MainLayout from '@/layouts/main-layout';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Map,
    MapControls,
    MapMarker,
    MarkerContent,
    MarkerTooltip,
} from '@/components/ui/map';
import { Switch } from '@/components/ui/switch';
import { SharedData } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { DollarSign, MapPin } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

interface Props {
    activeOrder: any;
}

export default function Index({ activeOrder }: Props) {
    const { auth } = usePage<SharedData>().props;
    const { user } = auth;

    const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute('content');

    const hasActiveOrder = Boolean(activeOrder);

    const [availableOrders, setAvailableOrders] = useState<any[]>([]);
    const [pollingEnabled, setPollingEnabled] = useState(true);
    const [deliveryLocation, setDeliveryLocation] = useState<{
        lat: number;
        lng: number;
    } | null>(null);

    // 🔥 Referencia al mapa para centrarlo sin re-renderizar
    const mapRef = useRef<any>(null);

    const fetchAvailableOrders = useCallback(async () => {
        if (!user.is_available || hasActiveOrder) return;

        try {
            const response = await fetch('/delivery/orders/available', {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            if (!response.ok) return;

            const data = await response.json();
            setAvailableOrders(data);
        } catch (error) {
            console.error('Error al obtener pedidos disponibles:', error);
        }
    }, [user.is_available, hasActiveOrder]);

    useEffect(() => {
        if (!pollingEnabled || hasActiveOrder) return;

        fetchAvailableOrders();

        const interval = setInterval(fetchAvailableOrders, 20000);
        return () => clearInterval(interval);
    }, [fetchAvailableOrders, pollingEnabled, hasActiveOrder]);

    const acceptOrder = async (orderId: number) => {
        try {
            const response = await fetch(`/delivery/orders/${orderId}/accept`, {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': csrfToken ?? '',
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const error = await response.json();
                return toast.error(error.message ?? 'Error al aceptar pedido');
            }

            toast.success('Pedido aceptado 🚴‍♂️');

            setAvailableOrders([]);
            setPollingEnabled(false);

            router.reload({ only: ['activeOrder'] });
        } catch (e) {
            toast.error('Error de conexión');
        }
    };

    const handleChangeAvailability = () => {
        router.patch('/delivery/availability', { status: !user.is_available });
    };

    const playBlockedSound = () => {
        const audio = new Audio('/sounds/blocked.mp3');
        audio.volume = 0.6;
        audio.play().catch(() => {});
    };

    const startDelivery = () => {
        router.post(
            `/delivery/orders/${activeOrder.id}/on-the-way`,
            {},
            {
                onSuccess: () => {
                    toast.success('Pedido en camino 🚴‍♂️');
                    router.reload({ only: ['activeOrder'] });
                },
                onError: (errors: any) => {
                    toast.error(
                        errors.message ?? 'No se pudo actualizar el pedido',
                    );
                },
            },
        );
    };

    const finishDelivery = () => {
        router.post(
            `/delivery/orders/${activeOrder.id}/delivered`,
            {},
            {
                onSuccess: () => {
                    toast.success('Entrega completada 📦');
                    router.reload({ only: ['activeOrder'] });
                },
                onError: (errors: any) => {
                    toast.error(
                        errors.message ?? 'No se pudo cerrar el pedido',
                    );
                },
            },
        );
    };

    useEffect(() => {
        if (!activeOrder || activeOrder.status !== 'on_the_way') return;

        let lastSentTime = 0;
        let lastSentLocation: { lat: number; lng: number } | null = null;
        const MIN_TIME_BETWEEN_UPDATES = 3000;
        const MAX_TIME_BETWEEN_UPDATES = 15000; // 15s para forzar envío si no hay buena señal
        const IDEAL_ACCURACY = 5; // 5 metros - precisión ideal
        const ACCEPTABLE_ACCURACY = 20; // 20 metros - precisión aceptable como fallback
        const MIN_DISTANCE_METERS = 3; // Mínimo 3 metros de movimiento para actualizar

        // Función para calcular distancia entre dos puntos (en metros)
        const calculateDistance = (
            lat1: number,
            lng1: number,
            lat2: number,
            lng2: number,
        ) => {
            const R = 6371e3; // Radio de la Tierra en metros
            const φ1 = (lat1 * Math.PI) / 180;
            const φ2 = (lat2 * Math.PI) / 180;
            const Δφ = ((lat2 - lat1) * Math.PI) / 180;
            const Δλ = ((lng2 - lng1) * Math.PI) / 180;

            const a =
                Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                Math.cos(φ1) *
                    Math.cos(φ2) *
                    Math.sin(Δλ / 2) *
                    Math.sin(Δλ / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            return R * c;
        };

        const sendLocation = (lat: number, lng: number, accuracy: number) => {
            const now = Date.now();

            fetch('/delivery/location-store', {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': csrfToken ?? '',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ lat, lng }),
            });

            lastSentTime = now;
            lastSentLocation = { lat, lng };
        };

        const shouldSendLocation = (pos: GeolocationPosition): boolean => {
            const now = Date.now();
            const timeSinceLastSent = now - lastSentTime;
            const accuracy = pos.coords.accuracy;

            // Si nunca hemos enviado, enviar con precisión aceptable
            if (!lastSentLocation) {
                return accuracy <= ACCEPTABLE_ACCURACY;
            }

            // Calcular distancia desde la última ubicación enviada
            const distance = calculateDistance(
                lastSentLocation.lat,
                lastSentLocation.lng,
                pos.coords.latitude,
                pos.coords.longitude,
            );

            // Prioridad 1: Precisión ideal (5m) y movimiento significativo
            if (accuracy <= IDEAL_ACCURACY && distance >= MIN_DISTANCE_METERS) {
                return true;
            }

            if (
                accuracy <= ACCEPTABLE_ACCURACY &&
                timeSinceLastSent >= MIN_TIME_BETWEEN_UPDATES &&
                distance >= MIN_DISTANCE_METERS
            ) {
                return true;
            }

            if (timeSinceLastSent >= MAX_TIME_BETWEEN_UPDATES) {
                return true;
            }

            return false;
        };

        const watchId = navigator.geolocation.watchPosition(
            (pos) => {
                if (shouldSendLocation(pos)) {
                    sendLocation(
                        pos.coords.latitude,
                        pos.coords.longitude,
                        pos.coords.accuracy,
                    );
                }
            },
            (error) => {
                console.error('Error geolocalización:', error);
            },
            {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 0,
            },
        );

        const backupInterval = setInterval(() => {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const now = Date.now();
                    const timeSinceLastSent = now - lastSentTime;

                    // Forzar envío si ha pasado mucho tiempo
                    if (timeSinceLastSent >= MAX_TIME_BETWEEN_UPDATES) {
                        sendLocation(
                            pos.coords.latitude,
                            pos.coords.longitude,
                            pos.coords.accuracy,
                        );
                    }
                },
                (error) => {
                    console.error('Error en backup:', error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 20000,
                    maximumAge: 0,
                },
            );
        }, MAX_TIME_BETWEEN_UPDATES);

        return () => {
            navigator.geolocation.clearWatch(watchId);
            clearInterval(backupInterval);
        };
    }, [activeOrder?.status]);

    const updateMarker = (lat: number, lng: number) => {
        setDeliveryLocation({ lat, lng });
    };

    useEffect(() => {
        if (!activeOrder || activeOrder.status !== 'on_the_way') return;

        const interval = setInterval(async () => {
            const res = await fetch(
                `/delivery/orders/${activeOrder.id}/location`,
            );
            const data = await res.json();

            if (data?.lat && data?.lng) {
                updateMarker(data.lat, data.lng);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [activeOrder?.id, activeOrder?.status]);

    useEffect(() => {
        if (deliveryLocation && mapRef.current) {
            const map = mapRef.current;

            if (map.flyTo) {
                map.flyTo({
                    center: [deliveryLocation.lng, deliveryLocation.lat],
                    duration: 1000,
                });
            } else if (map.easeTo) {
                map.easeTo({
                    center: [deliveryLocation.lng, deliveryLocation.lat],
                    duration: 1000,
                });
            } else if (map.setCenter) {
                map.setCenter([deliveryLocation.lng, deliveryLocation.lat]);
            }
        }
    }, [deliveryLocation]);

    return (
        <MainLayout>
            <div className="space-y-2 p-2">
                <Card className="rounded-xl py-2">
                    <CardContent className="flex items-center justify-between p-2">
                        <div className="flex items-center gap-2">
                            <img
                                src="https://i.pravatar.cc/100"
                                alt="Repartidor"
                                className="h-10 w-10 rounded-full"
                            />
                            <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    Repartidor
                                </p>
                            </div>
                        </div>

                        <div
                            className={`flex items-center gap-2 rounded-lg border px-2 py-1 ${hasActiveOrder ? 'cursor-not-allowed opacity-60' : ''}`}
                        >
                            <Label htmlFor="disponibilidad" className="text-xs">
                                {user.is_available
                                    ? 'Recibiendo pedidos'
                                    : 'No recibir pedidos'}
                            </Label>
                            <div
                                onClick={() => {
                                    if (hasActiveOrder) {
                                        playBlockedSound();
                                    }
                                }}
                                className={
                                    hasActiveOrder ? 'cursor-not-allowed' : ''
                                }
                            >
                                <Switch
                                    id="disponibilidad"
                                    checked={user.is_available}
                                    disabled={hasActiveOrder}
                                    onCheckedChange={handleChangeAvailability}
                                    className="focus-visible:ring-orange-500 data-[state=checked]:bg-orange-500"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden rounded-xl p-0">
                    <div className="h-80 bg-gray-200">
                        <Map
                            ref={mapRef}
                            center={
                                deliveryLocation
                                    ? [
                                          deliveryLocation.lng,
                                          deliveryLocation.lat,
                                      ]
                                    : [-97.2275336, 17.4606859]
                            }
                            zoom={16}
                            theme="light"
                        >
                            <MapControls
                                position="bottom-right"
                                showZoom
                                showLocate
                            />

                            {deliveryLocation && (
                                <MapMarker
                                    longitude={deliveryLocation.lng}
                                    latitude={deliveryLocation.lat}
                                >
                                    <MarkerContent>
                                        <MapPin
                                            className="fill-black stroke-white dark:fill-white"
                                            size={28}
                                        />
                                    </MarkerContent>
                                    <MarkerTooltip>LOCATION</MarkerTooltip>
                                </MapMarker>
                            )}
                        </Map>
                    </div>
                </Card>

                {hasActiveOrder && (
                    <Card className="rounded-xl py-2">
                        <CardContent className="space-y-2 p-2">
                            <p className="font-medium">Pedido en curso</p>
                            <p className="text-sm text-muted-foreground">
                                Pedido #{activeOrder.id}
                            </p>

                            <div className="flex gap-2 pt-1">
                                <Button className="flex-1 rounded-lg bg-green-600 hover:bg-green-700">
                                    Llegué
                                </Button>
                                <Button
                                    variant="destructive"
                                    className="flex-1 rounded-lg"
                                >
                                    Problema
                                </Button>

                                {activeOrder &&
                                    activeOrder.status === 'picked_up' && (
                                        <Button
                                            className="flex-1 bg-green-600 hover:bg-green-700"
                                            onClick={startDelivery}
                                        >
                                            Salí del negocio
                                        </Button>
                                    )}

                                {activeOrder &&
                                    activeOrder.status === 'on_the_way' && (
                                        <Button
                                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                                            onClick={finishDelivery}
                                        >
                                            Entregado
                                        </Button>
                                    )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {availableOrders.length > 0 && !hasActiveOrder && (
                    <Card className="rounded-xl py-2">
                        <CardContent className="space-y-2 p-2">
                            <p className="font-medium">Nueva entrega</p>
                            <p className="text-sm text-muted-foreground">
                                Pedido #{availableOrders[0].id}
                            </p>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1 font-semibold">
                                    <DollarSign className="h-4 w-4" />$
                                    {availableOrders[0].delivery_fee}
                                </div>

                                <Button
                                    className="rounded-lg bg-orange-500 px-2 hover:bg-orange-600"
                                    onClick={() =>
                                        acceptOrder(availableOrders[0].id)
                                    }
                                >
                                    Aceptar
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </MainLayout>
    );
}
