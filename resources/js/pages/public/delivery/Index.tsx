import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import MainLayout from '@/layouts/main-layout';
import { SharedData } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
    DollarSign,
    Navigation,
    Package,
    PackageSearch,
} from './../../../lib/icons';

import { Map } from '@/components/leaflet/Map';
import { useLeafletMap } from '@/components/leaflet/useLeafletMap';
import { messaging, onMessage, registerFCMToken } from '@/firebase';
import { useGeolocation } from '@/hooks/use-Geolocation';
import { User2 } from 'lucide-react';

const notificationAudio =
    typeof window !== 'undefined'
        ? new Audio('/sounds/notification.mp3')
        : null;

interface Props {
    activeOrder: any;
}

const vibrateDevice = () => {
    if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200, 100, 200]);
    }
};

export default function Index({ activeOrder }: Props) {
    const { auth } = usePage<SharedData>().props;
    const { user } = auth;

    const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute('content');
    const hasActiveOrder = Boolean(activeOrder);

    const [availableOrders, setAvailableOrders] = useState<any[]>([]);
    const [pollingEnabled, setPollingEnabled] = useState(true);
    const [deliveryLocation, setDeliveryLocation] = useState<[number, number]>([
        0, 0,
    ]);
    const deliveryAvailable =
        user?.delivery_profile?.status?.is_available ?? false;

    const { latitude, longitude } = useGeolocation();

    const fetchAvailableOrders = useCallback(async () => {
        if (!deliveryAvailable || hasActiveOrder) return;
        try {
            const response = await fetch('/delivery/orders/available', {
                headers: { 'X-Requested-With': 'XMLHttpRequest' },
            });
            if (!response.ok) return;
            const data = await response.json();
            setAvailableOrders(data);
        } catch (error) {
            console.error(error);
        }
    }, [deliveryAvailable, hasActiveOrder]);

    useEffect(() => {
        if (!pollingEnabled || hasActiveOrder) return;
        fetchAvailableOrders();
        const interval = setInterval(fetchAvailableOrders, 20000);
        return () => clearInterval(interval);
    }, [fetchAvailableOrders, pollingEnabled, hasActiveOrder]);

    useEffect(() => {
        const handleSubscription = async () => {
            if (deliveryAvailable) {
                await registerFCMToken(user);
            }
        };

        handleSubscription();
    }, [deliveryAvailable]);

    useEffect(() => {
        if (!messaging) return;

        const unsubscribe = onMessage(messaging, (payload) => {
            // toast.success(
            //     <div className="flex flex-col gap-1">
            //         <p className="font-bold">
            //             {payload.notification?.title || 'Nuevo Pedido'}
            //         </p>
            //         <p className="text-xs">{payload.notification?.body}</p>
            //     </div>,
            //     {
            //         position: 'top-right',
            //         autoClose: 5000,
            //         icon: '🚴‍♂️',
            //     },
            // );

            vibrateDevice();
            fetchAvailableOrders();
        });

        return () => unsubscribe();
    }, [fetchAvailableOrders]);

    useEffect(() => {
        if (latitude && longitude) {
            setDeliveryLocation([latitude, longitude]);
        }
    }, [latitude, longitude]);

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
                return toast.error(error.message ?? 'Error');
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
        // if (notificationAudio) {
        //     notificationAudio.muted = true;
        //     notificationAudio
        //         .play()
        //         .then(() => {
        //             notificationAudio.pause();
        //             notificationAudio.muted = false;
        //         })
        //         .catch(() => {});
        // }

        router.patch('/delivery/availability', { status: !deliveryAvailable });
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
                    toast.success('En camino 🚴‍♂️');
                    router.reload({ only: ['activeOrder'] });
                },
                onError: (e: any) => toast.error(e.message ?? 'Error'),
            },
        );
    };

    const finishDelivery = () => {
        router.post(
            `/delivery/orders/${activeOrder.id}/delivered`,
            {},
            {
                onSuccess: () => {
                    toast.success('Entregado 📦');
                    router.reload({ only: ['activeOrder'] });
                },
                onError: (e: any) => toast.error(e.message ?? 'Error'),
            },
        );
    };

    function FollowDelivery({ position }: { position: [number, number] }) {
        useLeafletMap({ follow: position });
        return null;
    }

    return (
        <MainLayout>
            <div className="min-h-screen space-y-2 bg-purple-50/50 p-2">
                {availableOrders.length > 0 &&
                    !hasActiveOrder &&
                    deliveryAvailable && (
                        <Card className="animate-pulse rounded-lg border-amber-200 bg-amber-50 shadow-md">
                            <CardContent className="space-y-1 p-1">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Navigation className="h-4 w-4 text-amber-600" />
                                        <p className="text-sm font-semibold tracking-tight text-amber-900 uppercase">
                                            ¡Nueva Solicitud!
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1 font-bold text-amber-700">
                                        <DollarSign className="h-4 w-4" />
                                        <span className="text-base leading-none">
                                            {availableOrders[0].delivery_fee}
                                        </span>
                                    </div>
                                </div>

                                <Button
                                    className="w-full rounded-lg bg-amber-600 py-2 text-sm font-bold tracking-widest text-white uppercase shadow-lg shadow-amber-200 hover:bg-amber-700 active:scale-95"
                                    onClick={() =>
                                        acceptOrder(availableOrders[0].id)
                                    }
                                >
                                    Aceptar Pedido #{availableOrders[0].id}
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                {hasActiveOrder && deliveryAvailable && (
                    <Card className="rounded-lg border-purple-200 bg-white shadow-sm animate-in slide-in-from-bottom-2">
                        <CardContent className="space-y-1 p-1">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Package className="h-4 w-4 text-purple-600" />
                                    <p className="text-sm font-semibold tracking-tight text-purple-900">
                                        Pedido en curso
                                    </p>
                                </div>
                                <span className="text-[10px] font-bold text-purple-500 uppercase">
                                    #{activeOrder.id}
                                </span>
                            </div>

                            <div className="flex gap-2">
                                <Button className="flex-1 rounded-lg bg-purple-600 text-xs font-semibold transition-all hover:bg-purple-700 active:scale-95">
                                    Llegué
                                </Button>

                                {activeOrder.status === 'picked_up' && (
                                    <Button
                                        className="flex-1 rounded-lg bg-green-600 text-xs font-semibold hover:bg-green-700 active:scale-95"
                                        onClick={startDelivery}
                                    >
                                        Iniciar Ruta
                                    </Button>
                                )}

                                {activeOrder.status === 'on_the_way' && (
                                    <Button
                                        className="flex-1 rounded-lg bg-blue-600 text-xs font-semibold hover:bg-blue-700 active:scale-95"
                                        onClick={finishDelivery}
                                    >
                                        Entregar
                                    </Button>
                                )}

                                {/* <Button
                                    variant="outline"
                                    className="rounded-lg border-amber-200 px-2 text-amber-700 hover:bg-amber-50 active:scale-95"
                                >
                                    <AlertCircle size={18} />
                                </Button> */}
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Card
                    className={`overflow-hidden rounded-lg border-purple-200 p-0 shadow-sm ${deliveryAvailable ? '' : 'bg-gray-300'}`}
                >
                    <CardContent className="flex items-center justify-between p-2">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <User2 className="h-8 w-8 text-purple-700" />
                                <div
                                    className={`absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-white ${deliveryAvailable ? 'bg-green-500' : 'bg-gray-400'}`}
                                />
                            </div>
                            <div>
                                <p className="text-sm leading-tight font-semibold text-purple-900">
                                    {user.name}
                                </p>
                                <p className="text-[10px] font-semibold tracking-wider text-gray-500 uppercase">
                                    Repartidor
                                </p>
                            </div>
                        </div>

                        <div
                            className={`flex items-center gap-2 rounded-lg border border-purple-100 bg-purple-50/50 px-2 py-1.5 transition-opacity ${hasActiveOrder ? 'opacity-50' : ''}`}
                        >
                            <Label
                                htmlFor="disponibilidad"
                                className="text-[10px] font-bold text-purple-800 uppercase"
                            >
                                {deliveryAvailable
                                    ? 'En línea'
                                    : 'Desconectado'}
                            </Label>
                            <div
                                onClick={() =>
                                    hasActiveOrder && playBlockedSound()
                                }
                            >
                                <Switch
                                    id="disponibilidad"
                                    checked={deliveryAvailable}
                                    disabled={hasActiveOrder}
                                    onCheckedChange={handleChangeAvailability}
                                    className="focus-visible:ring-purple-400 data-[state=checked]:bg-purple-600"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {deliveryAvailable ? (
                    <Card className="relative h-70 overflow-hidden rounded-lg border-purple-200 py-0 shadow-sm">
                        <Map center={deliveryLocation}>
                            {/* <MapMarker
                                position={deliveryLocation}
                                icon={businessIcon}
                            /> */}
                            <FollowDelivery position={deliveryLocation} />
                        </Map>
                    </Card>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-purple-100 bg-purple-50/30 py-12 text-center">
                        <div className="mb-4 rounded-lg bg-white p-4 shadow-sm">
                            <PackageSearch className="h-10 w-10 text-gray-300" />
                        </div>

                        <h2 className="text-base font-semibold tracking-tight text-gray-700 uppercase">
                            Actualmente no puedes recibir pedidos
                        </h2>

                        <p className="mt-1 text-[10px] leading-tight font-normal tracking-widest text-gray-500 uppercase">
                            Activa tu disponibilidad para comenzar a trabajar
                        </p>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
