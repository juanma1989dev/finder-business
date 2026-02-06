import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MainLayout from '@/layouts/main-layout';
import { Business, SharedData, TypeUser } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Clock,
    CreditCard,
    DoorClosed,
    DoorOpen,
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

const getStatusLabel = (business: Business) => {
    const LABEL_SHCHEDULE_UNAVAILABLE = 'Horario no disponible';

    if (!business?.schedules || business.schedules.length === 0) {
        return LABEL_SHCHEDULE_UNAVAILABLE;
    }

    const currentDate = new Date();
    const currentDayNum = currentDate.getDay() === 0 ? 7 : currentDate.getDay();

    const currentSchedule = business.schedules.find(
        (schedule) => schedule.day == currentDayNum,
    );

    if (!currentSchedule) return LABEL_SHCHEDULE_UNAVAILABLE;

    return `${currentSchedule.open} hrs - ${currentSchedule.close} hrs`;
};

export default function BusinessDetail({ business, favorite }: Props) {
    const [stateFavorite, setStateFavorite] = useState(favorite);
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    const LEGENDS = {
        payments:
            business.payments.length === 0
                ? 'Sin métodos de pago registrados.'
                : business.payments.map((p) => p.name).join(' | '),
        schedul: getStatusLabel(business),
    };

    // business/la-cafe/1
    const copyUlrDetailBusiness = () => {
        navigator.clipboard
            .writeText(
                `${window.location.origin}/business/${business.slug}/${business.id}`,
            )
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
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                        <div className="lg:col-span-4">
                            <div className="space-y-5 lg:sticky lg:top-20">
                                <div className="relative h-32 w-full overflow-hidden rounded-lg border border-purple-200 shadow-sm sm:h-64 lg:aspect-[4/3] lg:h-auto">
                                    <img
                                        src={
                                            business.cover_image
                                                ? `/storage/${business.cover_image}`
                                                : `/images/${business.category?.image}`
                                        }
                                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                                        alt={business.name}
                                    />

                                    <Link
                                        href="/"
                                        className="absolute top-3 left-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white/90 text-gray-700 shadow-sm backdrop-blur-sm transition-all active:scale-95"
                                    >
                                        <ArrowLeft className="h-5 w-5" />
                                    </Link>

                                    <div className="absolute top-3 right-3 hidden gap-2 sm:flex">
                                        <button
                                            onClick={copyUlrDetailBusiness}
                                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/90 text-gray-700 shadow-sm backdrop-blur-sm transition-all active:scale-95"
                                        >
                                            <Share2 className="h-4 w-4" />
                                        </button>

                                        {user?.type === TypeUser.CLIENT && (
                                            <button
                                                onClick={toggleFavorite}
                                                className={`flex h-9 w-9 items-center justify-center rounded-lg shadow-sm backdrop-blur-sm transition-all active:scale-95 ${
                                                    stateFavorite
                                                        ? 'bg-purple-600 text-white'
                                                        : 'bg-white/90 text-gray-700'
                                                }`}
                                            >
                                                <Heart
                                                    className={`h-4 w-4 ${
                                                        stateFavorite
                                                            ? 'fill-current'
                                                            : ''
                                                    }`}
                                                />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-3 px-1 sm:hidden">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="space-y-1">
                                            <span className="inline-block rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-purple-700 uppercase">
                                                {business.category?.name}
                                            </span>
                                            <h1 className="text-xl font-semibold tracking-tight text-purple-800">
                                                {business.name}
                                            </h1>
                                        </div>

                                        <div className="flex gap-2 pt-1">
                                            <button
                                                onClick={copyUlrDetailBusiness}
                                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-gray-700 shadow-sm transition-all active:scale-95"
                                            >
                                                <Share2 className="h-4 w-4" />
                                            </button>

                                            {user?.type === TypeUser.CLIENT && (
                                                <button
                                                    onClick={toggleFavorite}
                                                    className={`flex h-9 w-9 items-center justify-center rounded-lg shadow-sm transition-all active:scale-95 ${
                                                        stateFavorite
                                                            ? 'bg-purple-600 text-white'
                                                            : 'bg-white text-gray-700'
                                                    }`}
                                                >
                                                    <Heart
                                                        className={`h-4 w-4 ${
                                                            stateFavorite
                                                                ? 'fill-current'
                                                                : ''
                                                        }`}
                                                    />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="hidden space-y-1 px-1 sm:block">
                                    <span className="inline-block rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-purple-700 uppercase">
                                        {business.category?.name}
                                    </span>
                                    <h1 className="text-2xl font-semibold tracking-tight text-purple-800">
                                        {business.name}
                                    </h1>
                                </div>

                                <div className="space-y-3 px-1">
                                    <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
                                        <Clock className="h-5 w-5 text-amber-600" />
                                        <div>
                                            <p className="text-xs font-semibold text-amber-700 uppercase">
                                                Horario de referencia
                                            </p>
                                            <p className="text-xs text-amber-700">
                                                {LEGENDS.schedul}
                                            </p>
                                            <p className="mt-2 flex items-center gap-2 text-xs text-amber-700">
                                                Actualmente:
                                                {business.is_open ? (
                                                    <>
                                                        <DoorOpen className="h-4 w-4" />
                                                        Abierto
                                                    </>
                                                ) : (
                                                    <>
                                                        <DoorClosed className="h-4 w-4" />
                                                        Cerrado
                                                    </>
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 rounded-lg border border-purple-200 bg-purple-50 p-3">
                                        <CreditCard className="h-5 w-5 text-purple-700" />
                                        <div>
                                            <p className="text-[10px] font-semibold text-purple-800 uppercase">
                                                Métodos de Pago
                                            </p>
                                            <p className="text-sm text-purple-800">
                                                {LEGENDS.payments}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 pt-1">
                                        <a
                                            href={
                                                business.use_whatsapp
                                                    ? `https://wa.me/${santizePhoneNumber(
                                                          business.phone,
                                                      )}`
                                                    : `tel:${business.phone}`
                                            }
                                            className="flex items-center justify-center gap-2 rounded-lg bg-purple-600 p-1 text-sm font-semibold text-white shadow-sm transition-transform active:scale-95"
                                        >
                                            {business.use_whatsapp ? (
                                                <MessageCircle className="h-4 w-4" />
                                            ) : (
                                                <PhoneCall className="h-4 w-4" />
                                            )}
                                            WhatsApp
                                        </a>

                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                                business.address,
                                            )}`}
                                            className="flex items-center justify-center gap-2 rounded-lg bg-gray-700 p-1 text-sm font-semibold text-white shadow-sm transition-transform active:scale-95"
                                        >
                                            <MapPinned className="h-4 w-4" />
                                            Mapa
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-8">
                            <Tabs defaultValue="products" className="w-full">
                                <TabsList className="sticky top-12 z-40 mb-4 inline-flex w-full gap-2 rounded-lg border border-purple-100 bg-purple-50 p-1.5 sm:w-auto">
                                    <TabsTrigger
                                        value="products"
                                        className="gap-2 px-4 py-3"
                                    >
                                        <Sparkles className="h-4 w-4" />
                                        Menú
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="main"
                                        className="gap-2 px-4 py-3"
                                    >
                                        <Info className="h-4 w-4" />
                                        Información
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="products">
                                    <ProductsBussinessTab business={business} />
                                </TabsContent>

                                <TabsContent value="main">
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
