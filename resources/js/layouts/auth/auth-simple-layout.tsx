import { Link, usePage } from '@inertiajs/react';
import { Home, ShieldCheck } from 'lucide-react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    const p = usePage();

    console.log(p);

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-100">
            {/* Background decoration */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.04),transparent_60%)]" />

            <div className="relative z-10 mx-auto flex w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-xl">
                {/* Left column */}
                <div className="relative hidden w-1/2 flex-col justify-between justify-center bg-gradient-to-br from-orange-600 to-orange-500 p-10 text-white md:flex">
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10" />

                    <div className="relative">
                        <img
                            src="/logo.webp"
                            alt="Logo"
                            className="mb-10 h-60 w-full object-cover"
                        />

                        <h2 className="mb-3 text-2xl leading-tight font-semibold">
                            Bienvenido a nuestra plataforma
                        </h2>
                        <p className="max-w-sm text-sm text-orange-100">
                            Gestiona tus pedidos, negocios y servicios de forma
                            segura y sencilla desde un solo lugar.
                        </p>
                    </div>

                    <div className="relative mt-5 flex items-center gap-2 text-xs text-orange-100">
                        <ShieldCheck className="h-4 w-4" />
                        {/* Tus datos están protegidos conforme a la ley */}
                    </div>
                </div>

                {/* Right column */}
                <div className="flex w-full flex-col justify-center px-6 py-10 sm:px-10 md:w-1/2">
                    <div className="mx-auto w-full max-w-sm">
                        <Link
                            href="/"
                            className="mb-8 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black"
                        >
                            <Home className="h-4 w-4" />
                            Volver al inicio
                        </Link>

                        <div className="mb-8 space-y-2">
                            <h1 className="text-2xl font-semibold text-gray-900">
                                {title}
                            </h1>
                            {description && (
                                <p className="text-gray-500">{description}</p>
                            )}
                        </div>

                        {children}

                        <p className="mt-10 text-center text-xs text-gray-400">
                            © {new Date().getFullYear()} Tu {}. Todos los
                            derechos reservados.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
