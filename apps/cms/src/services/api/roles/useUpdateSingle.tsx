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
  body: {
    name?: string;
    permission_groups?: Array<{
      environment_key?: string;
      permissions: string[];
    }>;
  };
}

export const updateSingleReq = (params: Params) => {
  return request<APIResponse<RoleResT>>({
    url: `/api/v1/roles/${params.id}`,
    csrf: true,
    config: {
      method: "PATCH",
      body: params.body,
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
  const updateRole = createMutation({
    mutationFn: updateSingleReq,
    onSettled: (data, error) => {
      if (data) {
        spawnToast({
          title: T("role_update_toast_title"),
          message: T("role_update_toast_message", {
            name: data.data.name,
          }),
          status: "success",
        });
        props?.onSuccess && props.onSuccess();
        queryClient.invalidateQueries(["roles.getMultiple"]);
        queryClient.invalidateQueries(["roles.getSingle"]);
        queryClient.invalidateQueries(["users.getSingle"]);
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
    action: updateRole,
    errors: errors,
    reset: () => {
      setErrors(undefined);
      updateRole.reset();
    },
  };
};

export default useUpdateSingle;
