// Utils
import request from "@/utils/request";
import objectToFormData from "@/utils/object-to-formdata";
import serviceHelpers from "@/utils/service-helpers";
// Types
import { APIResponse } from "@/types/api";
import { MediaResT } from "@headless/types/src/media";

interface Params {
  body: {
    file: File;
  };
}
interface Response {
  id: MediaResT["id"];
}

export const uploadSingleFileReq = (params: Params) => {
  return request<APIResponse<Response>>({
    url: `/api/v1/media/file`,
    csrf: true,
    config: {
      method: "POST",
      body: objectToFormData(params.body),
    },
  });
};

interface UseUploadFileSingleProps {
  onSuccess?: (_data: APIResponse<Response>) => void;
  onError?: () => void;
}

const useUploadFileSingle = (props?: UseUploadFileSingleProps) => {
  // -----------------------------
  // Mutation
  return serviceHelpers.useMutationWrapper<Params, APIResponse<Response>>({
    mutationFn: uploadSingleFileReq,
    invalidates: ["media.getMultiple"],
    onSuccess: props?.onSuccess,
    onError: props?.onError,
  });
};

export default useUploadFileSingle;
