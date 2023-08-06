import request from "@/utils/request";
// Types
import { APIResponse } from "@/types/api";

interface Params {
  email: string;
}

const sendPasswordReset = async (params: Params) => {
  return request<
    APIResponse<{
      message: string;
    }>
  >({
    url: `/api/v1/auth/reset-password`,
    csrf: true,
    config: {
      method: "POST",
      body: params,
    },
  });
};

export default sendPasswordReset;
