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
    ShoppingCart,
    Trash2,
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

                    <div className="absolute top-4 right-4 flex gap-2">
                        {user && (
                            <button
                                onClick={toggleFavorite}
                                className={`rounded-full p-3 ${
                                    stateFavorite
                                        ? 'bg-orange-600 text-white'
                                        : 'bg-white'
                                }`}
                            >
                                <Heart
                                    className={
                                        stateFavorite ? 'fill-current' : ''
                                    }
                                />
                            </button>
                        )}

                        <button
                            onClick={copyUlrDetailBusiness}
                            className="rounded-full bg-white p-3"
                        >
                            <Share2 />
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <h1 className="item-center mb-4 flex gap-4 text-2xl font-bold">
                        <span>
                            {business.name}
                            <span className="mx-2 text-sm text-gray-500">
                                ({business.category?.name})
                            </span>
                        </span>

                        {/* WhatsApp o Cel */}
                        {business.use_whatsapp ? (
                            <a
                                className="block flex cursor-pointer items-center justify-center rounded-xl bg-green-500 px-2 py-1 font-medium text-white shadow-lg transition-all duration-200 hover:bg-green-600"
                                href={`https://wa.me/${santizePhoneNumber(business.phone)}?text=${encodeURIComponent('Hola me podría dar más información de ...')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <MessageCircle className="mr-2 inline h-4 w-4" />

                                <span className="text-sm">WhatsApp</span>
                            </a>
                        ) : (
                            <a
                                href={`tel:${santizePhoneNumber(business.phone)}`}
                                className="flex items-center justify-center rounded-lg bg-green-600 px-2 py-1 font-medium text-white shadow-lg transition duration-300 ease-in-out hover:bg-green-700"
                            >
                                <PhoneCall className="mr-2 inline h-4 w-4" />
                                <span className="text-sm">¡Llama Ahora!</span>
                            </a>
                        )}
                        {/* Indicaciones */}
                        <a
                            className="block flex cursor-pointer items-center justify-center rounded-xl bg-sky-500 px-2 py-1 font-medium text-white shadow-lg transition-all duration-200 hover:bg-sky-600"
                            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(business.address)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <MapPinned className="mr-2 inline h-4 w-4" />
                            <span className="text-sm">Cómo llegar</span>
                        </a>
                    </h1>

                    <Tabs defaultValue="products">
                        <TabsList className="mb-4">
                            <TabsTrigger
                                value="main"
                                className="cursor-pointer"
                            >
                                General
                            </TabsTrigger>
                            <TabsTrigger
                                value="products"
                                className="cursor-pointer"
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

                {/* BOTÓN CARRITO */}
                {user && totalItems > 0 && (
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="fixed right-6 bottom-6 flex items-center gap-3 rounded-full bg-green-600 px-5 py-4 text-white shadow-xl"
                    >
                        <ShoppingCart />
                        <span>{totalItems}</span>
                    </button>
                )}

                {/* DRAWER */}
                {isCartOpen && (
                    <>
                        <div
                            onClick={() => setIsCartOpen(false)}
                            className="fixed inset-0 bg-black/60"
                        />

                        <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl">
                            <div className="flex justify-between border-b p-4">
                                <h2 className="font-semibold">Tu pedido</h2>
                                <button onClick={() => setIsCartOpen(false)}>
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-4 overflow-y-auto p-4">
                                {items.map((item) => (
                                    <div
                                        key={item.key}
                                        className="flex items-start justify-between rounded-lg border p-3"
                                    >
                                        {/* IZQUIERDA → INFO */}
                                        <div className="flex-1">
                                            <p className="mb-1 font-semibold">
                                                {item.name} {' - '}
                                                {item.variations?.length >
                                                    0 && (
                                                    <span className="text-sm text-gray-500">
                                                        {item.variations
                                                            .map(
                                                                (v: any) =>
                                                                    v.name,
                                                            )
                                                            .join(', ')}
                                                    </span>
                                                )}
                                            </p>

                                            {/* EXTRAS */}
                                            <span className="mt-4 mb-2 text-sm text-gray-700">
                                                Extras
                                            </span>
                                            {item.extras.length > 0 && (
                                                <ul className="text-sm text-gray-500">
                                                    {item.extras.map(
                                                        (e: any) => (
                                                            <li key={e.id}>
                                                                + {e.name} ($
                                                                {e.price})
                                                            </li>
                                                        ),
                                                    )}
                                                </ul>
                                            )}
                                        </div>

                                        {/* DERECHA → ACCIONES */}
                                        <div className="ml-4 flex h-full min-h-[80px] flex-col items-end justify-between">
                                            {/* ELIMINAR ARRIBA */}
                                            <button
                                                onClick={() =>
                                                    removeItem(item.key)
                                                }
                                                className="text-red-500 hover:text-red-600"
                                            >
                                                <Trash2 size={18} />
                                            </button>

                                            {/* CONTADOR ABAJO */}
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() =>
                                                        decrement(item.key)
                                                    }
                                                    className="flex h-7 w-7 items-center justify-center rounded border hover:bg-gray-100"
                                                >
                                                    −
                                                </button>

                                                <span className="w-5 text-center text-sm font-medium">
                                                    {item.quantity}
                                                </span>

                                                <button
                                                    onClick={() =>
                                                        increment(item.key)
                                                    }
                                                    className="flex h-7 w-7 items-center justify-center rounded border hover:bg-gray-100"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {items.length > 0 && (
                                <div className="border-t p-4">
                                    <button
                                        onClick={() =>
                                            router.visit(
                                                '/shopping-cart/details',
                                            )
                                        }
                                        className="w-full rounded-xl bg-green-600 py-3 text-white"
                                    >
                                        Total: ${totalPrice.toFixed(2)}
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </MainLayout>
    );
}
