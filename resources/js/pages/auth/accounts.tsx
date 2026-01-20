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
        className="group flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-md"
    >
        <h2 className="mb-4 text-center text-lg font-bold text-slate-800 transition-colors group-hover:text-orange-600">
            {title}
        </h2>
        <div className="mb-4 overflow-hidden rounded-xl bg-slate-100">
            <img
                src={imageSrc}
                alt={title}
                className="h-48 w-48 object-cover transition-transform duration-500 group-hover:scale-105"
            />
        </div>
    </Link>
);

interface Props {
    accountTypes: AccountTypeMap;
}

export default function AccountPage({ accountTypes }: Props) {
    return (
        <MainLayout>
            <div className="p-4">
                <h1 className="mb-4 text-center text-2xl font-bold text-gray-600">
                    Elige el tipo de cuenta quieres crear
                </h1>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {Object.entries(accountTypes).map(([key, value]) => (
                        <CardUser
                            key={key}
                            title={value.label}
                            imageSrc={value.banner}
                            type={key}
                        />
                    ))}
                </div>

                <footer className="bottom-0 mt-8 w-full text-center text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} Finder. Todos los derechos
                    reservados.
                </footer>
            </div>
        </MainLayout>
    );
}
