import { initFCMListeners, registerFCMToken } from '@/firebase';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

export default function ProviderLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { auth } = usePage<SharedData>().props;
    const initialized = useRef(false);

    useEffect(() => {
        if (initialized.current) return;

        const user = auth?.user;
        if (!user?.id) return;

        initialized.current = true;

        const currentToken = user.fcm_tokens?.token ?? null;

        registerFCMToken(currentToken);
        initFCMListeners(currentToken);
    }, [auth?.user?.id]);

    return <>{children}</>;
}
