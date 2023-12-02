import T from "@/translations";
// Utils
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
// Types
import { APIResponse } from "@/types/api";
import { UserResT } from "@headless/types/src/users";

interface Params {
  id: number;
  body: {
    role_ids?: number[];
    super_admin?: boolean;
  };
}

export const updateSingleReq = (params: Params) => {
  return request<APIResponse<UserResT>>({
    url: `/api/v1/users/${params.id}`,
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
  // -----------------------------
  // Mutation
  return serviceHelpers.useMutationWrapper<Params, APIResponse<UserResT>>({
    mutationFn: updateSingleReq,
    successToast: {
      title: T("user_update_toast_title"),
      message: T("user_update_toast_message"),
    },
    invalidates: ["users.getMultiple", "users.getSingle"],
    onSuccess: props?.onSuccess,
    onError: props?.onError,
  });
};

export default useUpdateSingle;
