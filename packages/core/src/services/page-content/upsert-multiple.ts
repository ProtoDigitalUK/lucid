import { PoolClient } from "pg";
// Utils
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
    language_id: number;
    title?: string | null;
    slug?: string | null;
    excerpt?: string | null;
  }[];
}

interface TranslationsT {
  language_id: number;
  title?: string | null;
  slug?: string | null;
  excerpt?: string | null;
}

const prepareTranslations = (
  translations: ServiceData["translations"],
  languages: {
    id: number;
  }[]
) => {
  return translations
    .filter((translation) =>
      languages.some((language) => language.id === translation.language_id)
    )
    .filter(
      (translation) =>
        translation.title || translation.slug || translation.excerpt
    );
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
      page_id: data.page_id,
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
    PageContent.createOrUpdateMultiple,
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

const upsertMultiple = async (client: PoolClient, data: ServiceData) => {
  try {
    if (data.translations.length === 0) return undefined;

    const languages = await Language.getMultipleByIds(client, {
      ids: data.translations.map((translation) => translation.language_id),
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

    const translationsWithUniqueSlugs = preparedTranslations.map(
      (translation, index) => ({
        ...translation,
        slug: uniqueSlugs[index],
      })
    );

    await createPageContents(translationsWithUniqueSlugs, data.page_id, client);

    return undefined;
  } catch (error) {
    throw error;
  }
};

export default upsertMultiple;
