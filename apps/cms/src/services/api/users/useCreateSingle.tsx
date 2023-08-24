import T from "@/translations";
import { createSignal, onCleanup } from "solid-js";
import { createMutation, useQueryClient } from "@tanstack/solid-query";
// Utils
import { validateSetError } from "@/utils/error-handling";
import spawnToast from "@/utils/spawn-toast";
import request from "@/utils/request";
// Types
import { APIResponse, APIErrorResponse } from "@/types/api";
import { UserResT } from "@lucid/types/src/users";

interface Params {
  body: {
    email: string;
    username: string;
    password: string;
    first_name?: string;
    last_name?: string;
    super_admin?: boolean;
    role_ids: number[];
  };
}

export const createSingleReq = (params: Params) => {
  return request<APIResponse<UserResT>>({
    url: `/api/v1/users`,
    csrf: true,
    config: {
      method: "POST",
      body: params.body,
    },
  });
};

interface UseUpdateSingleProps {
  onSuccess?: () => void;
  onError?: () => void;
}

const useCreateSingle = (props?: UseUpdateSingleProps) => {
  // ----------------------------------------
  // States / Hooks
  const [errors, setErrors] = createSignal<APIErrorResponse>();
  const queryClient = useQueryClient();

  // ----------------------------------------
  // Queries / Mutations
  const createUser = createMutation({
    mutationFn: createSingleReq,
    onSettled: (data, error) => {
      if (data) {
        spawnToast({
          title: T("user_create_toast_title"),
          message: T("user_create_toast_message"),
          status: "success",
        });
        props?.onSuccess && props.onSuccess();
        queryClient.invalidateQueries(["users.getMultiple"]);
      } else if (error) {
        props?.onError && props.onError();
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
    action: createUser,
    errors: errors,
    reset: () => {
      setErrors(undefined);
      createUser.reset();
    },
  };
};

export default useCreateSingle;
