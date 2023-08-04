import { createQuery } from "@tanstack/solid-query";
// Services
import api from "@/services/api";

export const useGetAll = (
  props: Parameters<typeof api.environments.collections.getAll>[0],
  options?: {
    enabled?: boolean;
  }
) => {
  const key = JSON.stringify(props);

  return createQuery(() => ["environments.collections.getAll", key], {
    queryFn: () => api.environments.collections.getAll(props),
    enabled: options?.enabled,
  });
};
