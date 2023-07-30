import request from "@/utils/request";
import { EnvironmentResT } from "@lucid/types/src/environments";

interface Props {
  key: string;
}

const getSingle = (props: Props) => {
  return request<APIResponse<EnvironmentResT>>({
    url: `/api/v1/environments/${props.key}`,
    config: {
      method: "GET",
    },
  });
};

export default getSingle;
