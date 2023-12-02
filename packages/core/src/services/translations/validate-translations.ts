// Utils
import { HeadlessError } from "@utils/app/error-handler.js";
// Schema
import { mediaTranslations, MediaTranslationsT } from "@schemas/media.js";

export interface ServiceData {
  translations: string;
}

const validateTranslations = (data: ServiceData) => {
  console.log("here", JSON.parse(data.translations));

  const translationValidate = mediaTranslations.safeParse(
    JSON.parse(data.translations)
  );

  if (!translationValidate.success) {
    throw new HeadlessError({
      type: "validation",
      zod: translationValidate.error,
    });
  }

  return translationValidate.data as MediaTranslationsT;
};

export default validateTranslations;
