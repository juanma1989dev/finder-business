/* ===============================
   PWA + Firebase Cloud Messaging
================================ */
importScripts(
    'https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js',
    'https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js',
);

firebase.initializeApp({
    apiKey: 'AIzaSyAZB94jSl6SGarKGFELlmPP0U5AubGqlhQ',
    authDomain: 'findy-daa52.firebaseapp.com',
    projectId: 'findy-daa52',
    messagingSenderId: '1098401806634',
    appId: '1:1098401806634:web:90436f219e6af5fa358653',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    const title = payload.notification?.title ?? 'Nueva notificación';
    const body = payload.notification?.body ?? '';

    self.registration.showNotification(title, {
        body,
        icon: '/favicon.webp',
        badge: '/favicon.webp',
        data: payload.data ?? {},
    });
});

/* ===============================
   PWA Cache
================================ */
const CACHE_NAME = 'vite-assets-v1';
const TILE_CACHE = 'leaflet-tiles-v1';
const MAX_TILES = 300;

/* ===============================
   Lifecycle
================================ */
self.addEventListener('install', () => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        (async () => {
            const keys = await caches.keys();
            await Promise.all(
                keys
                    .filter((key) => ![CACHE_NAME, TILE_CACHE].includes(key))
                    .map((key) => caches.delete(key)),
            );

            await self.clients.claim();
        })(),
    );
});

/* ===============================
   Fetch
================================ */
self.addEventListener('fetch', (event) => {
    const { request } = event;

    if (request.method !== 'GET') return;

    const url = new URL(request.url);

    if (url.hostname.includes('tile.openstreetmap.org')) {
        event.respondWith(cacheLeafletTiles(request));
        return;
    }

    if (url.pathname.startsWith('/build/assets/')) {
        event.respondWith(cacheAssets(request));
        return;
    }
});

/* ===============================
   Messaging
================================ */
self.addEventListener('message', (event) => {
    if (event.data === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

/* ===============================
   Helpers
================================ */
async function cacheLeafletTiles(request) {
    const cache = await caches.open(TILE_CACHE);
    const cached = await cache.match(request);

    if (cached) return cached;

    const response = await fetch(request);
    cache.put(request, response.clone());

    const keys = await cache.keys();
    if (keys.length > MAX_TILES) {
        cache.delete(keys[0]);
    }

    return response;
}

async function cacheAssets(request) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);

    if (cached) return cached;

    const response = await fetch(request);
    cache.put(request, response.clone());
    return response;
}
