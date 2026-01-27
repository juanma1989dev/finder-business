import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { Schedules } from '@/types';
import { CalendarDays, Plus, Tag, XIcon } from 'lucide-react';

export interface FeatureItem {
    id: number;
    name: string;
}

interface FeatureSectionProps {
    title: string;
    icon: React.ReactNode;
    items: FeatureItem[];
    toggle: (id: number, checked: boolean) => void;
    isSelected: (id: number) => boolean;
}

interface SectionHeaderProps {
    icon: React.ReactNode;
    title: string;
}

interface FieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    full?: boolean;
    labelClass: string;
    inputClass: string;
}

import { useCallback } from 'react';

export function useToggleList<T extends string | number>(
    value: T[],
    onChange: (next: T[]) => void,
) {
    const toggle = useCallback(
        (item: T, checked: boolean) => {
            onChange(
                checked ? [...value, item] : value.filter((v) => v !== item),
            );
        },
        [value, onChange],
    );

    const isSelected = useCallback((item: T) => value.includes(item), [value]);

    return {
        toggle,
        isSelected,
    };
}

export function SectionHeader({ icon, title }: SectionHeaderProps) {
    return (
        <div className="relative mb-2 flex items-center gap-2 px-1">
            <span className="absolute top-1/2 left-0 h-4 w-0.5 -translate-y-1/2 rounded-full bg-purple-500" />
            <span className="ml-2 flex h-6 w-6 items-center justify-center rounded-md bg-orange-50 text-purple-600 ring-1 ring-orange-100">
                {icon}
            </span>
            <h3 className="text-[10px] font-semibold tracking-widest text-slate-700 uppercase">
                {title}
            </h3>
        </div>
    );
}

export function TagsSection({
    tags,
    tagInput,
    setTagInput,
    setTags,
    inputStyle,
}: {
    tags: string[];
    tagInput: string;
    setTagInput: (v: string) => void;
    setTags: (v: string[]) => void;
    inputStyle: string;
}) {
    return (
        <section>
            <SectionHeader icon={<Tag size={14} />} title="SEO" />
            <CardBase>
                <CardContent className="p-3">
                    <div className="mb-2 flex gap-2">
                        <Input
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            placeholder="Añadir tag…"
                            className={inputStyle}
                        />
                        <Button
                            type="button"
                            onClick={() =>
                                tagInput && setTags([...tags, tagInput])
                            }
                            className="h-9 rounded-lg bg-orange-600 px-3"
                        >
                            <Plus size={16} />
                        </Button>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                        {tags.map((tag) => (
                            <Badge
                                key={tag}
                                className="flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] uppercase"
                            >
                                {tag}
                                <XIcon
                                    size={12}
                                    onClick={() =>
                                        setTags(tags.filter((t) => t !== tag))
                                    }
                                    className="cursor-pointer"
                                />
                            </Badge>
                        ))}
                    </div>
                </CardContent>
            </CardBase>
        </section>
    );
}

export function AvailabilitySection({
    schedules,
    setSchedules,
}: {
    schedules: Schedules[];
    setSchedules: (s: Schedules[]) => void;
}) {
    const updateDay = (idx: number, updates: Partial<Schedules>) => {
        const newSchedules = [...schedules];
        newSchedules[idx] = { ...newSchedules[idx], ...updates };
        setSchedules(newSchedules);
    };

    return (
        <section className="w-full space-y-2">
            <SectionHeader icon={<CalendarDays size={14} />} title="Horario" />
            <CardBase className="overflow-hidden">
                <CardContent className="divide-y divide-slate-100 p-0">
                    {schedules.map((day, idx) => (
                        <div
                            key={day.label}
                            className={`flex flex-col gap-1.5 px-3 py-2.5 transition-colors ${
                                day.isOpen ? 'bg-white' : 'bg-slate-50/50'
                            }`}
                        >
                            {/* Fila Superior: Día y Switch */}
                            <div className="flex items-center justify-between gap-2">
                                <span
                                    className={`text-[11px] font-bold tracking-tight uppercase ${
                                        day.isOpen
                                            ? 'text-slate-700'
                                            : 'text-slate-400'
                                    }`}
                                >
                                    {day.label}
                                </span>
                                <Switch
                                    checked={day.isOpen}
                                    onCheckedChange={(v) =>
                                        updateDay(idx, { isOpen: v })
                                    }
                                    className="scale-75 data-[state=checked]:bg-purple-600"
                                />
                            </div>

                            {/* Fila Inferior: Grid de Inputs */}
                            {day.isOpen && (
                                <div className="mt-1 grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-1">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="pl-1 text-[9px] font-semibold text-slate-400">
                                            INICIO
                                        </span>
                                        <Input
                                            type="time"
                                            value={day.open}
                                            onChange={(e) =>
                                                updateDay(idx, {
                                                    open: e.target.value,
                                                })
                                            }
                                            className="h-8 w-full border-slate-200 bg-slate-50/50 px-2 text-[11px]"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-0.5">
                                        <span className="pl-1 text-[9px] font-semibold text-slate-400">
                                            FIN
                                        </span>
                                        <Input
                                            type="time"
                                            value={day.close}
                                            onChange={(e) =>
                                                updateDay(idx, {
                                                    close: e.target.value,
                                                })
                                            }
                                            className="h-8 w-full border-slate-200 bg-slate-50/50 px-2 text-[11px]"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </CardContent>
            </CardBase>
        </section>
    );
}
export function FeatureSection({
    title,
    icon,
    items,
    toggle,
    isSelected,
}: FeatureSectionProps) {
    return (
        <section>
            <SectionHeader icon={icon} title={title} />

            <CardBase>
                <CardContent className="p-2">
                    <div className="space-y-0">
                        {items.map((item) => (
                            <label
                                key={item.id}
                                className="flex items-center justify-between rounded-lg px-2 py-1.5 transition hover:bg-slate-50"
                            >
                                <span className="text-sm text-slate-700">
                                    {item.name}
                                </span>

                                <input
                                    type="checkbox"
                                    checked={isSelected(item.id)}
                                    onChange={(e) =>
                                        toggle(item.id, e.target.checked)
                                    }
                                    className="h-4 w-4 accent-purple-600"
                                />
                                {/* data-[state=checked]:bg-purple-600 */}
                            </label>
                        ))}
                    </div>
                </CardContent>
            </CardBase>
        </section>
    );
}

export function CardBase({
    children,
    className = '',
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <Card
            className={cn(
                'rounded-xl border border-slate-200 bg-white shadow-sm',
                className,
            )}
        >
            {children}
        </Card>
    );
}

export function Field({
    label,
    value,
    onChange,
    full,
    labelClass,
    inputClass,
}: FieldProps) {
    return (
        <div className={full ? 'sm:col-span-2' : ''}>
            <Label className={labelClass}>{label}</Label>
            <Input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={inputClass}
            />
        </div>
    );
}
