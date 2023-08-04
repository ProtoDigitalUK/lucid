import { createQuery } from "@tanstack/solid-query";
// Services
import api from "@/services/api";

export const useGetAll = (
  props: Parameters<typeof api.environments.forms.getAll>[0],
  options?: {
    enabled?: boolean;
  }
) => {
  const key = JSON.stringify(props);

  return createQuery(() => ["environments.forms.getAll", key], {
    queryFn: () => api.environments.forms.getAll(props),
    enabled: options?.enabled,
  });
};
