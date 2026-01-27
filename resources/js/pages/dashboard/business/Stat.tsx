export default function Stat({
    label,
    value,
    danger,
}: {
    label: string;
    value: number;
    danger?: boolean;
}) {
    return (
        <div
            className={`rounded-lg border p-3 text-center transition-colors ${
                danger
                    ? 'border-amber-200 bg-amber-50'
                    : 'border-purple-100 bg-purple-50'
            }`}
        >
            <p
                className={`text-[10px] leading-tight font-semibold tracking-widest uppercase ${
                    danger ? 'text-amber-700' : 'text-purple-700'
                }`}
            >
                {label}
            </p>

            <p
                className={`mt-0.5 text-base font-semibold ${
                    danger ? 'text-amber-600' : 'text-purple-800'
                }`}
            >
                {value}
            </p>
        </div>
    );
}
