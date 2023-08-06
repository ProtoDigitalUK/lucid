import request from "@/utils/request";
// Types
import { APIResponse } from "@/types/api";
import { EnvironmentResT } from "@lucid/types/src/environments";

interface Params {
  key: string;
  body: {
    title?: string;
    assigned_bricks?: string[];
    assigned_collections?: string[];
    assigned_forms?: string[];
  };
}

const updateSingle = (params: Params) => {
  return request<APIResponse<EnvironmentResT>>({
    url: `/api/v1/environments/${params.key}`,
    csrf: true,
    config: {
      method: "PATCH",
      body: params.body,
    },
  });
};

export default updateSingle;
