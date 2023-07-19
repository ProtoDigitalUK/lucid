import request from "@/utils/request";
// Types
import { OptionsResT } from "@lucid/types/src/options";

interface Params {
  key: "initial_user_created";
}

const login = (params: Params) => {
  return request<APIResponse<OptionsResT>>(
    `/api/v1/options/public/${params.key}`,
    {
      method: "GET",
    }
  );
};

export default login;
