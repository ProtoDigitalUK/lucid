import T from "@/translations";
import { createSignal, onCleanup } from "solid-js";
import { createMutation, useQueryClient } from "@tanstack/solid-query";
import { useNavigate } from "@solidjs/router";
// Utils
import { validateSetError } from "@/utils/error-handling";
import spawnToast from "@/utils/spawn-toast";
import request from "@/utils/request";
// State
import { setEnvironment } from "@/state/environment";
// Types
import { APIResponse, APIErrorResponse } from "@/types/api";
import { EnvironmentResT } from "@lucid/types/src/environments";

interface Params {
  key: string;
  title: string;
  assigned_bricks: string[];
  assigned_collections: string[];
  assigned_forms: string[];
}

export const createSingleReq = (params: Params) => {
  return request<APIResponse<EnvironmentResT>>({
    url: `/api/v1/environments`,
    csrf: true,
    config: {
      method: "POST",
      body: params,
    },
  });
};

const useCreateSingle = () => {
  // ----------------------------------------
  // States / Hooks
  const navigate = useNavigate();
  const [errors, setErrors] = createSignal<APIErrorResponse>();
  const queryClient = useQueryClient();

  // ----------------------------------------
  // Queries / Mutations
  const createEnvironment = createMutation({
    mutationFn: createSingleReq,
    onSettled: (data, error) => {
      if (data) {
        spawnToast({
          title: T("environment_created_toast_title"),
          message: T("environment_created_toast_message"),
          status: "success",
        });
        setEnvironment(data.data.key);
        navigate(`/env/${data.data.key}`);

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
    action: createEnvironment,
    errors: errors,
    reset: () => {
      setErrors(undefined);
      createEnvironment.reset();
    },
  };
};

export default useCreateSingle;
