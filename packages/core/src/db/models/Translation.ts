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
  static updateMultiple: TranslationUpdateMultiple = async (client, data) => {
    if (data.translations.length === 0) return undefined;

    // Construct the VALUES table to be used for the update
    const aliases = aliasGenerator({
      columns: [
        { key: "id", type: "int" },
        { key: "translation_key_id", type: "int" },
        { key: "language_id", type: "int" },
        { key: "value", type: "text" },
      ],
      rows: data.translations.length,
    });

    const dataValues = data.translations.flatMap((translation) => {
      return [
        translation.id,
        translation.translation_key_id,
        translation.language_id,
        translation.value,
      ];
    });

    await client.query({
      text: `WITH data_values (id, translation_key_id, language_id, value) AS (
              VALUES ${aliases}
            )
            UPDATE lucid_translations
            SET
              translation_key_id = data_values.translation_key_id,
              language_id = data_values.language_id,
              value = data_values.value
            FROM data_values
            WHERE lucid_translations.id = data_values.id;`,
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

type TranslationUpdateMultiple = (
  client: PoolClient,
  data: {
    translations: {
      id: number;
      translation_key_id: number;
      language_id: number;
      value: string;
    }[];
  }
) => Promise<void>;
