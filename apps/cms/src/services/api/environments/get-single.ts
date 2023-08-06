import request from "@/utils/request";
// Types
import { APIResponse } from "@/types/api";
import { EnvironmentResT } from "@lucid/types/src/environments";

interface Params {
  key: string;
}

const getSingle = (params: Params) => {
  return request<APIResponse<EnvironmentResT>>({
    url: `/api/v1/environments/${params.key}`,
    config: {
      method: "GET",
    },
  });
};

export default getSingle;
