import T from "@/translations";
// Utils
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
// Types
import { APIResponse } from "@/types/api";
import { EnvironmentResT } from "@headless/types/src/environments";

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

interface UseUpdateSingleProps {
  onSuccess?: () => void;
  onError?: () => void;
}

const useUpdateSingle = (props?: UseUpdateSingleProps) => {
  // -----------------------------
  // Mutation
  return serviceHelpers.useMutationWrapper<
    Params,
    APIResponse<EnvironmentResT>
  >({
    mutationFn: updateSingleReq,
    successToast: {
      title: T("environment_updated_toast_title"),
      message: T("environment_updated_toast_message"),
    },
    invalidates: [
      "environment.getSingle",
      "environment.getAll",
      "environment.collections.getAll",
    ],
    onSuccess: props?.onSuccess,
    onError: props?.onError,
  });
};

export default useUpdateSingle;
