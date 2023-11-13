import { PoolClient } from "pg";
// Models
import Translation from "@db/models/Translation.js";

export interface ServiceData {
  translations: {
    value: string | undefined | null;
    language_id: number;
    key: string;
  }[];
  keyMap: {
    [key: string]: number | undefined | null;
  };
}

const upsertMultiple = async (client: PoolClient, data: ServiceData) => {
  // remove keys that dont have a value
  const translations = data.translations
    .filter((translation) => {
      if (
        data.keyMap[translation.key] === undefined ||
        data.keyMap[translation.key] === null
      ) {
        return false;
      }
      return true;
    })
    .map((translation) => {
      return {
        ...translation,
        translation_key_id: data.keyMap[translation.key] as number,
      };
    });

  await Translation.createOrUpdateMultiple(client, {
    translations: translations,
  });
};

export default upsertMultiple;
