import { createMemo } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
// Utils
import request from "@/utils/request";
// Types
import { SettingsResT } from "@lucid/types/src/settings";
import { APIResponse } from "@/types/api";

interface QueryParams {}

const useGetSettings = (params?: QueryHook<QueryParams>) => {
  const queryParams = createMemo(() => {
    return {};
  });

  const queryKey = createMemo(() => {
    return JSON.stringify(queryParams());
  });

  return createQuery(
    () => ["settings.getSettings", queryKey(), params?.key?.()],
    {
      queryFn: () =>
        request<APIResponse<SettingsResT>>({
          url: `/api/v1/settings`,
          config: {
            method: "GET",
          },
        }),
      get enabled() {
        return params?.enabled ? params.enabled() : true;
      },
    }
  );
};

export default useGetSettings;
