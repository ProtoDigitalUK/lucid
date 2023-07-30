import request from "@/utils/request";
import { CollectionResT } from "@lucid/types/src/collections";

interface Props {
  include: {
    bricks: boolean;
  };
  filters?: {
    environment_key: string;
  };
}

const getAll = (props: Props) => {
  return request<APIResponse<CollectionResT[]>>({
    url: `/api/v1/collections`,
    query: {
      include: [
        {
          key: "bricks",
          include: props.include.bricks,
        },
      ],
      filters: props.filters,
    },
    config: {
      method: "GET",
    },
  });
};

export default getAll;
