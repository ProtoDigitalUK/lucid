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
  body: {
    name?: string;
    alt?: string;
    file?: File;
  };
}

export const createSingleReq = (params: Params) => {
  return request<APIResponse<MediaResT>>({
    url: `/api/v1/media`,
    csrf: true,
    config: {
      method: "POST",
      body: objectToFormData(params.body),
    },
  });
};

interface UseCreateSingleProps {
  onSuccess?: () => void;
  onError?: () => void;
}

const useCreateSingle = (props?: UseCreateSingleProps) => {
  // ----------------------------------------
  // States / Hooks
  const [errors, setErrors] = createSignal<APIErrorResponse>();
  const queryClient = useQueryClient();

  // ----------------------------------------
  // Queries / Mutations
  const createMedia = createMutation({
    mutationFn: createSingleReq,
    onSettled: (data, error) => {
      if (data) {
        spawnToast({
          title: T("media_create_toast_title"),
          message: T("media_create_toast_message"),
          status: "success",
        });
        props?.onSuccess && props.onSuccess();
        queryClient.invalidateQueries(["media.getMultiple"]);
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
    action: createMedia,
    errors: errors,
    reset: () => {
      setErrors(undefined);
      createMedia.reset();
    },
  };
};

export default useCreateSingle;
