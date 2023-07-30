import request from "@/utils/request";

const csrf = () => {
  return request<APIResponse<CSRFRes>>({
    url: `/api/v1/auth/csrf`,
    config: {
      method: "GET",
    },
  });
};

export default csrf;
