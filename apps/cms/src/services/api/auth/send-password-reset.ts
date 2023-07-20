import request from "@/utils/request";
import api from "@/services/api";

interface Params {
  email: string;
}

const sendPasswordReset = async (params: Params) => {
  const csrfRes = await api.auth.csrf();

  return request<
    APIResponse<{
      message: string;
    }>
  >(`/api/v1/auth/reset-password`, {
    method: "POST",
    body: JSON.stringify(params),
    headers: {
      _csrf: csrfRes.data._csrf,
    },
  });
};

export default sendPasswordReset;
