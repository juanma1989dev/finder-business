import { getAnalytics, isSupported } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

/* ===============================
   Analytics
================================ */
export const analytics =
    typeof window !== 'undefined'
        ? isSupported().then((yes) => (yes ? getAnalytics(app) : null))
        : null;

/* ===============================
   Messaging
================================ */
export const messaging =
    typeof window !== 'undefined' ? getMessaging(app) : null;

/* ===============================
   Register FCM Token
================================ */
async function registerFCMToken(currentToken: string | null) {
    if (!messaging) return;
    if (!('Notification' in window)) return;
    if (!('serviceWorker' in navigator)) return;

    if (Notification.permission === 'denied') {
        console.warn('Las notificaciones están bloqueadas.');
        return;
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return;

    try {
        const registration = await navigator.serviceWorker.ready;

        const token = await getToken(messaging, {
            vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
            serviceWorkerRegistration: registration,
        });

        if (!token) return;

        if (currentToken === token) {
            // console.warn('Token ya sincronizado.');
            return;
        }

        await fetch('/fcm/token', {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN':
                    document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute('content') || '',
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({ token }),
        });
    } catch (error) {
        console.error('FCM error:', error);
    }
}

function initFCMListeners(currentToken: string | null) {
    document.addEventListener('visibilitychange', async () => {
        if (document.visibilityState === 'visible') {
            await registerFCMToken(currentToken);
        }
    });
}

export { initFCMListeners, onMessage, registerFCMToken };
