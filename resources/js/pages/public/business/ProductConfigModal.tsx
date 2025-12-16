import { CartExtra, CartVariation } from '@/types';
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-xl bg-white p-4">
                <h2 className="mb-3 text-lg font-bold">
                    {product.name}{' '}
                    <span className="text-green-600">${product.price}</span>
                </h2>

                {/* VARIACIONES */}
                {hasVariations && (
                    <div className="mb-4">
                        <p className="mb-1 text-sm font-medium">Tipo *</p>

                        <div className="flex flex-wrap gap-2">
                            {product.variations.map((v: CartVariation) => {
                                const selected = variation?.id === v.id;

                                return (
                                    <button
                                        key={v.id}
                                        type="button"
                                        onClick={() => setVariation(v)}
                                        className={`rounded border px-3 py-1 text-sm transition ${
                                            selected
                                                ? 'border-green-600 bg-green-50 text-green-700'
                                                : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                    >
                                        {v.name}{' '}
                                        {Number(v.price) > 0 &&
                                            `(+ $${v.price})`}
                                    </button>
                                );
                            })}
                        </div>

                        {isInvalid && (
                            <p className="mt-1 text-xs text-red-500">
                                Selecciona una variación para continuar
                            </p>
                        )}
                    </div>
                )}

                {/* EXTRAS */}
                {product.extras?.length > 0 && (
                    <div className="mb-4">
                        <p className="mb-1 text-sm font-medium">Extras</p>

                        <div className="flex flex-wrap gap-2">
                            {product.extras.map((e: CartExtra) => (
                                <button
                                    key={e.id}
                                    type="button"
                                    onClick={() => toggleExtra(e)}
                                    className={`rounded border px-3 py-1 text-sm transition ${
                                        extras.some((x) => x.id === e.id)
                                            ? 'border-green-600 bg-green-50'
                                            : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                >
                                    {e.name} (+${e.price})
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* NOTAS */}
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ej: sin picante..."
                    className="w-full rounded border p-2 text-sm"
                />

                {/* ACTIONS */}
                <div className="mt-4 flex gap-2">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded border py-2"
                    >
                        Cancelar
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
                        className={`flex-1 rounded py-2 text-white transition ${
                            isInvalid
                                ? 'cursor-not-allowed bg-gray-400'
                                : 'bg-green-600 hover:bg-green-700'
                        }`}
                    >
                        Agregar
                    </button>
                </div>
            </div>
        </div>
    );
};
