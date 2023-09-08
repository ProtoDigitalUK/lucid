import T from "@/translations";
import { createSignal, onCleanup } from "solid-js";
import { createMutation, useQueryClient } from "@tanstack/solid-query";
// Utils
import { validateSetError } from "@/utils/error-handling";
import spawnToast from "@/utils/spawn-toast";
import request from "@/utils/request";
// Types
import { APIResponse, APIErrorResponse } from "@/types/api";

export const deleteAllProcessedImagesReq = () => {
  return request<APIResponse<null>>({
    url: `/api/v1/media/processed`,
    csrf: true,
    config: {
      method: "DELETE",
    },
  });
};

interface UseDeleteAllProcessedImagesProps {
  onSuccess?: () => void;
  onError?: () => void;
}

const useDeleteAllProcessedImages = (
  props: UseDeleteAllProcessedImagesProps
) => {
  // ----------------------------------------
  // States / Hooks
  const [errors, setErrors] = createSignal<APIErrorResponse>();
  const queryClient = useQueryClient();

  // ----------------------------------------
  // Queries / Mutations
  const deleteAllProcessedImages = createMutation({
    mutationFn: deleteAllProcessedImagesReq,
    onSettled: (data, error) => {
      if (data) {
        spawnToast({
          title: T("delete_processed_images_toast_title"),
          message: T("delete_processed_images_toast_message"),
          status: "success",
        });
        setErrors(undefined);
        props.onSuccess?.();
        queryClient.invalidateQueries(["settings.getSettings"]);
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
    action: deleteAllProcessedImages,
    errors: errors,
    reset: () => {
      setErrors(undefined);
      deleteAllProcessedImages.reset();
    },
  };
};

export default useDeleteAllProcessedImages;
