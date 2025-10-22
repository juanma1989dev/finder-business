import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Business, Schedules } from '@/types';
import { useForm } from '@inertiajs/react';
import { BookText, Clock, LoaderCircle, Save, XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface BusinessFormProps {
    categories: Array<{
        id: number;
        name: string;
        image: string;
    }>;
    initialValues: Partial<Business>;
    submitUrl: string;
    onSuccess?: () => void;
    payments: any;
    services: any;
    daysOfWeek: Array<{ label: string; value: string }>;
}

const initialState: Business = {
    id: undefined,
    name: '',
    phone: '',
    use_whatsapp: true,
    description: '',
    long_description: '',
    id_category: '',
    address: '',
    tags: '',
    amenities: [],
    payments: [],
    schedules: [],
};

const MAX_TAGS = 6; // máximo de palabras clave
const MIN_TAG_LENGTH = 4; // longitud mínima de cada palabra

export default function BusinessForm({
    categories,
    initialValues,
    submitUrl,
    onSuccess,
    payments,
    services,
}: BusinessFormProps) {
    const { data, setData, transform, put, processing, errors, wasSuccessful } =
        useForm({
            ...initialState,
            ...initialValues,
            amenities: initialValues?.amenities?.map((a: any) => a.id) ?? [],
            payments: initialValues?.payments?.map((p: any) => p.id) ?? [],
            schedules: initialValues?.schedules?.map((sc: any) => sc) ?? [],
        });

    const [tagInput, setTagInput] = useState<string>('');
    const [tags, setTag] = useState<string[]>([...(initialValues.tags ?? [])]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        transform((data) => ({
            ...data,
            tags: tags.join(','),
        }));
        put(submitUrl);
    };

    const handleServiceChange = (serviceId: number, checked: boolean) => {
        if (checked) {
            setData('amenities', [...data.amenities, serviceId]);
        } else {
            setData(
                'amenities',
                data.amenities.filter((id: number) => id !== serviceId),
            );
        }
    };

    const handlePaymentChange = (paymentId: number, checked: boolean) => {
        if (checked) {
            setData('payments', [...data.payments, paymentId]);
        } else {
            setData(
                'payments',
                data.payments.filter((id: number) => id !== paymentId),
            );
        }
    };

    useEffect(() => {
        if (wasSuccessful && onSuccess) {
            onSuccess();
        }
    }, [wasSuccessful]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    const handleAddTag = () => {
        const newTag = tagInput.trim().toLowerCase();
        if (isTagValid(newTag, tags)) {
            setTag([...tags, newTag]);
            setTagInput('');
        }
    };

    const handleChange = (
        index: number,
        field: keyof Schedules,
        value: string | boolean,
    ) => {
        const updated = [...data.schedules];
        updated[index] = { ...updated[index], [field]: value };

        setData('schedules', updated);
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTag((prevTags) => prevTags.filter((tag) => tag !== tagToRemove));
    };

    const isTagValid = (tag: string, existingTags: string[]): boolean => {
        const trimmedTag = tag.trim().toLowerCase();
        return (
            trimmedTag.length >= MIN_TAG_LENGTH && // cumple longitud mínima
            !existingTags.includes(trimmedTag) && // no está duplicada
            existingTags.length < MAX_TAGS // no supera máximo permitido
        );
    };

    return (
        <form
            className="relative flex w-full flex-col gap-2 rounded-xl p-1 p-3 lg:w-12/12 xl:flex-row"
            onSubmit={handleSubmit}
        >
            <button
                type="submit"
                disabled={processing}
                className="absolute top-0 right-2 mt-6 flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-orange-600 p-2 text-white shadow hover:scale-105 hover:bg-orange-700 disabled:opacity-50"
                title="Guardar"
            >
                {processing ? (
                    <LoaderCircle className="h-4 w-4 animate-spin duration-400" />
                ) : (
                    <Save className="h-5 w-5" />
                )}
            </button>
            <Card className="flex w-full flex-col gap-2 p-3 xl:w-6/12">
                <h3 className="mt-2 mb-4 mb-5 flex items-center gap-3 text-lg font-bold">
                    Datos generales
                    <BookText className="h-4 w-4" />
                </h3>
                <div className="my-3 md:col-span-2">
                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-medium">
                            Nombre <span className="text-red-500">*</span>
                        </label>

                        <Input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="mt-1 block w-full rounded-xl border border-gray-200 p-2"
                            placeholder="Ingresa el nombre"
                            disabled={processing}
                        />
                        {errors.name && (
                            <div className="mt-1 text-sm text-red-500">
                                {errors.name}
                            </div>
                        )}
                    </div>

                    {/* Checkbox WhatsApp */}

                    {/* Descripción */}
                    <div className="my-3 md:col-span-2">
                        <label className="block text-sm font-medium">
                            Descripción <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            className="mt-1 block w-full rounded-xl border border-gray-200 p-2"
                            maxLength={100}
                            disabled={processing}
                        />
                        {errors.description && (
                            <div className="mt-1 text-sm text-red-500">
                                {errors.description}
                            </div>
                        )}
                        <span className="text-sm font-bold text-gray-700/60">
                            Caracteres restantes -{' '}
                            {100 - data.description.length}
                        </span>
                    </div>

                    {/* Descripción larga */}
                    <div className="my-3 md:col-span-2">
                        <label className="block text-sm font-medium">
                            Descripción larga
                        </label>
                        <textarea
                            value={data.long_description}
                            onChange={(e) =>
                                setData('long_description', e.target.value)
                            }
                            className="mt-1 block w-full rounded-xl border border-gray-200 p-2"
                            rows={8}
                            maxLength={1000}
                            disabled={processing}
                        />
                        {errors.description && (
                            <div className="mt-1 text-sm text-red-500">
                                {errors.long_description}
                            </div>
                        )}
                        <span className="text-sm font-bold text-gray-700/60">
                            Caracteres restantes -{' '}
                            {1000 - data.long_description.length}
                        </span>
                    </div>

                    {/* Categoría */}
                    <div>
                        <label className="block text-sm font-medium">
                            Categoría <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={data.id_category}
                            onChange={(e) =>
                                setData('id_category', e.target.value)
                            }
                            className="mt-1 block w-full rounded-xl border border-gray-200 p-2"
                            disabled={processing}
                        >
                            <option value="">Selecciona una categoría</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        {errors.id_category && (
                            <div className="mt-1 text-sm text-red-500">
                                {errors.id_category}
                            </div>
                        )}
                    </div>

                    {/* Teléfono */}
                    <div>
                        <label className="block text-sm font-medium">
                            Teléfono
                            <span className="text-red-500">*</span>
                            {/* {10 - data.phone.length} */}
                        </label>
                        <Input
                            type="tel"
                            value={data.phone}
                            onChange={(e) =>
                                setData(
                                    'phone',
                                    e.target.value.replace(/\D/g, ''),
                                )
                            }
                            className="my-1 block w-full rounded-xl border border-gray-200 p-2"
                            placeholder="1234567890"
                            maxLength={10}
                            disabled={processing}
                        />

                        <Label className="flex items-center gap-3 text-sm">
                            ¿Usar para WhatsApp?
                            <Switch
                                checked={data.use_whatsapp}
                                onCheckedChange={(checked: boolean) => {
                                    setData('use_whatsapp', checked);
                                }}
                                className="border-gray-300 data-[state=checked]:bg-emerald-500"
                                disabled={processing}
                            />
                        </Label>
                        {errors.phone && (
                            <div className="mt-1 text-sm text-red-500">
                                {errors.phone}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-3 border-t pt-5">
                    <h3 className="mt-3 mb-0 text-lg font-semibold">
                        Palabras claves -{' '}
                        <span className="text-sm text-gray-500">
                            {' '}
                            ({tags.length}){' '}
                        </span>
                    </h3>
                    <span className="mb-5 text-sm text-gray-500">
                        (Deben ser mínimo 4 caracteres)
                    </span>
                    <div className="space-y-2">
                        <div className="flex gap-2">
                            <Input
                                id="tags"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="pizza, tlayudas, hamburguesas, ..."
                                disabled={tags.length >= MAX_TAGS}
                            />
                            <Button
                                type="button"
                                onClick={handleAddTag}
                                variant="outline"
                                disabled={!isTagValid(tagInput, tags)}
                            >
                                Agregar
                            </Button>
                        </div>
                    </div>

                    <div className="my-3 flex gap-1">
                        {tags.map(function (tag) {
                            return (
                                <Badge
                                    key={`tag-${tag}`}
                                    className="flex items-center gap-1 bg-orange-600/80 px-2 py-1 text-sm"
                                >
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveTag(tag);
                                        }}
                                        className="ml-1 cursor-pointer rounded-full p-0.5 hover:bg-black/20"
                                    >
                                        <XIcon className="h-4 w-4 text-white" />
                                    </button>
                                    {tag}
                                </Badge>
                            );
                        })}
                    </div>
                </div>
                <div className="my-5 space-y-4 border-t pt-4">
                    <h3 className="text-lg font-semibold">Amenidades</h3>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {services.map((service: any) => (
                            <div
                                key={service.id}
                                className="flex items-center space-x-2"
                            >
                                <Checkbox
                                    id={`service-${service.id}`}
                                    checked={data.amenities.includes(
                                        service.id,
                                    )}
                                    onCheckedChange={(checked) =>
                                        handleServiceChange(
                                            service.id,
                                            checked === true,
                                        )
                                    }
                                    disabled={processing}
                                    className="data-[state=checked]:border-emerald-500 data-[state=checked]:bg-emerald-500"
                                />
                                <Label
                                    htmlFor={`service-${service.id}`}
                                    className="cursor-pointer font-normal"
                                >
                                    {service.name}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="my-5 space-y-4 border-t pt-4">
                    <h3 className="text-lg font-semibold">Tipos de pago</h3>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {payments.map((payment: any) => (
                            <div
                                key={payment.id}
                                className="flex items-center space-x-2"
                            >
                                <Checkbox
                                    id={payment.id}
                                    checked={data.payments.includes(payment.id)}
                                    onCheckedChange={(checked) =>
                                        handlePaymentChange(
                                            payment.id,
                                            checked === true,
                                        )
                                    }
                                    className="data-[state=checked]:border-emerald-500 data-[state=checked]:bg-emerald-500"
                                />
                                <Label
                                    htmlFor={payment.id}
                                    className="cursor-pointer font-normal"
                                >
                                    {payment.name}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
            <Card className="w-full p-3 xl:w-6/12">
                <h3 className="mt-2 mb-4 flex items-center gap-3 text-lg font-bold">
                    Horarios
                    <Clock className="h-4 w-4" />
                </h3>

                <div className="space-y-4">
                    {data.schedules.map((dayData: any, index: any) => (
                        <div
                            key={index}
                            className="space-y-2 rounded-lg border p-3"
                        >
                            <div className="flex items-center justify-between">
                                <Label className="text-md font-semibold">
                                    {dayData.label}
                                </Label>
                                <Label className="text-md flex cursor-pointer gap-2 font-semibold">
                                    <span>
                                        {dayData.isOpen ? 'Abierto' : 'Cerrado'}
                                    </span>
                                    <Switch
                                        checked={dayData.isOpen}
                                        onCheckedChange={(checked: boolean) => {
                                            handleChange(
                                                index,
                                                'isOpen',
                                                checked,
                                            );
                                        }}
                                        className="cursor-pointer data-[state=checked]:bg-emerald-500"
                                    />
                                </Label>
                            </div>

                            {dayData.isOpen && (
                                <div className="flex w-full gap-4">
                                    <div className="flex-1 space-y-1">
                                        <Label className="text-sm">
                                            Apertura
                                        </Label>
                                        <Input
                                            type="time"
                                            value={dayData.open}
                                            onChange={(e) =>
                                                handleChange(
                                                    index,
                                                    'open',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <Label className="text-sm">
                                            Cierre
                                        </Label>
                                        <Input
                                            type="time"
                                            value={dayData.close}
                                            onChange={(e) =>
                                                handleChange(
                                                    index,
                                                    'close',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </Card>
        </form>
    );
}
