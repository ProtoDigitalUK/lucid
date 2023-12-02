import T from "@/translations";
// Utils
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
// Types
import { APIResponse } from "@/types/api";
import { RoleResT } from "@headless/types/src/roles";

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
  // -----------------------------
  // Mutation
  return serviceHelpers.useMutationWrapper<Params, APIResponse<RoleResT>>({
    mutationFn: createSingleReq,
    successToast: {
      title: T("role_created_toast_title"),
      message: T("role_created_toast_message"),
    },
    invalidates: ["roles.getMultiple"],
    onSuccess: props?.onSuccess,
    onError: props?.onError,
  });
};

export default useCreateSingle;
