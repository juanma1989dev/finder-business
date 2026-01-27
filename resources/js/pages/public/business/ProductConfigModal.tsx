import { CartExtra, CartVariation } from '@/types';
import { X } from 'lucide-react';
import { useState } from 'react';

interface Props {
    product: any;
    onConfirm: (data: {
        extras: CartExtra[];
        variations: CartVariation[];
        notes: string;
    }) => void;
    onClose: () => void;
}

export const ProductConfigModal = ({ product, onConfirm, onClose }: Props) => {
    const [extras, setExtras] = useState<CartExtra[]>([]);
    const [variation, setVariation] = useState<CartVariation | null>(null);
    const [notes, setNotes] = useState('');

    const toggleExtra = (extra: CartExtra) => {
        setExtras((prev) =>
            prev.some((e) => e.id === extra.id)
                ? prev.filter((e) => e.id !== extra.id)
                : [...prev, extra],
        );
    };

    const hasVariations = product.variations?.length > 0;
    const isInvalid = hasVariations && !variation;

    const currentTotal =
        Number(product.price) +
        (variation ? Number(variation.price) : 0) +
        extras.reduce((acc, curr) => acc + Number(curr.price), 0);

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-gray-900/40 p-4 backdrop-blur-sm">
            {/* ESTRUCTURA Y SOMBRA DE TARJETA */}
            <div className="relative w-full max-w-[420px] overflow-hidden rounded-lg bg-white shadow-2xl duration-200 animate-in fade-in zoom-in">
                {/* HEADER - Paleta Gris para títulos neutros */}
                <div className="flex items-center justify-between border-b border-purple-50 px-6 py-5">
                    <div>
                        <h2 className="text-sm font-semibold text-gray-700 uppercase">
                            Personalizar pedido
                        </h2>
                        <p className="text-sm font-semibold text-purple-800">
                            {product.name}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg bg-gray-50 p-2 text-gray-500 transition-colors hover:bg-purple-50 hover:text-purple-700"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* CUERPO - Padding p-3 (usado aquí en el contenedor de scroll) */}
                <div className="scrollbar-hide max-h-[60vh] space-y-4 overflow-y-auto px-6 py-4">
                    {/* VARIACIONES - Paleta Púrpura */}
                    {hasVariations && (
                        <div className="mb-4">
                            <p className="mb-3 text-[10px] font-semibold tracking-widest text-gray-700 uppercase">
                                Selecciona una opción
                                <span className="ml-1 text-purple-600">*</span>
                            </p>
                            <div className="grid grid-cols-1 gap-2">
                                {product.variations.map((v: CartVariation) => {
                                    const selected = variation?.id === v.id;
                                    return (
                                        <button
                                            key={v.id}
                                            type="button"
                                            onClick={() => setVariation(v)}
                                            className={`flex items-center justify-between rounded-lg border-2 px-4 py-3 transition-all active:scale-95 ${
                                                selected
                                                    ? 'border-purple-600 bg-purple-50 text-purple-800'
                                                    : 'border-purple-50 bg-white text-gray-600 hover:border-purple-100'
                                            }`}
                                        >
                                            <span className="text-sm font-semibold">
                                                {v.name}
                                            </span>
                                            <span className="text-sm font-normal">
                                                {Number(v.price) > 0
                                                    ? `+ $${v.price}`
                                                    : 'Incluido'}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                            {/* ALERTA - Paleta Amber */}
                            {isInvalid && (
                                <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 p-2">
                                    <p className="text-center text-[10px] leading-tight font-semibold text-amber-700 uppercase">
                                        Selecciona una opción para continuar
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* EXTRAS - Paleta Púrpura (Secundarios) */}
                    {product.extras?.length > 0 && (
                        <div className="mb-4">
                            <p className="mb-3 text-[10px] font-semibold tracking-widest text-gray-700 uppercase">
                                ¿Deseas agregar extras?
                            </p>
                            <div className="flex flex-col gap-2">
                                {product.extras.map((e: CartExtra) => {
                                    const isSelected = extras.some(
                                        (x) => x.id === e.id,
                                    );
                                    return (
                                        <button
                                            key={e.id}
                                            type="button"
                                            onClick={() => toggleExtra(e)}
                                            className={`flex items-center justify-between rounded-lg border px-4 py-3 transition-all ${
                                                isSelected
                                                    ? 'border-purple-600 bg-purple-50 text-purple-700'
                                                    : 'border-purple-200 bg-white text-gray-600 hover:bg-purple-50/50'
                                            }`}
                                        >
                                            <span className="text-sm font-normal">
                                                {e.name}
                                            </span>
                                            <span className="text-sm font-semibold">
                                                + ${e.price}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* NOTAS */}
                    <div className="mb-1">
                        <p className="mb-1 text-[10px] font-semibold tracking-widest text-gray-700 uppercase">
                            Notas adicionales
                        </p>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Ej: Sin aderezos, cambiar por..."
                            className="h-20 w-full resize-none rounded-lg border border-purple-200 bg-white p-3 text-sm font-normal text-gray-600 transition-colors focus:border-purple-600 focus:outline-none"
                        />
                    </div>
                </div>

                {/* FOOTER - Paleta Púrpura para botones */}
                <div className="border-t border-purple-50 bg-white p-3">
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 rounded-lg px-4 py-3 text-sm font-semibold text-gray-500 transition-all hover:bg-gray-50 active:scale-95"
                        >
                            Volver
                        </button>

                        <button
                            disabled={isInvalid}
                            onClick={() =>
                                onConfirm({
                                    extras,
                                    variations: variation ? [variation] : [],
                                    notes,
                                })
                            }
                            className={`flex-[2] rounded-lg py-3 text-sm font-semibold text-white shadow-sm transition-all active:scale-95 ${
                                isInvalid
                                    ? 'cursor-not-allowed bg-gray-300'
                                    : 'bg-purple-600 hover:bg-purple-700'
                            }`}
                        >
                            Confirmar — ${currentTotal.toFixed(2)}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
