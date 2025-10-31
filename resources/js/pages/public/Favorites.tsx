import BusinessCard from '@/components/app/BusinessCard';
import MainLayout from '@/layouts/main-layout';
import { Business } from '@/types';
import { Head } from '@inertiajs/react';
import { Search } from 'lucide-react';

interface Props {
    businesses: Business[];
}

export default function Favorites({ businesses }: Props) {
    const loadingNegocios = false;
    const session = true;

    return (
        <MainLayout>
            <Head title="Favoritos"></Head>

            <h1 className="my-3 text-2xl font-bold text-gray-800">
                Mis negocios favoritos
            </h1>
            {/* Grid/Lista de negocios */}
            {loadingNegocios ? (
                <div className="w-full py-16 text-center">
                    Cargando negocios…
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {businesses.map((negocio: any, index: number) => (
                        <BusinessCard business={negocio} />
                    ))}
                </div>
            )}

            {!loadingNegocios && businesses.length === 0 && (
                <div className="py-16 text-center">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-pink-100">
                        <Search className="h-8 w-8 text-purple-400" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-gray-700">
                        No Tienes Negocios Favoritos
                    </h3>
                    <p className="mx-auto max-w-md text-gray-500">
                        Agrega negocios a tus favoritos para encontrarlos
                        fácilmente más tarde.
                    </p>
                </div>
            )}
        </MainLayout>
    );
}
