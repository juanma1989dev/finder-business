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
import { toast } from 'react-toastify';
import { LayoutBusinessModules } from '../LayoutBusinessModules';
import {
    AvailabilitySection,
    CardBase,
    FeatureItem,
    FeatureSection,
    Field,
    SectionHeader,
    useToggleList,
} from '../components';

interface Props {
    business: Business;
    categories: BusinessCategories[];
    payments: Payments[];
    amenities: Amenites[];
}

interface BusinessForm {
    name: string;
    phone: string;
    slogan: string;
    description: string;
    category_id: string | number;
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
        'mb-1 block text-[10px] font-semibold uppercase tracking-widest text-gray-500 leading-tight';

    const inputStyle =
        'h-9 w-full rounded-lg border-purple-200 bg-white px-3 text-sm text-gray-700 shadow-sm transition focus:border-purple-600 focus:ring-1 focus:ring-purple-600/20 font-normal';

    const form = useForm<BusinessForm>({
        name: business?.name ?? '',
        phone: business?.phone ?? '',
        slogan: business?.slogan ?? '',
        description: business?.description ?? '',
        category_id: business?.category_id ?? '',
        amenities: (business?.amenities ?? []).map((a) => Number(a.id)),
        payments: (business?.payments ?? []).map((p) => Number(p.id)),
        schedules: business?.schedules ?? [],
        tags: '',
        use_whatsapp: business?.use_whatsapp ?? false,
    });

    const { data, setData, transform, put, processing } = form;

    // const [tagInput, setTagInput] = useState<string>('');
    // const [tags, setTags] = useState<string[]>(
    //     typeof business?.tags === 'string'
    //         ? business.tags.split(',').filter(Boolean)
    //         : [],
    // );

    const handleSubmit = () => {
        // transform((d) => ({ ...d, tags: tags.join(',') }));
        put(
            `/dashboard/business/${business.id}-${business.slug}/info-general/`,
            {
                preserveScroll: true,
                onSuccess: () => toast.success('Módulo actualizado'),
                onError: () => toast.error('Error al guardar'),
            },
        );
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
            titleHead="Findy Business"
            headerTitle={business?.name || 'Cargando…'}
            headerDescription="Gestión técnica de metadatos y disponibilidad."
            buttonText="Guardar cambios"
            icon={ShieldCheck}
            onSubmit={handleSubmit}
            processing={processing}
            breadcrumbs={breadcrumbs}
        >
            <div className="space-y-6 lg:col-span-8">
                <section className="mb-4">
                    <SectionHeader
                        icon={
                            <LayoutGrid size={14} className="text-purple-700" />
                        }
                        title="Información general"
                        // className="mb-3 font-semibold text-purple-800"
                    />
                    {/* ESPACIADO Y ESTRUCTURA: p-3, rounded-lg, shadow-sm */}
                    <CardBase className="rounded-lg border-purple-200 bg-purple-50/10 shadow-sm">
                        <CardContent className="p-3">
                            {/* Gap de Grilla Responsiva: gap-4 */}
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field
                                    label="Nombre comercial"
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
                                        value={data.category_id}
                                        onChange={(e) =>
                                            setData(
                                                'category_id',
                                                e.target.value,
                                            )
                                        }
                                        className={`${inputStyle} appearance-none`}
                                    >
                                        <option value="">Seleccionar…</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="sm:col-span-2">
                                    <Field
                                        label="Eslogan o frase publicitaria"
                                        value={data.slogan}
                                        onChange={(v) => setData('slogan', v)}
                                        full
                                        labelClass={labelStyle}
                                        inputClass={inputStyle}
                                    />
                                </div>

                                {/* Teléfono + WhatsApp */}
                                <div className="sm:col-span-2">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="w-full">
                                            <Label className={labelStyle}>
                                                Teléfono de contacto
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
                                                placeholder="Ej: 5551234567"
                                                className={inputStyle}
                                            />
                                        </div>

                                        <div className="w-full">
                                            <Label className={labelStyle}>
                                                WhatsApp Business
                                            </Label>
                                            {/* Paleta Púrpura: bg-purple-50, border-purple-200 */}
                                            <div className="flex h-9 w-full items-center justify-between rounded-lg border border-purple-200 bg-purple-50 px-3 shadow-sm">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] leading-tight font-semibold tracking-tight text-purple-700 uppercase">
                                                        {data.use_whatsapp
                                                            ? 'Habilitado'
                                                            : 'Deshabilitado'}
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
                                                    className="scale-75 transition-transform active:scale-95 data-[state=checked]:bg-purple-600"
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
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        className="min-h-[100px] rounded-lg border-purple-200 p-3 text-sm font-normal shadow-sm focus:border-purple-600 focus:ring-1 focus:ring-purple-600/20"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </CardBase>
                </section>

                <div className="grid gap-6 sm:grid-cols-2">
                    <FeatureSection
                        title="Amenidades"
                        icon={<Coffee size={14} className="text-purple-600" />}
                        items={amenitiesUI}
                        toggle={amenitiesToggle.toggle}
                        isSelected={amenitiesToggle.isSelected}
                    />

                    <FeatureSection
                        title="Cobro"
                        icon={<Wallet size={14} className="text-purple-700" />}
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
                {/* <TagsSection
                    tags={tags}
                    tagInput={tagInput}
                    setTagInput={setTagInput}
                    setTags={setTags}
                    inputStyle={inputStyle}
                /> */}
            </div>
        </LayoutBusinessModules>
    );
}
