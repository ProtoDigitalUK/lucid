import { createSignal, onCleanup } from "solid-js";
import { createMutation } from "@tanstack/solid-query";
// Utils
import { validateSetError } from "@/utils/error-handling";
import request from "@/utils/request";
// Types
import { APIResponse } from "@/types/api";
import { APIErrorResponse } from "@/types/api";

export const csrfReq = () => {
  return request<
    APIResponse<{
      _csrf: string;
    }>
  >({
    url: `/api/v1/auth/csrf`,
    config: {
      method: "GET",
    },
  });
};

const useCsrf = () => {
  // ----------------------------------------
  // States / Hooks
  const [errors, setErrors] = createSignal<APIErrorResponse>();

  // ----------------------------------------
  // Queries / Mutations
  const csrf = createMutation({
    mutationFn: csrfReq,
    onSettled: (data, error) => {
      if (data) {
        setErrors(undefined);
      } else if (error) {
        validateSetError(error, setErrors);
      }
    },
  });

  // ----------------------------------------
  // On Cleanup
  onCleanup(() => {
    setErrors(undefined);
  });

  // ----------------------------------------
  // Return
  return {
    action: csrf,
    errors: errors,
  };
};

export default useCsrf;
