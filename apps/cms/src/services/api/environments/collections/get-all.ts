import request from "@/utils/request";
// Types
import { APIResponse } from "@/types/api";
import { CollectionResT } from "@lucid/types/src/collections";

interface Params {
  include: {
    bricks: boolean;
  };
  filters?: {
    environment_key: string;
  };
}

const getAll = (params: Params) => {
  return request<APIResponse<CollectionResT[]>>({
    url: `/api/v1/collections`,
    query: {
      include: [
        {
          key: "bricks",
          include: params.include.bricks,
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
