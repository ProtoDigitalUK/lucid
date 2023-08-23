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
  id: number;
  body: {
    role_ids?: number[];
  };
}

export const updateSingleReq = (params: Params) => {
  return request<APIResponse<UserResT>>({
    url: `/api/v1/users/${params.id}`,
    csrf: true,
    config: {
      method: "PATCH",
      body: params.body,
    },
  });
};

interface UseUpdateSingleProps {
  onSuccess?: () => void;
  onError?: () => void;
}

const useUpdateSingle = (props?: UseUpdateSingleProps) => {
  // ----------------------------------------
  // States / Hooks
  const [errors, setErrors] = createSignal<APIErrorResponse>();
  const queryClient = useQueryClient();

  // ----------------------------------------
  // Queries / Mutations
  const updateUser = createMutation({
    mutationFn: updateSingleReq,
    onSettled: (data, error) => {
      if (data) {
        spawnToast({
          title: T("user_update_toast_title"),
          message: T("user_update_toast_message"),
          status: "success",
        });
        props?.onSuccess && props.onSuccess();
        queryClient.invalidateQueries(["users.getMultiple"]);
        queryClient.invalidateQueries(["users.getSingle"]);
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
    action: updateUser,
    errors: errors,
    reset: () => {
      setErrors(undefined);
      updateUser.reset();
    },
  };
};

export default useUpdateSingle;
