import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';

export default function AuthLayout({
    children,
    title,
    subTitle,
    description,
    bannerImage,
    ...props
}: {
    children: React.ReactNode;
    title: string;
    subTitle?: string;
    description?: string;
    bannerImage: string;
}) {
    return (
        <AuthLayoutTemplate
            title={title}
            description={description}
            subTitle={subTitle}
            bannerImage={bannerImage}
            {...props}
        >
            {children}
        </AuthLayoutTemplate>
    );
}
