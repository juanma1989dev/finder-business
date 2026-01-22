import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { getMetaValue } from '@/helpers';
import { Business, SharedData, type NavItem } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import {
    BookOpenText,
    Camera,
    Globe,
    Home,
    Image as ImageIcon,
    LoaderCircle,
    MapPin,
    ShoppingBag,
} from 'lucide-react';
import { useMemo, useRef, useState } from 'react';

export function AppSidebar() {
    const { open } = useSidebar();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadingCover, setUploadingCover] = useState(false);

    const { props } = usePage<SharedData>();
    const business = getMetaValue<Business>(props, 'business');

    // Optimizamos la obtención de la imagen con useMemo
    const imgSrc = useMemo(() => {
        if (!business) return '/images/default.png';
        if (business.cover_image) return `/storage/${business.cover_image}`;
        return `/images/${business.category?.image ?? 'default.png'}`;
    }, [business]);

    const deliveryNavItems: NavItem[] = useMemo(
        () =>
            props.auth.user.type === 'repartidor'
                ? [
                      {
                          title: 'Dashboard',
                          href: `/delivery`,
                          icon: Home,
                      },
                  ]
                : [],
        [props.auth.user.type],
    );

    // Items de navegación centralizados
    const mainNavItems: NavItem[] = useMemo(
        () =>
            business
                ? [
                      {
                          title: 'Información general',
                          href: `/dashboard/business/${business.id}/info-general`,
                          icon: BookOpenText,
                      },
                      {
                          title: 'Ubicación',
                          href: `/dashboard/business/${business.id}/location`,
                          icon: MapPin,
                      },
                      {
                          title: 'Productos',
                          href: `/dashboard/business/${business.id}/services`,
                          icon: ShoppingBag,
                      },
                      {
                          title: 'Galería',
                          href: `/dashboard/business/${business.id}/gallery`,
                          icon: ImageIcon,
                      },
                      {
                          title: 'Redes sociales',
                          href: `/dashboard/business/${business.id}/social-networks`,
                          icon: Globe,
                      },
                  ]
                : [],
        [business],
    );

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !business) return;

        router.post(
            `/dashboard/business/update-cover-image/${business.id}`,
            { cover_image: file },
            {
                multipart: true,
                preserveScroll: true,
                onStart: () => setUploadingCover(true),
                onFinish: () => setUploadingCover(false),
            } as any,
        );
    };

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader className="pt-4">
                <SidebarMenu>
                    <SidebarMenuItem className="flex flex-col items-center gap-4">
                        {/* Botón Volver / Home */}
                        <Link
                            href="/dashboard/business"
                            className="flex w-full items-center gap-2 px-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                        >
                            <Home className="h-4 w-4" />
                            {open && <span>Mis negocios</span>}
                        </Link>

                        {/* Contenedor de Avatar/Negocio */}
                        <div className="group relative">
                            <TooltipProvider delayDuration={200}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div
                                            className={`relative overflow-hidden rounded-full border-2 border-background bg-muted shadow-md transition-all duration-300 ${
                                                open ? 'h-24 w-24' : 'h-10 w-10'
                                            }`}
                                        >
                                            <img
                                                src={imgSrc}
                                                alt={business?.name}
                                                className="h-full w-full object-cover"
                                            />

                                            {/* Overlay de Carga/Subida (Solo cuando está abierto) */}
                                            {open && (
                                                <button
                                                    onClick={() =>
                                                        fileInputRef.current?.click()
                                                    }
                                                    disabled={uploadingCover}
                                                    className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-100"
                                                >
                                                    {uploadingCover ? (
                                                        <LoaderCircle className="h-6 w-6 animate-spin text-white" />
                                                    ) : (
                                                        <>
                                                            <Camera className="h-6 w-6 text-white" />
                                                            <span className="text-[10px] font-medium text-white">
                                                                Cambiar
                                                            </span>
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </TooltipTrigger>
                                    {!open && (
                                        <TooltipContent
                                            side="right"
                                            className="font-semibold"
                                        >
                                            {business?.name}
                                        </TooltipContent>
                                    )}
                                </Tooltip>
                            </TooltipProvider>

                            {/* Input oculto */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>

                        {/* Título del Negocio */}
                        {open && (
                            <div className="text-center">
                                <h5 className="truncate px-2 text-sm font-bold tracking-tight text-foreground">
                                    {business?.name}
                                </h5>
                                <p className="text-[10px] tracking-widest text-muted-foreground uppercase">
                                    {business?.category?.name || 'Negocio'}
                                </p>
                            </div>
                        )}
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <NavMain items={deliveryNavItems} />
                    <NavMain items={mainNavItems} />
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
