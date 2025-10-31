import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="flex w-full max-w-[80%] overflow-hidden rounded-lg shadow-lg">
                {/* Columna izquierda - imagen, solo visible en md+ */}
                <div className="hidden w-1/2 items-center justify-center bg-gray-100 md:flex">
                    <img
                        src="/logo.webp"
                        className="h-auto max-w-full"
                        alt="Logo"
                    />
                </div>

                {/* Columna derecha - login */}
                <div className="flex w-full flex-col items-center justify-center bg-white p-6 md:w-1/2 md:p-10">
                    <div className="w-full max-w-sm">
                        <div className="flex flex-col gap-8">
                            <div className="flex flex-col items-center gap-4">
                                <Link
                                    href="/"
                                    className="flex flex-col items-center gap-2 font-medium"
                                >
                                    <span className="sr-only">{title}</span>
                                </Link>

                                <div className="space-y-2 text-center">
                                    <h1 className="text-xl font-medium">
                                        {title}
                                    </h1>
                                    <p className="text-center text-sm text-muted-foreground">
                                        {description}
                                    </p>
                                </div>
                            </div>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
