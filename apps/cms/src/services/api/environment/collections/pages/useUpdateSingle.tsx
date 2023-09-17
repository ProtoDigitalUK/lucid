import T from "@/translations";
// Utils
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
// Types
import { APIResponse } from "@/types/api";

interface Params {
  id: number;
  body: {
    title?: string;
    slug?: string;
    homepage?: boolean;
    excerpt?: string;
    published?: boolean;
    parent_id?: number | null;
    category_ids?: number[];

    // TODO: Add types
    builder_bricks?: [];
    fixed_bricks?: [];
  };
  headers: {
    "lucid-environment": string;
  };
}

export const updateSingleReq = (params: Params) => {
  return request<APIResponse<null>>({
    url: `/api/v1/pages/${params.id}`,
    csrf: true,
    config: {
      method: "PATCH",
      body: params.body,
      headers: {
        "lucid-environment": params.headers["lucid-environment"],
      },
    },
  });
};

interface UseUpdateSingleProps {
  onSuccess?: () => void;
  onError?: () => void;
  collectionName: string;
}

const useUpdateSingle = (props: UseUpdateSingleProps) => {
  // -----------------------------
  // Mutation
  return serviceHelpers.useMutationWrapper<Params, APIResponse<null>>({
    mutationFn: updateSingleReq,
    successToast: {
      title: T("update_toast_title", {
        name: props.collectionName,
      }),
      message: T("update_toast_message", {
        name: {
          value: props.collectionName,
          toLowerCase: true,
        },
      }),
    },
    invalidates: [
      "environment.collections.pages.getMultiple",
      "environment.collections.pages.getSingle",
    ],
    onSuccess: props?.onSuccess,
    onError: props?.onError,
  });
};

export default useUpdateSingle;
