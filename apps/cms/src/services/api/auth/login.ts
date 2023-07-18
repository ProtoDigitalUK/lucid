import request from "@/utils/request";
import api from "@/services/api";

interface Params {
  username: string;
  password: string;
}

const login = async (params: Params) => {
  const csrfRes = await api.auth.csrf();

  return request<APIResponse<UserRes>>(`/api/v1/auth/login`, {
    method: "POST",
    body: JSON.stringify(params),
    headers: {
      _csrf: csrfRes.data._csrf,
    },
  });
};

export default login;
