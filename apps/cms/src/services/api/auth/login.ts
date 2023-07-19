import request from "@/utils/request";
import api from "@/services/api";
// Types
import { UserResT } from "@lucid/types/src/users";

interface Params {
  username: string;
  password: string;
}

const login = async (params: Params) => {
  const csrfRes = await api.auth.csrf();

  return request<APIResponse<UserResT>>(`/api/v1/auth/login`, {
    method: "POST",
    body: JSON.stringify(params),
    headers: {
      _csrf: csrfRes.data._csrf,
    },
  });
};

export default login;
