import { createQuery } from "@tanstack/solid-query";
// Services
import api from "@/services/api";

export const useGetAll = (
  props: Parameters<typeof api.brickConfig.getAll>[0],
  options?: {
    enabled?: boolean;
  }
) => {
  const key = JSON.stringify(props);

  return createQuery(() => ["brickConfig.getAll", key], {
    queryFn: () => api.brickConfig.getAll(props),
    enabled: options?.enabled,
  });
};
