// public/firebase-messaging-sw.js
importScripts(
    'https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js',
);
importScripts(
    'https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js',
);

firebase.initializeApp({
    apiKey: 'AIzaSyAZB94jSl6SGarKGFELlmPP0U5AubGqlhQ',
    authDomain: 'findy-daa52.firebaseapp.com',
    projectId: 'findy-daa52',
    storageBucket: 'findy-daa52.firebasestorage.app', // Agregado
    messagingSenderId: '1098401806634',
    appId: '1:1098401806634:web:90436f219e6af5fa358653',
    measurementId: 'G-D1TFQGNMV3', // Agregado
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    self.registration.showNotification(payload.notification.title, {
        body: payload.notification.body,
        icon: '/favicon.webp',
        badge: '/favicon.webp',
        data: payload.data,
    });
});

// Al final de public/firebase-messaging-sw.js
self.addEventListener('install', () => {
    self.skipWaiting(); // Fuerza a que el SW nuevo reemplace al viejo de inmediato
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim()); // Toma control de las pestañas abiertas inmediatamente
});
