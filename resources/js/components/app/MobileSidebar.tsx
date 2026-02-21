import { Link, router, usePage } from '@inertiajs/react';
import {
    ChevronRight,
    Heart,
    Home,
    LayoutDashboard,
    Loader2,
    LogIn,
    LogOut,
    Menu,
    User,
    X,
} from 'lucide-react';
import { useState } from 'react';

export default function MobileSidebar() {
    const { auth } = usePage().props as any;
    const { user } = auth;
    const { url } = usePage();

    const [isOpen, setIsOpen] = useState(false);
    const [isSigningOut, setIsSigningOut] = useState(false);

    const handleSignOut = () => {
        router.post(
            '/logout',
            {},
            {
                onStart: () => setIsSigningOut(true),
                onFinish: () => {
                    setIsSigningOut(false);
                    setIsOpen(false);
                },
            },
        );
    };

    const isPageActive = (path: string) => {
        if (path === '/') return url === '/';
        return url.startsWith(path);
    };

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <>
            <button
                onClick={toggleMenu}
                className="fixed top-2 left-2 z-[60] flex h-8 w-8 items-center justify-center rounded-xl border border-gray-300 bg-white text-purple-600 shadow-lg transition-transform active:scale-90 md:hidden"
            >
                {isOpen ? <X size={24} /> : <Menu size={20} />}
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 z-[51] bg-slate-900/40 backdrop-blur-sm md:hidden"
                    onClick={toggleMenu}
                />
            )}

            <nav
                className={`fixed top-0 left-0 z-[55] h-full w-[250px] transform bg-white transition-transform duration-300 md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="flex h-full flex-col">
                    <div className="bg-gray-50/50 p-6 pt-8">
                        {user && (
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 to-purple-400 text-lg font-bold text-white shadow-lg">
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="truncate text-sm font-extrabold text-gray-800">
                                        {user.name}
                                    </p>
                                    <p className="truncate text-[11px] font-medium tracking-wider text-gray-400 uppercase">
                                        {user.email}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 space-y-1 overflow-y-auto p-4">
                        <p className="px-4 pb-2 text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">
                            Menú Principal
                        </p>

                        <NavItem
                            href="/"
                            icon={<Home size={16} />}
                            label="Inicio"
                            active={isPageActive('/')}
                            onClick={() => setIsOpen(false)}
                        />

                        {user && (
                            <>
                                <NavItem
                                    href="/dashboard"
                                    icon={<LayoutDashboard size={16} />}
                                    label="Panel de Control"
                                    active={isPageActive('/dashboard')}
                                    onClick={() => setIsOpen(false)}
                                />
                                <NavItem
                                    href="/favorites"
                                    icon={<Heart size={16} />}
                                    label="Mis Favoritos"
                                    active={isPageActive('/favorites')}
                                    onClick={() => setIsOpen(false)}
                                    variant="orange"
                                />
                                <NavItem
                                    href="/profile"
                                    icon={<User size={16} />}
                                    label="Ajustes Perfil"
                                    active={isPageActive('/profile')}
                                    onClick={() => setIsOpen(false)}
                                />
                            </>
                        )}
                    </div>

                    <div className="border-t border-gray-100 p-4">
                        {user ? (
                            <button
                                onClick={handleSignOut}
                                disabled={isSigningOut}
                                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-200 transition-all active:scale-[0.97] disabled:opacity-70"
                            >
                                {isSigningOut ? (
                                    <Loader2
                                        size={18}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <LogOut size={18} />
                                )}
                                <span>
                                    {isSigningOut
                                        ? 'Saliendo...'
                                        : 'CERRAR SESIÓN'}
                                </span>
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                onClick={() => setIsOpen(false)}
                                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-purple-600 px-2 py-1.5 text-sm font-bold text-white shadow-lg shadow-purple-200"
                            >
                                <LogIn size={16} />
                                <span>Ingresar</span>
                            </Link>
                        )}
                    </div>
                </div>
            </nav>
        </>
    );
}

function NavItem({
    href,
    icon,
    label,
    active,
    onClick,
    variant = 'purple',
}: {
    href: string;
    icon: React.ReactNode;
    label: string;
    active: boolean;
    onClick: () => void;
    variant?: 'purple' | 'orange';
}) {
    const activeStyles = {
        purple: 'bg-purple-50 text-purple-700 border-purple-100',
        orange: 'bg-orange-50 text-orange-700 border-orange-100',
    };

    return (
        <Link
            href={href}
            onClick={onClick}
            className={`group flex items-center justify-between rounded-xl border border-transparent px-4 py-3 transition-all duration-200 active:scale-[0.98] ${
                active
                    ? activeStyles[variant]
                    : 'text-gray-500 hover:bg-gray-50'
            }`}
        >
            <div className="flex items-center gap-3">
                <span
                    className={`${active ? 'scale-110' : 'text-gray-400 group-hover:text-gray-600'}`}
                >
                    {icon}
                </span>
                <span className="text-sm font-bold tracking-tight uppercase">
                    {label}
                </span>
            </div>
            {active && <ChevronRight size={14} className="opacity-40" />}
        </Link>
    );
}
