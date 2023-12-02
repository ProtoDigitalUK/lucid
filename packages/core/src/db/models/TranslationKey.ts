import { PoolClient } from "pg";

// -------------------------------------------
// Single Page
export type TranslationKeyT = {
  id: number;
};

export default class TranslationKey {
  static createMultiple: TranslationKeyCreateMultiple = async (
    client,
    total
  ) => {
    const translationKeys = await client.query<TranslationKeyT>({
      text: `INSERT INTO headless_translation_keys (id)
      SELECT nextval('headless_translation_keys_id_seq')
      FROM generate_series(1, $1)
      RETURNING id`,
      values: [total],
    });

    return translationKeys.rows;
  };
  static deleteMultiple: TranslationKeyDeleteMultiple = async (
    client,
    data
  ) => {
    await client.query({
      text: `DELETE FROM headless_translation_keys
      WHERE id = ANY($1)`,
      values: [data.ids],
    });
  };
}

// -------------------------------------------
// Types
type TranslationKeyCreateMultiple = (
  client: PoolClient,
  total: number
) => Promise<TranslationKeyT[]>;

type TranslationKeyDeleteMultiple = (
  client: PoolClient,
  data: {
    ids: number[];
  }
) => Promise<void>;
