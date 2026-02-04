import { motion } from 'framer-motion';

export function PwaUpdateBanner({ onRefresh }: { onRefresh: () => void }) {
    return (
        <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed inset-x-4 bottom-4 z-50 rounded-2xl bg-purple-600 px-4 py-3 text-white shadow-xl"
        >
            <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold">
                    Nueva versión disponible
                </p>
                <button
                    onClick={onRefresh}
                    className="rounded-xl bg-white/20 px-3 py-1.5 text-xs font-bold backdrop-blur hover:bg-white/30"
                >
                    Actualizar
                </button>
            </div>
        </motion.div>
    );
}
