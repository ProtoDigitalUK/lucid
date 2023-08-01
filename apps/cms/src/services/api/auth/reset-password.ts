import request from "@/utils/request";

interface Params {
  token: string;
  password: string;
  password_confirmation: string;
}

const resetPassword = async (params: Params) => {
  return request<
    APIResponse<{
      message: string;
    }>
  >({
    url: `/api/v1/auth/reset-password/${params.token}`,
    csrf: true,
    config: {
      method: "PATCH",
      body: {
        password: params.password,
        password_confirmation: params.password_confirmation,
      },
    },
  });
};

export default resetPassword;
