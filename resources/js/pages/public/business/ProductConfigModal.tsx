import { CartExtra, CartVariation } from '@/types';
import { X } from 'lucide-react';
import { useState } from 'react';

interface Props {
    product: any;
    onConfirm: (data: {
        extras: CartExtra[];
        variations: CartVariation[]; // Propiedad original respetada
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

    // Cálculo de precio para el feedback visual del usuario
    const currentTotal =
        Number(product.price) +
        (variation ? Number(variation.price) : 0) +
        extras.reduce((acc, curr) => acc + Number(curr.price), 0);

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-gray-900/40 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-[420px] overflow-hidden rounded-2xl bg-white shadow-2xl duration-200 animate-in fade-in zoom-in">
                {/* HEADER */}
                <div className="flex items-center justify-between border-b border-gray-50 px-6 py-5">
                    <div>
                        <h2 className="text-[10px] font-black tracking-[0.15em] text-gray-400 uppercase">
                            Personalizar pedido
                        </h2>
                        <p className="text-sm font-black text-orange-500 uppercase">
                            {product.name}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-xl bg-gray-50 p-2 text-gray-400 transition-colors hover:bg-orange-50 hover:text-orange-500"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="scrollbar-hide max-h-[60vh] overflow-y-auto px-6 py-4">
                    {/* VARIACIONES (OBLIGATORIAS SI EXISTEN) */}
                    {hasVariations && (
                        <div className="mb-6">
                            <p className="mb-3 text-[10px] font-black tracking-widest text-gray-900 uppercase">
                                Selecciona una opción{' '}
                                <span className="text-orange-500">*</span>
                            </p>
                            <div className="grid grid-cols-1 gap-2">
                                {product.variations.map((v: CartVariation) => {
                                    const selected = variation?.id === v.id;
                                    return (
                                        <button
                                            key={v.id}
                                            type="button"
                                            onClick={() => setVariation(v)}
                                            className={`flex items-center justify-between rounded-xl border-2 px-4 py-3 transition-all active:scale-[0.98] ${
                                                selected
                                                    ? 'border-purple-600 bg-purple-50 text-purple-700'
                                                    : 'border-gray-50 bg-gray-50/50 text-gray-500 hover:border-gray-100'
                                            }`}
                                        >
                                            <span className="text-[11px] font-black uppercase">
                                                {v.name}
                                            </span>
                                            <span className="text-[10px] font-bold">
                                                {Number(v.price) > 0
                                                    ? `+ $${v.price}`
                                                    : 'Incluido'}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                            {isInvalid && (
                                <p className="mt-2 text-[9px] font-bold tracking-tighter text-red-500 uppercase">
                                    Por favor, selecciona una opción para
                                    continuar
                                </p>
                            )}
                        </div>
                    )}

                    {/* EXTRAS (OPCIONALES) */}
                    {product.extras?.length > 0 && (
                        <div className="mb-6">
                            <p className="mb-3 text-[10px] font-black tracking-widest text-gray-900 uppercase">
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
                                            className={`flex items-center justify-between rounded-xl border-2 px-4 py-3 transition-all ${
                                                isSelected
                                                    ? 'border-orange-200 bg-orange-50 text-orange-700'
                                                    : 'border-gray-50 bg-gray-50/50 text-gray-600 hover:border-gray-100'
                                            }`}
                                        >
                                            <span className="text-[11px] font-black uppercase">
                                                {e.name}
                                            </span>
                                            <span className="text-[10px] font-bold">
                                                + ${e.price}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* NOTAS */}
                    <div className="mb-2">
                        <p className="mb-3 text-[10px] font-black tracking-widest text-gray-900 uppercase">
                            Notas adicionales
                        </p>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Ej: Sin aderezos, cambiar por..."
                            className="h-20 w-full resize-none rounded-xl border-2 border-gray-50 bg-gray-50/50 p-4 text-[12px] font-medium text-gray-700 transition-colors focus:border-purple-300 focus:outline-none"
                        />
                    </div>
                </div>

                {/* FOOTER - PRECIO TOTAL Y CONFIRMACIÓN */}
                <div className="border-t border-gray-50 bg-white px-6 py-6">
                    <div className="mb-4 flex items-end justify-between">
                        <div className="flex flex-col">
                            {/* <span className="text-[9px] leading-none font-black tracking-widest text-gray-400 uppercase">
                                Subtotal
                            </span> */}
                            {/* <span className="mt-1 text-2xl leading-none font-black text-gray-900">
                                ${currentTotal.toFixed(2)}
                            </span> */}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 rounded-xl px-4 py-3 text-[11px] font-black tracking-wider text-gray-400 uppercase transition-colors hover:bg-gray-50"
                        >
                            Volver
                        </button>

                        <button
                            disabled={isInvalid}
                            onClick={() =>
                                onConfirm({
                                    extras,
                                    variations: variation ? [variation] : [], // Enviado como Array para respetar el tipo original
                                    notes,
                                })
                            }
                            className={`flex-[2] rounded-xl py-3 text-[11px] font-black tracking-wider text-white uppercase shadow-lg transition-all active:scale-95 ${
                                isInvalid
                                    ? 'cursor-not-allowed bg-gray-200 text-gray-400 shadow-none'
                                    : 'bg-orange-500 shadow-orange-100 hover:bg-orange-600 hover:shadow-orange-200'
                            }`}
                        >
                            Confirmar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
