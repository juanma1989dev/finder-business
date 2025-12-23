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

interface Props {
    open: boolean;
    onClose: () => void;
    businessId: string;
    service: ServicesAndProducts | null;
    onSuccess: () => void;
    productTypes: ProductsTypes[];
}

type ProductForm = {
    name: string;
    description: string;
    price: number;
    duration: string;
    category: number | undefined;
    isActive: boolean;
    image: File | undefined;
    image_url: string;
    extras: ProductExtras[];
    variations: ProductVariations[];
};

export default function ProductServiceModal({
    open,
    onClose,
    businessId,
    service,
    onSuccess,
    productTypes,
}: Props) {
    const form = useForm<ProductForm>({
        name: '',
        description: '',
        price: 0,
        duration: '',
        category: undefined,
        isActive: true,
        image: undefined,
        image_url: '',
        extras: [],
        variations: [],
    });

    useEffect(() => {
        if (!open) return;

        if (service) {
            form.setData({
                name: service.name ?? '',
                description: service.description ?? '',
                price: service.price ?? 0,
                duration: service.duration ?? '',
                category: service.category ?? undefined,
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
            data: isEdit ? { ...form.data, _method: 'PUT' } : form.data,
            onSuccess: () => {
                toast.success(
                    isEdit
                        ? 'Actualizado correctamente'
                        : 'Creado correctamente',
                );
                onClose();
                onSuccess();
            },
        } as any);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl overflow-hidden rounded-[2rem] border-none bg-gray-50 p-0 shadow-2xl">
                <div className="bg-white px-4 py-4">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                                {service ? <Sparkles /> : <Plus />}
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-black text-gray-900">
                                    {service
                                        ? 'Editar Producto'
                                        : 'Nuevo Producto'}
                                </DialogTitle>
                                <p className="text-sm font-medium text-gray-500">
                                    Configura los detalles de tu producto
                                </p>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                <Tabs defaultValue="general">
                    {/* TABS */}
                    <div className="bg-white px-6">
                        <TabsList className="flex gap-8 bg-transparent p-0">
                            {[
                                {
                                    id: 'general',
                                    label: 'General',
                                    icon: Package,
                                },
                                {
                                    id: 'variations',
                                    label: 'Variaciones',
                                    icon: Layers,
                                },
                                { id: 'extras', label: 'Extras', icon: Plus },
                            ].map((tab) => (
                                <TabsTrigger
                                    key={tab.id}
                                    value={tab.id}
                                    className="flex items-center gap-2 border-b-2 border-transparent px-1 pb-4 text-sm font-bold text-gray-400 data-[state=active]:border-orange-500 data-[state=active]:text-orange-600"
                                >
                                    <tab.icon size={16} />
                                    {tab.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>

                    <div className="max-h-[60vh] overflow-y-auto px-6 py-6">
                        <TabsContent value="general" className="space-y-8">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-3">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black tracking-widest text-gray-400 uppercase">
                                            Categoria
                                        </Label>
                                        <Select
                                            value={
                                                form.data.category !== undefined
                                                    ? String(form.data.category)
                                                    : undefined
                                            }
                                            onValueChange={(value) =>
                                                form.setData(
                                                    'category',
                                                    Number(value),
                                                )
                                            }
                                        >
                                            <SelectTrigger className="h-10 rounded-xl">
                                                <SelectValue placeholder="Selecciona tipo" />
                                            </SelectTrigger>

                                            <SelectContent>
                                                {productTypes.map((type) => (
                                                    <SelectItem
                                                        key={type.id}
                                                        value={String(type.id)}
                                                    >
                                                        {`${type.icon} ${type.name}`}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {form.errors.category && (
                                            <span className="mt-1 text-xs text-red-500 animate-in fade-in">
                                                {form.errors.category}
                                            </span>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs font-black tracking-widest text-gray-400 uppercase">
                                            Nombre
                                        </Label>
                                        <Input
                                            value={form.data.name}
                                            onChange={(e) =>
                                                form.setData(
                                                    'name',
                                                    e.target.value,
                                                )
                                            }
                                            className="rounded-xl border-gray-200"
                                        />
                                        {form.errors.name && (
                                            <span className="mt-1 text-xs text-red-500 animate-in fade-in">
                                                {form.errors.name}
                                            </span>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs font-black tracking-widest text-gray-400 uppercase">
                                            Precio
                                        </Label>
                                        <Input
                                            type="number"
                                            value={form.data.price}
                                            onChange={(e) =>
                                                form.setData(
                                                    'price',
                                                    Number(e.target.value),
                                                )
                                            }
                                            className="rounded-xl border-gray-200"
                                        />
                                        {form.errors.price && (
                                            <span className="mt-1 text-xs text-red-500 animate-in fade-in">
                                                {form.errors.price}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div
                                    onClick={() =>
                                        document
                                            .getElementById('image-upload')
                                            ?.click()
                                    }
                                    className="relative flex min-h-[180px] cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white"
                                >
                                    {/* {form.data.image &&  form.data.image_url && (
                                        <Trash2
                                            className="absolute top-3 right-3 z-50 h-8 w-8 rounded-full bg-white p-2 text-red-500"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                form.setData(
                                                    'image',
                                                    undefined,
                                                );
                                                form.setData('image_url', '');
                                            }}
                                        />
                                    )} */}

                                    {form.data.image || form.data.image_url ? (
                                        <img
                                            src={
                                                form.data.image
                                                    ? URL.createObjectURL(
                                                          form.data.image,
                                                      )
                                                    : form.data.image_url
                                            }
                                            className="h-full w-full rounded-xl object-cover p-2"
                                        />
                                    ) : (
                                        <ImageIcon className="text-gray-400" />
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
                                    {form.errors.image && (
                                        <span className="mt-1 text-xs text-red-500 animate-in fade-in">
                                            {form.errors.image}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-xs font-black tracking-widest text-gray-400 uppercase">
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
                                        'rounded-xl border-gray-200',
                                        form.errors.description &&
                                            'border-red-500 focus:ring-red-500',
                                    )}
                                />
                                {form.errors.description && (
                                    <span className="mt-1 text-xs text-red-500 animate-in fade-in">
                                        {form.errors.description}
                                    </span>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="variations" className="space-y-4">
                            {form.data.variations.map((v, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm"
                                >
                                    <Input
                                        value={v.name}
                                        className="border-none font-bold"
                                        onChange={(e) => {
                                            const arr = [
                                                ...form.data.variations,
                                            ];
                                            arr[i].name = e.target.value;
                                            form.setData('variations', arr);
                                        }}
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-400"
                                        onClick={() => {
                                            const arr = [
                                                ...form.data.variations,
                                            ];
                                            arr.splice(i, 1);
                                            form.setData('variations', arr);
                                        }}
                                    >
                                        <Trash2 size={18} />
                                    </Button>
                                </div>
                            ))}

                            <Button
                                className="h-12 w-full rounded-2xl bg-orange-600 font-bold text-white hover:bg-orange-700"
                                onClick={() =>
                                    form.setData('variations', [
                                        ...form.data.variations,
                                        { name: '' },
                                    ])
                                }
                            >
                                <Plus size={18} className="mr-2" />
                                Agregar variación
                            </Button>
                        </TabsContent>

                        {/* EXTRAS */}
                        <TabsContent value="extras" className="space-y-4">
                            {form.data.extras.map((e, i) => (
                                <div
                                    key={i}
                                    className="grid grid-cols-[1fr_120px_auto] items-center gap-4 rounded-2xl bg-white p-3 shadow-sm"
                                >
                                    <Input
                                        value={e.name}
                                        className="border-none font-bold"
                                        onChange={(ev) => {
                                            const arr = [...form.data.extras];
                                            arr[i].name = ev.target.value;
                                            form.setData('extras', arr);
                                        }}
                                    />
                                    <Input
                                        type="number"
                                        value={e.price}
                                        onChange={(ev) => {
                                            const arr = [...form.data.extras];
                                            arr[i].price = Number(
                                                ev.target.value,
                                            );
                                            form.setData('extras', arr);
                                        }}
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-400"
                                        onClick={() => {
                                            const arr = [...form.data.extras];
                                            arr.splice(i, 1);
                                            form.setData('extras', arr);
                                        }}
                                    >
                                        <Trash2 size={18} />
                                    </Button>
                                </div>
                            ))}

                            <Button
                                className="h-12 w-full rounded-2xl bg-orange-600 font-bold text-white hover:bg-orange-700"
                                onClick={() =>
                                    form.setData('extras', [
                                        ...form.data.extras,
                                        { name: '', price: 0 },
                                    ])
                                }
                            >
                                <Plus size={18} className="mr-2" />
                                Agregar extra
                            </Button>
                        </TabsContent>
                    </div>
                </Tabs>

                {/* FOOTER */}
                <div className="flex justify-end border-t bg-white px-4 py-3">
                    <Button
                        onClick={handleSubmit}
                        disabled={form.processing}
                        className="rounded-xl bg-orange-600 px-4 font-black text-white hover:bg-orange-700"
                    >
                        {form.processing ? (
                            <LoaderCircle className="animate-spin" />
                        ) : (
                            <Save className="mr-2" size={18} />
                        )}
                        Guardar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
