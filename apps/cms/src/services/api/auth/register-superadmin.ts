import request from "@/utils/request";
// Types
import { UserResT } from "@lucid/types/src/users";

interface Params {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

const registerSuperAdmin = (params: Params) => {
  return request<APIResponse<UserResT>>({
    url: `/api/v1/auth/register-superadmin`,
    csrf: true,
    config: {
      method: "POST",
      body: JSON.stringify(params),
    },
  });
};

export default registerSuperAdmin;