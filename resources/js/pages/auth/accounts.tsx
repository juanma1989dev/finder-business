import MainLayout from '@/layouts/main-layout';
import { AccountTypeMap, SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';

interface CardUserProps {
    title: string;
    imageSrc: string;
    type: string;
}

const CardUser = ({ title, imageSrc, type }: CardUserProps) => (
    <Link
        href={`/login?type=${type}`}
        onClick={() => localStorage.setItem('lastAccountType', type)} // Guarda tipo de cuenta
        className="group flex flex-col items-center rounded-lg border border-purple-200 bg-purple-50 p-3 shadow-sm transition-all hover:border-purple-300 hover:bg-white active:scale-95"
    >
        <h2 className="mb-3 text-center text-sm font-semibold text-purple-800 uppercase transition-colors">
            {title}
        </h2>
        <div className="mb-3 overflow-hidden rounded-lg bg-white">
            <img
                src={imageSrc}
                alt={title}
                className="h-48 w-48 object-cover transition-transform duration-500 group-hover:scale-105"
            />
        </div>
        <span className="text-[10px] font-semibold tracking-wider text-purple-600 uppercase">
            Seleccionar
        </span>
    </Link>
);

interface Props {
    accountTypes: AccountTypeMap;
}

export default function AccountPage({ accountTypes }: Props) {
    const { auth } = usePage<SharedData>().props;
    const { user } = auth;

    // 🔹 Redirección inmediata si hay usuario
    if (user) {
        switch (user.type) {
            case 'client':
                router.visit('/client/dashboard', { replace: true });
                return null;
            case 'business':
                router.visit('/business/dashboard', { replace: true });
                return null;
            case 'delivery':
                router.visit('/delivery', { replace: true });
                return null;
        }
    }

    return (
        <MainLayout>
            <div className="mx-auto max-w-7xl p-3">
                <header className="mb-6 text-center">
                    <h1 className="text-base font-semibold tracking-tight text-gray-700 uppercase">
                        Elige el tipo de cuenta que quieres crear
                    </h1>
                </header>

                {/* 🔹 Grid centrado y responsive */}
                <div className="flex justify-center">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {Object.entries(accountTypes).map(([key, value]) => (
                            <CardUser
                                key={key}
                                title={value.label}
                                imageSrc={value.banner}
                                type={key}
                            />
                        ))}
                    </div>
                </div>

                <footer className="mt-8 w-full text-center text-[10px] leading-tight font-normal tracking-widest text-gray-500 uppercase">
                    &copy; {new Date().getFullYear()} Findy. Todos los derechos
                    reservados.
                </footer>
            </div>
        </MainLayout>
    );
}
