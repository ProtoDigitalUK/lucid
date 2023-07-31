import request from "@/utils/request";
import { EnvironmentResT } from "@lucid/types/src/environments";

interface Params {
  key: string;
  title: string;
  assigned_bricks: string[];
  assigned_collections: string[];
  assigned_forms: string[];
}

const createSingle = (params: Params) => {
  return request<APIResponse<EnvironmentResT>>({
    url: `/api/v1/environments`,
    csrf: true,
    config: {
      method: "POST",
      body: JSON.stringify(params),
    },
  });
};

export default createSingle;