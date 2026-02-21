import L from 'leaflet';
import { Marker } from 'react-leaflet';

interface MapMarkerProps {
    position: [number, number];
    draggable?: boolean;
    icon?: L.Icon | L.DivIcon;
    onDragEnd?: (lat: number, lng: number) => void;
}

export function MapMarker({
    position,
    draggable = false,
    icon,
    onDragEnd,
}: MapMarkerProps) {
    return (
        <Marker
            position={position}
            draggable={draggable}
            icon={icon}
            eventHandlers={
                draggable && onDragEnd
                    ? {
                          dragend: (e) => {
                              const { lat, lng } = e.target.getLatLng();
                              onDragEnd(lat, lng);
                          },
                      }
                    : undefined
            }
        />
    );
}
