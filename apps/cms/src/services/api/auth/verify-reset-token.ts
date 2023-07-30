import request from "@/utils/request";

interface Params {
  token: string;
}

const verifyResetToken = (params: Params) => {
  return request<
    APIResponse<{
      message: string;
    }>
  >({
    url: `/api/v1/auth/reset-password/${params.token}`,
    config: {
      method: "GET",
    },
  });
};

export default verifyResetToken;
