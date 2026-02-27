import { Map } from '@/components/leaflet/Map';
import { useLeafletMap } from '@/components/leaflet/useLeafletMap';
import { Card, CardContent } from '@/components/ui/card';
import { useGeolocation } from '@/hooks/use-Geolocation';
import { useNotification } from '@/hooks/use-notification';
import MainLayout from '@/layouts/main-layout';
import { DollarSign, Package, PackageSearch } from '@/lib/icons';
import { OrderStatus, SharedData } from '@/types';
import { router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Battery,
    ChevronRight,
    History,
    Loader2,
    MapPin,
    Moon,
    PackageCheck,
    Sun,
    Timer,
    User2,
    Wifi,
    WifiOff,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

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
const AUTO_REJECT_SECONDS = 30;
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

    const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const { playNotification, stop: stopNotification } = useNotification();

    const [incomingOrder, setIncomingOrder] = useState<Order | null>(null);
    const [countdown, setCountdown] = useState<number>(AUTO_REJECT_SECONDS);
    const [isAccepting, setIsAccepting] = useState(false);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    // Track System Status
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        if ('getBattery' in navigator) {
            (navigator as any).getBattery().then((battery: any) => {
                setBatteryLevel(Math.floor(battery.level * 100));
                battery.addEventListener('levelchange', () => {
                    setBatteryLevel(Math.floor(battery.level * 100));
                });
            });
        }

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // --- audio refs (initialized once) ---
    const blockedAudioRef = useRef<HTMLAudioElement | null>(null);
    const incomingOrderRef = useRef<Order | null>(null);

    useEffect(() => {
        incomingOrderRef.current = incomingOrder;
    }, [incomingOrder]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        blockedAudioRef.current = new Audio(SOUND_BLOCKED);
    }, []);

    // Sound & Haptic Feedback for New Orders - Handled directly in handler for better browser support
    /*
    useEffect(() => {
        if (incomingOrder) {
            playNotification({ withSound: true, vibrationType: 'pulse' });
        }
    }, [incomingOrder, playNotification]);
    */

    /* -------------------------- helpers / callbacks ------------------------- */
    const getCsrfToken = useCallback(() => {
        if (typeof document === 'undefined') return '';
        return (
            document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute('content') ?? ''
        );
    }, []);

    const clearIncomingOrder = useCallback(
        (message?: string) => {
            stopNotification();

            setIncomingOrder(null);
            setCountdown(AUTO_REJECT_SECONDS);

            if (message) toast.info(message);
        },
        [stopNotification],
    );

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

                clearIncomingOrder();

                playNotification({ withSound: false, vibrationType: 'short' });
                router.reload({ only: ['activeOrder'] });
            } catch (error: any) {
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

    const updateStatus = useCallback(
        (url: string, msg: string) => {
            if (isUpdatingStatus) return;
            setIsUpdatingStatus(true);
            router.post(
                url,
                {},
                {
                    onSuccess: () => {
                        playNotification({
                            withSound: false,
                            vibrationType: 'short',
                        });
                        router.reload({ only: ['activeOrder'] });
                    },
                    onError: (e: any) => toast.error(e?.message ?? 'Error'),
                    onFinish: () => setIsUpdatingStatus(false),
                },
            );
        },
        [isUpdatingStatus],
    );

    const playBlockedSound = useCallback(() => {
        blockedAudioRef.current?.play().catch(() => {});
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

    useEffect(() => {
        if (latitude && longitude) {
            setDeliveryLocation([latitude, longitude]);
        }
    }, [latitude, longitude]);

    useEffect(() => {
        let timer: number | undefined;
        if (incomingOrder) {
            setCountdown(AUTO_REJECT_SECONDS);
            timer = window.setInterval(() => {
                setCountdown((prev: number) => {
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
                playNotification({ withSound: true, vibrationType: 'pulse' });
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
            <div className="flex min-h-screen flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-white to-purple-50/30">
                {/* --- Elegant Header & Performance --- */}
                <div className="sticky top-0 z-40 px-4 pt-4 pb-2">
                    <div className="overflow-hidden rounded-2xl border border-white/40 bg-white/70 shadow-xl shadow-purple-900/5 backdrop-blur-xl">
                        <div className="p-4">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg ring-2 shadow-purple-200 ring-white">
                                            <User2 className="h-6 w-6 text-white" />
                                        </div>
                                        <div
                                            className={cls(
                                                'absolute -right-1 -bottom-1 h-4 w-4 rounded-full border-2 border-white shadow-sm',
                                                deliveryAvailable
                                                    ? 'bg-emerald-500'
                                                    : 'bg-gray-300',
                                            )}
                                        />
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-black tracking-tight text-gray-800">
                                            Hola, {auth.user.name}
                                        </h2>
                                        <div className="mt-0.5 flex items-center gap-2">
                                            <div className="flex items-center gap-1 rounded-md border border-white/50 bg-white/50 px-1.5 py-0.5 shadow-sm">
                                                {isOnline ? (
                                                    <Wifi className="h-2.5 w-2.5 text-emerald-500" />
                                                ) : (
                                                    <WifiOff className="h-2.5 w-2.5 text-rose-500" />
                                                )}
                                                <span
                                                    className={cls(
                                                        'text-[8px] font-bold uppercase',
                                                        isOnline
                                                            ? 'text-emerald-600'
                                                            : 'text-rose-600',
                                                    )}
                                                >
                                                    {isOnline
                                                        ? 'Online'
                                                        : 'Offline'}
                                                </span>
                                            </div>
                                            {batteryLevel !== null && (
                                                <div className="flex items-center gap-1 rounded-md border border-white/50 bg-white/50 px-1.5 py-0.5 shadow-sm">
                                                    <Battery
                                                        className={cls(
                                                            'h-2.5 w-2.5',
                                                            batteryLevel < 20
                                                                ? 'text-rose-500'
                                                                : 'text-indigo-500',
                                                        )}
                                                    />
                                                    <span className="text-[8px] font-bold text-gray-500">
                                                        {batteryLevel}%
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={toggleAvailability}
                                    className={`group relative flex items-center gap-2 overflow-hidden rounded-xl px-4 py-2 text-[10px] font-black tracking-wider uppercase transition-all duration-300 active:scale-95 ${
                                        deliveryAvailable
                                            ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                    } ${hasActiveOrder && 'cursor-not-allowed opacity-50'}`}
                                >
                                    {deliveryAvailable ? (
                                        <>
                                            En línea <Sun className="h-3 w-3" />
                                        </>
                                    ) : (
                                        <>
                                            Fuera de turno{' '}
                                            <Moon className="h-3 w-3" />
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* <div className="grid grid-cols-1">
                                <div className="rounded-xl border border-indigo-100/50 bg-indigo-50/50 p-3">
                                    <div className="mb-1 flex items-center gap-2">
                                        <TrendingUp className="h-3 w-3 text-indigo-600" />
                                        <span className="text-[9px] font-bold tracking-tighter text-gray-400 uppercase">
                                            ***Entregas de Hoy
                                        </span>
                                    </div>
                                    <p className="text-sm font-black text-indigo-900">
                                        0
                                    </p>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>

                <div className="flex-1 px-4 pb-32">
                    <div className="relative mt-2">
                        {deliveryAvailable ? (
                            <Card className="relative h-[60vh] overflow-hidden rounded-3xl border-0 bg-white p-0 shadow-2xl ring-1 ring-purple-100/50">
                                <Map center={deliveryLocation}>
                                    <FollowDelivery
                                        position={deliveryLocation}
                                    />
                                </Map>
                                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white via-white/20 to-transparent" />
                            </Card>
                        ) : (
                            <div className="flex h-[60vh] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-purple-200 bg-white/50 duration-700 animate-in fade-in">
                                <div className="relative mb-6">
                                    <div className="absolute inset-0 animate-ping rounded-full bg-purple-100 opacity-75"></div>
                                    <div className="relative rounded-2xl bg-white p-6 shadow-xl shadow-purple-900/5">
                                        <PackageSearch className="h-12 w-12 text-purple-200" />
                                    </div>
                                </div>
                                <h2 className="text-base font-extrabold tracking-tight text-gray-800 uppercase">
                                    Estás desconectado
                                </h2>
                                <p className="mt-2 max-w-[200px] text-center text-[10px] leading-relaxed tracking-widest text-gray-400 uppercase">
                                    Activa tu disponibilidad para empezar a
                                    recibir pedidos
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <AnimatePresence>
                    {(incomingOrder || hasActiveOrder) && (
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            className="fixed inset-x-0 bottom-0 z-[1000] px-4 pb-2"
                        >
                            <Card className="overflow-hidden border-0 bg-white/95 shadow-2xl ring-1 shadow-purple-900/20 ring-white backdrop-blur-xl">
                                <CardContent className="p-0">
                                    {incomingOrder && (
                                        <div className="p-4">
                                            <div className="mb-4 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-12 w-12 animate-pulse items-center justify-center rounded-2xl bg-purple-600 shadow-xl shadow-purple-200">
                                                        <Package className="h-6 w-6 text-white" />
                                                    </div>
                                                    <div>
                                                        <span className="mb-1 inline-flex rounded-full bg-purple-100 px-2.5 py-0.5 text-[9px] font-black tracking-widest text-purple-600 uppercase">
                                                            Nuevo Pedido
                                                        </span>
                                                        <h3 className="text-lg leading-none font-black text-gray-900">
                                                            {
                                                                incomingOrder.store_name
                                                            }
                                                        </h3>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="flex items-center justify-end gap-1.5 text-xs font-black text-red-500">
                                                        <Timer className="animate-spin-slow h-4 w-4" />
                                                        {countdown}s
                                                    </div>
                                                    <p className="mt-1 text-[10px] font-bold tracking-tighter text-gray-400">
                                                        EXPIRA PRONTO
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mb-4 grid grid-cols-2 gap-4">
                                                <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50/50 p-3">
                                                    <MapPin className="h-4 w-4 text-gray-400" />
                                                    <p className="text-xs font-bold text-gray-600">
                                                        — km
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-3 rounded-2xl border border-green-100 bg-green-50/50 p-3 text-green-700">
                                                    <DollarSign className="h-4 w-4" />
                                                    <p className="text-xs font-black">
                                                        {
                                                            incomingOrder.delivery_fee
                                                        }
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex gap-3">
                                                <button
                                                    className="flex-1 rounded-2xl border border-red-200 py-4 text-xs font-black tracking-widest text-red-500 uppercase transition-all hover:bg-red-50 active:scale-95 disabled:opacity-50"
                                                    onClick={() =>
                                                        clearIncomingOrder(
                                                            'Pedido rechazado',
                                                        )
                                                    }
                                                    disabled={isAccepting}
                                                >
                                                    Declinar
                                                </button>
                                                <button
                                                    className="flex-[2] rounded-2xl bg-purple-600 py-4 text-xs font-black tracking-widest text-white uppercase shadow-xl shadow-purple-200 transition-all hover:bg-purple-700 active:scale-95 disabled:opacity-50"
                                                    onClick={() =>
                                                        handleAcceptOrder(
                                                            incomingOrder?.id ??
                                                                0,
                                                        )
                                                    }
                                                    disabled={isAccepting}
                                                >
                                                    {isAccepting ? (
                                                        <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                                                    ) : (
                                                        'Aceptar Pedido'
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {hasActiveOrder && (
                                        <div className="p-2">
                                            <div className="mb-4 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                                        <History className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black tracking-widest text-indigo-600 uppercase">
                                                            En Curso
                                                        </p>
                                                        <p className="text-sm font-black text-gray-900">
                                                            Orden #
                                                            {activeOrder.id}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-100">
                                                    <div
                                                        className="h-full bg-indigo-500 transition-all duration-1000"
                                                        style={{
                                                            width:
                                                                activeOrder.status ===
                                                                OrderStatus.PICKED_UP
                                                                    ? '100%'
                                                                    : '50%',
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex gap-3">
                                                {activeOrder.status ===
                                                    OrderStatus.DELIVERY_ASSIGNED && (
                                                    <button
                                                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 py-4 text-xs font-black tracking-widest text-white uppercase shadow-xl shadow-green-200 transition-all hover:bg-green-700 active:scale-95 disabled:opacity-50"
                                                        onClick={() =>
                                                            updateStatus(
                                                                `/delivery/orders/${activeOrder.id}/on-the-way`,
                                                                'En camino 🚴‍♂️',
                                                            )
                                                        }
                                                        disabled={
                                                            isUpdatingStatus
                                                        }
                                                    >
                                                        {isUpdatingStatus ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <>
                                                                Recoger Pedido
                                                                <ChevronRight className="h-4 w-4" />
                                                            </>
                                                        )}
                                                    </button>
                                                )}

                                                {activeOrder.status ===
                                                    OrderStatus.PICKED_UP && (
                                                    <button
                                                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 text-xs font-black tracking-widest text-white uppercase shadow-xl shadow-blue-200 transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50"
                                                        onClick={() =>
                                                            updateStatus(
                                                                `/delivery/orders/${activeOrder.id}/delivered`,
                                                                'Entregado 📦',
                                                            )
                                                        }
                                                        disabled={
                                                            isUpdatingStatus
                                                        }
                                                    >
                                                        {isUpdatingStatus ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <>
                                                                Confirmar
                                                                Entrega
                                                                <PackageCheck className="h-4 w-4" />
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <style>{`
                .animate-spin-slow {
                    animation: spin 3s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </MainLayout>
    );
}
