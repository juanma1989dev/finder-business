import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { makeBreadCrumb } from '@/helpers';
import {
    Amenites,
    BusinessCategories,
    FlashData,
    Payments,
    Schedules,
} from '@/types';
import { useForm } from '@inertiajs/react';
import {
    BookText,
    Clock,
    Coffee,
    CreditCard,
    Info,
    Phone,
    Plus,
    Tag,
    XIcon,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { LayoutBusinessModules } from './LayoutBusinessModules';

interface Props {
    business: any;
    categories: BusinessCategories[];
    payments: Payments[];
    amenities: Amenites[];
}

const MAX_TAGS = 6;
const MIN_TAG_LENGTH = 3;

export default function EditBusiness({
    business,
    categories,
    payments,
    amenities,
}: Props) {
    const breadcrumbs = makeBreadCrumb({
        text: `${business.name ?? ''} - Configuración`,
        url: '#',
    });

    const { data, setData, transform, put, processing, errors } = useForm({
        name: business.name ?? '',
        phone: business.phone ?? '',
        use_whatsapp: !!business.use_whatsapp,
        description: business.description ?? '',
        long_description: business.long_description ?? '',
        id_category: business.id_category ?? '',
        address: business.address ?? '',
        // Mapeamos solo los IDs para los checkboxes
        amenities: business?.amenities?.map((a: Amenites) => a.id) ?? [],
        payments: business?.payments?.map((p: Payments) => p.id) ?? [],
        schedules: business?.schedules ?? [],
    });

    const [tagInput, setTagInput] = useState<string>('');
    const [tags, setTags] = useState<string[]>(
        typeof business.tags === 'string'
            ? business.tags.split(',').filter(Boolean)
            : (business.tags ?? []),
    );

    const handleSubmit = () => {
        // Transformamos los tags de array a string antes de enviar si tu backend lo requiere
        transform((data) => ({
            ...data,
            tags: tags.join(','),
        }));

        put(`/dashboard/business/${business.id}/info-general/x`, {
            preserveScroll: true,
            onSuccess: (page) => {
                const flash = (page.props as any).flash as FlashData;
                if (flash?.success) toast.success(flash.success);
            },
        });
    };

    const handleServiceChange = (id: number, checked: boolean) => {
        const current = [...data.amenities];
        setData(
            'amenities',
            checked ? [...current, id] : current.filter((i) => i !== id),
        );
    };

    const handlePaymentChange = (id: number, checked: boolean) => {
        const current = [...data.payments];
        setData(
            'payments',
            checked ? [...current, id] : current.filter((i) => i !== id),
        );
    };

    const handleAddTag = () => {
        const newTag = tagInput.trim().toLowerCase();
        if (
            newTag.length >= MIN_TAG_LENGTH &&
            !tags.includes(newTag) &&
            tags.length < MAX_TAGS
        ) {
            setTags([...tags, newTag]);
            setTagInput('');
        } else if (tags.length >= MAX_TAGS) {
            toast.warning(`Máximo ${MAX_TAGS} etiquetas`);
        }
    };

    const handleScheduleChange = (
        index: number,
        field: keyof Schedules,
        value: any,
    ) => {
        const updated = [...data.schedules];
        updated[index] = { ...updated[index], [field]: value };
        setData('schedules', updated);
    };

    return (
        <LayoutBusinessModules
            titleHead="Información General"
            headerTitle="Editar Negocio"
            headerDescription="Gestiona la identidad y disponibilidad de tu empresa."
            buttonText="Guardar"
            icon={BookText}
            onSubmit={handleSubmit}
            processing={processing}
            breadcrumbs={breadcrumbs}
        >
            {/* Columna Izquierda: Información Principal */}
            <div className="col-span-1 space-y-6 border-none lg:col-span-7">
                <Card className="overflow-hidden rounded-3xl border-slate-200 shadow-sm">
                    <CardHeader className="border-b border-slate-50 bg-slate-50/50 px-6 py-4">
                        <div className="flex items-center gap-2 text-orange-600">
                            <Info size={18} strokeWidth={2.5} />
                            <CardTitle className="text-sm font-bold tracking-tight text-slate-800 uppercase">
                                Datos del Negocio
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6 p-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label className="text-[11px] font-bold text-slate-400 uppercase">
                                    Nombre Comercial
                                </Label>
                                <Input
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    className="rounded-xl border-slate-200 focus:ring-orange-500/20"
                                />
                                {errors.name && (
                                    <p className="text-[10px] font-bold text-red-500">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[11px] font-bold text-slate-400 uppercase">
                                    Categoría
                                </Label>
                                <select
                                    value={data.id_category}
                                    onChange={(e) =>
                                        setData('id_category', e.target.value)
                                    }
                                    className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-orange-500/20"
                                >
                                    <option value="">Seleccionar...</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[11px] font-bold text-slate-400 uppercase">
                                    Teléfono
                                </Label>
                                <div className="relative">
                                    <Phone
                                        className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                                        size={14}
                                    />
                                    <Input
                                        value={data.phone}
                                        onChange={(e) =>
                                            setData(
                                                'phone',
                                                e.target.value.replace(
                                                    /\D/g,
                                                    '',
                                                ),
                                            )
                                        }
                                        className="rounded-xl border-slate-200 pl-9"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                                <div className="space-y-0.5">
                                    <Label className="text-xs font-bold text-slate-700">
                                        WhatsApp
                                    </Label>
                                    <p className="text-[10px] text-slate-500">
                                        ¿Recibir mensajes?
                                    </p>
                                </div>
                                <Switch
                                    checked={data.use_whatsapp}
                                    onCheckedChange={(v) =>
                                        setData('use_whatsapp', v)
                                    }
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[11px] font-bold text-slate-400 uppercase">
                                Descripción Corta
                            </Label>
                            <Input
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                placeholder="Breve resumen..."
                                className="rounded-xl border-slate-200"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[11px] font-bold text-slate-400 uppercase">
                                Historia / Descripción Larga
                            </Label>
                            <Textarea
                                value={data.long_description}
                                onChange={(e) =>
                                    setData('long_description', e.target.value)
                                }
                                className="min-h-[120px] resize-none rounded-xl border-slate-200"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Grid de Amenidades y Pagos */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {/* Amenidades */}
                    <Card className="overflow-hidden rounded-3xl border-slate-200 shadow-sm">
                        <div className="flex items-center gap-2 border-b border-blue-100 bg-blue-50/50 px-4 py-3">
                            <Coffee size={16} className="text-blue-600" />
                            <span className="text-[11px] font-bold text-blue-700 uppercase">
                                Amenidades
                            </span>
                        </div>
                        <div className="space-y-1 p-4">
                            {amenities.map((item) => (
                                <label
                                    key={item.id}
                                    className="flex cursor-pointer items-center justify-between rounded-xl p-2 transition-colors hover:bg-slate-50"
                                >
                                    <div className="flex items-center gap-3">
                                        <Checkbox
                                            checked={data.amenities.includes(
                                                item.id,
                                            )}
                                            onCheckedChange={(c) =>
                                                handleServiceChange(
                                                    Number(item.id),
                                                    !!c,
                                                )
                                            }
                                        />
                                        <span className="text-sm font-medium text-slate-600">
                                            {item.name}
                                        </span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </Card>

                    {/* Pagos */}
                    <Card className="overflow-hidden rounded-3xl border-slate-200 shadow-sm">
                        <div className="flex items-center gap-2 border-b border-emerald-100 bg-emerald-50/50 px-4 py-3">
                            <CreditCard
                                size={16}
                                className="text-emerald-600"
                            />
                            <span className="text-[11px] font-bold text-emerald-700 uppercase">
                                Pagos
                            </span>
                        </div>
                        <div className="space-y-1 p-4">
                            {payments.map((item) => (
                                <label
                                    key={item.id}
                                    className="flex cursor-pointer items-center justify-between rounded-xl p-2 transition-colors hover:bg-slate-50"
                                >
                                    <div className="flex items-center gap-3">
                                        <Checkbox
                                            checked={data.payments.includes(
                                                item.id,
                                            )}
                                            onCheckedChange={(c) =>
                                                handlePaymentChange(
                                                    Number(item.id),
                                                    !!c,
                                                )
                                            }
                                        />
                                        <span className="text-sm font-medium text-slate-600">
                                            {item.name}
                                        </span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

            {/* Columna Derecha: Horarios y Tags */}
            <div className="col-span-1 space-y-6 lg:col-span-5">
                <Card className="overflow-hidden rounded-3xl border-slate-200 shadow-sm">
                    <CardHeader className="border-b border-slate-50 bg-slate-50/50 px-6 py-4">
                        <div className="flex items-center gap-2 text-orange-600">
                            <Clock size={18} strokeWidth={2.5} />
                            <CardTitle className="text-sm font-bold tracking-tight text-slate-800 uppercase">
                                Horarios
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3 p-4">
                        {data.schedules.map((day: Schedules, idx: number) => (
                            <div
                                key={idx}
                                className={`rounded-2xl border p-3 transition-all ${day.isOpen ? 'border-orange-100 bg-orange-50/30' : 'border-slate-100 bg-slate-50 opacity-60'}`}
                            >
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-sm font-bold text-slate-700">
                                        {day.label}
                                    </span>
                                    <Switch
                                        checked={day.isOpen}
                                        onCheckedChange={(v) =>
                                            handleScheduleChange(
                                                idx,
                                                'isOpen',
                                                v,
                                            )
                                        }
                                        className="scale-75"
                                    />
                                </div>
                                {day.isOpen && (
                                    <div className="mt-2 flex items-center gap-2">
                                        <Input
                                            type="time"
                                            value={day.open}
                                            onChange={(e) =>
                                                handleScheduleChange(
                                                    idx,
                                                    'open',
                                                    e.target.value,
                                                )
                                            }
                                            className="h-8 rounded-lg text-xs"
                                        />
                                        <span className="text-slate-400">
                                            -
                                        </span>
                                        <Input
                                            type="time"
                                            value={day.close}
                                            onChange={(e) =>
                                                handleScheduleChange(
                                                    idx,
                                                    'close',
                                                    e.target.value,
                                                )
                                            }
                                            className="h-8 rounded-lg text-xs"
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Tags Card */}
                <Card className="overflow-hidden rounded-3xl border-slate-200 shadow-sm">
                    <CardHeader className="border-b border-purple-100 bg-purple-50/50 px-6 py-4">
                        <div className="flex items-center gap-2 text-purple-600">
                            <Tag size={18} strokeWidth={2.5} />
                            <CardTitle className="text-sm font-bold tracking-tight text-slate-800 uppercase">
                                Etiquetas
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4 p-6">
                        <div className="flex gap-2">
                            <Input
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) =>
                                    e.key === 'Enter' &&
                                    (e.preventDefault(), handleAddTag())
                                }
                                placeholder="Ej: Café"
                                className="h-10 rounded-xl"
                            />
                            <Button
                                type="button"
                                onClick={handleAddTag}
                                className="h-10 rounded-xl bg-purple-600 px-4 hover:bg-purple-700"
                            >
                                <Plus size={16} />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                                <Badge
                                    key={tag}
                                    className="flex items-center gap-2 rounded-lg border-none bg-purple-100 px-3 py-1 text-purple-700 hover:bg-purple-200"
                                >
                                    {tag}
                                    <XIcon
                                        size={12}
                                        className="cursor-pointer"
                                        onClick={() =>
                                            setTags(
                                                tags.filter((t) => t !== tag),
                                            )
                                        }
                                    />
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </LayoutBusinessModules>
    );
}
