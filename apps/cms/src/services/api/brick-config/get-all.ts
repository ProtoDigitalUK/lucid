import request from "@/utils/request";
// Types
import { APIResponse } from "@/types/api";
import { BrickConfigT } from "@lucid/types/src/bricks";

interface Params {
  include: {
    fields: boolean;
  };
  filters?: {
    environment_key: string;
    collection_key: string;
  };
}

const getAll = (params: Params) => {
  return request<APIResponse<BrickConfigT[]>>({
    url: `/api/v1/bricks/config`,
    query: {
      include: [
        {
          key: "fields",
          include: params.include.fields,
        },
      ],
      filters: params.filters,
    },
    config: {
      method: "GET",
    },
  });
};

export default getAll;
