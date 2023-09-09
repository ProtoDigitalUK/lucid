import T from "@/translations";
import { createSignal, onCleanup } from "solid-js";
import { createMutation, useQueryClient } from "@tanstack/solid-query";
// Utils
import { validateSetError } from "@/utils/error-handling";
import spawnToast from "@/utils/spawn-toast";
import request from "@/utils/request";
import objectToFormData from "@/utils/object-to-formdata";
// Types
import { APIResponse, APIErrorResponse } from "@/types/api";
import { MediaResT } from "@lucid/types/src/media";

interface Params {
  id: number;
  body: {
    name?: string;
    alt?: string;
    file?: File;
  };
}

export const updateSingleReq = (params: Params) => {
  return request<APIResponse<MediaResT>>({
    url: `/api/v1/media/${params.id}`,
    csrf: true,
    config: {
      method: "PATCH",
      body: objectToFormData(params.body),
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
  const updateMedia = createMutation({
    mutationFn: updateSingleReq,
    onSettled: (data, error) => {
      if (data) {
        spawnToast({
          title: T("media_update_toast_title"),
          message: T("media_update_toast_message"),
          status: "success",
        });
        props?.onSuccess && props.onSuccess();
        queryClient.invalidateQueries(["media.getMultiple"]);
        queryClient.invalidateQueries(["media.getSingle"]);
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
    action: updateMedia,
    errors: errors,
    reset: () => {
      setErrors(undefined);
      updateMedia.reset();
    },
  };
};

export default useUpdateSingle;
