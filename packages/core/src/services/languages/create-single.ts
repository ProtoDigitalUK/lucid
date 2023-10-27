import T from "@translations/index.js";
import { PoolClient } from "pg";
import ISO6391 from "iso-639-1";
// Utils
import { LucidError } from "@utils/app/error-handler.js";
// Models
import Language from "@db/models/Language.js";

export interface ServiceData {
  code: string;
  is_default?: boolean;
  is_enabled?: boolean;
}

const createSingle = async (client: PoolClient, data: ServiceData) => {
  const language = await Language.getSingleByCode(client, {
    code: data.code,
  });

  if (language) {
    throw new LucidError({
      type: "basic",
      name: T("error_generic_name", {
        type: T("language"),
      }),
      message: T("error_exists", {
        type: T("language"),
      }),
      status: 400,
    });
  }

  const code = data.code.split("-");
  const iso6391 = code[0];

  if (!ISO6391.validate(iso6391)) {
    throw new LucidError({
      type: "basic",
      name: T("error_generic_name", {
        type: T("language"),
      }),
      message: T("error_invalid", {
        type: T("language_iso_639_1"),
      }),
      status: 400,
    });
  }

  const languageRes = await Language.createSingle(client, {
    code: data.code,
    is_default: data.is_default,
    is_enabled: data.is_enabled,
  });

  if (!languageRes) {
    throw new LucidError({
      type: "basic",
      name: T("error_generic_name", {
        type: T("language"),
      }),
      message: T("error_create", {
        type: T("language"),
      }),
      status: 500,
    });
  }

  return undefined;
};

export default createSingle;
