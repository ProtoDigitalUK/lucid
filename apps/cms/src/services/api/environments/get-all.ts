import request from "@/utils/request";
import { EnvironmentResT } from "@lucid/types/src/environments";

const getAll = () => {
  return request<APIResponse<EnvironmentResT[]>>({
    url: `/api/v1/environments`,
    config: {
      method: "GET",
    },
  });
};

export default getAll;
