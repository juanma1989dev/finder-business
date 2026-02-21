import { TypeUser, User } from '@/types';
import { router } from '@inertiajs/react';
import { ChevronDown, Heart, LayoutDashboard, LogOut } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

function getDashboardUrlByUser(user: User) {
    const URLS = {
        client: '/dashboard/client',
        delivery: '/dashboard/delivery',
        business: '/dashboard/business',
    };

    return URLS[user.type] ?? null;
}

export default function DropdownMenu({ user, className }: any) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);
    const [isSigningOut, setIsSigningOut] = useState(false);

    useEffect(() => {
        const onDoc = (e: MouseEvent) => {
            if (!ref.current) return;
            if (!ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('click', onDoc);
        return () => document.removeEventListener('click', onDoc);
    }, []);

    const URL_DASHBOARD = getDashboardUrlByUser(user);

    function handleClickLogout() {
        router.post(
            '/logout',
            {},
            {
                onStart: () => setIsSigningOut(true),
                onFinish: () => setIsSigningOut(false),
            },
        );
    }

    return (
        <div className={`flex items-center ${className}`}>
            <div ref={ref} className="relative">
                <button
                    onClick={() => setOpen((v) => !v)}
                    className={`flex items-center gap-2 rounded-full border p-1 transition-all duration-300 ${
                        open
                            ? 'border-purple-200 bg-purple-50 shadow-md'
                            : 'border-gray-200 bg-white hover:border-purple-200 hover:shadow-sm'
                    }`}
                >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 to-purple-400 text-[13px] font-bold text-white shadow-inner">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden pr-1 text-sm font-bold text-gray-700 md:block">
                        {user?.name.split(' ')[0]}
                    </span>
                    <ChevronDown
                        className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                    />
                </button>

                {open && (
                    <div className="absolute right-0 z-50 mt-3 w-64 origin-top-right rounded-[1.5rem] border border-gray-100 bg-white p-2 shadow-2xl ring-1 shadow-purple-900/10 ring-black/5 transition-all">
                        <div className="mb-1 border-b border-gray-50 px-4 py-3">
                            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                                Cuenta
                            </p>
                            <p className="truncate text-sm font-extrabold text-gray-800">
                                {user?.email}
                            </p>
                        </div>

                        <div className="space-y-1">
                            <a
                                href={URL_DASHBOARD}
                                className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-purple-50 hover:text-purple-700"
                            >
                                <LayoutDashboard className="h-4 w-4" />
                                <span>Panel de Control</span>
                            </a>

                            {user.type == TypeUser.CLIENT && (
                                <a
                                    href="/favorites"
                                    className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-orange-50 hover:text-orange-700"
                                >
                                    <Heart className="h-4 w-4" />
                                    <span>Mis Favoritos</span>
                                </a>
                            )}

                            {/* {user.type == TypeUser.CLIENT && (
                                <a
                                    href="/profile"
                                    className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-purple-50 hover:text-purple-700"
                                >
                                    <UserIcon className="h-4 w-4" />
                                    <span>Ajustes del Perfil</span>
                                </a>
                            )} */}
                        </div>

                        <div className="mt-2 border-t border-gray-50 pt-2">
                            <button
                                onClick={handleClickLogout}
                                disabled={isSigningOut}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-200 transition-all hover:from-orange-600 hover:to-orange-700 active:scale-[0.98] disabled:opacity-70"
                            >
                                {isSigningOut ? (
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                ) : (
                                    <LogOut className="h-4 w-4" />
                                )}
                                <span>
                                    {isSigningOut
                                        ? 'Saliendo...'
                                        : 'Cerrar sesión'}
                                </span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
