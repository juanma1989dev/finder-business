import { useForm } from '@inertiajs/react';
import {
    Image as ImageIcon,
    Layers,
    LoaderCircle,
    Package,
    Plus,
    Save,
    Sparkles,
    Trash2,
} from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
    ProductExtras,
    ProductsTypes,
    ProductVariations,
    ServicesAndProducts,
} from '@/types';

interface Props {
    open: boolean;
    onClose: () => void;
    businessId: string;
    product: ServicesAndProducts | null;
    onSuccess: () => void;
    productTypes: ProductsTypes[];
}

type ProductForm = {
    name: string;
    description: string;
    price: string;
    duration: string;
    category: string;
    isActive: boolean;
    image: File | undefined;
    image_url: string;
    extras: ProductExtras[];
    variations: ProductVariations[];
};

// Estilos compartidos para mantener el JSX limpio
const STYLES = {
    label: 'text-[10px] font-semibold tracking-widest text-gray-500 uppercase leading-tight mb-1 block',
    input: 'rounded-lg border-purple-200 bg-white text-sm shadow-sm transition focus:border-purple-600 focus:ring-1 focus:ring-purple-600/20',
    tabTrigger:
        'relative rounded-none border-b-2 border-transparent bg-transparent px-1 text-sm font-semibold text-gray-400 transition-all hover:text-purple-500 data-[state=active]:border-purple-600 data-[state=active]:text-purple-700',
};

export default function ProductServiceModal({
    open,
    onClose,
    businessId,
    product,
    onSuccess,
    productTypes,
}: Props) {
    const form = useForm<ProductForm>({
        name: '',
        description: '',
        price: '',
        duration: '',
        category: '',
        isActive: true,
        image: undefined,
        image_url: '',
        extras: [],
        variations: [],
    });

    // Sincronización de datos con Tipado Estricto
    useEffect(() => {
        if (!open) return;

        if (product) {
            form.setData({
                name: product.name ?? '',
                description: product.description ?? '',
                price: String(product.price ?? ''),
                duration: String(product.duration ?? ''),
                category: String(product.category ?? ''),
                isActive: Boolean(product.isActive ?? true),
                image: undefined,
                image_url: product.image_url ?? '',
                extras: product.extras ?? [],
                variations: product.variations ?? [],
            });
        } else {
            form.reset();
            form.clearErrors();
        }
    }, [open, product]);

    const handleSubmit = () => {
        const isEdit = Boolean(product);
        const url = isEdit
            ? `/dashboard/business/${businessId}-null/services/${product?.id}`
            : `/dashboard/business/${businessId}-null/services`;

        if (isEdit) {
            form.transform((data) => ({
                ...data,
                // _method: 'PUT',
            }));
        }

        form.post(url, {
            forceFormData: true,
            onSuccess: () => {
                toast.success(
                    isEdit
                        ? 'Actualizado correctamente'
                        : 'Creado correctamente',
                );
                onClose();
                onSuccess();
                form.reset();
            },
        });
    };

    // Helper para renderizar errores de arrays
    const renderError = (key: string) => {
        const error = form.errors[key as keyof typeof form.errors];
        return error ? (
            <span className="ml-1 text-[10px] font-medium text-red-500">
                {error}
            </span>
        ) : null;
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl overflow-hidden rounded-lg border-none bg-gray-50 p-0 shadow-2xl">
                {/* Header */}
                <div className="border-b border-purple-100 bg-white px-6 py-4">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-700">
                                {product ? (
                                    <Sparkles size={20} />
                                ) : (
                                    <Plus size={20} />
                                )}
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-semibold text-purple-800">
                                    {product
                                        ? 'Editar Producto'
                                        : 'Nuevo Producto'}
                                </DialogTitle>
                                <p className="text-xs text-gray-500">
                                    Gestiona las propiedades y variantes de tu
                                    catálogo.
                                </p>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                <Tabs defaultValue="general" className="w-full">
                    <div className="border-b border-gray-100 bg-white px-6">
                        <TabsList className="flex justify-start gap-6 bg-transparent p-0">
                            <TabsTrigger
                                value="general"
                                className={STYLES.tabTrigger}
                            >
                                <div className="flex items-center gap-2">
                                    <Package size={12} /> General
                                </div>
                            </TabsTrigger>
                            <TabsTrigger
                                value="variations"
                                className={STYLES.tabTrigger}
                            >
                                <div className="flex items-center gap-2">
                                    <Layers size={12} /> Variaciones (
                                    {form.data.variations.length})
                                </div>
                            </TabsTrigger>
                            <TabsTrigger
                                value="extras"
                                className={STYLES.tabTrigger}
                            >
                                <div className="flex items-center gap-2">
                                    <Plus size={12} /> Extras (
                                    {form.data.extras.length})
                                </div>
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="max-h-[60vh] overflow-y-auto p-6">
                        {/* Tab: General */}
                        <TabsContent value="general" className="mt-0 space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <Label className={STYLES.label}>
                                            Categoría
                                        </Label>
                                        <Select
                                            value={
                                                form.data.category
                                                    ? String(form.data.category)
                                                    : undefined
                                            }
                                            onValueChange={(v) =>
                                                form.setData('category', v)
                                            }
                                        >
                                            <SelectTrigger
                                                className={STYLES.input}
                                            >
                                                <SelectValue placeholder="Selecciona tipo" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {productTypes.map((t) => (
                                                    <SelectItem
                                                        key={t.id}
                                                        value={String(t.id)}
                                                    >
                                                        {t.icon} {t.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {renderError('category')}
                                    </div>

                                    <div className="space-y-1">
                                        <Label className={STYLES.label}>
                                            Nombre del producto
                                        </Label>
                                        <Input
                                            value={form.data.name}
                                            onChange={(e) =>
                                                form.setData(
                                                    'name',
                                                    e.target.value,
                                                )
                                            }
                                            className={STYLES.input}
                                        />
                                        {renderError('name')}
                                    </div>

                                    <div className="space-y-1">
                                        <Label className={STYLES.label}>
                                            Precio base
                                        </Label>
                                        <Input
                                            type="number"
                                            value={form.data.price}
                                            onChange={(e) =>
                                                form.setData(
                                                    'price',
                                                    e.target.value,
                                                )
                                            }
                                            className={STYLES.input}
                                        />
                                        {renderError('price')}
                                    </div>
                                </div>

                                {/* Image Upload */}
                                <div
                                    onClick={() =>
                                        document
                                            .getElementById('image-upload')
                                            ?.click()
                                    }
                                    className="relative flex aspect-square cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-purple-200 bg-white transition hover:border-purple-400 active:scale-95"
                                >
                                    {form.data.image || form.data.image_url ? (
                                        <>
                                            <img
                                                src={
                                                    form.data.image
                                                        ? URL.createObjectURL(
                                                              form.data.image,
                                                          )
                                                        : form.data.image_url
                                                }
                                                className="h-full w-full object-cover p-2"
                                            />
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-3 right-3 h-7 w-7 rounded-full"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    form.setData({
                                                        ...form.data,
                                                        image: undefined,
                                                        image_url: '',
                                                    });
                                                }}
                                            >
                                                <Trash2 size={14} />
                                            </Button>
                                        </>
                                    ) : (
                                        <div className="text-center">
                                            <ImageIcon
                                                className="mx-auto mb-2 text-gray-300"
                                                size={32}
                                            />
                                            <span className="text-xs font-medium text-gray-400">
                                                Subir imagen
                                            </span>
                                        </div>
                                    )}
                                    <input
                                        id="image-upload"
                                        type="file"
                                        className="hidden"
                                        onChange={(e) =>
                                            form.setData(
                                                'image',
                                                e.target.files?.[0],
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label className={STYLES.label}>
                                    Descripción
                                </Label>
                                <Textarea
                                    value={form.data.description}
                                    onChange={(e) =>
                                        form.setData(
                                            'description',
                                            e.target.value,
                                        )
                                    }
                                    className={cn(
                                        STYLES.input,
                                        'min-h-[100px]',
                                        form.errors.description &&
                                            'border-red-500',
                                    )}
                                />
                                {renderError('description')}
                            </div>
                        </TabsContent>

                        {/* Tab: Variations */}
                        <TabsContent
                            value="variations"
                            className="mt-0 space-y-3"
                        >
                            {form.data.variations.map((v, i) => {
                                const hasErr =
                                    !!form.errors[
                                        `variations.${i}.name` as keyof typeof form.errors
                                    ];
                                return (
                                    <div key={i} className="space-y-1">
                                        <div
                                            className={cn(
                                                'flex items-center gap-2 rounded-lg border bg-white p-1 transition-all',
                                                hasErr
                                                    ? 'border-red-500 shadow-red-50'
                                                    : 'border-purple-100',
                                            )}
                                        >
                                            <Input
                                                value={v.name}
                                                placeholder="Ej: Tamaño Grande"
                                                className="border-none bg-transparent font-semibold text-purple-800 focus:ring-0"
                                                onChange={(e) => {
                                                    const arr = [
                                                        ...form.data.variations,
                                                    ];
                                                    arr[i].name =
                                                        e.target.value;
                                                    form.setData(
                                                        'variations',
                                                        arr,
                                                    );
                                                }}
                                            />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-gray-300 hover:text-red-500"
                                                onClick={() => {
                                                    const arr = [
                                                        ...form.data.variations,
                                                    ];
                                                    arr.splice(i, 1);
                                                    form.setData(
                                                        'variations',
                                                        arr,
                                                    );
                                                }}
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                        {renderError(`variations.${i}.name`)}
                                    </div>
                                );
                            })}
                            <Button
                                variant="outline"
                                className="w-full border-dashed border-purple-300 text-purple-600"
                                onClick={() =>
                                    form.setData('variations', [
                                        ...form.data.variations,
                                        { name: '' },
                                    ])
                                }
                            >
                                <Plus size={16} className="mr-2" /> Agregar
                                variación
                            </Button>
                        </TabsContent>

                        {/* Tab: Extras */}
                        <TabsContent value="extras" className="mt-0 space-y-3">
                            {form.data.extras.map((e, i) => (
                                <div
                                    key={i}
                                    className="grid grid-cols-[1fr_120px_auto] items-start gap-3 rounded-lg border border-purple-100 bg-white p-2 shadow-sm"
                                >
                                    <div className="space-y-1">
                                        <Input
                                            value={e.name}
                                            placeholder="Nombre extra"
                                            className="border-none bg-transparent font-semibold text-purple-800 focus:ring-0"
                                            onChange={(ev) => {
                                                const arr = [
                                                    ...form.data.extras,
                                                ];
                                                arr[i].name = ev.target.value;
                                                form.setData('extras', arr);
                                            }}
                                        />
                                        {renderError(`extras.${i}.name`)}
                                    </div>
                                    <div className="space-y-1">
                                        <Input
                                            type="number"
                                            value={e.price}
                                            className="h-8 border-purple-100 bg-purple-50/50 font-mono text-xs"
                                            onChange={(ev) => {
                                                const arr = [
                                                    ...form.data.extras,
                                                ];
                                                arr[i].price = Number(
                                                    ev.target.value,
                                                );
                                                form.setData('extras', arr);
                                            }}
                                        />
                                        {renderError(`extras.${i}.price`)}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-gray-300 hover:text-red-500"
                                        onClick={() => {
                                            const arr = [...form.data.extras];
                                            arr.splice(i, 1);
                                            form.setData('extras', arr);
                                        }}
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            ))}
                            <Button
                                variant="outline"
                                className="w-full border-dashed border-purple-300 text-purple-600"
                                onClick={() =>
                                    form.setData('extras', [
                                        ...form.data.extras,
                                        { name: '', price: 0 },
                                    ])
                                }
                            >
                                <Plus size={16} className="mr-2" /> Agregar
                                extra
                            </Button>
                        </TabsContent>
                    </div>
                </Tabs>

                {/* Footer */}
                <div className="flex justify-end gap-3 border-t border-purple-100 bg-white px-6 py-4">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="text-gray-500"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={form.processing}
                        className="bg-purple-600 px-6 font-semibold text-white hover:bg-purple-700 active:scale-95 disabled:opacity-50"
                    >
                        {form.processing ? (
                            <LoaderCircle className="animate-spin" size={18} />
                        ) : (
                            <>
                                <Save className="mr-2" size={18} /> Guardar
                                cambios
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
