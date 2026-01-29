import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Home } from 'lucide-react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    subTitle?: string;
    bannerImage: string;
}

export default function AuthLayout({
    children,
    title,
    subTitle,
    bannerImage,
}: PropsWithChildren<AuthLayoutProps>) {
    const pageData = usePage<SharedData>();
    const { name: nameApp } = pageData.props;

    return (
        <div className="relative mt-10 flex flex-col items-center justify-center space-y-4 p-3">
            <h1 className="mb-4 text-base font-semibold text-gray-700">
                {title}
            </h1>

            <div className="relative z-10 mx-auto flex w-full max-w-5xl overflow-hidden rounded-lg border border-purple-200 bg-white shadow-sm">
                <div className="relative hidden w-1/2 flex-col justify-center border-r border-purple-100 bg-purple-50 p-10 text-purple-800 md:flex">
                    <div className="absolute inset-0 opacity-5" />

                    <div className="relative">
                        <img
                            src={bannerImage}
                            alt="Logo"
                            className="mb-10 h-60 w-full rounded-lg object-cover shadow-sm"
                        />

                        <h2 className="mb-3 text-center text-xl leading-tight font-semibold text-purple-800">
                            Bienvenido
                        </h2>
                    </div>

                    <div className="relative mt-5 flex items-center gap-2 text-[10px] leading-tight text-purple-700"></div>
                </div>

                <div className="flex w-full flex-col justify-center px-6 py-10 md:w-1/2 md:px-10">
                    <div className="mx-auto w-full max-w-sm">
                        <Link
                            href="/"
                            className="mb-8 inline-flex items-center gap-2 text-sm font-normal text-gray-500 transition-colors hover:text-purple-700"
                        >
                            <Home className="h-4 w-4" />
                            Volver al inicio
                        </Link>

                        <div className="mb-8 space-y-2">
                            {subTitle && (
                                <h3 className="text-base font-semibold text-gray-700">
                                    {subTitle}
                                </h3>
                            )}
                        </div>

                        <div className="space-y-2">{children}</div>

                        <p className="mt-10 text-center text-[10px] leading-tight text-gray-500 uppercase">
                            © {new Date().getFullYear()} - {nameApp}. <br />
                            Todos los derechos reservados.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
