import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Bike, CheckCircle, Package, Star } from 'lucide-react';

export default function Dashboard() {
    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Seguimiento de pedidos', href: '/dashboard' },
            ]}
        >
            <Head title="Seguimiento de Pedidos" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl bg-gray-50/50 p-4">
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-white p-6 shadow-sm md:min-h-min">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Seguimiento de tu pedidos
                        </h1>
                        <p className="text-gray-500">
                            Revisa los productos y finaliza tu compra
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Columna Izquierda: Información del Pedido */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Stepper / Estado del Pedido */}
                            <div className="rounded-xl border bg-white p-6">
                                <div className="relative flex items-center justify-between">
                                    <div className="absolute top-1/2 left-0 z-0 h-1 w-full -translate-y-1/2 bg-orange-100"></div>
                                    <div className="absolute top-1/2 left-0 z-0 h-1 w-2/3 -translate-y-1/2 bg-orange-500"></div>

                                    {[
                                        {
                                            label: 'Pedido Recibido',
                                            icon: (
                                                <CheckCircle className="h-5 w-5" />
                                            ),
                                            active: true,
                                        },
                                        {
                                            label: 'En Preparación',
                                            icon: (
                                                <Package className="h-5 w-5" />
                                            ),
                                            active: true,
                                        },
                                        {
                                            label: 'En Caminossss',
                                            icon: <Bike className="h-5 w-5" />,
                                            active: true,
                                        },
                                    ].map((step, i) => (
                                        <div
                                            key={i}
                                            className="relative z-10 flex flex-col items-center gap-2"
                                        >
                                            <div
                                                className={`rounded-full p-2 ${step.active ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'}`}
                                            >
                                                {step.icon}
                                            </div>
                                            <span className="text-xs font-medium text-gray-600">
                                                {step.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Detalles de Productos */}
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold">
                                    Detalles seleccionados
                                </h2>

                                {/* Item 1 */}
                                <div className="flex items-center gap-4 rounded-xl border bg-white p-4 shadow-sm">
                                    <img
                                        src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=100&h=100&auto=format&fit=crop"
                                        alt="Hamburguesa"
                                        className="h-20 w-20 rounded-lg object-cover"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-bold">
                                            Hamburguesa clásica
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            $12.00
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            Refresco de cola
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="flex h-8 w-8 items-center justify-center rounded-full border">
                                            -
                                        </button>
                                        <span className="font-medium">2</span>
                                        <button className="flex h-8 w-8 items-center justify-center rounded-full border">
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* Botones de Acción Rápida */}
                                <div className="flex gap-4">
                                    <button className="flex-1 rounded-xl bg-orange-500 py-3 font-bold text-white transition-colors hover:bg-orange-600">
                                        Pedir de nuevo
                                    </button>
                                    <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-300 py-3 font-medium text-gray-600 transition-colors hover:bg-gray-50">
                                        <Star className="h-4 w-4 text-orange-400" />{' '}
                                        Calificar pedido
                                    </button>
                                </div>

                                {/* Item Historial */}
                                <div className="flex items-center gap-4 rounded-xl border bg-gray-50 p-4 opacity-70">
                                    <img
                                        src="https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=100&h=100&auto=format&fit=crop"
                                        alt="Pizza"
                                        className="h-16 w-16 rounded-lg object-cover"
                                    />
                                    <div className="flex-1 text-sm">
                                        <h3 className="font-bold">
                                            Pedido #9876 - Entregado
                                        </h3>
                                        <p className="text-gray-500">
                                            05/09/2024
                                        </p>
                                        <div className="mt-1 flex text-orange-400">
                                            <Star className="h-3 w-3 fill-current" />
                                            <Star className="h-3 w-3 fill-current" />
                                            <Star className="h-3 w-3 fill-current" />
                                        </div>
                                    </div>
                                    <span className="font-bold">$18.50</span>
                                </div>
                            </div>
                        </div>

                        {/* Columna Derecha: Resumen y Mapa */}
                        <div className="space-y-6">
                            {/* Card Estado Actual */}
                            <div className="rounded-xl border bg-white p-5 shadow-sm">
                                <div className="mb-4 flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-semibold tracking-wider text-gray-500 uppercase">
                                            Estado actual
                                        </p>
                                        <p className="text-lg font-bold text-orange-600">
                                            ¡Tu pedido va camino!
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            Llegará en ~15-20 min.
                                        </p>
                                    </div>
                                    <Star className="h-5 w-5 text-gray-300" />
                                </div>
                                <div className="text-2xl font-black text-gray-800">
                                    $31.26
                                </div>
                            </div>

                            {/* Resumen de costos */}
                            <div className="space-y-3 rounded-xl border bg-white p-5 shadow-sm">
                                <h3 className="border-bottom pb-2 font-bold">
                                    Resumen del pedido
                                </h3>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal:</span>
                                    <span>$23.50</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Costo de envío:</span>
                                    <span>$4.00</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>IVA (16%):</span>
                                    <span>$3.76</span>
                                </div>
                                <div className="flex justify-between border-t pt-2 text-lg font-bold text-gray-900">
                                    <span>Total:</span>
                                    <span>$31.26</span>
                                </div>
                                <p className="text-xs font-medium text-green-600">
                                    Efectivo al recibir
                                </p>
                            </div>

                            {/* Mapa y Dirección */}
                            {/* <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                                <div className="relative h-40 bg-blue-50">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <MapPin className="h-8 w-8 animate-bounce text-orange-500" />
                                        <div className="absolute h-1 w-3/4 rotate-45 bg-blue-200"></div>
                                    </div>
                                    <div className="absolute bottom-2 left-2 rounded bg-white px-2 py-1 text-[10px] font-bold shadow">
                                        Ubicación en tiempo real
                                    </div>
                                </div>
                                <div className="space-y-4 p-4">
                                    <div>
                                        <p className="text-xs font-bold tracking-tighter text-gray-400 uppercase">
                                            Dirección de entrega
                                        </p>
                                        <p className="text-sm font-medium">
                                            Casa - Santo Domingo Yanhuitlán
                                        </p>
                                    </div>
                                    <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-3 font-bold text-white transition-colors hover:bg-black">
                                        Confirmar y Pagar
                                    </button>
                                    <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50">
                                        <MessageSquare className="h-4 w-4" />{' '}
                                        Contactar al repartidor
                                    </button>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
