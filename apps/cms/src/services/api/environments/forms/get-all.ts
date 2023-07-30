import request from "@/utils/request";
import { FormResT } from "@lucid/types/src/forms";

interface Props {
  include: {
    fields: boolean;
  };
  filters?: {
    environment_key: string;
  };
}

const getAll = (props: Props) => {
  return request<APIResponse<FormResT[]>>({
    url: `/api/v1/forms`,
    query: {
      include: [{ key: "fields", include: props.include.fields }],
      filters: props.filters,
    },
    config: {
      method: "GET",
    },
  });
};

export default getAll;
