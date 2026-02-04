import { useEffect, useState } from 'react';

export function usePwaUpdate() {
    const [updateAvailable, setUpdateAvailable] = useState(false);
    const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(
        null,
    );

    useEffect(() => {
        if (!('serviceWorker' in navigator)) return;

        navigator.serviceWorker.ready.then((registration) => {
            if (registration.waiting) {
                setWaitingWorker(registration.waiting);
                setUpdateAvailable(true);
            }

            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                if (!newWorker) return;

                newWorker.addEventListener('statechange', () => {
                    if (
                        newWorker.state === 'installed' &&
                        navigator.serviceWorker.controller
                    ) {
                        setWaitingWorker(newWorker);
                        setUpdateAvailable(true);
                    }
                });
            });
        });
    }, []);

    const refreshApp = () => {
        if (!waitingWorker) return;
        waitingWorker.postMessage('SKIP_WAITING');
        window.location.reload();
    };

    return { updateAvailable, refreshApp };
}
