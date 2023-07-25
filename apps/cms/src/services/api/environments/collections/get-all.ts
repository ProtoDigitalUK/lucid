import request from "@/utils/request";
import queryBuilder from "@/utils/query-builder";
import { CollectionResT } from "@lucid/types/src/collections";
// State
import { environment } from "@/state/environment";

interface Props {
  include: {
    bricks: boolean;
  };
}

const getAll = (props: Props) => {
  return request<APIResponse<CollectionResT[]>>(
    `/api/v1/collections?${queryBuilder({
      include: [
        {
          key: "bricks",
          include: props.include.bricks,
        },
      ],
    })}`,
    {
      method: "GET",
      headers: {
        "lucid-environment": environment() || "",
      },
    }
  );
};

export default getAll;
