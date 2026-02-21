import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

interface FlyToProps {
    position: [number, number];
    enabled?: boolean;
    zoom?: number;
    animate?: boolean;
}

export function FlyTo({
    position,
    enabled = true,
    zoom,
    animate = true,
}: FlyToProps) {
    const map = useMap();

    useEffect(() => {
        if (!enabled) return;

        map.flyTo(position, zoom ?? map.getZoom(), {
            animate,
            duration: animate ? 0.6 : 0,
        });
    }, [position, enabled, zoom, map]);

    return null;
}
