import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MainLayout from '@/layouts/main-layout';
import { Business, SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Clock,
    CreditCard,
    Heart,
    Info,
    MapPinned,
    MessageCircle,
    PhoneCall,
    Share2,
    Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { InfoBusinessTab } from './info-tab';
import { ProductsBussinessTab } from './products-tab';

interface Props {
    business: Business;
    favorite: boolean;
}

export default function BusinessDetail({ business, favorite }: Props) {
    const [stateFavorite, setStateFavorite] = useState(favorite);

    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    const LEGENDS = {
        payments: business.payments.map((p) => p.name).join(' | '),
        schedul: 'Abierto • Cierra 8pm',
    };

    const copyUlrDetailBusiness = () => {
        navigator.clipboard
            .writeText(`${window.location.origin}/detail/${business.id}`)
            .then(() => toast.success('Enlace copiado al portapapeles'))
            .catch(() => toast.error('Error al copiar'));
    };

    const toggleFavorite = () => {
        if (!user) return toast.info('Inicia sesión para guardar favoritos');
        const next = !stateFavorite;
        setStateFavorite(next);
        router.post(
            '/business/detail/set-favorite',
            {
                id_user: user.id,
                id_business: business.id,
                favorite: next,
            },
            { onError: () => setStateFavorite(!next) },
        );
    };

    const santizePhoneNumber = (phone: string | null): string => {
        if (!phone) return '';
        return '52' + phone.trim();
    };

    return (
        <MainLayout>
            <div className="min-h-screen bg-white">
                <div className="mx-auto max-w-7xl px-3 py-4 sm:px-4">
                    {/* Configuración de Grilla Responsiva Principal */}
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                        {/* Panel de Información Lateral */}
                        <div className="lg:col-span-4 xl:col-span-4">
                            <div className="space-y-4 lg:sticky lg:top-20">
                                {/* Contenedor de Imagen con Box Model y Sombra */}
                                <div className="relative h-48 w-full overflow-hidden rounded-lg border border-purple-200 shadow-sm sm:h-64 lg:aspect-[4/3] lg:h-auto">
                                    <img
                                        src={
                                            business.cover_image
                                                ? `/storage/${business.cover_image}`
                                                : `/images/${business.category?.image}`
                                        }
                                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                                        alt={business.name}
                                    />

                                    {/* Botones Flotantes con Efectos Dinámicos */}
                                    <div className="absolute inset-x-3 top-3 flex justify-between">
                                        <Link
                                            href="/"
                                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/90 text-gray-700 shadow-sm backdrop-blur-sm transition-all active:scale-95"
                                        >
                                            <ArrowLeft className="h-5 w-5" />
                                        </Link>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={copyUlrDetailBusiness}
                                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/90 text-gray-700 shadow-sm backdrop-blur-sm transition-all active:scale-95"
                                            >
                                                <Share2 className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={toggleFavorite}
                                                className={`flex h-9 w-9 items-center justify-center rounded-lg shadow-sm backdrop-blur-sm transition-all active:scale-95 ${
                                                    stateFavorite
                                                        ? 'bg-purple-600 text-white'
                                                        : 'bg-white/90 text-gray-700'
                                                }`}
                                            >
                                                <Heart
                                                    className={`h-4 w-4 ${stateFavorite ? 'fill-current' : ''}`}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Textos y Labels usando Paleta Púrpura y Escalas */}
                                <div className="space-y-2 p-1">
                                    <div className="mb-3 flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <span className="rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-purple-700 uppercase">
                                                {business.category?.name}
                                            </span>
                                        </div>
                                        <h1 className="text-xl font-semibold tracking-tight text-purple-800 sm:text-2xl">
                                            {business.name}
                                        </h1>
                                    </div>

                                    {/* Bloques de Información (Amber para Horario, Púrpura para Pagos) */}
                                    <div className="grid grid-cols-1 gap-3">
                                        <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
                                            <div className="text-amber-600">
                                                <Clock className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] leading-tight font-semibold text-amber-700 uppercase">
                                                    Horario
                                                </p>
                                                <p className="text-sm font-normal text-amber-700">
                                                    {LEGENDS.schedul}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 rounded-lg border border-purple-200 bg-purple-50 p-3">
                                            <div className="text-purple-700">
                                                <CreditCard className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] leading-tight font-semibold text-purple-800 uppercase">
                                                    Métodos de Pago
                                                </p>
                                                <p className="text-sm font-normal text-purple-800">
                                                    {LEGENDS.payments}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Botones de Acción Primarios */}
                                    <div className="grid grid-cols-2 gap-2 pt-2">
                                        <a
                                            href={
                                                business.use_whatsapp
                                                    ? `https://wa.me/${santizePhoneNumber(business.phone)}`
                                                    : `tel:${business.phone}`
                                            }
                                            className="flex items-center justify-center gap-2 rounded-lg bg-purple-600 p-3 text-sm font-semibold text-white shadow-sm transition-transform active:scale-95"
                                        >
                                            {business.use_whatsapp ? (
                                                <MessageCircle className="h-4 w-4" />
                                            ) : (
                                                <PhoneCall className="h-4 w-4" />
                                            )}
                                            WhatsApp
                                        </a>
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address)}`}
                                            className="flex items-center justify-center gap-2 rounded-lg bg-gray-700 p-3 text-sm font-semibold text-white shadow-sm transition-transform active:scale-95"
                                        >
                                            <MapPinned className="h-4 w-4" />
                                            Mapa
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Panel de Contenido Principal (Tabs) */}
                        <div className="lg:col-span-8 xl:col-span-8">
                            <Tabs defaultValue="products" className="w-full">
                                <TabsList className="sticky top-14 z-40 mb-4 inline-flex w-full items-center justify-start gap-2 rounded-lg border border-purple-100 bg-purple-50 p-1.5 sm:w-auto">
                                    <TabsTrigger
                                        value="products"
                                        className="flex items-center gap-2 rounded-lg px-6 py-2 text-sm font-semibold transition-all data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=inactive]:text-purple-700 data-[state=inactive]:hover:bg-purple-100"
                                    >
                                        <Sparkles className="h-4 w-4" />
                                        Menú
                                    </TabsTrigger>

                                    <TabsTrigger
                                        value="main"
                                        className="flex items-center gap-2 rounded-lg px-6 py-2 text-sm font-semibold transition-all data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=inactive]:text-purple-700 data-[state=inactive]:hover:bg-purple-100"
                                    >
                                        <Info className="h-4 w-4" />
                                        Información
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent
                                    value="products"
                                    className="duration-300 animate-in outline-none fade-in zoom-in-95"
                                >
                                    <ProductsBussinessTab business={business} />
                                </TabsContent>

                                <TabsContent
                                    value="main"
                                    className="duration-300 animate-in outline-none fade-in zoom-in-95"
                                >
                                    <InfoBusinessTab business={business} />
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
