import request from "@/utils/request";

interface Params {
  key: "initial_user_created";
}

const login = (params: Params) => {
  return request<APIResponse<OptionRes>>(
    `/api/v1/options/public/${params.key}`,
    {
      method: "GET",
    }
  );
};

export default login;
