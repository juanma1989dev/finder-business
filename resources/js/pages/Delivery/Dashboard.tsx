import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useOrderStatus } from '@/hooks/useOrderStatus';
import DashboardLayout from '@/layouts/dashboard-layout';
import { BreadcrumbItem, Order } from '@/types';
import { router } from '@inertiajs/react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { Bike, CalendarIcon, ChevronRight, Loader2, PackageSearch } from 'lucide-react';
import { useState } from 'react';

export default function DeliveryDashboard({
    breadcrumbs,
    orders,
    filters,
}: {
    breadcrumbs: BreadcrumbItem[];
    orders: Order[];
    filters?: {
        date?: string;
    };
}) {
    const [date, setDate] = useState<Date>(
        filters?.date ? new Date(`${filters.date}T00:00:00`) : new Date(),
    );

    const [processingId, setProcessingId] = useState<number | null>(null);

    const onDateChange = (selected?: Date) => {
        if (!selected) return;

        setDate(selected);

        router.get(
            '/dashboard/delivery',
            {
                date: format(selected, 'yyyy-MM-dd'),
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    return (
        <DashboardLayout breadcrumbs={breadcrumbs}>
            <div className="flex min-h-screen flex-col gap-4 bg-purple-50/30 p-4 lg:p-6">
                <div className="mb-2">
                    <h1 className="text-base font-semibold tracking-tight text-gray-700 uppercase">
                        Historial de pedidos
                    </h1>
                </div>

                <div className="flex flex-col gap-3 rounded-lg border border-purple-200 bg-white p-3 shadow-sm md:flex-row md:items-center">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full justify-start gap-2 text-left font-normal md:w-64"
                            >
                                <CalendarIcon className="h-4 w-4 text-purple-600" />
                                {date ? (
                                    format(date, 'PPP', { locale: es })
                                ) : (
                                    <span className="text-gray-400">
                                        Selecciona una fecha
                                    </span>
                                )}
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={onDateChange}
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* 📦 Pedidos */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {orders.length === 0 ? (
                        <EmptyState />
                    ) : (
                        orders.map((order) => (
                            <DeliveryOrderCard
                                key={order.id}
                                pedido={order}
                                isProcessing={processingId === order.id}
                            />
                        ))
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}

function DeliveryOrderCard({
    pedido,
    isProcessing,
}: {
    pedido: any;
    isProcessing: boolean;
}) {
    const { labels } = useOrderStatus();
    const status = pedido.status;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className={`relative flex flex-col overflow-hidden rounded-[2rem] border border-white/40 bg-white/70 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl transition-all hover:bg-white/90 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] ${isProcessing ? 'animate-pulse' : ''
                }`}
        >
            {isProcessing && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/40 backdrop-blur-sm">
                    <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
                </div>
            )}

            <div className="flex items-start justify-between">
                <div className="flex gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 shadow-inner border border-purple-100/50">
                        <Bike className="h-6 w-6" />
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Orden #{pedido.id}
                        </span>
                        <h3 className="text-base font-bold text-slate-800 line-clamp-1">
                            {pedido.user?.name ?? 'Cliente Registrado'}
                        </h3>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-1.5">
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-[9px] font-black text-amber-600 border border-amber-100 uppercase tracking-tighter">
                        {labels[status]}
                    </span>
                    <span className="text-lg font-black text-slate-900">
                        ${pedido.total}
                    </span>
                </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Listo para entrega</span>
                </div>

                <button
                    onClick={() => router.get(`/delivery/history/${pedido.id}`)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-purple-600 hover:text-white"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </motion.div>
    );
}

function EmptyState() {
    return (
        <div className="col-span-full flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-purple-100 bg-white py-16 text-center">
            <div className="mb-4 rounded-lg bg-purple-50 p-4 text-gray-300 shadow-sm">
                <PackageSearch size={32} />
            </div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase">
                No hay pedidos por mostrar
            </h3>
            <p className="mt-1 text-[10px] tracking-widest text-gray-500 uppercase">
                Los pedidos de ese día aparecerán aquí.
            </p>
        </div>
    );
}
