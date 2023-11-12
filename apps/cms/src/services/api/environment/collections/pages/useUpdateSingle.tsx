import T from "@/translations";
// Utils
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
// Types
import { APIResponse } from "@/types/api";
import { BrickStoreFieldT } from "@/store/builderStore";

export interface BrickUpdateFieldT {
  group_position?: number;
  parent_repeater?: number;
  fields_id?: BrickStoreFieldT["fields_id"];
  key: BrickStoreFieldT["key"];
  type: BrickStoreFieldT["type"];
  value?: BrickStoreFieldT["value"];
  target?: "_blank" | "_self";
  items?: BrickUpdateFieldT[];
}

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
    builder_bricks?: Array<{
      id?: number;
      key: string;
      fields: Array<BrickUpdateFieldT>;
    }>;
    fixed_bricks?: Array<{
      id?: number;
      key: string;
      fields: Array<BrickUpdateFieldT>;
    }>;
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
