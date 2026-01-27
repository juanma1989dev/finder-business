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
    LayoutDashboard,
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
                          title: 'Dashboard Entrega',
                          href: `/delivery`,
                          icon: Home,
                      },
                  ]
                : [],
        [props.auth.user.type],
    );

    const mainNavItems: NavItem[] = useMemo(
        () =>
            business
                ? [
                      {
                          title: 'Panel de Control',
                          href: `/dashboard/business/${business.id}-${business.slug}/home`,
                          icon: LayoutDashboard,
                      },
                      {
                          title: 'Información general',
                          href: `/dashboard/business/${business.id}-${business.slug}/info-general`,
                          icon: BookOpenText,
                      },
                      {
                          title: 'Ubicación',
                          href: `/dashboard/business/${business.id}-${business.slug}/location`,
                          icon: MapPin,
                      },
                      {
                          title: 'Productos',
                          href: `/dashboard/business/${business.id}-${business.slug}/services`,
                          icon: ShoppingBag,
                      },
                      {
                          title: 'Galería',
                          href: `/dashboard/business/${business.id}-${business.slug}/gallery`,
                          icon: ImageIcon,
                      },
                      {
                          title: 'Redes sociales',
                          href: `/dashboard/business/${business.id}-${business.slug}/social-networks`,
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
        <Sidebar
            collapsible="icon"
            variant="inset"
            className="border-purple-100 bg-white"
        >
            <SidebarHeader className="pt-6">
                <SidebarMenu>
                    <SidebarMenuItem className="flex flex-col items-center gap-4">
                        <Link
                            href="/dashboard/business"
                            className="mb-2 flex w-full items-center justify-center gap-2 px-2 text-lg font-semibold tracking-widest text-gray-500 uppercase transition-colors hover:text-purple-600 active:scale-95"
                        >
                            <Home className="h-5 w-5 text-purple-600" />
                            {open && <span>Mis negocios</span>}
                        </Link>

                        <div className="group relative">
                            <TooltipProvider delayDuration={200}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div
                                            className={`relative overflow-hidden rounded-lg border-2 border-purple-50 bg-purple-50 shadow-sm transition-all duration-300 ${
                                                open ? 'h-24 w-24' : 'h-10 w-10'
                                            }`}
                                        >
                                            <img
                                                src={imgSrc}
                                                alt={business?.name}
                                                className="h-full w-full object-cover"
                                            />

                                            {open && (
                                                <button
                                                    onClick={() =>
                                                        fileInputRef.current?.click()
                                                    }
                                                    disabled={uploadingCover}
                                                    className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-purple-900/60 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 disabled:opacity-100"
                                                >
                                                    {uploadingCover ? (
                                                        <LoaderCircle className="h-6 w-6 animate-spin text-white" />
                                                    ) : (
                                                        <>
                                                            <Camera className="h-6 w-6 text-white" />
                                                            <span className="mt-1 text-[10px] font-semibold text-white uppercase">
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
                                            className="border-none bg-purple-900 font-semibold text-white"
                                        >
                                            {business?.name}
                                        </TooltipContent>
                                    )}
                                </Tooltip>
                            </TooltipProvider>

                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>

                        {open && (
                            <div className="space-y-1 text-center">
                                <h5 className="truncate px-2 text-sm leading-tight font-semibold text-purple-800">
                                    {business?.name}
                                </h5>
                                <p className="text-[10px] font-normal tracking-widest text-gray-500 uppercase">
                                    {business?.category?.name || 'Negocio'}
                                </p>
                            </div>
                        )}
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="px-2">
                <SidebarGroup>
                    <NavMain items={deliveryNavItems} />
                    <div className="my-2 border-t border-purple-50" />
                    <NavMain items={mainNavItems} />
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-purple-50 p-4">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
