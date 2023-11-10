import { PoolClient } from "pg";
// Utils
import service from "@utils/app/service.js";
// Schema
import { MediaTranslationsT } from "@schemas/media.js";
// Services
import mediaService from "@services/media/index.js";
import translationsService from "@services/translations/index.js";

export interface ServiceData {
  id: number;
  translations: MediaTranslationsT;
}

const updateSingle = async (client: PoolClient, data: ServiceData) => {
  const media = await service(
    mediaService.getSingle,
    false,
    client
  )({
    id: data.id,
  });

  await service(
    translationsService.updateMultiple,
    false,
    client
  )({
    translations: data.translations,
    keyMap: {
      name: media.name_translation_key_id,
      alt: media.alt_translation_key_id,
    },
  });

  return undefined;
};

export default updateSingle;
