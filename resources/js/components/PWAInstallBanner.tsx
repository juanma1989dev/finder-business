import { usePWAInstall } from '@/hooks/use-pwa-install';
import { Download, X } from 'lucide-react';
import { useState } from 'react';

export default function PWAInstallBanner() {
    const { canInstall, install } = usePWAInstall();
    const [hidden, setHidden] = useState(false);

    if (!canInstall || hidden) return null;

    return (
        <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
            <div className="flex w-full max-w-md items-center gap-3 rounded-2xl bg-purple-600 px-4 py-3 text-white shadow-xl">
                <div className="flex-1">
                    <p className="text-sm font-bold">Instala Findy</p>
                    <p className="text-xs opacity-90">
                        Acceso rápido y funciona offline
                    </p>
                </div>

                <button
                    onClick={install}
                    className="rounded-xl bg-white/20 p-2 transition hover:bg-white/30"
                >
                    <Download size={18} />
                </button>

                <button
                    onClick={() => setHidden(true)}
                    className="rounded-xl bg-white/10 p-2 transition hover:bg-white/20"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
}
