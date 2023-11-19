import T from "@/translations";
// Utils
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
// Types
import type { APIResponse } from "@/types/api";
import type { BrickDataT } from "@/store/builderStore";

interface Params {
  id: number;
  collectionKey: string;
  body: {
    bricks: Array<BrickDataT>;
  };
  headers: {
    "lucid-environment": string;
  };
}

export const updateBricksReq = (params: Params) => {
  return request<APIResponse<null>>({
    url: `/api/v1/pages/${params.collectionKey}/${params.id}/bricks`,
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

interface UseUpdateBricksProps {
  onSuccess?: () => void;
  onError?: () => void;
}

const useUpdateBricks = (props: UseUpdateBricksProps) => {
  // -----------------------------
  // Mutation
  return serviceHelpers.useMutationWrapper<Params, APIResponse<null>>({
    mutationFn: updateBricksReq,
    successToast: {
      title: T("update_toast_title", {
        name: "Bricks",
      }),
      message: T("update_toast_message", {
        name: {
          value: "Bricks",
          toLowerCase: true,
        },
      }),
    },
    invalidates: ["environment.collections.pages.getSingle"],
    onSuccess: props?.onSuccess,
    onError: props?.onError,
  });
};

export default useUpdateBricks;
