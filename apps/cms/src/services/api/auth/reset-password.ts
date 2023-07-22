import request from "@/utils/request";
import api from "@/services/api";

interface Params {
  token: string;
  password: string;
  password_confirmation: string;
}

const resetPassword = async (params: Params) => {
  const csrfRes = await api.auth.csrf();

  return request<
    APIResponse<{
      message: string;
    }>
  >(`/api/v1/auth/reset-password/${params.token}`, {
    method: "PATCH",
    body: JSON.stringify({
      password: params.password,
      password_confirmation: params.password_confirmation,
    }),
    headers: {
      _csrf: csrfRes.data._csrf,
    },
  });
};

export default resetPassword;
