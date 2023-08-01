import request from "@/utils/request";

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
