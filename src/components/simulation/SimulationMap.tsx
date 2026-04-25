import { useState, useEffect } from "react";
import { SimulationState, SimulationConfig } from "@/pages/Simulation";
import { useJsApiLoader, GoogleMap, DirectionsRenderer } from "@react-google-maps/api";
import { Loader2 } from "lucide-react";

interface SimulationMapProps {
  simulationState: SimulationState;
  config: SimulationConfig;
  predictedCongestion?: number | null;
  onRouteStats?: (stats: { distance: number; duration: number }) => void;
}

const YELAHANKA_COORDS = { lat: 13.1007, lng: 77.5963 };

const DESTINATIONS: Record<string, { lat: number; lng: number }> = {
  "YLK_KIA_01": { lat: 13.1989, lng: 77.7068 },
  "YLK_PU_01": { lat: 13.1682, lng: 77.5354 },
  "YLK_JK_01": { lat: 13.0785, lng: 77.6067 },
  "YLK_BG_01": { lat: 13.1336, lng: 77.6688 },
};

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  styles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }]
    }
  ]
};

const SimulationMap = ({ simulationState, config, predictedCongestion, onRouteStats }: SimulationMapProps) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  });

  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    
    const fetchRoute = () => {
      if (!window.google || !window.google.maps) {
        console.error("Google maps API window object is not initialized.");
        return;
      }

      try {
        const dest = DESTINATIONS[config.selectedRoute] || DESTINATIONS["YLK_KIA_01"];
        const directionsService = new window.google.maps.DirectionsService();
        
        directionsService.route(
          {
            origin: YELAHANKA_COORDS,
            destination: dest,
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === window.google.maps.DirectionsStatus.OK && result) {
              setDirectionsResponse(result);
              
              const route = result.routes[0];
              if (route && route.legs[0]) {
                const leg = route.legs[0];
                if (onRouteStats) {
                  onRouteStats({
                    distance: leg.distance?.value || 0,
                    duration: leg.duration?.value || 0,
                  });
                }
              }
            } else {
              console.error(`Error fetching directions ${status}`);
            }
          }
        );
      } catch (err) {
        console.error("Failed to construct directions routing proxy", err);
      }
    };

    fetchRoute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, config.selectedRoute]);

  const getRouteColor = () => {
    const c = predictedCongestion;
    if (c == null) return "#3b82f6"; // primary blue (default mapping)
    if (c < 0.4) return "#22c55e"; // green
    if (c < 0.7) return "#eab308"; // yellow
    return "#ef4444"; // red
  };

  if (loadError) return <div className="w-full h-full flex items-center justify-center font-medium opacity-50">Error loading maps - Verify your VITE_GOOGLE_MAPS_API_KEY.</div>;
  if (!isLoaded) return <div className="w-full h-full flex items-center justify-center"><Loader2 className="animate-spin text-muted-foreground w-8 h-8"/></div>;

  return (
    <div className="w-full h-full relative">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={YELAHANKA_COORDS}
        zoom={12}
        options={mapOptions}
      >
        {directionsResponse && (
          <DirectionsRenderer
            directions={directionsResponse}
            options={{
              suppressMarkers: false,
              polylineOptions: {
                strokeColor: getRouteColor(),
                strokeWeight: 6,
                strokeOpacity: 0.8,
              }
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
};

export default SimulationMap;
