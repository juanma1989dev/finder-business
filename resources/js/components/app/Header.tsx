import { Link, usePage } from '@inertiajs/react';
import { LogIn, MessageSquareHeart } from 'lucide-react';
import DropdownMenu from './DropdownMenu';

export default function Header() {
    const { auth } = usePage().props as any;
    const { user } = auth;

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/70 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between gap-4">
                    {/* Logo con el gradiente de la marca */}
                    <div className="flex shrink-0 items-center">
                        <Link
                            href="/"
                            className="group flex items-center gap-2"
                        >
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-orange-500 shadow-lg shadow-purple-200 transition-transform group-hover:scale-105">
                                <span className="text-xl font-black text-white">
                                    D
                                </span>
                            </div>
                            <h1 className="hidden text-lg font-black tracking-tight text-gray-900 sm:block">
                                <span className="bg-gradient-to-r from-purple-700 to-purple-500 bg-clip-text text-transparent">
                                    Directorio
                                </span>
                            </h1>
                        </Link>
                    </div>

                    {/* Área de Acciones */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        {/* Botón de Sugerencias estilizado */}
                        <a
                            href="https://forms.gle/NT3EPoh1VyRUuQKG6"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 rounded-full border border-purple-100 bg-purple-50 px-3 py-1.5 text-[13px] font-bold text-purple-700 transition-colors hover:bg-purple-100"
                        >
                            <MessageSquareHeart className="h-4 w-4" />
                            <span className="hidden md:inline">
                                Sugerencias
                            </span>
                        </a>

                        <div className="h-6 w-px bg-gray-100" />

                        {/* Estado de Autenticación */}
                        <div className="flex items-center">
                            {user ? (
                                <div className="flex items-center gap-3">
                                    <DropdownMenu user={user} />
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    className="group flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-[13px] font-bold text-white shadow-lg shadow-orange-200 transition-all hover:bg-orange-600 hover:shadow-orange-300 active:scale-95"
                                >
                                    <LogIn className="h-4 w-4" />
                                    <span>Entrar</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
