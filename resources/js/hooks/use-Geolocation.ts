import { useEffect, useState } from 'react';

interface GeolocationState {
    latitude: number | null;
    longitude: number | null;
    accuracy: number | null;
    error: string | null;
    loading: boolean;
    source: 'navigator' | 'ip' | 'cache' | null;
}

interface GeolocationOptions {
    enableHighAccuracy?: boolean;
    timeout?: number;
    maximumAge?: number;
    enableIPFallback?: boolean;
    ipApiUrl?: string;
    cacheKey?: string;
    cacheDuration?: number; // en milisegundos
}

interface CachedLocation {
    latitude: number;
    longitude: number;
    accuracy: number | null;
    timestamp: number;
    source: 'navigator' | 'ip';
}

export function useGeolocation(options: GeolocationOptions = {}) {
    const {
        enableHighAccuracy = true,
        timeout = 10000,
        maximumAge = 0,
        enableIPFallback = true,
        ipApiUrl = 'https://ipapi.co/json/',
        cacheKey = 'user_geolocation',
        cacheDuration = 30 * 60 * 1000, // 30 minutos por defecto
    } = options;

    const [state, setState] = useState<GeolocationState>({
        latitude: null,
        longitude: null,
        accuracy: null,
        error: null,
        loading: true,
        source: null,
    });

    // Función para obtener ubicación del caché
    const getCachedLocation = (): CachedLocation | null => {
        try {
            const cached = sessionStorage.getItem(cacheKey);
            if (!cached) return null;

            const data: CachedLocation = JSON.parse(cached);
            const now = Date.now();

            // Verificar si el caché expiró
            if (now - data.timestamp > cacheDuration) {
                sessionStorage.removeItem(cacheKey);
                return null;
            }

            return data;
        } catch (error) {
            console.error('Error al leer caché de ubicación:', error);
            return null;
        }
    };

    // Función para guardar ubicación en caché
    const setCachedLocation = (
        latitude: number,
        longitude: number,
        accuracy: number | null,
        source: 'navigator' | 'ip',
    ) => {
        try {
            const data: CachedLocation = {
                latitude,
                longitude,
                accuracy,
                timestamp: Date.now(),
                source,
            };
            sessionStorage.setItem(cacheKey, JSON.stringify(data));
        } catch (error) {
            console.error('Error al guardar caché de ubicación:', error);
        }
    };

    useEffect(() => {
        let isMounted = true;
        let watchId: number | null = null;

        // Función para obtener ubicación por IP (fallback)
        const getLocationByIP = async () => {
            try {
                const response = await fetch(ipApiUrl);

                if (!response.ok) {
                    throw new Error('Error al obtener ubicación por IP');
                }

                const data = await response.json();

                if (isMounted && data.latitude && data.longitude) {
                    const location = {
                        latitude: data.latitude,
                        longitude: data.longitude,
                        accuracy: null,
                        error: null,
                        loading: false,
                        source: 'ip' as const,
                    };

                    setState(location);
                    setCachedLocation(
                        data.latitude,
                        data.longitude,
                        null,
                        'ip',
                    );
                } else {
                    throw new Error('Datos de IP incompletos');
                }
            } catch (error) {
                if (isMounted) {
                    setState({
                        latitude: null,
                        longitude: null,
                        accuracy: null,
                        error: 'No se pudo obtener la ubicación',
                        loading: false,
                        source: null,
                    });
                }
            }
        };

        // Función principal para obtener ubicación
        const getLocation = () => {
            // 1. Intentar obtener del caché primero
            const cached = getCachedLocation();
            if (cached) {
                setState({
                    latitude: cached.latitude,
                    longitude: cached.longitude,
                    accuracy: cached.accuracy,
                    error: null,
                    loading: false,
                    source: 'cache',
                });
                return;
            }

            // 2. Verificar si el navegador soporta geolocalización
            if (!navigator.geolocation) {
                console.warn(
                    'Geolocalización no soportada, intentando con IP...',
                );
                if (enableIPFallback) {
                    getLocationByIP();
                } else {
                    setState({
                        latitude: null,
                        longitude: null,
                        accuracy: null,
                        error: 'Geolocalización no soportada',
                        loading: false,
                        source: null,
                    });
                }
                return;
            }

            // 3. Callback de éxito
            const onSuccess = (position: GeolocationPosition) => {
                if (isMounted) {
                    const location = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        error: null,
                        loading: false,
                        source: 'navigator' as const,
                    };

                    setState(location);
                    setCachedLocation(
                        position.coords.latitude,
                        position.coords.longitude,
                        position.coords.accuracy,
                        'navigator',
                    );
                }
            };

            // 4. Callback de error
            const onError = (error: GeolocationPositionError) => {
                console.error('Error de geolocalización:', error.message);

                // Intentar fallback a IP si está habilitado
                if (enableIPFallback && isMounted) {
                    console.log('Intentando obtener ubicación por IP...');
                    getLocationByIP();
                } else if (isMounted) {
                    let errorMessage = 'Error al obtener ubicación';

                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = 'Permiso de ubicación denegado';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = 'Ubicación no disponible';
                            break;
                        case error.TIMEOUT:
                            errorMessage = 'Tiempo de espera agotado';
                            break;
                    }

                    setState({
                        latitude: null,
                        longitude: null,
                        accuracy: null,
                        error: errorMessage,
                        loading: false,
                        source: null,
                    });
                }
            };

            // 5. Obtener ubicación
            navigator.geolocation.getCurrentPosition(onSuccess, onError, {
                enableHighAccuracy,
                timeout,
                maximumAge,
            });
        };

        // Iniciar obtención de ubicación
        getLocation();

        // Cleanup
        return () => {
            isMounted = false;
            if (watchId !== null) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, [
        enableHighAccuracy,
        timeout,
        maximumAge,
        enableIPFallback,
        ipApiUrl,
        cacheKey,
        cacheDuration,
    ]);

    // Función para refrescar manualmente la ubicación
    const refresh = () => {
        sessionStorage.removeItem(cacheKey);
        setState((prev) => ({ ...prev, loading: true }));
        window.location.reload();
    };

    // Función para limpiar caché
    const clearCache = () => {
        sessionStorage.removeItem(cacheKey);
    };

    return {
        ...state,
        refresh,
        clearCache,
    };
}
