import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface FlashData {
    success?: string;
    error?: string;
    info?: string;
    code?: string;
    meta?: Record<string, unknown>;
}

export interface SharedData {
    name: string;
    auth: Auth;
    sidebarOpen: boolean;
    flash?: FlashData;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

/**************************/

export interface ServicesAndProducts {
    id?: string;
    business_id: string;
    name: string;
    description: string;
    price: number;
    duration?: string;
    category: string;
    isActive: boolean;
    image_url: string;
}

interface SocialLinks {
    web?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
    tiktok?: string;
}

export interface Amenites {
    id?: string;
    name: string;
    icon: string;
}

export interface Payments {
    id?: string;
    name: string;
    icon: string;
}

export interface Schedules {
    close?: string;
    open?: string;
    day: number;
    isOpen: boolean;
    label: string;
}

export interface GalleryImage {
    id: string;
    url: string;
    file?: File;
    is_primary: boolean;
}

export interface BusinessCategories {
    id: string;
    name: string;
    image: string;
}

export interface Business {
    id?: string;
    name: string;
    phone: string;
    location?: string;
    use_whatsapp: boolean;
    description: string;
    long_description: string;
    id_category: string | number;
    address: string;
    tags: string[];
    cover_image?: string;
    social_networks?: SocialLinks;
    category?: BusinessCategories;
    amenities: Amenites[];
    payments: Payments[];
    schedules: Schedules[];
    images?: GalleryImage[];
    products?: ServicesAndProducts[];
    cords?: {
        type: 'Point';
        coordinates: [number, number];
    };
}
