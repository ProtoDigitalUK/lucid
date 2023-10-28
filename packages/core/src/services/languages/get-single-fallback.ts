import T from "@translations/index.js";
import { PoolClient } from "pg";
// Utils
import { LucidError } from "@utils/app/error-handler.js";
// Models
import Language from "@db/models/Language.js";
// Format
import formatLanguage from "@utils/format/format-language.js";

export interface ServiceData {
  code?: string;
}

const getSingleFallback = async (client: PoolClient, data: ServiceData) => {
  if (!data.code) {
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
    return formatLanguage(language);
  }

  const language = await Language.getSingleByCode(client, {
    code: data.code,
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

  return formatLanguage(language);
};

export default getSingleFallback;
