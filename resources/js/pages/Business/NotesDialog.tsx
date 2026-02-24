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
            className="fixed inset-0 z-50 flex items-end justify-center bg-purple-900/40 p-4 backdrop-blur-sm sm:items-center"
            onClick={onClose}
        >
            {/* Contenedor con Radio de Borde rounded-lg y Sombra de Tarjeta */}
            <div
                className="w-full max-w-md rounded-lg border border-amber-200 bg-white p-5 shadow-xl duration-200 animate-in fade-in slide-in-from-bottom-4 zoom-in sm:rounded-lg"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header con Paleta Amber */}
                <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight text-amber-700 uppercase">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                    {title}
                </h2>

                {/* Textarea con Paleta Gris y Focus Púrpura */}
                <textarea
                    autoFocus
                    className="mt-4 w-full rounded-lg border border-purple-100 bg-purple-50 p-3 text-sm font-normal text-gray-700 transition-all placeholder:text-gray-400 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                    rows={4}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />

                {/* Labels de línea de tiempo / Micro-textos */}
                <p className="mt-2 text-[10px] leading-tight font-normal tracking-widest text-gray-500 uppercase">
                    Enter para confirmar · Esc para cancelar
                </p>

                <div className="mt-4 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-lg px-4 py-3 text-sm font-semibold text-gray-500 transition-all hover:bg-gray-50 active:scale-95"
                    >
                        Volver
                    </button>

                    {/* Botón Primario con Paleta Amber para acciones críticas */}
                    <button
                        disabled={!value.trim()}
                        onClick={onConfirm}
                        className="flex-[2] rounded-lg bg-amber-600 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-amber-700 active:scale-95 disabled:bg-gray-300 disabled:opacity-50 disabled:shadow-none"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
