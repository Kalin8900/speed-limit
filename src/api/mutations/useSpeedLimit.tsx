import { http } from "../../types/http";
import { success, error as failure } from "../../types/notifications";
import { SpeedLimit, SpeedLimitQuery } from "../../types/speedLimit";
import { Mutator, UseTypedMutation, useTypedMutation } from "../../types/useTypedMutation";
import { speedLimitOverpassQuery } from "../../utils/speedLimitOverpass";

export const SpeedLimitMutationKey = "speedLimit";

const speedLimit: Mutator<SpeedLimitQuery, SpeedLimit> = ({ signal, lat, long, radius }) => {
  const params = new URLSearchParams();

  params.append("data", speedLimitOverpassQuery(lat, long, radius));

  return http.post("api/interpreter", {
    baseURL: "https://overpass-api.de",
    signal,
    data: params,
  });
};

export const useSpeedLimit: UseTypedMutation<typeof speedLimit> = (options) => {
  return useTypedMutation(SpeedLimitMutationKey, speedLimit, {
    onSuccess: (data, variables, context) => {
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      failure({ title: "Speed limit not found" });

      if (options?.onError) {
        options.onError(error, variables, context);
      }
    },
    ...options,
  });
};
