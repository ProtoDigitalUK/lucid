import request from "@/utils/request";
// Types
import { APIResponse } from "@/types/api";

const logout = () => {
  return request<
    APIResponse<{
      message: string;
    }>
  >({
    url: `/api/v1/auth/logout`,
    config: {
      method: "POST",
    },
  });
};

export default logout;
