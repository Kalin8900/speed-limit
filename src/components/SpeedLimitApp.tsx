import { Alert, Loader } from "@mantine/core";
import { useEffect, useState } from "react";
import { AlertCircle } from "tabler-icons-react";
import { useSpeedLimit } from "../api/mutations/useSpeedLimit";
import { useGeolocation } from "../hooks/useGeolocation";
import { SpeedLimitNode, SpeedLimitWay } from "../types/speedLimit";
import { SpeedLimit } from "./SpeedLimit";

export const SpeedLimitApp = () => {
  const location = useGeolocation({
    enableHighAccuracy: true,
    maximumAge: 360,
    timeout: 10000,
  });

  const { mutate: getSpeedLimit, data } = useSpeedLimit();

  const [ways, setWays] = useState<(SpeedLimitWay | SpeedLimitNode)[]>();

  useEffect(() => {
    if (location.coords && location.timeDiff !== null && (location.timeDiff === 0 || location.timeDiff > 1000)) {
      getSpeedLimit(
        {
          lat: location.coords.latitude,
          long: location.coords.longitude,
          radius: 25,
        },
        {
          onSuccess: ({ elements }) => {
            setWays(elements);
          },
        }
      );
    }
  }, [location]);

  if (location.isLoading || !data) {
    return <Loader />;
  }

  if (!ways) {
    return (
      <Alert color={"orange"} title={"No data"} icon={<AlertCircle />} variant={"light"}>
        {" "}
        No data fetched from the server{" "}
      </Alert>
    );
  }

  return <SpeedLimit location={location} elements={ways} />;
};
