import T from "@/translations";
// Utils
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
// Types
import { APIResponse } from "@/types/api";
import { RoleResT } from "@lucid/types/src/roles";

interface Params {
  id: number;
}

export const deleteSingleReq = (params: Params) => {
  return request<APIResponse<RoleResT>>({
    url: `/api/v1/roles/${params.id}`,
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
  // -----------------------------
  // Mutation
  return serviceHelpers.useMutationWrapper<Params, APIResponse<RoleResT>>({
    mutationFn: deleteSingleReq,
    successToast: {
      title: T("role_deleted_toast_title"),
      message: T("role_deleted_toast_message"),
    },
    invalidates: ["roles.getMultiple", "roles.getSingle"],
    onSuccess: props.onSuccess,
    onError: props.onError,
  });
};

export default useDeleteSingle;
