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
}

export const deleteSingleReq = (params: Params) => {
  return request<APIResponse<UserResT>>({
    url: `/api/v1/users/${params.id}`,
    csrf: true,
    config: {
      method: "DELETE",
    },
  });
};

interface UseDeleteProps {
  onSuccess?: () => void;
  onError?: () => void;
}

const useDeleteSingle = (props: UseDeleteProps) => {
  // ----------------------------------------
  // States / Hooks
  const [errors, setErrors] = createSignal<APIErrorResponse>();
  const queryClient = useQueryClient();

  // ----------------------------------------
  // Queries / Mutations
  const deleteUser = createMutation({
    mutationFn: deleteSingleReq,
    onSettled: (data, error) => {
      if (data) {
        spawnToast({
          title: T("user_deleted_toast_title"),
          message: T("user_deleted_toast_message"),
          status: "success",
        });
        setErrors(undefined);
        props.onSuccess?.();
        queryClient.invalidateQueries(["users.getMultiple"]);
        queryClient.invalidateQueries(["users.getSingle"]);
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
    action: deleteUser,
    errors: errors,
    reset: () => {
      setErrors(undefined);
      deleteUser.reset();
    },
  };
};

export default useDeleteSingle;
