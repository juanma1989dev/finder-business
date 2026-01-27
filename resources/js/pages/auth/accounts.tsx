import MainLayout from '@/layouts/main-layout';
import { AccountTypeMap } from '@/types';
import { Link } from '@inertiajs/react';

const CardUser = ({
    title,
    imageSrc,
    type,
}: {
    title: string;
    imageSrc: string;
    type: string;
}) => (
    <Link
        href={`/login?type=${type}`}
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
    return (
        <MainLayout>
            <div className="mx-auto max-w-7xl p-3">
                <header className="mb-4">
                    <h1 className="text-center text-base font-semibold tracking-tight text-gray-700 uppercase">
                        Elige el tipo de cuenta quieres crear
                    </h1>
                </header>

                {/* CONFIGURACIÓN DE GRILLA RESPONSIVA */}
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

                <footer className="mt-8 w-full text-center text-[10px] leading-tight font-normal tracking-widest text-gray-500 uppercase">
                    &copy; {new Date().getFullYear()} Finder. Todos los derechos
                    reservados.
                </footer>
            </div>
        </MainLayout>
    );
}
