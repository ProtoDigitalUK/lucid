import { MediaT } from "@db/models/Media.js";
// Utils
import createURL from "@utils/media/create-url.js";
// Types
import { MediaResT } from "@headless/types/src/media.js";

const constructTranslations = (media: MediaT) => {
  const translationsMap = new Map();

  media.name_translations.forEach((translation) => {
    translationsMap.set(translation.language_id, {
      language_id: translation.language_id,
      name: translation.value || null,
      alt: null,
    });
  });

  media.alt_translations.forEach((translation) => {
    if (translationsMap.has(translation.language_id)) {
      const existingTranslation = translationsMap.get(translation.language_id);
      existingTranslation.alt = translation.value || null;
    } else {
      translationsMap.set(translation.language_id, {
        language_id: translation.language_id,
        name: null,
        alt: translation.value || null,
      });
    }
  });

  return Array.from(translationsMap.values());
};

const formatMedia = (
  media: MediaT,
  multi_content?: boolean,
  language_id?: number
): MediaResT => {
  return {
    id: media.id,
    key: media.key,
    url: createURL(media.key) as string,
    translations: multi_content
      ? [
          {
            language_id: language_id || 0,
            name: media.name_translation_value || null,
            alt: media.alt_translation_value || null,
          },
        ]
      : constructTranslations(media),
    type: media.type,
    meta: {
      mime_type: media.mime_type,
      file_extension: media.file_extension,
      file_size: media.file_size,
      width: media.width,
      height: media.height,
    },
    created_at: media.created_at,
    updated_at: media.updated_at,
  };
};

export default formatMedia;
