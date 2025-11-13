import { useCallback, useState } from 'react';
import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { Loader2 } from 'lucide-react';

interface GoogleMapEmbedProps {
  latitude: number;
  longitude: number;
  name: string;
  showDirections?: boolean;
  userLocation?: { lat: number; lng: number };
}

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

export const GoogleMapEmbed = ({ 
  latitude, 
  longitude, 
  name,
  showDirections = false,
  userLocation,
}: GoogleMapEmbedProps) => {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [directionsError, setDirectionsError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const center = {
    lat: latitude,
    lng: longitude,
  };

  const onLoad = useCallback((map: google.maps.Map) => {
    if (showDirections && userLocation) {
      setIsLoading(true);
      const directionsService = new google.maps.DirectionsService();
      
      directionsService.route(
        {
          origin: userLocation,
          destination: { lat: latitude, lng: longitude },
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          setIsLoading(false);
          if (status === 'OK' && result) {
            setDirections(result);
            setDirectionsError(null);
          } else {
            setDirectionsError('Unable to get directions');
            console.error('Directions request failed:', status);
          }
        }
      );
    }
  }, [showDirections, userLocation, latitude, longitude]);

  return (
    <div className="relative">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={showDirections && directions ? 12 : 15}
        onLoad={onLoad}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
          zoomControl: true,
        }}
      >
        {!showDirections && (
          <Marker
            position={center}
            title={name}
            animation={google.maps.Animation.DROP}
          />
        )}
        
        {showDirections && directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: false,
              polylineOptions: {
                strokeColor: '#3B82F6',
                strokeWeight: 5,
              },
            }}
          />
        )}
      </GoogleMap>
      
      {isLoading && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-background/90 px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          <span className="text-sm">Getting directions...</span>
        </div>
      )}
      
      {directionsError && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-destructive text-destructive-foreground px-4 py-2 rounded-lg shadow-lg">
          {directionsError}
        </div>
      )}
      
      {showDirections && directions && (
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <h4 className="font-semibold mb-2">Route Summary</h4>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">Distance:</span> {directions.routes[0]?.legs[0]?.distance?.text}</p>
            <p><span className="font-medium">Duration:</span> {directions.routes[0]?.legs[0]?.duration?.text}</p>
            <p className="text-xs text-muted-foreground mt-2">
              From: {directions.routes[0]?.legs[0]?.start_address}
            </p>
            <p className="text-xs text-muted-foreground">
              To: {directions.routes[0]?.legs[0]?.end_address}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
