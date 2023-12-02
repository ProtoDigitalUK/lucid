import T from "@/translations";
// Utils
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
// Types
import { APIResponse } from "@/types/api";

interface Params {
  body: {
    translations: {
      language_id: number;
      title: string | null;
      slug: string | null;
      excerpt: string | null;
    }[];
    collection_key: string;
    homepage?: boolean;
    published?: boolean;
    parent_id?: number;
    category_ids?: number[];
  };
  headers: {
    "headless-environment": string;
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
        "headless-environment": params.headers["headless-environment"],
      },
    },
  });
};

interface UseCreateSingleProps {
  onSuccess?: () => void;
  onError?: () => void;
  collectionName: string;
}

const useCreateSingle = (props: UseCreateSingleProps) => {
  // -----------------------------
  // Mutation
  return serviceHelpers.useMutationWrapper<Params, APIResponse<null>>({
    mutationFn: createSingleReq,
    successToast: {
      title: T("create_toast_title", {
        name: props.collectionName,
      }),
      message: T("create_toast_message", {
        name: {
          value: props.collectionName,
          toLowerCase: true,
        },
      }),
    },
    invalidates: ["environment.collections.pages.getMultiple"],
    onSuccess: props?.onSuccess,
    onError: props?.onError,
  });
};

export default useCreateSingle;
