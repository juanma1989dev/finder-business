import { deliveryIcon } from '@/components/leaflet/icons';
import { Map } from '@/components/leaflet/Map';
import { MapMarker } from '@/components/leaflet/MapMarker';
import { useLeafletMap } from '@/components/leaflet/useLeafletMap';
import 'leaflet/dist/leaflet.css';

interface MapProps {
    deliveryLocation: { lat: number; lng: number } | null;
}

function FollowDelivery({ position }: { position: [number, number] }) {
    useLeafletMap({ follow: position });
    return null;
}

export default function MapDelivery({ deliveryLocation }: MapProps) {
    if (!deliveryLocation) return null;

    const position: [number, number] = [
        deliveryLocation.lat,
        deliveryLocation.lng,
    ];

    return (
        <Map center={position}>
            <MapMarker position={position} icon={deliveryIcon} />
            <FollowDelivery position={position} />
        </Map>
    );
}
