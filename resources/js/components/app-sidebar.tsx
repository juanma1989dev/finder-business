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
    CloudUpload,
    Globe,
    Home,
    Image,
    LoaderCircle,
    MapPin,
    ShoppingBag,
} from 'lucide-react';
import { useRef, useState } from 'react';

const getImgSrc = function (business: Business | undefined): string {
    if (!business) return '/images/default.png';
    if (business.cover_image) return `/storage/${business.cover_image}`;
    return `/images/${business.category?.image ?? 'default.png'}`;
};

export function AppSidebar() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { open } = useSidebar();
    const [uploadingCover, setUploadingCover] = useState<boolean>(false);

    const props = usePage<SharedData>().props;

    const business = getMetaValue<Business>(props, 'business');

    const handleClickChangeCoverImage = () => {
        fileInputRef.current?.click();
    };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        router.post(
            `/dashboard/business/update-cover-image/${business?.id}`,
            { cover_image: file },
            {
                multipart: true,
                forceFormData: true,
                preserveScroll: true,
                onStart: () => {
                    setUploadingCover(true);
                },
                onFinish: () => {
                    setUploadingCover(false);
                },
            } as any,
        );
    };

    const imgSrc = getImgSrc(business);

    const mainNavItems: NavItem[] = business
        ? [
              {
                  title: 'Información general',
                  href: `/dashboard/business/${business?.id}/info-general`,
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
                  icon: Image,
              },
              {
                  title: 'Redes sociales',
                  href: `/dashboard/business/${business.id}/social-networks`,
                  icon: Globe,
              },
          ]
        : [];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <Link
                            href="/dashboard/business"
                            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                        >
                            <Home className="h-4 w-4" />
                            {open && <span>Mis negocios</span>}
                        </Link>

                        {/* Imagen del negocio */}
                        <div className="mt-4 flex flex-col items-center">
                            <TooltipProvider delayDuration={200}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <img
                                            src={imgSrc}
                                            alt={business?.name}
                                            className={`rounded-full object-cover shadow transition-all duration-300 ${
                                                open ? 'h-24 w-24' : 'h-10 w-10'
                                            }`}
                                        />
                                    </TooltipTrigger>
                                    {!open && (
                                        <TooltipContent side="right">
                                            {business?.name}
                                        </TooltipContent>
                                    )}
                                </Tooltip>
                            </TooltipProvider>

                            {open && (
                                <>
                                    <h5 className="mt-2 mb-1 text-center text-sm font-medium text-foreground">
                                        {business?.name}
                                    </h5>

                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept="image/*"
                                    />

                                    <button
                                        onClick={handleClickChangeCoverImage}
                                        disabled={uploadingCover}
                                        className="mt-1 flex items-center gap-1 rounded-md bg-orange-600 px-3 py-1 text-xs text-white transition-all hover:bg-orange-700 disabled:opacity-50"
                                    >
                                        {uploadingCover ? (
                                            <LoaderCircle className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <CloudUpload className="h-4 w-4" />
                                        )}
                                    </button>
                                </>
                            )}
                        </div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <NavMain items={mainNavItems} />
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
