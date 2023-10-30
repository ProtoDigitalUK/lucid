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
      text: `INSERT INTO lucid_translation_keys (id)
      SELECT nextval('lucid_translation_keys_id_seq')
      FROM generate_series(1, $1)
      RETURNING id`,
      values: [total],
    });

    return translationKeys.rows;
  };
}

// -------------------------------------------
// Types
type TranslationKeyCreateMultiple = (
  client: PoolClient,
  total: number
) => Promise<TranslationKeyT[]>;
