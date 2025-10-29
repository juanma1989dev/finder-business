import { useEffect, useState, useRef } from 'react';

export interface GeolocationState {
    latitude: number | null;
    longitude: number | null;
    accuracy: number | null;
    error: string | null;
    loading: boolean;
    source: 'navigator' | 'ip' | 'cache' | null;
}

export interface GeolocationOptions {
    enableHighAccuracy?: boolean;
    timeout?: number;
    maximumAge?: number;
    enableIPFallback?: boolean;
    ipApiUrl?: string;
    cacheMinutes?: number;
}

interface CachedLocation {
    latitude: number;
    longitude: number;
    accuracy: number | null;
    timestamp: number;
    expiresAt: number;
    source: 'navigator' | 'ip';
}

export function useGeolocation(options: GeolocationOptions = {}) {
    const {
        enableHighAccuracy = true,
        timeout = 10000,
        maximumAge = 0,
        enableIPFallback = true,
        ipApiUrl = 'https://ipapi.co/json/',
        cacheMinutes = 30,
    } = options;

    const cacheKey = 'geolocation_cache';
    const [state, setState] = useState<GeolocationState>({
        latitude: null,
        longitude: null,
        accuracy: null,
        error: null,
        loading: true,
        source: null,
    });

    const isMountedRef = useRef(true);

    // Auto-limpiar cache expirado en cada render
    useEffect(() => {
        const cleanExpiredCache = () => {
            try {
                const cached = localStorage.getItem(cacheKey);
                if (cached) {
                    const data: CachedLocation = JSON.parse(cached);
                    const now = Date.now();
                    
                    if (now >= data.expiresAt) {
                        localStorage.removeItem(cacheKey);
                        console.log('🗑️ Cache expirado y eliminado automáticamente');
                    }
                }
            } catch (error) {
                console.error('Error limpiando cache:', error);
                localStorage.removeItem(cacheKey);
            }
        };

        cleanExpiredCache();
    }, []);

    useEffect(() => {
        isMountedRef.current = true;

        const getLocationByIP = async () => {
            try {
                console.log('🌐 Obteniendo ubicación por IP...');
                const response = await fetch(ipApiUrl);

                if (!response.ok) {
                    throw new Error('Error al obtener ubicación por IP');
                }

                const data = await response.json();

                if (isMountedRef.current && data.latitude && data.longitude) {
                    console.log('✅ Ubicación por IP obtenida:', {
                        lat: data.latitude,
                        lon: data.longitude,
                        city: data.city,
                        country: data.country_name
                    });

                    const location = {
                        latitude: data.latitude,
                        longitude: data.longitude,
                        accuracy: null,
                        error: null,
                        loading: false,
                        source: 'ip' as const,
                    };

                    setState(location);
                    
                    // Guardar en cache
                    const cacheData: CachedLocation = {
                        latitude: data.latitude,
                        longitude: data.longitude,
                        accuracy: null,
                        timestamp: Date.now(),
                        expiresAt: Date.now() + (cacheMinutes * 60 * 1000),
                        source: 'ip',
                    };
                    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
                    console.log(`💾 Ubicación guardada en cache (expira en ${cacheMinutes} min)`);
                } else {
                    throw new Error('Datos de IP incompletos');
                }
            } catch (error) {
                console.error('❌ Error obteniendo ubicación por IP:', error);
                if (isMountedRef.current) {
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

        const getLocation = () => {
            // 1. Verificar cache válido en localStorage
            try {
                const cached = localStorage.getItem(cacheKey);
                if (cached) {
                    const data: CachedLocation = JSON.parse(cached);
                    const now = Date.now();

                    // Verificar si NO ha expirado
                    if (now < data.expiresAt) {
                        const ageInMinutes = Math.round((now - data.timestamp) / 60000);
                        const expiresInMinutes = Math.round((data.expiresAt - now) / 60000);
                        
                        console.log('📦 Usando ubicación en cache:', {
                            source: data.source,
                            age: `${ageInMinutes} min`,
                            expiresIn: `${expiresInMinutes} min`
                        });
                        
                        setState({
                            latitude: data.latitude,
                            longitude: data.longitude,
                            accuracy: data.accuracy,
                            error: null,
                            loading: false,
                            source: 'cache',
                        });
                        return; // Cache válido, no solicitar ubicación
                    } else {
                        // Cache expirado, eliminarlo
                        localStorage.removeItem(cacheKey);
                        console.log('⏰ Cache expirado, solicitando nueva ubicación');
                    }
                }
            } catch (error) {
                console.error('Error leyendo cache:', error);
                localStorage.removeItem(cacheKey);
            }
            
            console.log('🔍 No hay cache válido, obteniendo nueva ubicación...');

            // 2. Verificar soporte de geolocalización
            if (!navigator.geolocation) {
                console.warn('⚠️ Geolocalización no soportada');
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
                if (isMountedRef.current) {
                    console.log('✅ Ubicación del navegador obtenida:', {
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                        accuracy: Math.round(position.coords.accuracy) + 'm',
                        altitude: position.coords.altitude,
                        altitudeAccuracy: position.coords.altitudeAccuracy,
                        heading: position.coords.heading,
                        speed: position.coords.speed,
                        timestamp: new Date(position.timestamp).toLocaleString(),
                    });

                    if (position.coords.accuracy > 10000) {
                        console.warn('⚠️ ADVERTENCIA: Precisión muy baja (' + 
                            Math.round(position.coords.accuracy/1000) + 'km). ' +
                            'Probablemente usando Wi-Fi o IP en lugar de GPS real.');
                    }

                    const location = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        error: null,
                        loading: false,
                        source: 'navigator' as const,
                    };

                    setState(location);
                    
                    // Guardar en cache con tiempo de expiración
                    const cacheData: CachedLocation = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        timestamp: Date.now(),
                        expiresAt: Date.now() + (cacheMinutes * 60 * 1000),
                        source: 'navigator',
                    };
                    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
                    console.log(`💾 Ubicación guardada en cache (expira en ${cacheMinutes} min)`);
                }
            };

            // 4. Callback de error
            const onError = (error: GeolocationPositionError) => {
                console.error('❌ Error de geolocalización:', error.message);

                if (enableIPFallback && isMountedRef.current) {
                    console.log('🔄 Intentando fallback a IP...');
                    getLocationByIP();
                } else if (isMountedRef.current) {
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

        getLocation();

        return () => {
            isMountedRef.current = false;
        };
    }, [
        enableHighAccuracy,
        timeout,
        maximumAge,
        enableIPFallback,
        ipApiUrl,
        cacheMinutes,
    ]);

    const refresh = () => {
        console.log('🔄 Limpiando cache y obteniendo nueva ubicación...');
        localStorage.removeItem(cacheKey);
        setState((prev) => ({ ...prev, loading: true, error: null }));
        setTimeout(() => {
            window.location.reload();
        }, 100);
    };

    const clearCache = () => {
        localStorage.removeItem(cacheKey);
        console.log('✅ Cache limpiado manualmente');
    };

    return {
        ...state,
        refresh,
        clearCache,
    };
}