import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import {
    Bike,
    Check,
    CheckCircle,
    Clock,
    Power,
    Search,
    Utensils,
} from 'lucide-react';
import { useMemo, useState } from 'react';

export default function OrderManagement() {
    const [isBusinessOpen, setIsBusinessOpen] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('Todos'); // 'Todos', 'Pendiente', 'Preparando'

    const [pedidos, setPedidos] = useState([
        {
            id: '#1024',
            cliente: 'Juan Pérez',
            total: 31.26,
            status: 'Pendiente',
            items: '2x Hamburguesa, 1x Soda',
            tiempo: 5,
            tipo: 'Delivery',
        },
        {
            id: '#1025',
            cliente: 'Maria G.',
            total: 15.5,
            status: 'Preparando',
            items: '1x Pizza Grande',
            tiempo: 12,
            tipo: 'Pick-up',
        },
        {
            id: '#1026',
            cliente: 'Carlos R.',
            total: 42.0,
            status: 'Pendiente',
            items: '3x Tacos Pastor',
            tiempo: 2,
            tipo: 'Delivery',
        },
    ]);

    // Lógica de Filtrado (Funcionalidad Nueva A)
    const pedidosFiltrados = useMemo(() => {
        return pedidos.filter((p) => {
            const matchesSearch =
                p.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.id.includes(searchTerm);
            const matchesTab = activeTab === 'Todos' || p.status === activeTab;
            return matchesSearch && matchesTab;
        });
    }, [pedidos, searchTerm, activeTab]);

    const avanzarEstado = (id: string) => {
        setPedidos(
            pedidos.map((p) => {
                if (p.id === id) {
                    if (p.status === 'Pendiente')
                        return { ...p, status: 'Preparando' };
                    if (p.status === 'Preparando')
                        return { ...p, status: 'Enviado' };
                }
                return p;
            }),
        );
    };

    const building = true; ////// MANEJA SI SE PUEDE VER LA SECCION

    return (
        <AppLayout
            breadcrumbs={[{ title: 'Panel de Control', href: '/admin' }]}
        >
            <Head title="Gestión de Pedidos" />

            {building ? (
                <div className="flex min-h-[400px] w-full flex-col items-center justify-center rounded-[2.5rem] border border-slate-100 bg-white p-8 text-center shadow-sm">
                    {/* Icono Animado Minimalista */}
                    <div className="relative mb-6">
                        <div className="absolute inset-0 animate-ping rounded-full bg-orange-100 opacity-75"></div>
                        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="40"
                                height="40"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M12 20v-6M9 20v-4M15 20v-8M18 20V8M21 20V4M3 20h18" />
                                <path d="M3 20v-2M6 20v-4" />
                            </svg>
                        </div>
                    </div>

                    {/* Texto con Jerarquía */}
                    <div className="max-w-md space-y-2">
                        <h3 className="text-3xl font-extrabold tracking-tight text-slate-900">
                            Gestión de Pedidos
                        </h3>
                        <p className="text-lg font-medium text-orange-600/80">
                            Estamos preparando algo increíble
                        </p>
                        <p className="text-sm leading-relaxed text-slate-500">
                            Este módulo se encuentra actualmente en desarrollo.
                            Muy pronto podrás gestionar tus ventas, clientes y
                            envíos desde este panel centralizado.
                        </p>
                    </div>

                    {/* Botón de retorno o acción simple */}
                    <div className="mt-8 flex gap-3">
                        <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
                        <div className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                        <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
                    </div>
                </div>
            ) : (
                <div className="flex min-h-screen flex-col gap-4 bg-[#f8fafc] p-4 lg:p-6">
                    {/* HEADER SUPERIOR */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-2xl font-black tracking-tight text-slate-900">
                                Gestión de Pedidos
                            </h1>
                            <p className="text-sm font-medium text-slate-500">
                                Control en tiempo real de tu cocina
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Funcionalidad C: Acceso rápido a inventario */}
                            <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50">
                                <Utensils className="h-4 w-4" />
                                <span>Menú</span>
                            </button>

                            <button
                                onClick={() =>
                                    setIsBusinessOpen(!isBusinessOpen)
                                }
                                className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold shadow-sm transition-all ${
                                    isBusinessOpen
                                        ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                                        : 'border border-rose-200 bg-rose-50 text-rose-700'
                                }`}
                            >
                                <Power className="h-4 w-4" />
                                {isBusinessOpen
                                    ? 'NEGOCIO ABIERTO'
                                    : 'NEGOCIO CERRADO'}
                            </button>
                        </div>
                    </div>

                    {/* BARRA DE FILTROS Y BÚSQUEDA */}
                    <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm md:flex-row">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Buscar pedido o cliente..."
                                className="w-full rounded-xl border-none bg-slate-100 py-2 pr-4 pl-10 text-sm focus:ring-2 focus:ring-indigo-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex w-full gap-1 md:w-auto">
                            {['Todos', 'Pendiente', 'Preparando'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-1 rounded-lg px-4 py-1.5 text-xs font-bold uppercase transition-all md:flex-none ${
                                        activeTab === tab
                                            ? 'bg-slate-900 text-white shadow-md'
                                            : 'text-slate-500 hover:bg-slate-50'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* GRID PRINCIPAL */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                        <div className="lg:col-span-3">
                            {pedidosFiltrados.length === 0 ? (
                                <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white p-20 text-center">
                                    <div className="rounded-full bg-slate-50 p-4">
                                        <CheckCircle className="h-8 w-8 text-slate-300" />
                                    </div>
                                    <h3 className="mt-4 font-bold text-slate-900">
                                        No hay pedidos aquí
                                    </h3>
                                    <p className="text-sm text-slate-500">
                                        Todo está al día por el momento.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {pedidosFiltrados.map((pedido) => (
                                        <OrderCard
                                            key={pedido.id}
                                            pedido={pedido}
                                            avanzarEstado={avanzarEstado}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* LADO DERECHO: MÉTRICAS E HISTORIAL */}
                        <div className="space-y-4">
                            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                <h3 className="mb-4 text-xs font-black tracking-widest text-slate-400 uppercase">
                                    Resumen de Hoy
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-600">
                                            Total Ventas
                                        </span>
                                        <span className="text-lg font-black text-slate-900">
                                            $1,850.00
                                        </span>
                                    </div>
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                                        <div className="h-full w-2/3 bg-indigo-500"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}

// Subcomponente para Limpieza de Código
function OrderCard({
    pedido,
    avanzarEstado,
}: {
    pedido: any;
    avanzarEstado: (id: string) => void;
}) {
    // Mejora UI: Alerta visual si el pedido lleva más de 10 min
    const isLate = pedido.tiempo > 10 && pedido.status === 'Pendiente';

    return (
        <div
            className={`group flex flex-col rounded-2xl border bg-white transition-all hover:shadow-lg ${isLate ? 'border-rose-200 ring-2 ring-rose-50' : 'border-slate-200'}`}
        >
            <div className="p-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            className={`rounded-lg p-2 ${pedido.status === 'Pendiente' ? 'bg-orange-100' : 'bg-blue-100'}`}
                        >
                            {pedido.tipo === 'Delivery' ? (
                                <Bike className="h-4 w-4 text-orange-600" />
                            ) : (
                                <Clock className="h-4 w-4 text-blue-600" />
                            )}
                        </div>
                        <div>
                            <span className="block text-[10px] font-black text-slate-400">
                                {pedido.id}
                            </span>
                            <h3 className="font-bold text-slate-900">
                                {pedido.cliente}
                            </h3>
                        </div>
                    </div>
                    <span
                        className={`rounded-full px-3 py-1 text-[10px] font-black uppercase ${
                            pedido.status === 'Pendiente'
                                ? 'bg-orange-50 text-orange-600'
                                : 'bg-blue-50 text-blue-600'
                        }`}
                    >
                        {pedido.status}
                    </span>
                </div>

                <div className="mt-4 rounded-xl bg-slate-50 p-3">
                    <p className="mb-1 text-xs font-bold tracking-tighter text-slate-500 uppercase">
                        Items
                    </p>
                    <p className="text-sm font-medium text-slate-700">
                        {pedido.items}
                    </p>
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                        <Clock
                            className={`h-3.5 w-3.5 ${isLate ? 'text-rose-500' : ''}`}
                        />
                        <span className={isLate ? 'text-rose-600' : ''}>
                            {pedido.tiempo} min
                        </span>
                    </div>
                    <span className="text-lg font-black text-slate-900">
                        ${pedido.total}
                    </span>
                </div>
            </div>

            <div className="mt-auto flex gap-2 border-t border-slate-100 p-2">
                <button
                    onClick={() => avanzarEstado(pedido.id)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-700 py-2.5 text-xs font-bold text-white transition-all hover:bg-red-800 active:scale-95"
                >
                    <Check className="h-3.5 w-3.5" />
                    {pedido.status === 'Pendiente' ? 'Recahzar' : 'Cancelar'}
                </button>

                <button
                    onClick={() => avanzarEstado(pedido.id)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-700 py-2.5 text-xs font-bold text-white transition-all hover:bg-green-800 active:scale-95"
                >
                    <Check className="h-3.5 w-3.5" />
                    {pedido.status === 'Pendiente' ? 'Aceptar' : 'Listo'}
                </button>
                {/* <button className="rounded-xl bg-slate-100 px-3 text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-500">
                    <X className="h-4 w-4" />
                </button> */}
            </div>
        </div>
    );
}
