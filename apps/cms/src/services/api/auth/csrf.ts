import request from "@/utils/request";

const csrf = () => {
  return request<APIResponse<CSRFRes>>(`/api/v1/auth/csrf`, {
    method: "GET",
  });
};

export default csrf;
