import T from "@/translations";
import { createSignal, onCleanup } from "solid-js";
import { createMutation, useQueryClient } from "@tanstack/solid-query";
import { useNavigate } from "@solidjs/router";
// Utils
import { validateSetError } from "@/utils/error-handling";
import spawnToast from "@/utils/spawn-toast";
import request from "@/utils/request";
// State
import { setEnvironment, environment } from "@/state/environment";
// Types
import { APIResponse, APIErrorResponse } from "@/types/api";
import { EnvironmentResT } from "@lucid/types/src/environments";

interface Params {
  key: string;
}

export const deleteSingleReq = (params: Params) => {
  return request<APIResponse<EnvironmentResT>>({
    url: `/api/v1/environments/${params.key}`,
    csrf: true,
    config: {
      method: "DELETE",
    },
  });
};

interface UseDeleteProps {
  onSuccess?: () => void;
}

const useDeleteSingle = (props: UseDeleteProps) => {
  // ----------------------------------------
  // States / Hooks
  const navigate = useNavigate();
  const [errors, setErrors] = createSignal<APIErrorResponse>();
  const queryClient = useQueryClient();

  // ----------------------------------------
  // Queries / Mutations
  const deleteEnvironment = createMutation({
    mutationFn: deleteSingleReq,
    onSettled: (data, error) => {
      if (data) {
        spawnToast({
          title: T("environment_deleted_toast_title"),
          message: T("environment_deleted_toast_message"),
          status: "success",
        });
        setErrors(undefined);

        if (data.data.key === environment()) {
          setEnvironment(undefined);
          navigate("/");
        }

        props.onSuccess?.();

        queryClient.invalidateQueries(["environment.getAll"]);
        queryClient.invalidateQueries(["environment.collections.getAll"]);
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
    action: deleteEnvironment,
    errors: errors,
  };
};

export default useDeleteSingle;
