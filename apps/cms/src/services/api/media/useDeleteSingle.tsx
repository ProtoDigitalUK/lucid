import T from "@/translations";
import { createSignal, onCleanup } from "solid-js";
import { createMutation, useQueryClient } from "@tanstack/solid-query";
// Utils
import { validateSetError } from "@/utils/error-handling";
import spawnToast from "@/utils/spawn-toast";
import request from "@/utils/request";
// Types
import { APIResponse, APIErrorResponse } from "@/types/api";
import { RoleResT } from "@lucid/types/src/roles";

interface Params {
  id: number;
}

export const deleteSingleReq = (params: Params) => {
  return request<APIResponse<RoleResT>>({
    url: `/api/v1/media/${params.id}`,
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
  const deleteMedia = createMutation({
    mutationFn: deleteSingleReq,
    onSettled: (data, error) => {
      if (data) {
        spawnToast({
          title: T("media_deleted_toast_title"),
          message: T("media_deleted_toast_message"),
          status: "success",
        });
        setErrors(undefined);
        props.onSuccess?.();
        queryClient.invalidateQueries(["media.getMultiple"]);
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
    action: deleteMedia,
    errors: errors,
    reset: () => {
      setErrors(undefined);
      deleteMedia.reset();
    },
  };
};

export default useDeleteSingle;
