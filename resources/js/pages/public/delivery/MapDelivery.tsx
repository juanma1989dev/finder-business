import {
    Map,
    MapControls,
    MapMarker,
    MarkerContent,
} from '@/components/ui/map';
import { Navigation } from 'lucide-react';

interface MapProps {
    deliveryLocation: { lat: number; lng: number } | null;
}

export default function MapDelivery({ deliveryLocation }: MapProps) {
    return (
        <Map
            center={
                deliveryLocation
                    ? [deliveryLocation.lng, deliveryLocation.lat]
                    : [-97.2275336, 17.4606859]
            }
            zoom={16}
            theme="light"
        >
            <MapControls position="bottom-right" showZoom showLocate />
            {deliveryLocation && (
                <MapMarker
                    longitude={deliveryLocation.lng}
                    latitude={deliveryLocation.lat}
                >
                    <MarkerContent>
                        <div className="flex items-center justify-center rounded-full bg-purple-600 p-1.5 shadow-lg ring-2 ring-white">
                            <Navigation
                                className="fill-white text-white"
                                size={16}
                            />
                        </div>
                    </MarkerContent>
                </MapMarker>
            )}
        </Map>
    );
}
