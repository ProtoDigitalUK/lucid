import T from "@translations/index.js";
import { PoolClient } from "pg";
import { iso6393 } from "iso-639-3";
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

  const code = iso6393.find((lang) => lang.iso6393 === data.code);
  if (!code) {
    throw new LucidError({
      type: "basic",
      name: T("error_generic_name", {
        type: T("language"),
      }),
      message: T("error_invalid", {
        type: T("language_iso_639_3"),
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
