import { Link, router, usePage } from '@inertiajs/react';
import { Heart, Home, Loader2, LogIn, LogOut, User } from 'lucide-react';
import { useState } from 'react';

export default function BottomMenu() {
    const { auth } = usePage().props as any;
    const { user } = auth;
    const { url } = usePage();

    const [isSigningOut, setIsSigningOut] = useState(false);

    const handleSignOut = () => {
        router.post(
            '/logout',
            {},
            {
                onStart: () => setIsSigningOut(true),
                onFinish: () => setIsSigningOut(false),
            },
        );
    };

    const isPageActive = (path: string) => {
        if (path === '/') return url === '/';
        return url.startsWith(path);
    };

    return (
        <>
            {/* Espaciador para que el contenido no quede debajo del menú */}
            <div className="h-[65px] md:hidden" />

            <nav className="fixed right-0 bottom-0 left-0 z-[50] md:hidden">
                {/* Contenedor principal: Sin márgenes laterales, pegado al borde */}
                <div className="border-t border-gray-100 bg-white/95 px-2 pt-2 backdrop-blur-md">
                    <div className="mx-auto flex h-10 max-w-4xl items-center justify-between">
                        <NavItem
                            href="/"
                            icon={<Home size={20} />}
                            label="Inicio"
                            active={isPageActive('/')}
                        />

                        {user && (
                            <NavItem
                                href="/favorites"
                                icon={<Heart size={20} />}
                                label="Favoritos"
                                active={isPageActive('/favorites')}
                            />
                        )}

                        {user && (
                            <NavItem
                                href="/dashboard/profile/business"
                                icon={<User size={20} />}
                                label="Perfil"
                                active={isPageActive('/dashboard')}
                            />
                        )}

                        <div className="flex-1">
                            {user ? (
                                <button
                                    onClick={handleSignOut}
                                    disabled={isSigningOut}
                                    className="flex w-full flex-col items-center justify-center gap-0.5 text-gray-400 transition-all active:scale-90"
                                >
                                    {isSigningOut ? (
                                        <Loader2
                                            size={18}
                                            className="animate-spin text-purple-600"
                                        />
                                    ) : (
                                        <LogOut size={18} />
                                    )}
                                    <span className="text-[9px] font-black tracking-tight uppercase">
                                        Salir
                                    </span>
                                </button>
                            ) : (
                                <NavItem
                                    href="/login"
                                    icon={<LogIn size={20} />}
                                    label="Entrar"
                                    active={url === '/login'}
                                />
                            )}
                        </div>
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
}: {
    href: string;
    icon: React.ReactNode;
    label: string;
    active: boolean;
}) {
    return (
        <Link
            href={href}
            className="group relative flex flex-1 flex-col items-center justify-center gap-0.5"
        >
            <div
                className={`transition-all duration-300 ${active ? 'scale-110 text-purple-600' : 'text-gray-400 group-active:scale-90'}`}
            >
                {icon}
            </div>
            <span
                className={`text-[9px] font-black tracking-tight uppercase transition-colors ${active ? 'text-purple-600' : 'text-gray-400'}`}
            >
                {label}
            </span>

            {/* Indicador inferior sutil: tipo rayita moderna */}
            {active && (
                <div className="absolute -bottom-1 h-1 w-6 rounded-full bg-purple-600" />
            )}
        </Link>
    );
}
