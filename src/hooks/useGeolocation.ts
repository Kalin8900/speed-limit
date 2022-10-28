import { useLogger } from "@mantine/hooks";
import { useEffect, useState } from "react";

export interface IGeolocation {
  coords: GeolocationCoordinates | null;
  timestamp: number;
  isLoading: boolean;
  error: GeolocationPositionError | null;
  timeDiff: number | null;
}

export const useGeolocation = (options: PositionOptions) => {
  const [geolocation, setGeolocation] = useState<IGeolocation>({
    isLoading: true,
    error: null,
    coords: null,
    timestamp: new Date().getTime(),
    timeDiff: null,
  });

  useLogger("useGeolocation", [geolocation]);

  const onSuccess = (position: GeolocationPosition) => {
    if (!position.coords) return;

    setGeolocation((prev) => ({
      isLoading: false,
      error: null,
      coords: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        altitude: position.coords.altitude,
        accuracy: position.coords.accuracy,
        altitudeAccuracy: position.coords.altitudeAccuracy,
        heading: position.coords.heading,
        speed: position.coords.speed,
      },
      timestamp: position.timestamp,
      timeDiff: position.timestamp - prev.timestamp,
    }));
  };

  const onError = (error: GeolocationPositionError) => {
    setGeolocation((prev) => ({
      isLoading: false,
      error,
      coords: null,
      timestamp: new Date().getTime(),
      timeDiff: new Date().getTime() - prev.timestamp,
    }));
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
    const watchId = navigator.geolocation.watchPosition(onSuccess, onError, options);

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return geolocation;
};
