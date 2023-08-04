import { createQuery } from "@tanstack/solid-query";
// Services
import api from "@/services/api";
// State
import { setEnvironment, syncEnvironment } from "@/state/environment";

export const useGetAll = (
  props?: undefined,
  options?: {
    enabled?: boolean;
  }
) => {
  return createQuery(() => ["environments.getAll"], {
    queryFn: () => api.environments.getAll(),
    onSuccess: (data) => {
      syncEnvironment(data.data);
    },
    onError: () => {
      setEnvironment(undefined);
    },
    enabled: options?.enabled,
  });
};
