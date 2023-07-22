import request from "@/utils/request";
import { EnvironmentResT } from "@lucid/types/src/environments";

const getAll = () => {
  return request<APIResponse<EnvironmentResT[]>>(`/api/v1/environments`, {
    method: "GET",
  });
};

export default getAll;
