import T from "@/translations";
import { createSignal, onCleanup } from "solid-js";
import { createMutation } from "@tanstack/solid-query";
import { useNavigate } from "@solidjs/router";
// Utils
import { validateSetError } from "@/utils/error-handling";
import spawnToast from "@/utils/spawn-toast";
import request from "@/utils/request";
// Types
import { APIErrorResponse, APIResponse } from "@/types/api";

interface Params {
  token: string;
  password: string;
  password_confirmation: string;
}

export const resetPasswordReq = async (params: Params) => {
  return request<
    APIResponse<{
      message: string;
    }>
  >({
    url: `/api/v1/auth/reset-password/${params.token}`,
    csrf: true,
    config: {
      method: "PATCH",
      body: {
        password: params.password,
        password_confirmation: params.password_confirmation,
      },
    },
  });
};

const useResetPassword = () => {
  // ----------------------------------------
  // States / Hooks
  const navigate = useNavigate();
  const [errors, setErrors] = createSignal<APIErrorResponse>();

  // ----------------------------------------
  // Queries / Mutations
  const resetPassword = createMutation({
    mutationFn: resetPasswordReq,
    onSettled: (data, error) => {
      if (data) {
        spawnToast({
          title: T("password_reset_success_toast_title"),
          message: T("password_reset_success_toast_message"),
          status: "success",
        });
        setErrors(undefined);
        navigate("/login");
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
    action: resetPassword,
    errors: errors,
    reset: () => {
      setErrors(undefined);
      resetPassword.reset();
    },
  };
};

export default useResetPassword;
