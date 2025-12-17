import { Link, usePage } from '@inertiajs/react';
import DropdownMenu from './DropdownMenu';

export default function () {
    const { auth } = usePage().props as any;
    const { user } = auth;

    return (
        <header className="top-0 z-20 m-0 w-full border-b border-gray-100 bg-white/80 p-0 px-5 shadow-sm backdrop-blur-sm">
            <div className="mx-auto flex items-center justify-between px-1 py-0">
                {/* Logo */}
                <div className="flex items-center space-x-2">
                    <a href="/">
                        <h1 className="text-md bg-gradient-to-r from-orange-700 to-amber-600 bg-clip-text font-bold text-transparent sm:text-2xl">
                            Directorio de Negocios
                        </h1>
                    </a>
                </div>

                {/* Área de autenticación */}
                <div className="flex items-center space-x-2">
                    <a
                        href="https://forms.gle/NT3EPoh1VyRUuQKG6"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-md mx-1 my-5 block text-blue-600 hover:underline"
                    >
                        Sugerencias
                    </a>

                    <span className="hidden md:mx-1 md:inline">|</span>

                    <div className="hidden md:inline">
                        {user ? (
                            <DropdownMenu user={user} />
                        ) : (
                            <Link
                                type="button"
                                href="/login"
                                className="text-md mx-1 my-5 block text-blue-600 hover:underline"
                            >
                                Iniciar sesión<div></div>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
