import T from "@translations/index.js";
import { PoolClient } from "pg";
// Utils
import { HeadlessError } from "@utils/app/error-handler.js";
// Models
import Language from "@db/models/Language.js";

export interface ServiceData {}

const getDefault = async (client: PoolClient) => {
  const language = await Language.getDefault(client);

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

  return {
    id: language.id,
    code: language.code,
  };
};

export default getDefault;
