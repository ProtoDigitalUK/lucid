import T from "@translations/index.js";
import { PoolClient } from "pg";
import ISO6391 from "iso-639-1";
// Utils
import { HeadlessError } from "@utils/app/error-handler.js";
// Models
import Language from "@db/models/Language.js";

export interface ServiceData {
  code: string;
  data: {
    code?: string;
    is_default?: boolean;
    is_enabled?: boolean;
  };
}

const updateSingle = async (client: PoolClient, data: ServiceData) => {
  if (!data.data.code && !data.data.is_default && !data.data.is_enabled) {
    throw new HeadlessError({
      type: "basic",
      name: T("error_generic_name", {
        type: T("language"),
      }),
      message: T("error_update", {
        type: T("language"),
      }),
      status: 400,
    });
  }

  if (data.data.code) {
    const language = await Language.getSingleByCode(client, {
      code: data.data.code,
    });

    if (language) {
      throw new HeadlessError({
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

    const code = data.data.code.split("-");
    const iso6391 = code[0];

    if (!ISO6391.validate(iso6391)) {
      throw new HeadlessError({
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
  }

  const languageRes = await Language.updateSingle(client, {
    code: data.code,
    data: {
      code: data.data.code,
      is_default: data.data.is_default,
      is_enabled: data.data.is_enabled,
      updated_at: new Date().toISOString(),
    },
  });

  if (!languageRes) {
    throw new HeadlessError({
      type: "basic",
      name: T("error_generic_name", {
        type: T("language"),
      }),
      message: T("error_update", {
        type: T("language"),
      }),
      status: 500,
    });
  }

  return undefined;
};

export default updateSingle;
