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
  // create id regardless of whether we have translations or not, id is still needed on the parent table
  const translationKeys = await TranslationKey.createMultiple(
    client,
    Object.keys(data.translations).length
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

  await Translation.createOrUpdateMultiple(client, {
    translations: translations,
  });

  return translationKeyIdMap;
};

export default createMultiple;
