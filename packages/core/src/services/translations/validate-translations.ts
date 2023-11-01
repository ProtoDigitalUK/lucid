// Utils
import { LucidError } from "@utils/app/error-handler.js";
// Schema
import { mediaTranslations } from "@schemas/media.js";

export interface ServiceData {
  translations: string;
}

const validateTranslations = (data: ServiceData) => {
  const translationValidate = mediaTranslations.safeParse(
    JSON.parse(data.translations)
  );

  if (!translationValidate.success) {
    throw new LucidError({
      type: "validation",
      zod: translationValidate.error,
    });
  }

  return translationValidate.data;
};

export default validateTranslations;
