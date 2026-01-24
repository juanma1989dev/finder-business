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
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md rounded-t-3xl bg-white p-5 shadow-xl sm:rounded-3xl"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="flex items-center gap-2 text-lg font-black">
                    <AlertTriangle className="text-rose-600" />
                    {title}
                </h2>

                <textarea
                    autoFocus
                    className="mt-4 w-full rounded-xl bg-slate-100 p-3 text-sm"
                    rows={4}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />

                <p className="mt-2 text-xs text-slate-400">
                    Enter para confirmar · Esc para cancelar
                </p>

                <button
                    disabled={!value.trim()}
                    onClick={onConfirm}
                    className="mt-4 w-full rounded-xl bg-rose-600 py-3 text-sm font-black text-white disabled:opacity-50"
                >
                    {confirmText}
                </button>
            </div>
        </div>
    );
}
