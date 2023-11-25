import T from "@/translations";
// Utils
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
// Types
import type { APIResponse, APIErrorResponse } from "@/types/api";
import type { BrickDataT } from "@/store/builderStore";

interface Params {
  id: number;
  body: {
    homepage?: boolean;
    published?: boolean;
    parent_id?: number | null;
    category_ids?: number[];
    author_id?: number | null;
    translations?: {
      title: string | null;
      slug: string | null;
      excerpt: string | null;
      language_id: number;
    }[];
    bricks?: Array<BrickDataT>;
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
  onError?: (_errors: APIErrorResponse | undefined) => void;
  collectionName: string;
}

const useUpdateSingle = (props: UseUpdateSingleProps) => {
  // -----------------------------
  // Mutation
  return serviceHelpers.useMutationWrapper<Params, APIResponse<null>>({
    mutationFn: updateSingleReq,
    successToast: {
      title: T("update_toast_title", {
        name: props.collectionName || "Content",
      }),
      message: T("update_toast_message", {
        name: {
          value: props.collectionName || "Content",
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
