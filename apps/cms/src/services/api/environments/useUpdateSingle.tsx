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
          title: "Environment Updated",
          message: "Your environment has been updated successfully.",
          status: "success",
        });
        setErrors(undefined);

        queryClient.invalidateQueries(["environments.getSingle"]);
        queryClient.invalidateQueries(["environments.getAll"]);
        queryClient.invalidateQueries(["environments.collections.getAll"]);
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
