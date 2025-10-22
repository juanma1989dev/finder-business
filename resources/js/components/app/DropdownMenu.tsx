import { router } from '@inertiajs/react';
import { Heart, Menu, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function DropdownMenu({ user }: any) {
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
        <div className="hidden items-center md:flex">
            <div ref={ref} className="relative">
                <button
                    onClick={() => setOpen((v) => !v)}
                    aria-haspopup="true"
                    aria-expanded={open}
                    className="flex cursor-pointer items-center gap-2 rounded-md p-2 hover:bg-gray-100"
                >
                    <p>{user?.name}</p>
                    <Menu className="h-5 w-5 text-gray-700" />
                </button>

                {open && (
                    <div className="absolute right-0 z-50 mt-2 w-56 rounded-lg border border-gray-100 bg-white py-2 shadow-lg">
                        <a
                            href="/favorites"
                            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                        >
                            <Heart className="h-4 w-4" /> <span>Favoritos</span>
                        </a>
                        <a
                            href="/dashboard/business"
                            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                        >
                            <User className="h-4 w-4" /> <span>Perfil</span>
                        </a>
                        <div className="mt-2 mb-0 border-t border-gray-100 pt-2 pb-0">
                            <button
                                onClick={handleClickLogout}
                                className="m-0 w-full cursor-pointer rounded bg-orange-500 px-2 py-1 text-white"
                                disabled={isSigningOut}
                            >
                                {isSigningOut ? 'Cerrando...' : 'Cerrar sesión'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
