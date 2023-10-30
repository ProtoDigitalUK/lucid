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
  static createMultiple: TranslationCreateMultiple = async (client, data) => {
    if (data.translations.length === 0) return undefined;

    const aliases = aliasGenerator({
      columns: [
        {
          key: "translation_key_id",
        },
        {
          key: "language_id",
        },
        {
          key: "value",
        },
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

    await client.query({
      text: `INSERT INTO 
            lucid_translations (translation_key_id, language_id, value) 
        VALUES 
            ${aliases}`,
      values: dataValues,
    });
  };
}

// -------------------------------------------
// Types
type TranslationCreateMultiple = (
  client: PoolClient,
  data: {
    translations: {
      translation_key_id: number;
      language_id: number;
      value: string;
    }[];
  }
) => Promise<void>;
