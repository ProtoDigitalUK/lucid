import { createQuery } from "@tanstack/solid-query";
// Services
import api from "@/services/api";

export const useVerifyResetToken = (
  props: Parameters<typeof api.auth.verifyResetToken>[0],
  options?: {
    enabled?: boolean;
  }
) => {
  const key = JSON.stringify(props);

  return createQuery(() => ["auth.verifyResetToken", key], {
    queryFn: () => api.auth.verifyResetToken(props),
    retry: 0,
    enabled: options?.enabled,
  });
};
