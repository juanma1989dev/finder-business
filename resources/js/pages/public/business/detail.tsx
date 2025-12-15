import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MainLayout from '@/layouts/main-layout';
import { useCartStore } from '@/store/cart.store';
import { Business, SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { TabsContent } from '@radix-ui/react-tabs';
import { ArrowLeftCircle, Heart, Share2, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { InfoBusinessTab } from './info-tab';
import { ProductsBussinessTab } from './products-tab';

interface Props {
    business: Business;
    favorite: boolean;
}

export default ({ business, favorite }: Props) => {
    const [stateFavorite, setStateFavorite] = useState<boolean | undefined>(
        favorite,
    );

    const [isCartOpen, setIsCartOpen] = useState(false);

    const props = usePage<SharedData>().props;
    const { auth } = props;
    const { user } = auth;
    const id_user = user?.id;

    const copyUlrDetailBusiness = (idBusiness: string | undefined) => {
        const texto = `${window.location.origin}/detail/${idBusiness}`;
        navigator.clipboard
            .writeText(texto)
            .then(() => toast.success('Se copió la URL.'))
            .catch(() => toast.error('Error al copiar la URL'));
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

    const { items, increment, decrement } = useCartStore();

    const totalItems = items.reduce((total, item) => total + item.quantity, 0);

    const totalPrice = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    );

    return (
        <MainLayout>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
                {/* Fondo decorativo */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-gradient-to-bl from-purple-100/40 to-pink-100/40 blur-3xl" />
                    <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-gradient-to-tr from-blue-100/30 to-indigo-100/30 blur-3xl" />
                </div>

                <div className="mb-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                    {/* Banner */}
                    <div className="relative h-64 md:h-80">
                        <Link
                            href="/"
                            className="absolute top-4 left-4 flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2 text-white"
                        >
                            <ArrowLeftCircle className="h-5 w-5" />
                        </Link>

                        <img
                            src={
                                business.cover_image
                                    ? `/storage/${business.cover_image}`
                                    : `/images/${business.category?.image}`
                            }
                            alt={business.name}
                            className="h-full w-full object-cover"
                        />

                        <div className="absolute top-4 right-4 flex gap-2">
                            {user && (
                                <button
                                    onClick={toggleFavorite}
                                    className={`rounded-full p-3 shadow-lg ${
                                        stateFavorite
                                            ? 'bg-orange-600 text-white'
                                            : 'bg-white text-gray-700'
                                    }`}
                                >
                                    <Heart
                                        className={`h-5 w-5 ${
                                            stateFavorite ? 'fill-current' : ''
                                        }`}
                                    />
                                </button>
                            )}

                            <button
                                onClick={() =>
                                    copyUlrDetailBusiness(business.id)
                                }
                                className="rounded-full bg-white p-3 text-gray-700 shadow-lg"
                            >
                                <Share2 className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="p-8">
                        <h1 className="mb-3 text-xl font-bold text-gray-700 md:text-3xl">
                            {business.name}{' '}
                            <span className="text-sm text-gray-500">
                                ({business.category?.name})
                            </span>
                        </h1>

                        <Tabs defaultValue="products">
                            <TabsList className="flex gap-3 rounded-xl bg-orange-100/50 p-3">
                                <TabsTrigger value="main">General</TabsTrigger>
                                <TabsTrigger value="products">
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
                </div>

                {/* BOTÓN FLOTANTE */}
                {totalItems > 0 && (
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="fixed right-6 bottom-6 z-50 flex items-center gap-3 rounded-full bg-green-600 px-5 py-4 text-white shadow-xl"
                    >
                        <div className="relative">
                            <ShoppingCart className="h-6 w-6" />
                            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold">
                                {totalItems}
                            </span>
                        </div>
                        <span className="hidden sm:block">Ver carrito</span>
                    </button>
                )}

                {/* DRAWER DEL CARRITO */}
                {isCartOpen && (
                    <>
                        <div
                            onClick={() => setIsCartOpen(false)}
                            className="fixed inset-0 z-40 bg-black/40"
                        />

                        <div className="fixed top-0 right-0 z-50 flex h-full w-full max-w-sm flex-col bg-white shadow-xl">
                            <div className="flex items-center justify-between border-b p-4">
                                <h2 className="text-lg font-semibold">
                                    Tu pedido
                                </h2>
                                <button onClick={() => setIsCartOpen(false)}>
                                    ✕
                                </button>
                            </div>

                            <div className="flex-1 space-y-4 overflow-y-auto p-4">
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between"
                                    >
                                        <div>
                                            <p className="font-semibold">
                                                {item.name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                ${item.price}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() =>
                                                    decrement(item.id)
                                                }
                                                className="h-7 w-7 rounded-full border"
                                            >
                                                −
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button
                                                onClick={() =>
                                                    increment(item.id)
                                                }
                                                className="h-7 w-7 rounded-full bg-green-600 text-white"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t p-4">
                                <button
                                    onClick={() =>
                                        router.visit('/shopping-cart/details')
                                    }
                                    className="w-full rounded-xl bg-green-600 py-3 font-semibold text-white"
                                >
                                    Total: ${totalPrice.toFixed(2)} · Continuar
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </MainLayout>
    );
};
