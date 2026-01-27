import { Link, usePage } from '@inertiajs/react';
import { LogIn, MessageSquareHeart } from 'lucide-react';
import DropdownMenu from './DropdownMenu';

export default function Header() {
    const { auth } = usePage().props as any;
    const { user } = auth;

    return (
        <header className="sticky top-0 z-50 w-full border-b border-purple-200 bg-white/70 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between gap-4">
                    {/* Logo con Identidad Púrpura */}
                    <div className="flex shrink-0 items-center">
                        <Link
                            href="/"
                            className="group flex items-center gap-2"
                        >
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-600 shadow-sm transition-transform group-hover:scale-105 active:scale-95">
                                <span className="text-xl font-semibold text-white">
                                    F
                                </span>
                            </div>
                            <h1 className="hidden text-base font-semibold tracking-tight text-purple-800 sm:block">
                                Finder
                            </h1>
                        </Link>
                    </div>

                    {/* Área de Acciones */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        {/* Botón de Sugerencias (Paleta Púrpura) */}
                        <a
                            href="https://forms.gle/NT3EPoh1VyRUuQKG6"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 rounded-lg border border-purple-200 bg-purple-50 px-3 py-1.5 text-sm font-semibold text-purple-700 transition-all hover:bg-purple-100 active:scale-95"
                        >
                            <MessageSquareHeart className="h-4 w-4" />
                            <span className="hidden md:inline">
                                Sugerencias
                            </span>
                        </a>

                        <div className="h-6 w-px bg-purple-200" />

                        {/* Estado de Autenticación */}
                        <div className="flex items-center">
                            {user ? (
                                <div className="flex items-center gap-3">
                                    <DropdownMenu user={user} />
                                </div>
                            ) : (
                                <Link
                                    href="/accounts"
                                    className="group flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-purple-700 active:scale-95"
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
