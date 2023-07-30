import request from "@/utils/request";
import { BrickConfigT } from "@lucid/types/src/bricks";

interface Props {
  include: {
    fields: boolean;
  };
  filters?: {
    environment_key: string;
    collection_key: string;
  };
}

const getAll = (props: Props) => {
  return request<APIResponse<BrickConfigT[]>>({
    url: `/api/v1/bricks/config`,
    query: {
      include: [
        {
          key: "fields",
          include: props.include.fields,
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
