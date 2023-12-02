import T from "@translations/index.js";
import { PoolClient } from "pg";
// Utils
import { HeadlessError } from "@utils/app/error-handler.js";
// Models
import Language from "@db/models/Language.js";
// Format
import formatLanguage from "@utils/format/format-language.js";

export interface ServiceData {
  code: string;
}

const getSingle = async (client: PoolClient, data: ServiceData) => {
  const language = await Language.getSingleByCode(client, {
    code: data.code,
  });

  if (!language) {
    throw new HeadlessError({
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

export default getSingle;
