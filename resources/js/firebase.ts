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

export const analytics =
    typeof window !== 'undefined'
        ? isSupported().then((yes) => (yes ? getAnalytics(app) : null))
        : null;

export const messaging =
    typeof window !== 'undefined' ? getMessaging(app) : null;

export async function registerFCMToken() {
    if (!messaging) return;
    if (!('Notification' in window)) return;

    if (Notification.permission === 'denied') {
        console.warn('Las notificaciones están bloqueadas en este navegador.');
        return;
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return;

    try {
        console.log('BEFORE TOKE');

        const token = await getToken(messaging, {
            vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        });

        console.log('TOKEN :: ', token);

        if (token) {
            const lastToken = localStorage.getItem('last_fcm_token');
            if (lastToken === token) {
                console.log('El token ya está sincronizado con el servidor.');
                return;
            }

            const response = await fetch('/fcm/token', {
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

            console.log(response.ok);

            if (response.ok) {
                localStorage.setItem('last_fcm_token', token);
            }
        }
    } catch (error) {
        console.error('Error detallado en FCM:', error);
    }
}

export { onMessage };
