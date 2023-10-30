import { PoolClient } from "pg";
// Models
import TranslationKey from "@db/models/TranslationKey.js";
import Translation from "@db/models/Translation.js";

export interface ServiceData {
  translations: Record<
    string,
    {
      language_id: number;
      value: string;
    }[]
  >;
}

const createMultiple = async (client: PoolClient, data: ServiceData) => {
  let totalIdsNeeded = 0;
  for (const [_, translation] of Object.entries(data.translations)) {
    if (translation.length > 0) {
      totalIdsNeeded++;
    }
  }

  const translationKeys = await TranslationKey.createMultiple(
    client,
    totalIdsNeeded
  );

  const translationKeyIdMap = new Map<string, number>();

  const translations: {
    translation_key_id: number;
    language_id: number;
    value: string;
  }[] = [];

  let counter = 0;
  for (const [key, translation] of Object.entries(data.translations)) {
    const currentTranslationKey = translationKeys[counter].id;

    translationKeyIdMap.set(key, currentTranslationKey);
    translations.push(
      ...translation.map((t) => ({
        translation_key_id: currentTranslationKey,
        language_id: t.language_id,
        value: t.value,
      }))
    );
    counter++;
  }

  await Translation.createMultiple(client, {
    translations: translations,
  });

  return translationKeyIdMap;
};

export default createMultiple;
