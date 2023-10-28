import { PoolClient } from "pg";
// Utils
import { LucidError } from "@utils/app/error-handler.js";
import service from "@utils/app/service.js";
// Models
import PageContent from "@db/models/PageContent.js";
import Language from "@db/models/Language.js";
// Services
import pageServices from "@services/pages/index.js";

export interface ServiceData {
  page_id: number;
  homepage: boolean;
  environment_key: string;
  collection_key: string;
  parent_id?: number;
  translations: {
    language_code: string;
    title: string;
    slug: string;
    excerpt?: string;
  }[];
}

interface TranslationsT {
  language_code: string;
  language_id: number;
  title: string;
  slug: string;
  excerpt?: string;
}

const prepareTranslations = (
  translations: ServiceData["translations"],
  languages: {
    id: number;
    code: string;
  }[]
) => {
  const languageCodeToId = Object.fromEntries(
    languages.map((language) => [language.code, language.id])
  );

  return translations
    .map((translation) => ({
      ...translation,
      language_id: languageCodeToId[translation.language_code],
    }))
    .filter((translation) => translation.language_id);
};

const buildUniqueSlugs = async (
  translations: TranslationsT[],
  data: ServiceData,
  client: PoolClient
) => {
  const slugPromises = translations.map((translation) => {
    return service(
      pageServices.buildUniqueSlug,
      false,
      client
    )({
      slug: translation.slug,
      homepage: data.homepage || false,
      environment_key: data.environment_key,
      collection_key: data.collection_key,
      parent_id: data.parent_id,
      language_id: translation.language_id,
    });
  });
  return await Promise.all(slugPromises);
};

const createPageContents = async (
  translations: TranslationsT[],
  page_id: number,
  client: PoolClient
) => {
  await service(
    PageContent.createMultiple,
    false,
    client
  )(
    translations.map((translation) => ({
      page_id,
      language_id: translation.language_id,
      title: translation.title,
      slug: translation.slug,
      excerpt: translation.excerpt,
    }))
  );
};

const createMultiple = async (client: PoolClient, data: ServiceData) => {
  try {
    const languages = await Language.getMultipleByCodes(client, {
      codes: data.translations.map((translation) => translation.language_code),
    });

    const preparedTranslations = prepareTranslations(
      data.translations,
      languages
    );
    const uniqueSlugs = await buildUniqueSlugs(
      preparedTranslations,
      data,
      client
    );

    // Merge uniqueSlugs with preparedTranslations
    const translationsWithUniqueSlugs = preparedTranslations.map(
      (translation, index) => ({
        ...translation,
        slug: uniqueSlugs[index],
      })
    );

    await createPageContents(translationsWithUniqueSlugs, data.page_id, client);

    return undefined;
  } catch (error) {
    console.log("her", error);
    throw error;
  }
};

export default createMultiple;
