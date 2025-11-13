import { ReactNode } from 'react';
import { LoadScript } from '@react-google-maps/api';

interface GoogleMapsProviderProps {
  children: ReactNode;
}

// Note: The API key will be loaded from environment variables
// For now, we'll use a placeholder that needs to be replaced with actual key
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

const libraries: ("places" | "geometry" | "drawing")[] = ["places"];

export const GoogleMapsProvider = ({ children }: GoogleMapsProviderProps) => {
  if (!GOOGLE_MAPS_API_KEY) {
    console.warn('Google Maps API key not configured. Maps will not load properly.');
  }

  return (
    <LoadScript
      googleMapsApiKey={GOOGLE_MAPS_API_KEY}
      libraries={libraries}
      loadingElement={<div>Loading Maps...</div>}
    >
      {children}
    </LoadScript>
  );
};
