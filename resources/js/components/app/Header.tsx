import { Link, usePage } from '@inertiajs/react';
import { LogIn, MessageSquareHeart } from 'lucide-react';
import { useState } from 'react';
import DropdownMenu from './DropdownMenu';

export default function Header() {
    const { auth } = usePage().props as any;
    const { user } = auth;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-purple-100 bg-white/80 backdrop-blur-lg">
            <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
                <div className="flex h-14 items-center justify-between gap-2 sm:h-16">
                    <div className="hidden items-center gap-1 md:flex">
                        <Link
                            href="/"
                            className="group flex items-center gap-2"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600 shadow-md transition-transform group-active:scale-90 sm:h-9 sm:w-9">
                                <span className="text-lg font-bold text-white">
                                    F
                                </span>
                            </div>
                            <h1 className="text-sm font-black tracking-tight text-purple-900 sm:text-base">
                                Finder
                            </h1>
                        </Link>
                    </div>
                    <div className="hidden flex-1 items-center justify-end gap-1.5 sm:gap-4 md:flex">
                        <a
                            href="https://forms.gle/NT3EPoh1VyRUuQKG6"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 rounded-xl border border-purple-100 bg-purple-50/50 p-2 text-sm font-bold text-purple-700 transition-all hover:bg-purple-100 active:scale-95 sm:px-3 sm:py-1.5"
                        >
                            <MessageSquareHeart className="h-5 w-5 sm:h-4 sm:w-4" />
                            <span className="hidden md:inline">
                                Sugerencias
                            </span>
                        </a>

                        {user ? (
                            <DropdownMenu user={user} />
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
        </header>
    );
}
