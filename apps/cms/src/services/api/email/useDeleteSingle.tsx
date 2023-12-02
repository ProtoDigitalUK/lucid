import T from "@/translations";
// Utils
import request from "@/utils/request";
import serviceHelpers from "@/utils/service-helpers";
// Types
import { APIResponse } from "@/types/api";
import { EmailResT } from "@headless/types/src/email";

interface Params {
  id: number;
}

export const deleteSingleReq = (params: Params) => {
  return request<APIResponse<EmailResT>>({
    url: `/api/v1/emails/${params.id}`,
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
  // -----------------------------
  // Mutation
  return serviceHelpers.useMutationWrapper<Params, APIResponse<EmailResT>>({
    mutationFn: deleteSingleReq,
    successToast: {
      title: T("email_deleted_toast_title"),
      message: T("email_deleted_toast_message"),
    },
    invalidates: ["email.getMultiple"],
    onSuccess: props.onSuccess,
    onError: props.onError,
  });
};

export default useDeleteSingle;
