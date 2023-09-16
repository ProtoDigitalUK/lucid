import T from "@/translations";
// Utils
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
// Types
import { APIResponse } from "@/types/api";

interface Params {
  id: number;
  headers: {
    "lucid-environment": string;
  };
}

export const deleteSingleReq = (params: Params) => {
  return request<APIResponse<null>>({
    url: `/api/v1/pages/${params.id}`,
    csrf: true,
    config: {
      method: "DELETE",
      headers: {
        "lucid-environment": params.headers["lucid-environment"],
      },
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
  return serviceHelpers.useMutationWrapper<Params, APIResponse<null>>({
    mutationFn: deleteSingleReq,
    successToast: {
      title: T("page_deleted_toast_title"),
      message: T("page_deleted_toast_message"),
    },
    invalidates: ["environment.collections.pages.getMultiple"],
    onSuccess: props.onSuccess,
    onError: props.onError,
  });
};

export default useDeleteSingle;
