import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BreadcrumbItem, GalleryImage } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { ImageIcon, Loader2, Save, Trash2, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard - Nuevo negocio',
        // href: dashboard().url,
        href: '',
    },
];

interface Props {
    business: any;
}

export default function Gallery({ business }: Props) {
    const [images, setImages] = useState<GalleryImage[]>(() =>
        business.images.map((img: GalleryImage, index: number) => ({
            ...img,
            id: img.id || `existing-${index}-${Date.now()}`,
        })),
    );

    const [uploading, setUploading] = useState<boolean>(false);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newImages: GalleryImage[] = Array.from(files).map((file, i) => ({
            id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${i}`,
            file,
            url: URL.createObjectURL(file),
            is_primary: images.length === 0 && i === 0,
        }));

        setImages((prev) => [...prev, ...newImages]);
    };

    const handleRemoveImage = (idToRemove: string) => {
        setImages((prev) => {
            const img = prev.find((i) => i.id === idToRemove);
            if (img?.url.startsWith('blob:')) {
                URL.revokeObjectURL(img.url);
            }

            const filtered = prev.filter((i) => i.id !== idToRemove);
            return filtered;
        });
    };

    const handleSetPrimary = (id: string) => {
        setImages((prev) =>
            prev.map((img) => ({ ...img, is_primary: img.id === id })),
        );
    };

    const formGallery = useForm({
        images: [] as GalleryImage[],
    });

    useEffect(() => {
        formGallery.setData('images', images);
    }, [images]);

    const handleSaveGallery = async () => {
        formGallery.setData('images', images);

        await new Promise((resolve) => setTimeout(resolve, 0));

        formGallery.post(`/dashboard/business/${business.id}/gallery`, {
            forceFormData: true, // necesario para subir archivos
            onSuccess: () => {
                toast.success('Galería sincronizada correctamente');
            },
            onError: (errors) => console.error(errors),
        });
    };

    const [hasChanges, setHasChanges] = useState<boolean>(false);

    useEffect(() => {
        setHasChanges(true);
    }, [images]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard - Nuevo negocio" />
            <Card className="relative m-2">
                <CardHeader>
                    <CardTitle>Galeria</CardTitle>
                    <CardDescription>
                        Administra las fotos de tu negocio
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between border-t pt-4">
                        <p className="text-sm text-muted-foreground">
                            {images.length === 0
                                ? 'No hay imágenes'
                                : `Imágenes cargadas : ${images.length}`}
                        </p>

                        {hasChanges && (
                            <Button
                                className="absolute top-3 right-3 cursor-pointer bg-orange-600 hover:bg-orange-700"
                                onClick={handleSaveGallery}
                                disabled={uploading || !hasChanges}
                            >
                                {uploading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}
                                Guardar
                            </Button>
                        )}
                    </div>

                    {/* Upload Section */}
                    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 transition-colors hover:border-muted-foreground/50">
                        <input
                            type="file"
                            id="gallery-upload"
                            multiple
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                            disabled={uploading}
                        />
                        <label
                            htmlFor="gallery-upload"
                            className={cn(
                                'flex cursor-pointer flex-col items-center gap-2',
                                uploading && 'pointer-events-none opacity-50',
                            )}
                        >
                            {uploading ? (
                                <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
                            ) : (
                                <Upload className="h-12 w-12 text-muted-foreground" />
                            )}
                            <div className="text-center">
                                <p className="text-sm font-medium">
                                    {uploading
                                        ? 'Subiendo imagenes...'
                                        : 'Click para subir imagenes'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    PNG, JPG, GIF hasta 10MB cada uno
                                </p>
                            </div>
                        </label>
                    </div>

                    {/* Gallery Grid */}
                    {images.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                            {images.map((image) => (
                                <div
                                    key={image.id}
                                    className="group relative overflow-hidden rounded-lg border bg-card"
                                >
                                    <div className="aspect-square overflow-hidden">
                                        <img
                                            src={
                                                image.url.startsWith('blob:')
                                                    ? image.url // blob temporal (preview)
                                                    : image.url.startsWith(
                                                            'http',
                                                        )
                                                      ? image.url // URL completa
                                                      : `/storage/${image.url}` // imagen guardada
                                            }
                                            alt={`${business.name}-${image.id ?? 'new'}`}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    {/* Overlay with actions */}
                                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                                        {!image.is_primary && (
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={() =>
                                                    handleSetPrimary(image.id)
                                                }
                                                disabled={image.is_primary}
                                                className="cursor-pointer"
                                            >
                                                Principal
                                            </Button>
                                        )}
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() =>
                                                handleRemoveImage(image.id)
                                            }
                                            className="cursor-pointer"
                                        >
                                            <Trash2 className="h-4 w-4"></Trash2>
                                        </Button>
                                    </div>

                                    {/* Primary badge */}
                                    {image.is_primary && (
                                        <div className="absolute top-2 left-2 rounded-full bg-orange-600 px-2 py-1 text-xs font-semibold text-white">
                                            Principal
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <ImageIcon className="mb-4 h-16 w-16 text-muted-foreground/50" />
                            <p className="text-sm font-medium text-muted-foreground">
                                Aún no tienes imagenes cargadas
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </AppLayout>
    );
}
