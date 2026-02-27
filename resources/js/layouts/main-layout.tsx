import { usePage } from '@inertiajs/react';
import { memo, ReactNode, useEffect, useRef, useState } from 'react';
import { ToastContainer } from 'react-toastify';

import Header from '@/components/app/Header';
import MobileSidebar from '@/components/app/MobileSidebar';
import { messaging, onMessage } from '@/firebase';
import { CartFloatButton } from '@/pages/Public/Business/CartFloatButton';
import { CartDrawer } from '@/pages/Public/Business/drawer-cart';
import { Order, OrderStatus, SharedData, TypeUser } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, ChevronDown, Circle, X } from 'lucide-react';
import ProviderLayout from './ProviderLayout';

interface MainLayoutProps {
    children: ReactNode;
    showFloatShoppingCart?: boolean;
}

const STEPS: { key: OrderStatus; label: string }[] = [
    { key: OrderStatus.PENDING, label: 'Pendiente' },
    { key: OrderStatus.CONFIRMED, label: 'Confirmado' },
    { key: OrderStatus.READY_FOR_PICKUP, label: 'Por recoger' }, //delivery_assigned
    { key: OrderStatus.PICKED_UP, label: 'En camino' },
    { key: OrderStatus.DELIVERED, label: 'Entregado' },
];

import { Clock, Home, Package, Truck } from 'lucide-react';

const STEP_ICONS: Record<OrderStatus, React.ReactNode> = {
    [OrderStatus.PENDING]: <Clock size={14} />,
    [OrderStatus.CONFIRMED]: <CheckCircle size={14} />,
    [OrderStatus.READY_FOR_PICKUP]: <Package size={14} />,
    [OrderStatus.PICKED_UP]: <Truck size={14} />,
    [OrderStatus.DELIVERED]: <Home size={14} />,
    [OrderStatus.DELIVERY_ASSIGNED]: <Package size={14} />, // por normalización
};

const normalizeStatus = (status: OrderStatus): OrderStatus => {
    if (status === OrderStatus.DELIVERY_ASSIGNED) {
        return OrderStatus.READY_FOR_PICKUP;
    }

    return status;
};

export default function MainLayout({
    children,
    showFloatShoppingCart = true,
}: MainLayoutProps) {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [activeOrder, setActiveOrder] = useState<Order | null>(null);
    const [isLoadingActiveOrder, setIsLoadingActiveOrder] = useState(true);

    const { cart, auth } = usePage<SharedData>().props;
    const items = Object.values(cart);
    const user = auth?.user;
    const totalItems = items.length;

    useEffect(() => {
        if (!messaging) return;

        const unsubscribe = onMessage(messaging, (payload) => {
            window.dispatchEvent(
                new CustomEvent('firebase-message', { detail: payload }),
            );

            // toast.success(
            //     <div>
            //         <p className="font-bold">
            //             {payload.notification?.title ?? 'Actualización'}
            //         </p>
            //         <p className="text-[10px]">
            //             {payload.notification?.body ?? ''}
            //         </p>
            //     </div>,
            // );
            fetchActiveOrder();
        });

        return () => unsubscribe();
    }, []);

    const fetchActiveOrder = async () => {
        try {
            const response = await fetch('/api/v1/me/active-order');
            const data = await response.json();

            if (!data || Object.keys(data).length === 0 || !data.id) {
                setActiveOrder((prev: Order | null) => {
                    // Si ya teníamos un pedido y ahora es null, asumimos que se entregó (o canceló)
                    // y forzamos el estado DELIVERED para darle los 6 segundos de gracia.
                    if (prev && prev.status !== OrderStatus.DELIVERED) {
                        return { ...prev, status: OrderStatus.DELIVERED };
                    }
                    return null;
                });
                return;
            }

            setActiveOrder(data);
        } catch (error) {
            console.error('Error fetching active order:', error);
        } finally {
            setIsLoadingActiveOrder(false);
        }
    };

    useEffect(() => {
        fetchActiveOrder();
    }, []);

    return (
        <ProviderLayout>
            <main className="relative z-10 min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
                <ToastContainer
                    position="top-right"
                    className="!z-[9999]"
                    autoClose={1800}
                />

                <Header />

                <div className="relative z-10 w-full max-w-6xl p-1 md:mx-auto md:max-w-7xl">
                    {children}
                    {/* {updateAvailable && <PwaUpdateBanner onRefresh={refreshApp} />} */}
                    {/* <PWAInstallBanner /> */}
                </div>

                {user && (
                    <>
                        {showFloatShoppingCart && (
                            <CartFloatButton
                                totalItems={totalItems}
                                onClick={() => setIsCartOpen(true)}
                            />
                        )}

                        <CartDrawer
                            isOpen={isCartOpen}
                            onClose={() => setIsCartOpen(false)}
                        />
                    </>
                )}

                <MobileSidebar />

                {!isLoadingActiveOrder &&
                    activeOrder &&
                    user?.type === TypeUser.CLIENT && (
                        <ActiveOrderBar
                            order={activeOrder}
                            onClose={() => setActiveOrder(null)}
                        />
                    )}
            </main>
        </ProviderLayout>
    );
}

const STORAGE_KEY = 'active-order-expanded';

const ActiveOrderBar = memo(
    ({ order, onClose }: { order: Order; onClose?: () => void }) => {
        const [isVisible, setIsVisible] = useState(true);
        const [expanded, setExpanded] = useState<boolean>(() => {
            // ✅ Si monta directo con DELIVERED, siempre abrir sin importar localStorage
            if (order.status === OrderStatus.DELIVERED) return true;

            if (typeof window === 'undefined') return true;
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved === null) return true;
            return saved === 'true';
        });

        // ✅ previousStatusRef arranca en null para distinguir "primer mount" de "cambio real"
        const previousStatusRef = useRef<OrderStatus | null>(null);

        const visualStatus = normalizeStatus(order.status);
        const CURRENT_STEP = STEPS.findIndex((s) => s.key === visualStatus);

        useEffect(() => {
            localStorage.setItem(STORAGE_KEY, String(expanded));
        }, [expanded]);

        useEffect(() => {
            const isNowDelivered = order.status === OrderStatus.DELIVERED;

            if (isNowDelivered) {
                setExpanded(true); // Siempre expandir al entregar

                // Countdown de 6s para cerrar
                const timer = setTimeout(() => {
                    setIsVisible(false);
                    // Notificar al padre para que limpie el estado después de la animación de salida
                    setTimeout(() => {
                        onClose?.();
                    }, 500); // Esperar a que termine la animación de Framer Motion
                }, 6000);

                return () => clearTimeout(timer);
            }

            previousStatusRef.current = order.status;
        }, [order.status, onClose]);

        useEffect(() => {
            // Resetear visibilidad si el pedido cambia a uno no entregado (por si acaso)
            if (order.status !== OrderStatus.DELIVERED) {
                setIsVisible(true);
            }
        }, [order.id]);

        const totalQuantity = (order.items ?? []).reduce(
            (sum, item) => sum + (item.quantity ?? 0),
            0,
        );

        return (
            <AnimatePresence>
                {isVisible && (
                    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center p-2 sm:p-4">
                        <motion.div
                            layout
                            initial={{ y: 100, opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{
                                y: 120,
                                opacity: 0,
                                transition: { duration: 0.2 },
                            }}
                            transition={{
                                type: 'spring',
                                stiffness: 400,
                                damping: 30,
                            }}
                            className="pointer-events-auto relative w-full max-w-md overflow-hidden rounded-3xl border border-white/40 bg-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.1)] backdrop-blur-xl transition-all hover:bg-white/90"
                        >
                            {/* Botón Cerrar (X) */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsVisible(false);
                                    setTimeout(() => onClose?.(), 300);
                                }}
                                className="absolute top-3 right-3 z-20 rounded-full p-1.5 text-purple-400 transition-colors hover:bg-purple-100 hover:text-purple-600"
                            >
                                <X size={16} />
                            </button>

                            <div
                                className="cursor-pointer px-5 py-4 select-none"
                                onClick={() => {
                                    setExpanded((prev) => !prev);
                                }}
                            >
                                <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-purple-200/50" />

                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 pb-1.5">
                                            <span className="flex items-center gap-1.5 rounded-full bg-purple-100 px-2 py-0.5 text-[9px] font-bold tracking-widest text-purple-600 uppercase">
                                                {order.status ===
                                                OrderStatus.DELIVERED
                                                    ? 'Completado'
                                                    : 'Pedido en vivo'}
                                                {order.status !==
                                                    OrderStatus.DELIVERED && (
                                                    <Circle className="h-1.5 w-1.5 animate-pulse fill-purple-600 text-purple-600" />
                                                )}
                                            </span>
                                            {!expanded && totalQuantity > 0 && (
                                                <span className="text-[10px] font-medium text-slate-500">
                                                    • {totalQuantity}{' '}
                                                    {totalQuantity === 1
                                                        ? 'producto'
                                                        : 'productos'}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-base font-extrabold text-slate-900">
                                            ORDEN #{order.id}
                                        </p>
                                        <p className="text-xs font-semibold text-purple-600">
                                            {STEPS[CURRENT_STEP]?.label ?? ''}
                                        </p>

                                        {order.status ===
                                            OrderStatus.DELIVERED && (
                                            <motion.p
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="mt-1 flex items-center gap-1.5 text-xs font-bold text-green-600"
                                            >
                                                <CheckCircle size={14} />{' '}
                                                ¡Entregado con éxito!
                                            </motion.p>
                                        )}
                                    </div>
                                    <motion.div
                                        animate={{ rotate: expanded ? 180 : 0 }}
                                        className="mr-6 flex h-8 w-8 items-center justify-center rounded-full bg-purple-50 text-purple-500"
                                    >
                                        <ChevronDown size={20} />
                                    </motion.div>
                                </div>
                            </div>

                            <AnimatePresence initial={false}>
                                {expanded && (
                                    <motion.div
                                        key="content"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{
                                            duration: 0.3,
                                            ease: [0.4, 0, 0.2, 1],
                                        }}
                                    >
                                        <div className="max-h-[50vh] overflow-y-auto border-t border-slate-100 bg-slate-50/30 px-5 py-4">
                                            <OrderDetail
                                                order={{
                                                    ...order,
                                                    status: normalizeStatus(
                                                        order.status,
                                                    ),
                                                }}
                                                expanded={expanded}
                                            />
                                        </div>

                                        {order.status ===
                                            OrderStatus.DELIVERED && (
                                            <div className="border-t border-slate-100 bg-white p-4">
                                                <button
                                                    onClick={() => {
                                                        window.location.href = `/orders/${order.id}`;
                                                    }}
                                                    className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-200 transition-all hover:scale-[1.02] hover:shadow-purple-300 active:scale-[0.98]"
                                                >
                                                    <span>
                                                        Ver detalle completo
                                                    </span>
                                                    <ChevronDown
                                                        size={18}
                                                        className="-rotate-90 transition-transform group-hover:translate-x-1"
                                                    />
                                                </button>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Barra de progreso de cierre automático (solo para entregados) */}
                            {order.status === OrderStatus.DELIVERED &&
                                isVisible && (
                                    <motion.div
                                        initial={{ width: '100%' }}
                                        animate={{ width: '0%' }}
                                        transition={{
                                            duration: 6,
                                            ease: 'linear',
                                        }}
                                        className="h-1 bg-green-500/50"
                                    />
                                )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        );
    },
);

const OrderDetail = memo(
    ({ order, expanded }: { order: Order; expanded: boolean }) => (
        <div className="space-y-2 rounded-lg border border-purple-200 bg-purple-50 p-1 shadow-sm">
            <div className="mb-4">
                <OrderTimeline
                    status={normalizeStatus(order.status)}
                    compact={!expanded}
                />
            </div>
            <div className="space-y-2">
                {(order.items ?? []).map((item) => (
                    <div
                        key={item.id}
                        className="flex justify-between text-sm font-normal text-gray-700"
                    >
                        <span className="font-semibold text-purple-800">
                            {item.quantity}×
                        </span>
                        <span className="text-gray-600">
                            {item.product_name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    ),
);

const OrderTimeline = memo(
    ({
        status,
        compact = false,
    }: {
        status: OrderStatus;
        compact?: boolean;
    }) => {
        const current = STEPS.findIndex((s) => s.key === status);

        const progressPercentage =
            current <= 0 ? 0 : (current / (STEPS.length - 1)) * 100;

        // 🔥 MODO ULTRA COMPACTO
        if (compact) {
            const currentStep = STEPS[current];

            return (
                <div className="flex items-center gap-3 px-2 py-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-white">
                        {STEP_ICONS[currentStep.key]}
                    </div>

                    <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800">
                            {currentStep.label}
                        </p>

                        <div className="mt-1 h-[4px] w-full overflow-hidden rounded-full bg-gray-200">
                            <motion.div
                                className="h-full bg-purple-600"
                                initial={{ width: 0 }}
                                animate={{
                                    width: `${progressPercentage}%`,
                                }}
                                transition={{
                                    duration: 0.4,
                                }}
                            />
                        </div>
                    </div>

                    <span className="text-xs font-medium text-gray-500">
                        {current + 1}/{STEPS.length}
                    </span>
                </div>
            );
        }

        // 🟣 MODO NORMAL (expandido)
        return (
            <div className="relative w-full px-2 py-4">
                <div className="absolute top-6 left-0 h-[3px] w-full rounded-full bg-gray-200" />

                <motion.div
                    className="absolute top-6 left-0 h-[3px] rounded-full bg-gradient-to-r from-purple-500 to-purple-700"
                    initial={{ width: 0 }}
                    animate={{
                        width: `${progressPercentage}%`,
                    }}
                    transition={{
                        duration: 0.5,
                        ease: 'easeInOut',
                    }}
                />

                <div className="relative flex justify-between">
                    {STEPS.map((step, index) => {
                        const isCompleted = index < current;
                        const isCurrent = index === current;

                        return (
                            <div
                                key={step.key}
                                className="flex w-[60px] flex-col items-center"
                            >
                                <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border bg-white">
                                    {isCompleted ? (
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                    ) : (
                                        <div
                                            className={`${
                                                isCurrent
                                                    ? 'text-purple-600'
                                                    : 'text-gray-300'
                                            }`}
                                        >
                                            {STEP_ICONS[step.key]}
                                        </div>
                                    )}
                                </div>

                                <span
                                    className={`mt-2 text-center text-[11px] leading-tight font-semibold ${
                                        isCurrent
                                            ? 'text-purple-800'
                                            : isCompleted
                                              ? 'text-gray-700'
                                              : 'text-gray-300'
                                    }`}
                                >
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    },
);
