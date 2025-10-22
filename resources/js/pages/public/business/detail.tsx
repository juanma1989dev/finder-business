import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MainLayout from '@/layouts/main-layout';
import { formatTime, IconDynamic } from '@/lib/utils';
import { Business, SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import {
    ArrowLeftCircle,
    Globe,
    Heart,
    MapPinned,
    MessageCircle,
    PhoneCall,
    Share2,
    Star,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';

interface Props {
    business: Business;
    favorite: boolean;
}

export default ({ business, favorite }: Props) => {
    const [stateFavorite, setStateFavorite] = useState<boolean | undefined>(
        favorite,
    );

    const props = usePage<SharedData>().props;
    const { auth } = props;
    const { user } = auth;
    const id_user = user?.id;

    const copyUlrDetailBusiness = (idBusiness: string | undefined) => {
        const texto = `${window.location.origin}/detail/${idBusiness}`;
        navigator.clipboard
            .writeText(texto)
            .then(() => {
                toast.success('Se copió la URL.');
            })
            .catch((err) => {
                toast.error('Error al copiar la URL');
            });
    };

    const santizePhoneNumber = (phone: string | null): string => {
        if (!phone) return '';

        const newPhone = '52' + phone.trim();

        return newPhone;
    };

    const toggleFavorite = () => {
        if (!user || !id_user) return;

        const newVal = !stateFavorite;
        setStateFavorite(newVal);

        router.post(
            '/business/detail/set-favorite',
            {
                id_user,
                id_business: String(business.id),
                favorite: newVal,
            },
            {
                onError: () => {
                    setStateFavorite(!newVal);
                    toast.error('Error al asignar el valor.');
                },
            },
        );
    };

    console.log(business);

    return (
        <MainLayout>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
                {/* <Toaster position="bottom-center" reverseOrder={false} /> */}
                {/* Elementos sutiles de fondo */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-gradient-to-bl from-purple-100/40 to-pink-100/40 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-gradient-to-tr from-blue-100/30 to-indigo-100/30 blur-3xl"></div>
                </div>

                <div className="mb-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                    {/* Banner Section */}
                    <div className="relative h-64 md:h-80">
                        <Link
                            className="absolute top-4 left-4 flex cursor-pointer items-center space-x-2 rounded-xl bg-orange-600 px-4 py-2 text-white"
                            href="/"
                            title="Volver al directorio"
                        >
                            <ArrowLeftCircle className="h-5 w-5" />
                        </Link>
                        {/* Imagen principal placeholder */}
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-700 to-orange-400">
                            <img
                                src={
                                    business.cover_image
                                        ? `/storage/${business.cover_image}`
                                        : `/images/${business.category.image}`
                                }
                                alt={business.name}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        </div>
                        <div className="absolute top-4 right-4 flex space-x-2">
                            {user && (
                                <button
                                    onClick={toggleFavorite}
                                    className={`cursor-pointer rounded-full p-3 shadow-lg transition-all duration-200 ${
                                        stateFavorite
                                            ? 'bg-orange-600 text-white'
                                            : 'bg-white/90 text-gray-700 hover:bg-white'
                                    }`}
                                >
                                    <Heart
                                        className={`h-5 w-5 ${stateFavorite ? 'fill-current' : ''}`}
                                    />
                                </button>
                            )}
                            <button
                                className="cursor-pointer rounded-full bg-white/90 p-3 text-gray-700 shadow-lg transition-all duration-200 hover:bg-white"
                                onClick={() =>
                                    copyUlrDetailBusiness(business.id)
                                }
                            >
                                <Share2 className="h-5 w-5" />
                            </button>
                        </div>
                        {/* <div className="absolute bottom-4 left-4">
                                <span className="rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-lg"></span>
                            </div> */}
                    </div>

                    {/* Información básica */}
                    <div className="p-8">
                        <h1 className="my-2 mb-3 flex items-center gap-2 text-xl font-bold text-gray-700 md:text-3xl">
                            {business.name}{' '}
                            <span className="text-sm text-gray-500">
                                ({business?.category.name})
                            </span>
                        </h1>

                        <Tabs defaultValue="main">
                            <TabsList className="flex gap-3 rounded-xl bg-orange-100/50 p-3">
                                <TabsTrigger
                                    className="cursor-pointer rounded-lg p-3 font-medium text-orange-700 transition-all duration-200 data-[state=active]:bg-orange-600 data-[state=active]:text-white"
                                    value="main"
                                >
                                    General
                                </TabsTrigger>
                                <TabsTrigger
                                    className="cursor-pointer rounded-lg p-3 font-medium text-orange-700 transition-all duration-200 data-[state=active]:bg-orange-600 data-[state=active]:text-white"
                                    value="products"
                                >
                                    Productos
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="main">
                                <div className="flex flex-col gap-3 md:flex-row">
                                    <div className="w-full md:w-4/6">
                                        <div className="my-3 flex flex-col items-center justify-center space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
                                            <div>
                                                <a
                                                    className="block flex w-full cursor-pointer items-center justify-center rounded-xl bg-sky-500 px-2 py-1 font-medium text-white shadow-lg transition-all duration-200 hover:bg-sky-600"
                                                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(business.address)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <MapPinned className="mr-2 inline h-4 w-4" />
                                                    <span className="text-sm">
                                                        Cómo llegar
                                                    </span>
                                                </a>
                                            </div>

                                            <div>
                                                {business.use_whatsapp ? (
                                                    <a
                                                        className="block flex w-full cursor-pointer items-center justify-center rounded-xl bg-green-500 px-2 py-1 font-medium text-white shadow-lg transition-all duration-200 hover:bg-green-600"
                                                        href={`https://wa.me/${santizePhoneNumber(business.phone)}?text=${encodeURIComponent('Hola me podría dar más información de ...')}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <MessageCircle className="mr-2 inline h-4 w-4" />

                                                        <span className="text-sm">
                                                            WhatsApp
                                                        </span>
                                                    </a>
                                                ) : (
                                                    // Solo mostrar el número sin acción de WhatsApp
                                                    <a
                                                        href={`tel:${santizePhoneNumber(business.phone)}`}
                                                        className="flex w-full items-center justify-center rounded-lg bg-green-600 px-2 py-1 font-medium text-white shadow-lg transition duration-300 ease-in-out hover:bg-green-700"
                                                    >
                                                        <PhoneCall className="mr-2 inline h-4 w-4" />
                                                        <span className="text-sm">
                                                            ¡Llama Ahora!
                                                        </span>
                                                    </a>
                                                )}
                                            </div>
                                        </div>

                                        {/* Descripcion */}
                                        <p className="max-w-2xl leading-relaxed text-gray-600">
                                            {business.long_description}
                                        </p>

                                        {/* Tags */}
                                        <div className="my-4 flex w-full justify-center gap-3">
                                            {business?.tags?.length > 0 &&
                                                business.tags.map(
                                                    (tag: string) => (
                                                        <Badge
                                                            className="flex items-center justify-center bg-slate-300/60 p-1 font-semibold text-orange-600 capitalize"
                                                            key={tag}
                                                        >
                                                            <Star className="font-semibold text-orange-600" />
                                                            {tag}
                                                        </Badge>
                                                    ),
                                                )}
                                        </div>

                                        {/* Imagenes */}
                                        {business.images &&
                                            business.images.length > 0 && (
                                                <div className="mt-2 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-3">
                                                    {business.images.map(
                                                        (
                                                            img,
                                                            index: number,
                                                        ) => (
                                                            <div
                                                                key={index}
                                                                className="h-32 w-full overflow-hidden rounded-lg border"
                                                            >
                                                                <img
                                                                    src={`/storage/${img.url}`}
                                                                    alt={`Imagen ${index + 1}`}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                    </div>

                                    <div className="w-full gap-2 space-y-2 md:w-2/6">
                                        <div className="rounded-xl bg-gray-50 p-3">
                                            <h3 className="mt-2 mb-2 text-center font-semibold text-gray-800">
                                                Horarios
                                            </h3>
                                            {business?.schedules &&
                                            business?.schedules.length > 0 ? (
                                                <div className="space-y-2">
                                                    {business?.schedules.map(
                                                        (day: any) => {
                                                            const open =
                                                                formatTime(
                                                                    day?.open,
                                                                );

                                                            const close =
                                                                formatTime(
                                                                    day?.close,
                                                                );

                                                            const horarioStr =
                                                                day?.isOpen
                                                                    ? `${open} - ${close}`
                                                                    : 'Cerrado';

                                                            return (
                                                                <div
                                                                    key={
                                                                        day?.label
                                                                    }
                                                                    className="flex items-center justify-between border-b border-gray-200 py-1 text-sm last:border-b-0"
                                                                >
                                                                    <span className="font-medium text-gray-700 capitalize">
                                                                        {
                                                                            day?.label
                                                                        }
                                                                    </span>
                                                                    <div className="flex items-center">
                                                                        <span className="text-gray-600">
                                                                            {
                                                                                horarioStr
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            );
                                                        },
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-center text-gray-600">
                                                    No disponibles.
                                                </p>
                                            )}
                                        </div>

                                        {/* Amenidades */}
                                        {business?.amenities &&
                                            business?.amenities.length > 0 && (
                                                <div className="rounded-xl bg-gray-50 p-3">
                                                    <h3 className="mt-2 mb-2 text-center font-semibold text-gray-800">
                                                        Amenidades
                                                    </h3>
                                                    <div className="space-y-2">
                                                        {business?.amenities.map(
                                                            (service: any) => (
                                                                <div
                                                                    key={
                                                                        service.id
                                                                    }
                                                                    className="flex items-center space-x-2"
                                                                >
                                                                    <IconDynamic
                                                                        iconName={
                                                                            service.icon
                                                                        }
                                                                        className="h-4 w-4 text-orange-600"
                                                                    />
                                                                    <span className="text-sm font-medium text-gray-700">
                                                                        {
                                                                            service.name
                                                                        }
                                                                    </span>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                        {/* Metodos de pago */}
                                        {business?.payments &&
                                            business?.payments.length > 0 && (
                                                <div className="rounded-xl bg-gray-50 p-3">
                                                    <h3 className="mt-2 mb-2 text-center font-semibold text-gray-800">
                                                        Metodos de pago
                                                    </h3>
                                                    <div className="space-y-2">
                                                        {business?.payments.map(
                                                            (payment: any) => (
                                                                <div
                                                                    key={
                                                                        payment.id
                                                                    }
                                                                    className="flex items-center space-x-2"
                                                                >
                                                                    <IconDynamic
                                                                        iconName={
                                                                            payment.icon
                                                                        }
                                                                        className="h-4 w-4 text-orange-600"
                                                                    />
                                                                    <span className="text-sm font-medium text-gray-700">
                                                                        {
                                                                            payment.name
                                                                        }
                                                                    </span>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                        {Object.entries(
                                            business?.social_networks ?? {},
                                        ).length > 0 && (
                                            <div className="rounded-xl bg-gray-50 p-3">
                                                <h3 className="mt-2 mb-3 text-center font-semibold text-gray-800">
                                                    Síguenos en
                                                </h3>
                                                <div className="flex flex-wrap items-center justify-center gap-2">
                                                    {Object.entries(
                                                        business.social_networks,
                                                    ).map(([key, url]) => {
                                                        return (
                                                            <a
                                                                key={key}
                                                                href={url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex cursor-pointer items-center gap-2 rounded-md bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-orange-100 hover:text-orange-600"
                                                            >
                                                                <Globe className="h-4 w-4" />
                                                                <span className="capitalize">
                                                                    {key}
                                                                </span>
                                                            </a>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="products">
                                <div className="container mx-auto px-1 py-2">
                                    <section className="mb-8">
                                        {business.products &&
                                        business.products.length > 0 ? (
                                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                                                {business.products.map(
                                                    (product: any) => (
                                                        <div
                                                            key={product.id}
                                                            className="flex h-full flex-col items-start justify-between rounded-lg bg-white p-4 shadow-sm transition-shadow hover:shadow-md md:flex-row"
                                                        >
                                                            {/* Imagen del producto */}
                                                            <div className="relative order-1 mb-3 h-26 w-full overflow-hidden rounded-lg bg-gray-100 md:order-2 md:mb-0 md:ml-3 md:h-24 md:w-24">
                                                                <img
                                                                    src={
                                                                        product.image_url
                                                                    }
                                                                    alt={
                                                                        product.name
                                                                    }
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            </div>

                                                            {/* Texto del producto */}
                                                            <div className="order-2 flex-1 md:order-1">
                                                                <h3 className="text-lg font-semibold text-gray-800">
                                                                    {
                                                                        product.name
                                                                    }
                                                                </h3>
                                                                <p className="mt-1 line-clamp-3 text-sm text-gray-600">
                                                                    {
                                                                        product.description
                                                                    }
                                                                </p>
                                                                <div className="mt-2 flex items-center">
                                                                    <span className="font-bold text-green-600">
                                                                        $
                                                                        {
                                                                            product.price
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center rounded-lg bg-gray-50/80 p-6 text-gray-600">
                                                No hay productos disponibles por
                                                el momento.
                                            </div>
                                        )}
                                    </section>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};
