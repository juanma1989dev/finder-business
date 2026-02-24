import { Map } from '@/components/leaflet/Map';
import { useLeafletMap } from '@/components/leaflet/useLeafletMap';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useGeolocation } from '@/hooks/use-Geolocation';
import MainLayout from '@/layouts/main-layout';
import { OrderStatus, SharedData } from '@/types';
import { router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { Timer, User2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { DollarSign, Package, PackageSearch } from '@/lib/icons';

type Order = {
    id: number;
    delivery_fee?: string | number;
    store_name?: string;
    distance?: number | string;
    [key: string]: any;
};

interface ApiError {
    message: string;
}

interface Props {
    activeOrder: any;
}

/* ----------------------------- Configuration ----------------------------- */
const AUTO_REJECT_SECONDS = 20;
const SOUND_NOTIFICATION = '/sounds/notification.mp3';
const SOUND_BLOCKED = '/sounds/blocked.mp3';
const SOUND_BLOCKED_VOLUME = 0.6;

/* ---------------------------- Small utilities ---------------------------- */
const cls = (...parts: Array<string | false | null | undefined>) =>
    parts.filter(Boolean).join(' ');

/* --------------------------- FollowDelivery comp ------------------------- */

function FollowDelivery({ position }: { position: [number, number] }) {
    useLeafletMap({ follow: position });
    return null;
}

export default function Index({ activeOrder }: Props) {
    const { auth } = usePage<SharedData>().props;
    const { user } = auth;
    const { latitude, longitude } = useGeolocation();

    const deliveryAvailable = Boolean(
        user?.delivery_profile?.status?.is_available ?? false,
    );

    const hasActiveOrder = Boolean(activeOrder);

    // refs to avoid stale closures in listeners/intervals
    const deliveryAvailableRef = useRef(deliveryAvailable);
    const hasActiveOrderRef = useRef(hasActiveOrder);

    useEffect(() => {
        deliveryAvailableRef.current = deliveryAvailable;
    }, [deliveryAvailable]);

    useEffect(() => {
        hasActiveOrderRef.current = hasActiveOrder;
    }, [hasActiveOrder]);

    // --- local state ---
    const [deliveryLocation, setDeliveryLocation] = useState<[number, number]>([
        0, 0,
    ]);

    const [incomingOrder, setIncomingOrder] = useState<Order | null>(null);
    const [countdown, setCountdown] = useState<number>(AUTO_REJECT_SECONDS);
    const [isAccepting, setIsAccepting] = useState(false);

    // --- audio refs (initialized once) ---
    const notificationAudioRef = useRef<HTMLAudioElement | null>(null);
    const blockedAudioRef = useRef<HTMLAudioElement | null>(null);
    const incomingOrderRef = useRef<Order | null>(null);

    useEffect(() => {
        incomingOrderRef.current = incomingOrder;
    }, [incomingOrder]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        notificationAudioRef.current = new Audio(SOUND_NOTIFICATION);
        blockedAudioRef.current = new Audio(SOUND_BLOCKED);
        blockedAudioRef.current.volume = SOUND_BLOCKED_VOLUME;
        // ensure we don't hold onto audio objects if page unloads
        return () => {
            notificationAudioRef.current = null;
            blockedAudioRef.current = null;
        };
    }, []);

    /* -------------------------- helpers / callbacks ------------------------- */
    const getCsrfToken = useCallback(() => {
        if (typeof document === 'undefined') return '';
        return (
            document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute('content') ?? ''
        );
    }, []);

    const clearIncomingOrder = useCallback((message?: string) => {
        notificationAudioRef.current?.pause();
        if (notificationAudioRef.current) {
            notificationAudioRef.current.currentTime = 0;
        }

        setIncomingOrder(null);
        setCountdown(AUTO_REJECT_SECONDS);

        if (message) toast.info(message);
    }, []);

    const handleAcceptOrder = useCallback(
        async (orderId: number) => {
            if (isAccepting) return;

            setIsAccepting(true);

            try {
                const response = await axios.post(
                    `/delivery/orders/${orderId}/accept`,
                    {},
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        withCredentials: true,
                    },
                );

                toast.success('Pedido aceptado 🚴‍♂️');

                clearIncomingOrder();

                router.reload({ only: ['activeOrder'] });
            } catch (error) {
                clearIncomingOrder();

                if (axios.isAxiosError<ApiError>(error)) {
                    const message =
                        error.response?.data?.message ?? 'Error inesperado';

                    toast.error(message);
                }
            } finally {
                setIsAccepting(false);
            }
        },
        [clearIncomingOrder, getCsrfToken, isAccepting],
    );

    const updateStatus = useCallback((url: string, msg: string) => {
        router.post(
            url,
            {},
            {
                onSuccess: () => {
                    toast.success(msg);
                    router.reload({ only: ['activeOrder'] });
                },
                onError: (e: any) => toast.error(e?.message ?? 'Error'),
            },
        );
    }, []);

    const playBlockedSound = useCallback(() => {
        blockedAudioRef.current?.play().catch(() => { });
    }, []);

    const toggleAvailability = useCallback(() => {
        if (hasActiveOrderRef.current) {
            playBlockedSound();
            return;
        }
        router.patch('/delivery/availability', {
            status: !deliveryAvailableRef.current,
        });
    }, [playBlockedSound]);

    /* --------------------------- Geolocation effect ------------------------- */
    useEffect(() => {
        if (latitude && longitude) {
            setDeliveryLocation([latitude, longitude]);
        }
    }, [latitude, longitude]);

    /* --------------------------- Incoming timer ----------------------------- */
    useEffect(() => {
        let timer: number | undefined;
        if (incomingOrder) {
            // if an incoming order exists, ensure countdown resets
            setCountdown(AUTO_REJECT_SECONDS);
            timer = window.setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearIncomingOrder('Pedido rechazado por tiempo');
                        return AUTO_REJECT_SECONDS;
                    }
                    return prev - 1;
                });
            }, 1_000);
        }
        return () => {
            if (timer) window.clearInterval(timer);
        };
    }, [incomingOrder, clearIncomingOrder]);

    useEffect(() => {
        const handler = (event: any) => {
            const payload = event.detail;

            const order = payload.data?.order
                ? JSON.parse(payload.data.order)
                : null;

            const status = order.status ?? null;

            if (
                status === OrderStatus.READY_FOR_PICKUP &&
                !incomingOrderRef.current &&
                !hasActiveOrderRef.current &&
                deliveryAvailableRef.current
            ) {
                const newIncoming: Order = {
                    id: Number(order.id),
                    delivery_fee: payload.data?.delivery_fee ?? '', // tarifa de entrega
                    store_name: payload.data?.store_name ?? '', // nombre del comercio
                    distance: payload.data?.distance ?? '', // distancia al comercio (si viene en la notificación)
                };
                const orderId = Number(order.id);
                if (!orderId) return;

                setIncomingOrder(newIncoming);
                setCountdown(AUTO_REJECT_SECONDS);
                notificationAudioRef.current?.play().catch(() => { });
            }
        };

        window.addEventListener('firebase-message', handler);

        return () => {
            window.removeEventListener('firebase-message', handler);
        };
    }, []);

    useEffect(() => {
        if (hasActiveOrder && incomingOrder) {
            clearIncomingOrder();
        }
    }, [hasActiveOrder, incomingOrder, clearIncomingOrder]);

    return (
        <MainLayout>
            <div className="min-h-screen space-y-2 bg-purple-50/50 p-2">
                {incomingOrder && (
                    <div className="fixed inset-x-0 bottom-0 z-50 duration-300 animate-in slide-in-from-bottom">
                        <Card className="rounded-t-2xl border-t border-purple-200 bg-white shadow-2xl">
                            <CardContent className="space-y-3 p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <p className="text-xs font-bold tracking-widest text-purple-600 uppercase">
                                            Pedido listo
                                        </p>
                                        <div className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600">
                                            <Timer className="h-3 w-3" />
                                            <span>{countdown}s</span>
                                        </div>
                                    </div>
                                    <span className="text-xs font-semibold text-gray-400">
                                        #{incomingOrder.id}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {incomingOrder.store_name ??
                                                'Nuevo comercio'}
                                        </p>
                                        <p className="text-[11px] text-gray-500">
                                            Distancia:{' '}
                                            {incomingOrder.distance ?? '—'} km
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1 font-bold text-green-600">
                                        <DollarSign className="h-4 w-4" />
                                        <span>
                                            {incomingOrder.delivery_fee}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() =>
                                            clearIncomingOrder(
                                                'Pedido rechazado',
                                            )
                                        }
                                        disabled={isAccepting}
                                        aria-label="Rechazar pedido"
                                    >
                                        Rechazar
                                    </Button>
                                    <Button
                                        className="flex-1 bg-purple-600 font-bold"
                                        onClick={() =>
                                            handleAcceptOrder(incomingOrder.id)
                                        }
                                        disabled={isAccepting}
                                        aria-label="Aceptar pedido"
                                    >
                                        {isAccepting
                                            ? 'Procesando...'
                                            : 'Aceptar pedido'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {hasActiveOrder && (
                    <Card className="border-purple-200 bg-white">
                        <CardContent className="space-y-2 p-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Package className="h-4 w-4 text-purple-600" />
                                    <p className="text-sm font-semibold text-purple-900">
                                        Pedido en curso
                                    </p>
                                </div>
                                <span className="text-[10px] font-bold text-purple-500">
                                    #{activeOrder.id}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    className="flex-1 bg-purple-600 text-xs"
                                    aria-label="Marcar llegada"
                                >
                                    Llegué
                                </Button>

                                {activeOrder.status === 'picked_up' && (
                                    <Button
                                        className="flex-1 bg-green-600 text-xs"
                                        onClick={() =>
                                            updateStatus(
                                                `/delivery/orders/${activeOrder.id}/on-the-way`,
                                                'En camino 🚴‍♂️',
                                            )
                                        }
                                        aria-label="Iniciar ruta"
                                    >
                                        Iniciar Ruta
                                    </Button>
                                )}

                                {activeOrder.status === 'on_the_way' && (
                                    <Button
                                        className="flex-1 bg-blue-600 text-xs"
                                        onClick={() =>
                                            updateStatus(
                                                `/delivery/orders/${activeOrder.id}/delivered`,
                                                'Entregado 📦',
                                            )
                                        }
                                        aria-label="Entregar pedido"
                                    >
                                        Entregar
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* --- Profile & availability --- */}
                <Card
                    className={cls(
                        'overflow-hidden border-purple-200 py-1',
                        !deliveryAvailable && 'bg-gray-200',
                    )}
                >
                    <CardContent className="flex items-center justify-between p-1">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <User2 className="h-8 w-8 text-purple-700" />
                                <div
                                    className={cls(
                                        'absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-white',
                                        deliveryAvailable
                                            ? 'bg-green-500'
                                            : 'bg-gray-400',
                                    )}
                                />
                            </div>
                            <div>
                                <p className="text-sm leading-tight font-semibold text-purple-900">
                                    {user.name}
                                </p>
                                <p className="text-[10px] font-semibold text-gray-500 uppercase">
                                    Repartidor
                                </p>
                            </div>
                        </div>

                        <div
                            className={cls(
                                'flex items-center gap-2 rounded-lg border border-purple-100 bg-purple-50 px-2 py-1.5',
                                hasActiveOrder && 'opacity-50',
                            )}
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
                                onClick={() => toggleAvailability()}
                                role="button"
                            >
                                <Switch
                                    id="disponibilidad"
                                    checked={deliveryAvailable}
                                    disabled={hasActiveOrder}
                                    onCheckedChange={() => toggleAvailability()}
                                    className="data-[state=checked]:bg-purple-600"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* --- Map or disconnected state --- */}
                {deliveryAvailable ? (
                    <Card className="relative h-80 overflow-hidden border-purple-200 bg-white p-0 shadow-sm">
                        <Map center={deliveryLocation}>
                            <FollowDelivery position={deliveryLocation} />
                        </Map>
                    </Card>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-purple-100 bg-purple-50/30 py-12">
                        <div className="mb-4 rounded-lg bg-white p-4 shadow-sm">
                            <PackageSearch className="h-10 w-10 text-gray-300" />
                        </div>
                        <h2 className="text-sm font-semibold text-gray-700 uppercase">
                            No puedes recibir pedidos
                        </h2>
                        <p className="mt-1 text-[10px] tracking-widest text-gray-500 uppercase">
                            Activa tu disponibilidad
                        </p>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
