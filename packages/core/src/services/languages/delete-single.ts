import T from "@translations/index.js";
import { PoolClient } from "pg";
// Utils
import { LucidError } from "@utils/app/error-handler.js";
import { SelectQueryBuilder } from "@utils/app/query-helpers.js";
// Models
import Language from "@db/models/Language.js";

export interface ServiceData {
  code: string;
}

const deleteSingle = async (client: PoolClient, data: ServiceData) => {
  const SelectQuery = new SelectQueryBuilder({
    columns: ["id", "code", "is_default"],
    exclude: undefined,
    sort: [
      {
        key: "id",
        value: "asc",
      },
    ],
    page: undefined,
    per_page: "-1",
  });
  let languages = await Language.getMultiple(client, SelectQuery);

  if (languages.data.length === 1) {
    throw new LucidError({
      type: "basic",
      name: T("error_generic_name", {
        type: T("language"),
      }),
      message: T("error_min_one", {
        type: T("language"),
      }),
      status: 500,
    });
  }

  const language = await Language.deleteSingle(client, {
    code: data.code,
  });

  if (!language) {
    throw new LucidError({
      type: "basic",
      name: T("error_generic_name", {
        type: T("language"),
      }),
      message: T("error_delete", {
        type: T("language"),
      }),
      status: 500,
    });
  }

  if (language.is_default) {
    languages.data = languages.data.filter((lang) => lang.id !== language.id);
    const newDefaultLanguage = languages.data[0];
    const languageRes = await Language.updateSingle(client, {
      code: newDefaultLanguage.code,
      data: {
        is_default: true,
        updated_at: new Date().toISOString(),
      },
    });

    if (!languageRes) {
      throw new LucidError({
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
  }

  return undefined;
};

export default deleteSingle;
