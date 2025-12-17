import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MainLayout from '@/layouts/main-layout';
import { useCartStore } from '@/store/cart.store';
import { Business, SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { TabsContent } from '@radix-ui/react-tabs';
import {
    ArrowLeftCircle,
    Heart,
    MapPinned,
    MessageCircle,
    PhoneCall,
    Share2,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { CartFloatButton } from './CartFloatButton';
import { CartDrawer } from './drawer-cart';
import { InfoBusinessTab } from './info-tab';
import { ProductsBussinessTab } from './products-tab';

interface Props {
    business: Business;
    favorite: boolean;
}

export default function BusinessDetail({ business, favorite }: Props) {
    const [stateFavorite, setStateFavorite] = useState(favorite);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    const { items, increment, decrement, removeItem, getTotalPrice } =
        useCartStore();

    const totalItems = items.reduce((t, i) => t + i.quantity, 0);
    const totalPrice = getTotalPrice();

    const copyUlrDetailBusiness = () => {
        navigator.clipboard
            .writeText(`${window.location.origin}/detail/${business.id}`)
            .then(() => toast.success('Se copió la URL'))
            .catch(() => toast.error('Error al copiar'));
    };

    const toggleFavorite = () => {
        if (!user) return;

        const next = !stateFavorite;
        setStateFavorite(next);

        router.post(
            '/business/detail/set-favorite',
            {
                id_user: user.id,
                id_business: business.id,
                favorite: next,
            },
            {
                onError: () => {
                    setStateFavorite(!next);
                    toast.error('Error');
                },
            },
        );
    };

    const santizePhoneNumber = (phone: string | null): string => {
        if (!phone) return '';

        const newPhone = '52' + phone.trim();

        return newPhone;
    };

    return (
        <MainLayout>
            <div className="min-h-screen bg-slate-50">
                <div className="relative h-65">
                    <Link
                        href="/"
                        className="absolute top-4 left-4 rounded-xl bg-orange-600 px-4 py-2 text-white"
                    >
                        <ArrowLeftCircle />
                    </Link>

                    <img
                        src={
                            business.cover_image
                                ? `/storage/${business.cover_image}`
                                : `/images/${business.category?.image}`
                        }
                        className="h-full w-full object-cover"
                    />

                    <div className="absolute top-4 right-4 flex flex-col gap-2 sm:flex-row sm:gap-2">
                        {user && (
                            <button
                                onClick={toggleFavorite}
                                className={`flex h-10 w-10 items-center justify-center rounded-full p-3 transition-all duration-200 ${
                                    stateFavorite
                                        ? 'bg-orange-600 text-white'
                                        : 'bg-white text-gray-600'
                                }`}
                            >
                                <Heart
                                    className={`h-6 w-6 transition-colors duration-200 ${
                                        stateFavorite
                                            ? 'fill-current text-white'
                                            : ''
                                    }`}
                                />
                            </button>
                        )}

                        <button
                            onClick={copyUlrDetailBusiness}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white p-3 shadow-md transition-all duration-200 hover:bg-gray-100"
                        >
                            <Share2 className="h-6 w-6 text-gray-600" />
                        </button>
                    </div>
                </div>

                <div className="p-4 sm:p-6">
                    <h1 className="mb-4 flex flex-col gap-4 text-2xl font-bold sm:flex-row sm:items-center">
                        <span>
                            {business.name}
                            <span className="mx-0 text-sm text-gray-500 sm:mx-2">
                                ({business.category?.name})
                            </span>
                        </span>

                        {/* Botones */}
                        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                            {business.use_whatsapp ? (
                                <a
                                    className="flex flex-1 items-center justify-center rounded-xl bg-green-500 px-3 py-2 font-medium text-white shadow-lg transition-all duration-200 hover:bg-green-600 sm:flex-none"
                                    href={`https://wa.me/${santizePhoneNumber(
                                        business.phone,
                                    )}?text=${encodeURIComponent(
                                        'Hola me podría dar más información de ...',
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <MessageCircle className="mr-2 h-4 w-4" />
                                    <span className="text-sm sm:text-base">
                                        WhatsApp
                                    </span>
                                </a>
                            ) : (
                                <a
                                    href={`tel:${santizePhoneNumber(business.phone)}`}
                                    className="flex flex-1 items-center justify-center rounded-lg bg-green-600 px-3 py-2 font-medium text-white shadow-lg transition duration-300 ease-in-out hover:bg-green-700 sm:flex-none"
                                >
                                    <PhoneCall className="mr-2 h-4 w-4" />
                                    <span className="text-sm sm:text-base">
                                        ¡Llama Ahora!
                                    </span>
                                </a>
                            )}

                            <a
                                className="flex flex-1 items-center justify-center rounded-xl bg-sky-500 px-3 py-2 font-medium text-white shadow-lg transition-all duration-200 hover:bg-sky-600 sm:flex-none"
                                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                                    business.address,
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <MapPinned className="mr-2 h-4 w-4" />
                                <span className="text-sm sm:text-base">
                                    Cómo llegar
                                </span>
                            </a>
                        </div>
                    </h1>

                    <Tabs defaultValue="products">
                        <TabsList className="mb-4 flex flex-row gap-2">
                            <TabsTrigger
                                value="main"
                                className="w-full cursor-pointer py-2 text-center sm:w-auto"
                            >
                                General
                            </TabsTrigger>
                            <TabsTrigger
                                value="products"
                                className="w-full cursor-pointer py-2 text-center sm:w-auto"
                            >
                                Productos
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="main">
                            <InfoBusinessTab business={business} />
                        </TabsContent>

                        <TabsContent value="products">
                            <ProductsBussinessTab business={business} />
                        </TabsContent>
                    </Tabs>
                </div>

                {user && (
                    <>
                        <CartFloatButton
                            totalItems={totalItems}
                            onClick={() => setIsCartOpen(true)}
                        />
                        <CartDrawer
                            isOpen={isCartOpen}
                            onClose={() => setIsCartOpen(false)}
                        />
                    </>
                )}
            </div>
        </MainLayout>
    );
}
