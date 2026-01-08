import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Home } from 'lucide-react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    subTitle?: string;
    description?: string;
    bannerImage: string;
}

export default function AuthLayout({
    children,
    title,
    subTitle,
    description,
    bannerImage,
}: PropsWithChildren<AuthLayoutProps>) {
    const pageData = usePage<SharedData>();
    const { name: nameApp } = pageData.props;

    return (
        <div className="relative mt-10 flex flex-col items-center justify-center space-y-10 p-5">
            <h1 className="text-2xl font-semibold text-gray-700">{title}</h1>
            <div className="relative z-10 mx-auto flex w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl">
                <div className="relative hidden w-1/2 flex-col justify-between justify-center bg-gradient-to-br from-orange-600 to-orange-500 p-10 text-white md:flex">
                    <div className="absolute inset-0 opacity-10" />

                    <div className="relative">
                        <img
                            src={bannerImage}
                            alt="Logo"
                            className="mb-10 h-60 w-full object-cover"
                        />

                        <h2 className="mb-3 text-2xl leading-tight font-semibold">
                            Bienvenido
                        </h2>
                        <p className="max-w-sm text-sm text-orange-100">
                            {description}
                        </p>
                    </div>

                    <div className="relative mt-5 flex items-center gap-2 text-xs text-orange-100">
                        {/* <ShieldCheck className="h-4 w-4" /> */}
                        {/* Tus datos están protegidos conforme a la ley */}
                    </div>
                </div>

                <div className="flex w-full flex-col justify-center px-6 py-10 md:w-1/2 md:px-10">
                    <div className="mx-auto w-full max-w-sm">
                        <Link
                            href="/"
                            className="mb-8 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black"
                        >
                            <Home className="h-4 w-4" />
                            Volver al inicio
                        </Link>

                        <div className="mb-8 space-y-2">
                            {subTitle && (
                                <h3 className="text-xl font-semibold text-gray-500">
                                    {subTitle}
                                </h3>
                            )}
                        </div>

                        {children}

                        <p className="mt-10 text-center text-xs text-gray-400">
                            © {new Date().getFullYear()} - {nameApp}. Todos los
                            derechos reservados.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
