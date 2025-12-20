import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
            <span className="absolute top-1/2 left-0 h-4 w-0.5 -translate-y-1/2 rounded-full bg-orange-500" />
            <span className="ml-2 flex h-6 w-6 items-center justify-center rounded-md bg-orange-50 text-orange-600 ring-1 ring-orange-100">
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
    return (
        <section>
            <SectionHeader icon={<CalendarDays size={14} />} title="Horario" />
            <CardBase>
                <CardContent className="p-2">
                    {schedules.map((day, idx) => (
                        <div
                            key={idx}
                            className="flex items-center justify-between rounded-lg px-3 py-2 text-xs"
                        >
                            <span className="font-semibold text-slate-600 uppercase">
                                {day.label}
                            </span>
                            <Switch
                                checked={day.isOpen}
                                onCheckedChange={(v) =>
                                    setSchedules(
                                        schedules.map((d, i) =>
                                            i === idx
                                                ? {
                                                      ...d,
                                                      isOpen: v,
                                                  }
                                                : d,
                                        ),
                                    )
                                }
                                className="scale-90 data-[state=checked]:bg-orange-600"
                            />
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
                    <div className="space-y-1">
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
                                    className="h-4 w-4 accent-orange-600"
                                />
                            </label>
                        ))}
                    </div>
                </CardContent>
            </CardBase>
        </section>
    );
}

export function CardBase({ children }: { children: React.ReactNode }) {
    return (
        <Card className="rounded-xl border border-slate-200 bg-white shadow-sm">
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
