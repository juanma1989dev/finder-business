import DashboardLayout from '@/layouts/dashboard-layout';
import { useForm } from '@inertiajs/react';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

type AccountTypeItem = {
    type: string;
    title: string;
    label: string;
    image: string;
    description: string;
};

type Props = {
    accountTypes: Record<string, AccountTypeItem>;
    suggestedType?: string;
};

export default function AccountConfig({ accountTypes, suggestedType }: Props) {
    const keys = Object.keys(accountTypes);

    const form = useForm<{ account_type: string }>({
        account_type: suggestedType ?? keys[0],
    });

    const [confirmed, setConfirmed] = useState(false);

    useEffect(() => {
        if (suggestedType) {
            form.setData('account_type', suggestedType);
            setConfirmed(false);
        }
    }, [suggestedType]);

    const current = accountTypes[form.data.account_type];

    return (
        <DashboardLayout>
            <div className="space-y-6 rounded-xl bg-white p-4 shadow-sm md:p-6">
                <header className="space-y-1 text-center">
                    <h1 className="text-xl font-semibold md:text-2xl">
                        Antes de continuar…
                    </h1>
                    <p className="text-sm text-gray-600">
                        Dinos cómo planeas usar la plataforma.
                        <span className="block font-medium text-gray-800">
                            Esta elección es importante.
                        </span>
                    </p>
                </header>

                <div className="grid gap-3 md:grid-cols-3">
                    {keys.map((key) => {
                        const item = accountTypes[key];
                        const selected = form.data.account_type === key;

                        return (
                            <button
                                key={key}
                                type="button"
                                onClick={() => {
                                    form.setData('account_type', key);
                                    setConfirmed(false);
                                }}
                                className={clsx(
                                    'relative rounded-xl border p-4 text-left transition',
                                    'active:scale-[0.97]',
                                    selected
                                        ? 'border-purple-700 bg-purple-50'
                                        : 'border-gray-200 bg-white',
                                )}
                            >
                                {selected && (
                                    <span className="absolute top-2 right-2 rounded-full bg-black px-2 py-0.5 text-[10px] text-white">
                                        Seleccionado
                                    </span>
                                )}

                                <p className="text-xs font-semibold text-gray-500 uppercase">
                                    {item.title}
                                </p>
                                <h3 className="mt-1 text-base font-semibold">
                                    {item.label}
                                </h3>
                            </button>
                        );
                    })}
                </div>

                <div className="grid gap-4 rounded-lg border p-4 md:grid-cols-2">
                    <div className="flex flex-col items-center text-center">
                        <img
                            src={current.image}
                            alt={current.label}
                            className="h-32 w-32 object-contain md:h-40 md:w-40"
                        />
                        <p className="mt-2 text-sm font-medium">
                            {current.label}
                        </p>
                    </div>

                    <div className="flex items-center">
                        <p className="text-sm leading-relaxed text-gray-700">
                            {current.description}
                        </p>
                    </div>
                </div>

                <div className="space-y-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
                    <h3 className="text-sm font-semibold text-amber-900">
                        Confirma tu elección
                    </h3>

                    <label className="flex cursor-pointer gap-2 text-sm text-amber-800">
                        <input
                            type="checkbox"
                            checked={confirmed}
                            onChange={(e) => setConfirmed(e.target.checked)}
                        />
                        <span>
                            Entiendo que continuaré con una{' '}
                            <strong>{current.label}</strong> y que no podré
                            cambiarla libremente después.
                        </span>
                    </label>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={() => form.post('/dashboard/account-config')}
                        disabled={!confirmed || form.processing}
                        className={clsx(
                            'rounded-lg px-6 py-3 text-sm font-semibold text-white transition',
                            !confirmed || form.processing
                                ? 'bg-gray-400'
                                : 'bg-blue-600 hover:bg-blue-700',
                        )}
                    >
                        {form.processing
                            ? 'Confirmando…'
                            : 'Confirmar y continuar'}
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
}
