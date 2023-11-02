import { PoolClient } from "pg";
// Models
import Translation from "@db/models/Translation.js";

export interface ServiceData {
  translations: {
    value: string;
    language_id: number;
    key: "name" | "alt";
    id?: number | undefined;
  }[];
  keyMap: {
    [key: string]: number | undefined | null;
  };
}

const updateMultiple = async (client: PoolClient, data: ServiceData) => {
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

  const toUpdate = translations.filter(
    (translation) => translation.id !== undefined
  );
  const toCreate = translations.filter(
    (translation) => translation.id === undefined
  );

  await Promise.all([
    Translation.createMultiple(client, {
      translations: toCreate,
    }),
    Translation.updateMultiple(client, {
      translations: toUpdate as {
        id: number;
        translation_key_id: number;
        language_id: number;
        value: string;
      }[],
    }),
  ]);
};

export default updateMultiple;
