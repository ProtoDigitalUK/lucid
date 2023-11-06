import T from "@translations/index.js";
import { PoolClient } from "pg";
// Utils
import { LucidError } from "@utils/app/error-handler.js";
// Models
import Language from "@db/models/Language.js";

export interface ServiceData {
  id?: number;
}

const getSingleFallback = async (client: PoolClient, data: ServiceData) => {
  if (!data.id) {
    // get default content lang
    const language = await Language.getDefault(client);
    if (!language) {
      throw new LucidError({
        type: "basic",
        name: T("error_generic_name", {
          type: T("language"),
        }),
        message: T("error_not_found", {
          type: T("language"),
        }),
        status: 404,
      });
    }
    return {
      id: language.id,
      code: language.code,
    };
  }

  const language = await Language.getSingleByID(client, {
    id: data.id,
  });

  if (!language) {
    throw new LucidError({
      type: "basic",
      name: T("error_generic_name", {
        type: T("language"),
      }),
      message: T("error_not_found", {
        type: T("language"),
      }),
      status: 404,
    });
  }

  return {
    id: language.id,
    code: language.code,
  };
};

export default getSingleFallback;
