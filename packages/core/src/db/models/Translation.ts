import { PoolClient } from "pg";
// Utils
import { aliasGenerator } from "@utils/app/query-helpers.js";

// -------------------------------------------
// Single Page
export type TranslationT = {
  id: number;
  translation_key_id: number;
  language_id: number;

  value: string;

  created_at: string;
  updated_at: string;
};

export default class Translation {
  static createOrUpdateMultiple: TranslationCreateUpdateMultiple = async (
    client,
    data
  ) => {
    if (data.translations.length === 0) return [];

    const aliases = aliasGenerator({
      columns: [
        { key: "translation_key_id", type: "int" },
        { key: "language_id", type: "int" },
        { key: "value", type: "text" },
      ],
      rows: data.translations.length,
    });

    const dataValues = data.translations.flatMap((translation) => {
      return [
        translation.translation_key_id,
        translation.language_id,
        translation.value,
      ];
    });

    const res = await client.query({
      text: `INSERT INTO lucid_translations (translation_key_id, language_id, value)
              VALUES ${aliases}
              ON CONFLICT (translation_key_id, language_id)
              DO UPDATE SET
                value = EXCLUDED.value
              RETURNING id`,
      values: dataValues,
    });

    return res.rows;
  };
}

// -------------------------------------------
// Types
type TranslationCreateUpdateMultiple = (
  client: PoolClient,
  data: {
    translations: {
      translation_key_id: number;
      language_id: number;
      value: string | undefined | null;
    }[];
  }
) => Promise<{ id: number }[]>;
