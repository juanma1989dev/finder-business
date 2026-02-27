import { AlertTriangle } from 'lucide-react';

interface ReasonDialogProps {
    open: boolean;
    title?: string;
    value: string;
    onChange: (value: string) => void;
    onConfirm: () => void;
    onClose: () => void;
    confirmText?: string;
    placeholder?: string;
}

export default function NotesDialog({
    open,
    title = 'Motivo',
    value,
    onChange,
    onConfirm,
    onClose,
    confirmText = 'Confirmar',
    placeholder = 'Escribe el motivo…',
}: ReasonDialogProps) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-end justify-center bg-purple-950/40 p-4 backdrop-blur-md animate-in fade-in duration-300 sm:items-center"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/90 p-8 shadow-2xl shadow-purple-900/20 duration-500 animate-in fade-in zoom-in-95 slide-in-from-bottom-10 sm:rounded-[3rem]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Visual Accent */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-amber-200 to-amber-400 opacity-50"></div>

                <div className="flex flex-col items-center text-center">
                    <div className="mb-4 rounded-3xl bg-amber-50 p-4 text-amber-600 shadow-inner">
                        <AlertTriangle className="h-8 w-8" strokeWidth={1.5} />
                    </div>

                    <h2 className="text-2xl font-black tracking-tight text-gray-900 uppercase">
                        {title}
                    </h2>
                    <p className="mt-2 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                        Selecciona un motivo común o escribe uno nuevo
                    </p>
                </div>

                <div className="mt-8 flex flex-wrap justify-center gap-2">
                    {[
                        'Producto agotado',
                        'Fuera de horario',
                        'Dirección no permitida',
                        'Exceso de pedidos',
                        'Falla técnica',
                    ].map((reason) => (
                        <button
                            key={reason}
                            onClick={() => onChange(reason)}
                            className={`rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-tight transition-all active:scale-95 ${value === reason
                                    ? 'bg-purple-600 text-white shadow-md'
                                    : 'bg-purple-50 text-purple-700 border border-purple-100 hover:bg-purple-100'
                                }`}
                        >
                            {reason}
                        </button>
                    ))}
                </div>

                <textarea
                    autoFocus
                    className="mt-6 w-full rounded-2xl border-2 border-purple-50 bg-white p-5 text-sm font-medium text-gray-700 transition-all placeholder:font-bold placeholder:text-gray-300 focus:border-purple-600/20 focus:bg-purple-50/30 focus:outline-none"
                    rows={4}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />

                <div className="mt-4 flex items-center justify-center gap-2 text-[9px] font-black tracking-widest text-purple-300 uppercase">
                    <span className="rounded border border-purple-100 bg-white px-1.5 py-0.5 shadow-sm">Enter</span>
                    <span>Confirmar</span>
                    <span className="mx-1 opacity-50">•</span>
                    <span className="rounded border border-purple-100 bg-white px-1.5 py-0.5 shadow-sm">Esc</span>
                    <span>Cerrar</span>
                </div>

                <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-2xl border-2 border-gray-100 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 transition-all hover:bg-gray-50 active:scale-95"
                    >
                        Cancelar
                    </button>

                    <button
                        disabled={!value.trim()}
                        onClick={onConfirm}
                        className="relative flex-[1.5] overflow-hidden rounded-2xl bg-amber-600 py-4 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-amber-900/10 transition-all hover:bg-amber-700 hover:shadow-amber-900/20 active:scale-[0.98] disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
                    >
                        <span className="relative z-10">{confirmText}</span>
                        {value.trim() && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer"></div>}
                    </button>
                </div>
            </div>
        </div>
    );
}
