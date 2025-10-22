import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Business, SocialLinks } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import {
    Facebook,
    Globe,
    Instagram,
    Loader2,
    Save,
    Twitter,
    Youtube,
} from 'lucide-react';
import { toast } from 'react-toastify';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard - Nuevo negocio',
        // href: dashboard().url,
        href: '',
    },
];

interface Props {
    business: Business;
}

export default function SocialNetworks({ business }: Props) {
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
        ...(business.social_networks ?? []),
    });

    const handleSocialChange = (platform: keyof SocialLinks, value: string) => {
        setData(platform, value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        post(`/dashboard/business/${business.id}/social-networks`, {
            onSuccess: ({ props }) => {
                const flashData = props?.flash as
                    | { success?: string }
                    | undefined;
                const success = flashData?.success;
                if (success) toast.success(success);
            },
            onError: (errors) => console.error(errors),
        });
    };

    const socialPlatforms = [
        {
            key: 'web' as const,
            label: 'Website',
            icon: Globe,
            placeholder: 'https://yourwebsite.com',
        },
        {
            key: 'facebook' as const,
            label: 'Facebook',
            icon: Facebook,
            placeholder: 'https://facebook.com/yourpage',
        },
        {
            key: 'instagram' as const,
            label: 'Instagram',
            icon: Instagram,
            placeholder: 'https://instagram.com/youraccount',
        },
        {
            key: 'twitter' as const,
            label: 'Twitter/X',
            icon: Twitter,
            placeholder: 'https://twitter.com/youraccount',
        },
        {
            key: 'youtube' as const,
            label: 'YouTube',
            icon: Youtube,
            placeholder: 'https://youtube.com/@yourchannel',
        },
        {
            key: 'tiktok' as const,
            label: 'TikTok',
            icon: Globe,
            placeholder: 'https://tiktok.com/@youraccount',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard - Nuevo negocio" />
            <div className="m-3 space-y-6 p-3">
                {/* Redes sociales */}
                <Card className="relative">
                    <CardHeader>
                        <CardTitle>Redes sociales</CardTitle>
                        <CardDescription>
                            Conecta tus perfiles de redes sociales
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="absolute top-0 right-2 flex justify-end border-t pt-4">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="cursor-pointer bg-orange-600 hover:bg-orange-700"
                                    title="Guardar"
                                >
                                    {processing ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Save className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                {socialPlatforms.map(
                                    ({
                                        key,
                                        label,
                                        icon: Icon,
                                        placeholder,
                                    }) => (
                                        <div key={key} className="space-y-2">
                                            <Label
                                                htmlFor={key}
                                                className="flex items-center gap-2"
                                            >
                                                <Icon className="h-4 w-4 text-orange-600" />
                                                {label}
                                            </Label>
                                            <Input
                                                id={key}
                                                type="url"
                                                value={data[key] || ''}
                                                onChange={(e) =>
                                                    handleSocialChange(
                                                        key,
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder={placeholder}
                                            />
                                        </div>
                                    ),
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
