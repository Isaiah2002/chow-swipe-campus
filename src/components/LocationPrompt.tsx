import { MapPin, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface LocationPromptProps {
  onRequestLocation: () => void;
  error?: string | null;
  loading?: boolean;
}

export const LocationPrompt = ({ onRequestLocation, error, loading }: LocationPromptProps) => {
  return (
    <Card className="p-6 border-border/50 bg-card">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
          <MapPin className="w-8 h-8 text-primary-foreground" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-card-foreground">
            Find Restaurants Near You
          </h3>
          <p className="text-sm text-muted-foreground">
            Allow location access to discover restaurants in your area with accurate distances
          </p>
        </div>

        {error && (
          <div className="flex items-center justify-center space-x-2 text-destructive text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <Button 
          onClick={onRequestLocation}
          disabled={loading}
          className="gradient-primary text-primary-foreground border-0 w-full"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              <span>Getting Location...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Enable Location</span>
            </div>
          )}
        </Button>

        <p className="text-xs text-muted-foreground">
          We'll only use your location to show nearby restaurants. You can change this anytime in your browser settings.
        </p>
      </div>
    </Card>
  );
};