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
  name: string;
  permission_groups: Array<{
    environment_key?: string;
    permissions: string[];
  }>;
}

export const createSingleReq = (params: Params) => {
  return request<APIResponse<RoleResT>>({
    url: `/api/v1/roles`,
    csrf: true,
    config: {
      method: "POST",
      body: params,
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
  const createRole = createMutation({
    mutationFn: createSingleReq,
    onSettled: (data, error) => {
      if (data) {
        spawnToast({
          title: T("role_created_toast_title"),
          message: T("role_created_toast_message"),
          status: "success",
        });
        props?.onSuccess && props.onSuccess();
        queryClient.invalidateQueries(["roles.getMultiple"]);
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
    action: createRole,
    errors: errors,
    reset: () => {
      setErrors(undefined);
      createRole.reset();
    },
  };
};

export default useCreateSingle;
