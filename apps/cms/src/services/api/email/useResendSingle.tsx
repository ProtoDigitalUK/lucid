import T from "@/translations";
import { createSignal, onCleanup } from "solid-js";
import { createMutation, useQueryClient } from "@tanstack/solid-query";
// Utils
import { validateSetError } from "@/utils/error-handling";
import spawnToast from "@/utils/spawn-toast";
import request from "@/utils/request";
// Types
import { APIResponse, APIErrorResponse } from "@/types/api";

interface Params {
  id: number;
}

export const resendSingleReq = (params: Params) => {
  return request<
    APIResponse<{
      success: boolean;
      message: string;
    }>
  >({
    url: `/api/v1/emails/${params.id}/resend`,
    csrf: true,
    config: {
      method: "POST",
    },
  });
};

interface UseResendSingleProps {
  onSuccess?: () => void;
  onError?: () => void;
}

const useResendSingle = (props: UseResendSingleProps) => {
  // ----------------------------------------
  // States / Hooks
  const [errors, setErrors] = createSignal<APIErrorResponse>();
  const queryClient = useQueryClient();

  // ----------------------------------------
  // Queries / Mutations
  const resendEmail = createMutation({
    mutationFn: resendSingleReq,
    onSettled: (data, error) => {
      if (data) {
        setErrors(undefined);

        if (data.data.success) {
          spawnToast({
            title: T("email_resent_toast_title"),
            message: T("email_resent_toast_message"),
            status: "success",
          });
          props.onSuccess?.();
        } else {
          spawnToast({
            title: T("email_resent_toast_erro_title"),
            message: T("email_resent_toast_error_message"),
            status: "error",
          });
        }

        queryClient.invalidateQueries(["email.getMultiple"]);
        queryClient.invalidateQueries(["email.getSingle"]);
      } else if (error) {
        validateSetError(error, setErrors);
        props.onError?.();
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
    action: resendEmail,
    errors: errors,
    reset: () => {
      setErrors(undefined);
      resendEmail.reset();
    },
  };
};

export default useResendSingle;
