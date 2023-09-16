import T from "@/translations";
// Utils
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
// Types
import { APIResponse } from "@/types/api";

interface Params {
  body: {
    title: string;
    slug: string;
    collection_key: string;
    homepage?: boolean;
    excerpt?: string;
    published?: boolean;
    parent_id?: number;
    category_ids?: number[];
  };
  headers: {
    "lucid-environment": string;
  };
}

export const createSingleReq = (params: Params) => {
  return request<APIResponse<null>>({
    url: `/api/v1/pages`,
    csrf: true,
    config: {
      method: "POST",
      body: params.body,
      headers: {
        "lucid-environment": params.headers["lucid-environment"],
      },
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
  return serviceHelpers.useMutationWrapper<Params, APIResponse<null>>({
    mutationFn: createSingleReq,
    successToast: {
      title: T("page_create_toast_title"),
      message: T("page_create_toast_message"),
    },
    invalidates: ["environment.collections.pages.getMultiple"],
    onSuccess: props?.onSuccess,
    onError: props?.onError,
  });
};

export default useCreateSingle;
