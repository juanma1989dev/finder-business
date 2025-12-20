import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { makeBreadCrumb } from '@/helpers';
import {
    Amenites,
    Business,
    BusinessCategories,
    Payments,
    Schedules,
} from '@/types';
import { useForm } from '@inertiajs/react';
import { Coffee, LayoutGrid, ShieldCheck, Wallet } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { LayoutBusinessModules } from './LayoutBusinessModules';
import {
    AvailabilitySection,
    CardBase,
    FeatureItem,
    FeatureSection,
    Field,
    SectionHeader,
    TagsSection,
    useToggleList,
} from './components';

interface Props {
    business: Business;
    categories: BusinessCategories[];
    payments: Payments[];
    amenities: Amenites[];
}

interface BusinessForm {
    name: string;
    phone: string;
    description: string;
    long_description: string;
    id_category: string | number;
    amenities: number[];
    payments: number[];
    schedules: Schedules[];
    tags: string;
    use_whatsapp: boolean;
}

export default function EditBusiness({
    business,
    categories,
    payments,
    amenities,
}: Props) {
    const breadcrumbs = makeBreadCrumb({
        text: 'Información general',
        url: '#',
    });

    const labelStyle =
        'mb-1 block text-[10px] font-semibold uppercase tracking-widest text-slate-500';

    const inputStyle =
        'h-9 rounded-lg border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20';

    const form = useForm<BusinessForm>({
        name: business?.name ?? '',
        phone: business?.phone ?? '',
        description: business?.description ?? '',
        long_description: business?.long_description ?? '',
        id_category: business?.id_category ?? '',
        amenities: (business?.amenities ?? []).map((a) => Number(a.id)),
        payments: (business?.payments ?? []).map((p) => Number(p.id)),
        schedules: business?.schedules ?? [],
        tags: '',
        use_whatsapp: business?.use_whatsapp ?? false,
    });

    const { data, setData, transform, put, processing } = form;

    const [tagInput, setTagInput] = useState<string>('');
    const [tags, setTags] = useState<string[]>(
        typeof business?.tags === 'string'
            ? business.tags.split(',').filter(Boolean)
            : [],
    );

    const handleSubmit = () => {
        transform((d) => ({ ...d, tags: tags.join(',') }));
        put(`/dashboard/business/${business.id}/info-general/x`, {
            preserveScroll: true,
            onSuccess: () => toast.success('Módulo actualizado'),
            onError: () => toast.error('Error al guardar'),
        });
    };

    const amenitiesUI: FeatureItem[] = (amenities ?? [])
        .filter((a): a is Amenites & { id: string } => Boolean(a.id))
        .map((a) => ({
            id: Number(a.id),
            name: a.name,
        }));

    const paymentsUI: FeatureItem[] = (payments ?? [])
        .filter((p): p is Payments & { id: string } => Boolean(p.id))
        .map((p) => ({
            id: Number(p.id),
            name: p.name,
        }));

    const amenitiesToggle = useToggleList<number>(data.amenities, (next) =>
        setData('amenities', next),
    );

    const paymentsToggle = useToggleList<number>(data.payments, (next) =>
        setData('payments', next),
    );

    return (
        <LayoutBusinessModules
            titleHead="System Asset Control"
            headerTitle={business?.name || 'Cargando…'}
            headerDescription="Gestión técnica de metadatos y disponibilidad."
            buttonText="Guardar cambios"
            icon={ShieldCheck}
            onSubmit={handleSubmit}
            processing={processing}
            breadcrumbs={breadcrumbs}
        >
            <div className="space-y-6 lg:col-span-8">
                {/* Identidad */}
                <section>
                    <SectionHeader
                        icon={<LayoutGrid size={14} />}
                        title="Información general"
                    />
                    <CardBase>
                        <CardContent className="p-3">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field
                                    label="Nombre"
                                    value={data.name}
                                    onChange={(v) => setData('name', v)}
                                    labelClass={labelStyle}
                                    inputClass={inputStyle}
                                />

                                <div>
                                    <Label className={labelStyle}>
                                        Categoría
                                    </Label>
                                    <select
                                        value={data.id_category}
                                        onChange={(e) =>
                                            setData(
                                                'id_category',
                                                e.target.value,
                                            )
                                        }
                                        className={`w-full ${inputStyle}`}
                                    >
                                        <option value="">Seleccionar…</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <Field
                                    label="Eslogan"
                                    value={data.description}
                                    onChange={(v) => setData('description', v)}
                                    full
                                    labelClass={labelStyle}
                                    inputClass={inputStyle}
                                />

                                {/* Teléfono + WhatsApp */}
                                <div className="sm:col-span-2">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {/* Teléfono */}
                                        <div className="w-full">
                                            <Label className={labelStyle}>
                                                Teléfono
                                            </Label>
                                            <Input
                                                value={data.phone}
                                                onChange={(e) =>
                                                    setData(
                                                        'phone',
                                                        e.target.value,
                                                    )
                                                }
                                                type="tel"
                                                maxLength={10}
                                                pattern="[0-9]{10}"
                                                placeholder="Ejemplo: 5551234567"
                                                className="h-9 w-full rounded-lg px-3 text-sm shadow-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
                                            />
                                        </div>

                                        {/* WhatsApp */}
                                        <div className="w-full">
                                            <Label className={labelStyle}>
                                                Contacto por WhatsApp
                                            </Label>

                                            <div className="flex h-9 w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 shadow-sm">
                                                <div className="flex items-center gap-2">
                                                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                                        💬
                                                    </span>

                                                    <span className="text-xs font-medium text-slate-700">
                                                        {data.use_whatsapp
                                                            ? 'WhatsApp habilitado'
                                                            : 'WhatsApp deshabilitado'}
                                                    </span>
                                                </div>

                                                <Switch
                                                    checked={data.use_whatsapp}
                                                    onCheckedChange={(
                                                        checked,
                                                    ) =>
                                                        setData(
                                                            'use_whatsapp',
                                                            checked,
                                                        )
                                                    }
                                                    className="scale-90 data-[state=checked]:bg-emerald-600"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <Label className={labelStyle}>
                                        Descripción detallada
                                    </Label>
                                    <Textarea
                                        value={data.long_description}
                                        onChange={(e) =>
                                            setData(
                                                'long_description',
                                                e.target.value,
                                            )
                                        }
                                        className="min-h-[90px] rounded-lg border-slate-200 p-3 text-sm shadow-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </CardBase>
                </section>

                {/* Features */}
                <div className="grid gap-6 sm:grid-cols-2">
                    <FeatureSection
                        title="Amenidades"
                        icon={<Coffee size={14} />}
                        items={amenitiesUI}
                        toggle={amenitiesToggle.toggle}
                        isSelected={amenitiesToggle.isSelected}
                    />

                    <FeatureSection
                        title="Métodos de cobro"
                        icon={<Wallet size={14} />}
                        items={paymentsUI}
                        toggle={paymentsToggle.toggle}
                        isSelected={paymentsToggle.isSelected}
                    />
                </div>
            </div>

            <div className="space-y-6 lg:col-span-4">
                <AvailabilitySection
                    schedules={data.schedules}
                    setSchedules={(s) => setData('schedules', s)}
                />
                <TagsSection
                    tags={tags}
                    tagInput={tagInput}
                    setTagInput={setTagInput}
                    setTags={setTags}
                    inputStyle={inputStyle}
                />
            </div>
        </LayoutBusinessModules>
    );
}
