import request from "@/utils/request";
import api from "@/services/api";
// Types
import { UserResT } from "@lucid/types/src/users";

interface Params {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

const registerSuperAdmin = async (params: Params) => {
  const csrfRes = await api.auth.csrf();

  return request<APIResponse<UserResT>>(`/api/v1/auth/register-superadmin`, {
    method: "POST",
    body: JSON.stringify(params),
    headers: {
      _csrf: csrfRes.data._csrf,
    },
  });
};

export default registerSuperAdmin;
