import request from "@/utils/request";
// Types
import { FormResT } from "@lucid/types/src/forms";
import { APIResponse } from "@/types/api";

interface Params {
  include: {
    fields: boolean;
  };
  filters?: {
    environment_key: string;
  };
}

const getAll = (params: Params) => {
  return request<APIResponse<FormResT[]>>({
    url: `/api/v1/forms`,
    query: {
      include: [{ key: "fields", include: params.include.fields }],
      filters: params.filters,
    },
    config: {
      method: "GET",
    },
  });
};

export default getAll;
