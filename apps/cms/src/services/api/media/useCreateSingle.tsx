import T from "@/translations";
// Utils
import request from "@/utils/request";
import objectToFormData from "@/utils/object-to-formdata";
import serviceHelpers from "@/utils/service-helpers";
// Types
import { APIResponse } from "@/types/api";
import { MediaResT } from "@lucid/types/src/media";

interface Params {
  body: {
    name?: string;
    alt?: string;
    file?: File;
  };
}

export const createSingleReq = (params: Params) => {
  return request<APIResponse<MediaResT>>({
    url: `/api/v1/media`,
    csrf: true,
    config: {
      method: "POST",
      body: objectToFormData(params.body),
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
  return serviceHelpers.useMutationWrapper<Params, APIResponse<MediaResT>>({
    mutationFn: createSingleReq,
    successToast: {
      title: T("media_create_toast_title"),
      message: T("media_create_toast_message"),
    },
    invalidates: ["media.getMultiple"],
    onSuccess: props?.onSuccess,
    onError: props?.onError,
  });
};

export default useCreateSingle;
