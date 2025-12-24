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

    // console.log(business.schedules);

    const LEGENDS = {
        payments: business.payments.map((p) => p.name).join(' | '),
        schedul: 'Abierto • Cierra 8pm *******',
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
                <div className="mx-auto max-w-7xl px-2 py-2 sm:px-2 lg:py-3">
                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-12 lg:gap-4">
                        {/* Informacion */}
                        <div className="lg:col-span-4 xl:col-span-4">
                            <div className="space-y-4 sm:space-y-6 lg:sticky lg:top-24">
                                <div className="relative h-48 w-full overflow-hidden rounded-[1.8rem] border border-gray-100 shadow-sm sm:h-64 lg:aspect-[4/3] lg:h-auto">
                                    <img
                                        src={
                                            business.cover_image
                                                ? `/storage/${business.cover_image}`
                                                : `/images/${business.category?.image}`
                                        }
                                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                                        alt={business.name}
                                    />

                                    <div className="absolute inset-x-3 top-3 flex justify-between">
                                        <Link
                                            href="/"
                                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-gray-700 shadow-sm backdrop-blur-sm transition-all active:scale-90"
                                        >
                                            <ArrowLeft className="h-4 w-4" />
                                        </Link>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={copyUlrDetailBusiness}
                                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-gray-700 shadow-sm backdrop-blur-sm transition-all active:scale-90"
                                            >
                                                <Share2 className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={toggleFavorite}
                                                className={`flex h-8 w-8 items-center justify-center rounded-lg shadow-sm backdrop-blur-sm transition-all active:scale-90 ${stateFavorite ? 'bg-orange-500 text-white' : 'bg-white/90 text-gray-700'}`}
                                            >
                                                <Heart
                                                    className={`h-4 w-4 ${stateFavorite ? 'fill-current' : ''}`}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 px-1">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <span className="rounded-md bg-purple-50 px-2 py-0.5 text-[9px] font-black tracking-[0.15em] text-purple-600 uppercase">
                                                {business.category?.name}
                                            </span>
                                        </div>
                                        <h1 className="text-xl font-black tracking-tight text-gray-900 sm:text-2xl">
                                            {business.name}
                                        </h1>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
                                        <div className="flex items-center gap-3 rounded-2xl border border-gray-50 bg-gray-50/50 p-3">
                                            <div className="rounded-xl bg-orange-100 p-2 text-orange-600">
                                                <Clock className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="mb-1 text-[9px] leading-none font-bold text-gray-400 uppercase">
                                                    Horario
                                                </p>
                                                <p className="text-xs font-bold text-gray-700 italic">
                                                    {LEGENDS.schedul}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 rounded-2xl border border-gray-50 bg-gray-50/50 p-3">
                                            <div className="rounded-xl bg-purple-100 p-2 text-purple-600">
                                                <CreditCard className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="mb-1 text-[9px] leading-none font-bold text-gray-400 uppercase">
                                                    Pagos
                                                </p>
                                                <p className="text-xs font-bold text-gray-700 italic">
                                                    {LEGENDS.payments}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <a
                                            href={
                                                business.use_whatsapp
                                                    ? `https://wa.me/${santizePhoneNumber(business.phone)}`
                                                    : `tel:${business.phone}`
                                            }
                                            className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-2 text-xs font-bold text-white shadow-sm transition-transform active:scale-95"
                                        >
                                            {business.use_whatsapp ? (
                                                <MessageCircle className="h-3.5 w-3.5" />
                                            ) : (
                                                <PhoneCall className="h-3.5 w-3.5" />
                                            )}
                                            WhatsApp
                                        </a>
                                        <a
                                            href={`http://maps.google.com/?q=${encodeURIComponent(business.address)}`}
                                            className="flex items-center justify-center gap-2 rounded-xl bg-gray-900 py-2 text-xs font-bold text-white shadow-sm transition-transform active:scale-95"
                                        >
                                            <MapPinned className="h-3.5 w-3.5" />{' '}
                                            Mapa
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/*   PRODUCTOS */}
                        <div className="lg:col-span-8 xl:col-span-8">
                            <Tabs defaultValue="products" className="w-full">
                                {/* Contenedor de la lista con fondo suave y bordes muy redondeados */}
                                <TabsList className="inline-flex w-full items-center justify-start gap-2 rounded-[1.2rem] border-none bg-gray-100/50 p-1.5 sm:w-auto">
                                    <TabsTrigger
                                        value="products"
                                        className="flex items-center gap-2 rounded-[1rem] px-6 py-2 text-xs font-black tracking-wider uppercase transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:bg-gray-200/50"
                                    >
                                        <Sparkles className="h-3.5 w-3.5" />{' '}
                                        Menú
                                    </TabsTrigger>

                                    <TabsTrigger
                                        value="main"
                                        className="flex items-center gap-2 rounded-[1rem] px-6 py-2 text-xs font-black tracking-wider uppercase transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:bg-gray-200/50"
                                    >
                                        <Info className="h-3.5 w-3.5" />
                                        Info
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
