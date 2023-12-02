import { PoolClient } from "pg";
// Utils
import service from "@utils/app/service.js";
import { HeadlessError } from "@utils/app/error-handler.js";
// Schema
import { MediaTranslationsT } from "@schemas/media.js";
// Models
import Media from "@db/models/Media.js";
// Services
import translationsService from "@services/translations/index.js";

export interface ServiceData {
  id: number;
  translations: MediaTranslationsT;
}

const updateSingle = async (client: PoolClient, data: ServiceData) => {
  const media = await Media.getSingleById(client, {
    id: data.id,
  });

  if (!media) {
    throw new HeadlessError({
      type: "basic",
      name: "Media not found",
      message: "We couldn't find the media you were looking for.",
      status: 404,
    });
  }

  await service(
    translationsService.upsertMultiple,
    false,
    client
  )({
    translations: [
      ...data.translations.map((translation) => {
        return {
          value: translation.name,
          language_id: translation.language_id,
          key: "name",
        };
      }),
      ...data.translations.map((translation) => {
        return {
          value: translation.alt,
          language_id: translation.language_id,
          key: "alt",
        };
      }),
    ],
    keyMap: {
      name: media.name_translation_key_id,
      alt: media.alt_translation_key_id,
    },
  });

  return undefined;
};

export default updateSingle;
