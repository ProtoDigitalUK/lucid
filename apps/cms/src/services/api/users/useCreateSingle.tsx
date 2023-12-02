import T from "@/translations";
// Utils
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
// Types
import { APIResponse } from "@/types/api";
import { UserResT } from "@headless/types/src/users";

interface Params {
  body: {
    email: string;
    username: string;
    password: string;
    password_confirmation: string;
    first_name?: string;
    last_name?: string;
    super_admin?: boolean;
    role_ids: number[];
  };
}

export const createSingleReq = (params: Params) => {
  return request<APIResponse<UserResT>>({
    url: `/api/v1/users`,
    csrf: true,
    config: {
      method: "POST",
      body: params.body,
    },
  });
};

interface UseUpdateSingleProps {
  onSuccess?: () => void;
  onError?: () => void;
}

const useCreateSingle = (props?: UseUpdateSingleProps) => {
  // -----------------------------
  // Mutation
  return serviceHelpers.useMutationWrapper<Params, APIResponse<UserResT>>({
    mutationFn: createSingleReq,
    successToast: {
      title: T("user_create_toast_title"),
      message: T("user_create_toast_message"),
    },
    invalidates: ["users.getMultiple"],
    onSuccess: props?.onSuccess,
    onError: props?.onError,
  });
};

export default useCreateSingle;
