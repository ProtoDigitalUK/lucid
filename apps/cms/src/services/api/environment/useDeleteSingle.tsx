import T from "@/translations";
import { useNavigate } from "@solidjs/router";
// Utils
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
// Store
import { setEnvironment, environment } from "@/store/environmentStore";
// Types
import { APIResponse } from "@/types/api";
import { EnvironmentResT } from "@headless/types/src/environments";

interface Params {
  key: string;
}

export const deleteSingleReq = (params: Params) => {
  return request<APIResponse<EnvironmentResT>>({
    url: `/api/v1/environments/${params.key}`,
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
  const navigate = useNavigate();

  // -----------------------------
  // Mutation
  return serviceHelpers.useMutationWrapper<
    Params,
    APIResponse<EnvironmentResT>
  >({
    mutationFn: deleteSingleReq,
    successToast: {
      title: T("environment_deleted_toast_title"),
      message: T("environment_deleted_toast_message"),
    },
    invalidates: ["environment.getAll", "environment.collections.getAll"],
    onSuccess: (data) => {
      props.onSuccess?.();
      if (data.data.key === environment()) {
        setEnvironment(undefined);
        navigate("/");
      }
    },
    onError: props.onError,
  });
};

export default useDeleteSingle;
