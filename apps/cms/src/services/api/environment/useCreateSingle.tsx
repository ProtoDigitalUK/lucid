import T from "@/translations";
import { useNavigate } from "@solidjs/router";
// Utils
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
// Store
import { setEnvironment } from "@/store/environmentStore";
// Types
import { APIResponse } from "@/types/api";
import { EnvironmentResT } from "@headless/types/src/environments";

interface Params {
  key: string;
  title: string;
  assigned_bricks: string[];
  assigned_collections: string[];
  assigned_forms: string[];
}

export const createSingleReq = (params: Params) => {
  return request<APIResponse<EnvironmentResT>, Params>({
    url: `/api/v1/environments`,
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
  const navigate = useNavigate();

  // -----------------------------
  // Mutation
  return serviceHelpers.useMutationWrapper<
    Params,
    APIResponse<EnvironmentResT>
  >({
    mutationFn: createSingleReq,
    successToast: {
      title: T("environment_created_toast_title"),
      message: T("environment_created_toast_message"),
    },
    invalidates: ["environment.getAll", "environment.collections.getAll"],
    onSuccess: (data) => {
      setEnvironment(data.data.key);
      navigate(`/env/${data.data.key}`);
      props?.onSuccess?.();
    },
    onError: () => {
      props?.onError?.();
    },
  });
};

export default useCreateSingle;
