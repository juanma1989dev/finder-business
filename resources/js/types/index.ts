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
    cart: Record<string, CartItem>;
    [key: string]: unknown;
}

export enum TypeUser {
    CLIENT = 'client',
    BUSINESS = 'business',
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    type: TypeUser;
    is_available: boolean;

    // email_verified_at: string | null;
    // two_factor_enabled?: boolean;
    [key: string]: unknown;
}

/**************************/

export interface ProductsTypes {
    id?: number;
    name: string;
    icon: string;
}

export interface ProductExtras {
    id?: string;
    business_product_id?: string;
    name: string;
    price: number;
}

export interface ProductVariations {
    id?: string;
    business_product_id?: string;
    name: string;
    // options: string[]; // e.g., ["Small", "Medium", "Large"]
}

export interface ServicesAndProducts {
    id?: string;
    businesses_id: string;
    name: string;
    description: string;
    price: number;
    duration?: string;
    category: number;
    isActive: boolean;
    image_url: string;
    extras?: ProductExtras[];
    variations?: ProductVariations[];
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
    slug: string;
    phone: string;
    location?: string;
    use_whatsapp: boolean;
    slogan: string;
    description: string;
    category_id: string | number;
    address: string;
    tags: string | string[] | null;
    cover_image?: string;
    social_networks?: SocialLinks;
    category?: BusinessCategories;
    amenities: Amenites[];
    payments: Payments[];
    schedules: Schedules[];
    images?: GalleryImage[];
    is_open: boolean;
    products?: ServicesAndProducts[];
    cords?: {
        type: 'Point';
        coordinates: [number, number];
    };
}

export interface CartExtra {
    id: string | number;
    name: string;
    price: number;
}

export interface CartVariation {
    id: string | number;
    name: string;
    price: number;
}

export interface CartItem {
    key: string;
    id: string | number;
    name: string;
    price: number;
    quantity: number;
    extras: CartExtra[];
    variations: CartVariation[];
    notes?: string;
}

/******** Orders ******** */
export interface OrderExtra {
    id: number;
    extra_name: string;
    price: string;
}

export interface OrderVariation {
    id: number;
    variation_name: string;
    price: string;
}

export interface OrderItem {
    id: number;
    product_name: string;
    unit_price: string;
    quantity: number;
    total_price: string;
    notes?: string;
    extras: OrderExtra[];
    variations: OrderVariation[];
}

export interface Order {
    id: number;
    status: string;
    subtotal: string;
    shipping: string;
    total: string;
    created_at: string;
    items: OrderItem[];
    user: User;
}

export type UserType = 'client' | 'business' | 'delivery';

export interface AccountType {
    type: UserType;
    label: string;
    banner: string;
    title: string;
    subTitle: string;
}

export type AccountTypeMap = Record<UserType, AccountType>;

export interface LoginConfig {
    type: string;
    banner: string;
    title: string;
    subTitle: string;
}

export enum OrderStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    READY_FOR_PICKUP = 'ready_for_pickup',
    PICKED_UP = 'picked_up',
    ON_THE_WAY = 'on_the_way',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
    REJECTED = 'rejected',
}

export interface BusinessSearchFilters {
    query: string;
    category: string | null;
    distance: number | null;
    foodType: number | null;
}
