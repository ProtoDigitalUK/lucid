import request from "@/utils/request";
// Types
import { APIResponse } from "@/types/api";

const csrf = () => {
  return request<
    APIResponse<{
      _csrf: string;
    }>
  >({
    url: `/api/v1/auth/csrf`,
    config: {
      method: "GET",
    },
  });
};

export default csrf;
