import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ProductExtras, ProductVariations, ServicesAndProducts } from '@/types';
import { useForm } from '@inertiajs/react';
import { LoaderCircle, Plus, Save, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const initialData = {
    name: '',
    description: '',
    price: 0,
    duration: '',
    category: 'Product',
    isActive: true,
    image: undefined as File | undefined,
    image_url: '',
    extras: [] as ProductExtras[],
    variations: [] as ProductVariations[],
};

interface Props {
    open: boolean;
    onClose: () => void;
    businessId: string;
    service: ServicesAndProducts | null;
    onSuccess: () => void;
}

export default function ProductServiceModal({
    open,
    onClose,
    businessId,
    service,
    onSuccess,
}: Props) {
    const form = useForm(initialData);

    useEffect(() => {
        if (!open) return;

        if (service) {
            form.setData({
                name: service.name ?? '',
                description: service.description ?? '',
                price: service.price ?? 0,
                duration: service.duration ?? '',
                category: service.category ?? 'Product',
                isActive: service.isActive ?? true,
                image: undefined,
                image_url: service.image_url ?? '',
                extras: service.extras ?? [],
                variations: service.variations ?? [],
            });
        } else {
            form.reset();
            form.clearErrors();
        }
    }, [open, service]);

    const handleSubmit = () => {
        const isEdit = Boolean(service);
        const url = isEdit
            ? `/dashboard/business/${businessId}/services/${service?.id}`
            : `/dashboard/business/${businessId}/services`;

        form.post(url, {
            forceFormData: true,
            // @ts-expect-error
            data: isEdit ? { ...form.data, _method: 'PUT' } : form.data,
            onSuccess: () => {
                toast.success(
                    isEdit
                        ? 'Servicio actualizado correctamente'
                        : 'Servicio creado correctamente',
                );
                onClose();
                onSuccess();
                form.reset();
            },
            onError: (errors) => {
                if (errors?.general) toast.error(errors.general);
                else toast.error('Error al guardar');
            },
        });
    };

    const handleAddExtra = () => {
        form.setData('extras', [...form.data.extras, { name: '', price: 0 }]);
    };

    const handleRemoveExtra = (index: number) => {
        const newExtras = [...form.data.extras];
        newExtras.splice(index, 1);
        form.setData('extras', newExtras);
    };

    const handleAddVariation = () => {
        form.setData('variations', [...form.data.variations, { name: '' }]);
    };

    const handleRemoveVariation = (index: number) => {
        const newVariations = [...form.data.variations];
        newVariations.splice(index, 1);
        form.setData('variations', newVariations);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="animate-slide-in w-full max-w-6xl rounded-2xl bg-white p-5 shadow-2xl">
                <DialogHeader className="mb-2 border-b pb-3">
                    <DialogTitle className="text-xl font-bold text-orange-600">
                        {service ? 'Editar Producto' : 'Agregar Producto'}
                    </DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="general" className="space-y-6">
                    <TabsList className="mb-1 border-b border-gray-200">
                        <TabsTrigger value="general">General</TabsTrigger>
                        <TabsTrigger value="variations">
                            Variaciones
                        </TabsTrigger>
                        <TabsTrigger value="extras">Extras</TabsTrigger>
                    </TabsList>

                    {/* General */}
                    <TabsContent value="general" className="space-y-6">
                        <div className="flex gap-6">
                            <div className="flex flex-1 flex-col gap-2">
                                <Label>Nombre</Label>
                                <Input
                                    value={form.data.name}
                                    onChange={(e) =>
                                        form.setData('name', e.target.value)
                                    }
                                    className="rounded-lg shadow-lg"
                                />
                                {form.errors.name && (
                                    <span className="mt-1 text-sm text-red-500">
                                        {form.errors.name}
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-1 flex-col gap-2">
                                <Label>Precio ($)</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={form.data.price}
                                    onChange={(e) =>
                                        form.setData(
                                            'price',
                                            Number(e.target.value),
                                        )
                                    }
                                    className="rounded-lg shadow-lg"
                                />
                                {form.errors.price && (
                                    <span className="mt-1 text-sm text-red-500">
                                        {form.errors.price}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label>Descripción</Label>
                            <Textarea
                                rows={4}
                                value={form.data.description}
                                onChange={(e) =>
                                    form.setData('description', e.target.value)
                                }
                                className="rounded-lg shadow-lg"
                            />
                            {form.errors.description && (
                                <span className="mt-1 text-sm text-red-500">
                                    {form.errors.description}
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={form.data.isActive}
                                onChange={(e) =>
                                    form.setData('isActive', e.target.checked)
                                }
                                className="h-5 w-5 rounded border-gray-300 focus:ring-2 focus:ring-orange-400"
                            />
                            <Label className="text-sm font-normal">
                                Activo (visible a clientes)
                            </Label>
                        </div>

                        <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center transition hover:border-orange-400">
                            <input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) =>
                                    form.setData('image', e.target.files?.[0])
                                }
                            />
                            <label
                                htmlFor="image-upload"
                                className="cursor-pointer text-sm font-medium text-orange-600 hover:text-orange-700"
                            >
                                Subir imagen
                            </label>
                            {(form.data.image || form.data.image_url) && (
                                <img
                                    src={
                                        form.data.image
                                            ? URL.createObjectURL(
                                                  form.data.image,
                                              )
                                            : form.data.image_url
                                    }
                                    className="mx-auto mt-4 h-32 w-32 rounded-lg object-cover shadow-md"
                                />
                            )}
                        </div>
                    </TabsContent>

                    {/* Variations */}
                    <TabsContent value="variations" className="space-y-6">
                        <Label className="font-semibold">Variaciones</Label>
                        {form.data.variations.map((varia, index) => (
                            <div
                                key={index}
                                className="mb-2 flex items-center gap-2"
                            >
                                <div className="flex flex-1 flex-col">
                                    <Input
                                        value={varia.name}
                                        placeholder="Nombre"
                                        onChange={(e) => {
                                            const newVariations = [
                                                ...form.data.variations,
                                            ];
                                            newVariations[index].name =
                                                e.target.value;
                                            form.setData(
                                                'variations',
                                                newVariations,
                                            );
                                        }}
                                    />
                                    {form.errors[
                                        `variations.${index}.name`
                                    ] && (
                                        <span className="mt-1 text-xs text-red-500">
                                            {
                                                form.errors[
                                                    `variations.${index}.name`
                                                ]
                                            }
                                        </span>
                                    )}
                                </div>
                                <Button
                                    variant="ghost"
                                    onClick={() => handleRemoveVariation(index)}
                                >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                            </div>
                        ))}
                        <Button
                            variant="outline"
                            className="mt-2 flex items-center gap-1"
                            onClick={handleAddVariation}
                        >
                            <Plus className="h-4 w-4" /> Agregar
                        </Button>
                    </TabsContent>

                    {/* Extras */}
                    <TabsContent value="extras" className="space-y-4">
                        <Label className="font-semibold">Extras</Label>
                        {form.data.extras.map((top, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-[1fr_1fr_auto] items-start gap-2"
                            >
                                {/* Nombre */}
                                <div className="flex flex-col">
                                    <Input
                                        value={top.name}
                                        placeholder="Nombre"
                                        onChange={(e) => {
                                            const newExtra = [
                                                ...form.data.extras,
                                            ];
                                            newExtra[index].name =
                                                e.target.value;
                                            form.setData('extras', newExtra);
                                        }}
                                    />
                                    {form.errors[`extras.${index}.name`] && (
                                        <span className="mt-1 text-xs text-red-500">
                                            {
                                                form.errors[
                                                    `extras.${index}.name`
                                                ]
                                            }
                                        </span>
                                    )}
                                </div>

                                {/* Precio */}
                                <div className="flex flex-col">
                                    <Input
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={top.price}
                                        placeholder="Precio"
                                        onChange={(e) => {
                                            const newExtra = [
                                                ...form.data.extras,
                                            ];
                                            newExtra[index].price = Number(
                                                e.target.value,
                                            );
                                            form.setData('extras', newExtra);
                                        }}
                                    />
                                    {form.errors[`extras.${index}.price`] && (
                                        <span className="mt-1 text-xs text-red-500">
                                            {
                                                form.errors[
                                                    `extras.${index}.price`
                                                ]
                                            }
                                        </span>
                                    )}
                                </div>

                                {/* Eliminar */}
                                <Button
                                    variant="ghost"
                                    onClick={() => handleRemoveExtra(index)}
                                >
                                    <Trash2 className="h-5 w-5 text-red-500" />
                                </Button>
                            </div>
                        ))}

                        <Button
                            variant="outline"
                            className="mt-2 flex items-center gap-1"
                            onClick={handleAddExtra}
                        >
                            <Plus className="h-4 w-4" /> Agregar topping
                        </Button>
                    </TabsContent>
                </Tabs>

                {/* Acciones */}
                <div className="mt-8 flex justify-end gap-4 border-t pt-4">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={form.processing}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={form.processing}
                        className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                    >
                        {form.processing ? (
                            <LoaderCircle className="h-5 w-5 animate-spin" />
                        ) : (
                            <Save className="h-5 w-5" />
                        )}
                        Guardar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
