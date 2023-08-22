import T from "@/translations";
import { createSignal, onCleanup } from "solid-js";
import { createMutation } from "@tanstack/solid-query";
import { useNavigate } from "@solidjs/router";
// Utils
import { validateSetError } from "@/utils/error-handling";
import spawnToast from "@/utils/spawn-toast";
import request from "@/utils/request";
// Types
import { APIResponse } from "@/types/api";
import { UserResT } from "@lucid/types/src/users";
import { APIErrorResponse } from "@/types/api";

interface Params {
  username: string;
  password: string;
}

export const loginReq = (params: Params) => {
  return request<APIResponse<UserResT>>({
    url: `/api/v1/auth/login`,
    csrf: true,
    config: {
      method: "POST",
      body: params,
    },
  });
};

const useLogin = () => {
  // ----------------------------------------
  // States / Hooks
  const navigate = useNavigate();
  const [errors, setErrors] = createSignal<APIErrorResponse>();

  // ----------------------------------------
  // Queries / Mutations
  const login = createMutation({
    mutationFn: loginReq,
    onSettled: (data, error) => {
      if (data) {
        spawnToast({
          title: T("login_success_toast_title"),
          message: T("login_success_toast_message"),
          status: "success",
        });
        navigate("/");
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
    action: login,
    errors: errors,
    reset: () => {
      setErrors(undefined);
      login.reset();
    },
  };
};

export default useLogin;
