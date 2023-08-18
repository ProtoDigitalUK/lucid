import T from "@/translations";
import { createSignal, onCleanup } from "solid-js";
import { createMutation, useQueryClient } from "@tanstack/solid-query";
// Utils
import { validateSetError } from "@/utils/error-handling";
import spawnToast from "@/utils/spawn-toast";
import request from "@/utils/request";
// Types
import { APIResponse, APIErrorResponse } from "@/types/api";
import { EnvironmentResT } from "@lucid/types/src/environments";

interface Params {
  key: string;
  body: {
    title?: string;
    assigned_bricks?: string[];
    assigned_collections?: string[];
    assigned_forms?: string[];
  };
}

export const updateSingleReq = (params: Params) => {
  return request<APIResponse<EnvironmentResT>>({
    url: `/api/v1/environments/${params.key}`,
    csrf: true,
    config: {
      method: "PATCH",
      body: params.body,
    },
  });
};

const useUpdateSingle = () => {
  // ----------------------------------------
  // States / Hooks
  const [errors, setErrors] = createSignal<APIErrorResponse>();
  const queryClient = useQueryClient();

  // ----------------------------------------
  // Queries / Mutations
  const updateEnvironment = createMutation({
    mutationFn: updateSingleReq,
    onSettled: (data, error) => {
      if (data) {
        spawnToast({
          title: T("environment_updated_toast_title"),
          message: T("environment_updated_toast_message"),
          status: "success",
        });
        setErrors(undefined);

        queryClient.invalidateQueries(["environment.getSingle"]);
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
    action: updateEnvironment,
    errors: errors,
  };
};

export default useUpdateSingle;
