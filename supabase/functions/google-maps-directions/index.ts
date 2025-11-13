import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { origin, destination, mode = 'DRIVING' } = await req.json();
    const apiKey = Deno.env.get('GOOGLE_MAPS_API_KEY');

    if (!apiKey) {
      throw new Error('Google Maps API key not configured');
    }

    console.log(`Fetching directions from ${origin} to ${destination} via ${mode}`);

    // Get directions from Google Maps Directions API
    const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=${mode.toLowerCase()}&key=${apiKey}`;
    
    const response = await fetch(directionsUrl);
    const data = await response.json();

    if (data.status !== 'OK') {
      console.error('Directions API error:', data.status, data.error_message);
      return new Response(JSON.stringify({
        error: data.error_message || `Directions API error: ${data.status}`,
        routes: [],
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Extract route information
    const routes = data.routes.map((route: any) => ({
      summary: route.summary,
      distance: route.legs[0].distance,
      duration: route.legs[0].duration,
      startAddress: route.legs[0].start_address,
      endAddress: route.legs[0].end_address,
      steps: route.legs[0].steps.map((step: any) => ({
        instruction: step.html_instructions,
        distance: step.distance,
        duration: step.duration,
        maneuver: step.maneuver,
      })),
      overviewPolyline: route.overview_polyline.points,
    }));

    console.log(`Successfully fetched ${routes.length} route(s)`);

    return new Response(JSON.stringify({
      routes,
      status: data.status,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in google-maps-directions function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      routes: [],
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
