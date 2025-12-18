import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { makeBreadCrumb } from '@/helpers';
import { Business, SocialLinks } from '@/types';
import { useForm } from '@inertiajs/react';
import {
    Facebook,
    Globe,
    Instagram,
    Link2,
    Music2,
    Share2,
    Twitter,
    Youtube,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { LayoutBusinessModules } from './LayoutBusinessModules';

interface Props {
    business: Business;
}

export default function SocialNetworks({ business }: Props) {
    const breadcrumbs = makeBreadCrumb({
        text: `${business.name ?? ''} - Redes Sociales`,
        url: '/',
    });

    const initialSocialLinks: SocialLinks = {
        web: '',
        facebook: '',
        instagram: '',
        twitter: '',
        linkedin: '',
        youtube: '',
        tiktok: '',
    };

    const { data, post, processing, setData } = useForm({
        ...initialSocialLinks,
        ...(business.social_networks ?? {}),
    });

    const handleSubmit = () => {
        post(`/dashboard/business/${business.id}/social-networks`, {
            preserveScroll: true,
            onSuccess: () =>
                toast.success('Enlaces actualizados correctamente'),
        });
    };

    const socialPlatforms = [
        {
            key: 'web',
            label: 'Sitio Web',
            icon: Globe,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
        },
        {
            key: 'facebook',
            label: 'Facebook',
            icon: Facebook,
            color: 'text-[#1877F2]',
            bg: 'bg-[#1877F2]/10',
        },
        {
            key: 'instagram',
            label: 'Instagram',
            icon: Instagram,
            color: 'text-[#E4405F]',
            bg: 'bg-[#E4405F]/10',
        },
        {
            key: 'twitter',
            label: 'Twitter / X',
            icon: Twitter,
            color: 'text-zinc-900',
            bg: 'bg-zinc-100',
        },
        {
            key: 'youtube',
            label: 'YouTube',
            icon: Youtube,
            color: 'text-[#FF0000]',
            bg: 'bg-[#FF0000]/10',
        },
        {
            key: 'tiktok',
            label: 'TikTok',
            icon: Music2,
            color: 'text-zinc-800',
            bg: 'bg-zinc-100',
        },
    ] as const;

    return (
        <LayoutBusinessModules
            titleHead="Redes Sociales"
            headerTitle="Presencia Digital"
            headerDescription="Gestiona los enlaces a tus redes sociales y sitio web oficial."
            buttonText="Guardar Enlaces"
            icon={Share2}
            onSubmit={handleSubmit}
            processing={processing}
            breadcrumbs={breadcrumbs}
        >
            {/* Contenedor Principal: Ocupa las 12 columnas del Grid del Layout */}
            <div className="space-y-6 lg:col-span-12">
                {/* Formulario en Grid */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                >
                    {socialPlatforms.map(
                        ({ key, label, icon: Icon, color, bg }) => (
                            <Card
                                key={key}
                                className="group relative overflow-hidden rounded-2xl border-slate-100 bg-white p-4 shadow-none transition-all duration-200 hover:border-orange-200 hover:shadow-md hover:shadow-orange-500/5"
                            >
                                <div className="flex items-center gap-4">
                                    {/* Icono de Plataforma */}
                                    <div
                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110 ${bg} ${color}`}
                                    >
                                        <Icon size={20} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="mb-1 flex items-center justify-between">
                                            <Label
                                                htmlFor={key}
                                                className="text-[10px] font-bold tracking-widest text-slate-400 uppercase"
                                            >
                                                {label}
                                            </Label>
                                            {data[key as keyof SocialLinks] && (
                                                <div className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[9px] font-bold text-green-600">
                                                    <Link2 size={10} />
                                                    Activo
                                                </div>
                                            )}
                                        </div>
                                        <Input
                                            id={key}
                                            type="url"
                                            value={
                                                data[
                                                    key as keyof SocialLinks
                                                ] || ''
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    key as keyof SocialLinks,
                                                    e.target.value,
                                                )
                                            }
                                            placeholder={`https://${key}.com/...`}
                                            className="h-8 border-none bg-transparent px-0 text-xs font-semibold text-slate-700 shadow-none placeholder:text-slate-300 focus-visible:ring-0"
                                        />
                                        <div className="h-[1.5px] w-full bg-slate-100 transition-colors group-focus-within:bg-orange-400" />
                                    </div>
                                </div>
                            </Card>
                        ),
                    )}
                </form>

                {/* Info Box Discreta */}
                <div className="flex items-start gap-3 rounded-2xl border border-blue-50 bg-blue-50/30 p-4">
                    <div className="mt-0.5 rounded-full bg-blue-100 p-1 text-blue-600">
                        <Globe size={14} />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-blue-900">
                            Validación de enlaces
                        </h4>
                        <p className="mt-1 text-[11px] leading-relaxed text-blue-700/70">
                            Asegúrate de incluir el protocolo{' '}
                            <strong>https://</strong> al inicio de cada URL.
                            Esto permite que los iconos de tu perfil público
                            dirijan correctamente a tus clientes.
                        </p>
                    </div>
                </div>
            </div>
        </LayoutBusinessModules>
    );
}
