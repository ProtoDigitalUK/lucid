import { PoolClient } from "pg";
// Models
import TranslationKey from "@db/models/TranslationKey.js";

export interface ServiceData {
  translation_key_ids: Array<number | null>;
}

const deleteMultiple = async (client: PoolClient, data: ServiceData) => {
  await TranslationKey.deleteMultiple(client, {
    ids: data.translation_key_ids.filter((id) => id !== null) as number[],
  });
};

export default deleteMultiple;
