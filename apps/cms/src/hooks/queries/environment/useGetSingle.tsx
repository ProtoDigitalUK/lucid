import { createQuery } from "@tanstack/solid-query";
// Services
import api from "@/services/api";

export const useGetSingle = (
  props: Parameters<typeof api.environments.getSingle>[0],
  options?: {
    enabled?: boolean;
  }
) => {
  const key = JSON.stringify(props);

  return createQuery(() => ["environments.getSingle", key], {
    queryFn: () => api.environments.getSingle(props),
    enabled: options?.enabled,
  });
};
