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
            className={`rounded-xl p-3 text-center ${
                danger ? 'bg-rose-50' : 'bg-slate-100'
            }`}
        >
            <p className="text-xs font-bold text-slate-500">{label}</p>
            <p
                className={`text-lg font-black ${
                    danger ? 'text-rose-600' : ''
                }`}
            >
                {value}
            </p>
        </div>
    );
}
