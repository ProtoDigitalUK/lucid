import { PoolClient } from "pg";
import T from "@translations/index.js";
import {
  LucidError,
  modelErrors,
  ErrorResult,
} from "@utils/app/error-handler.js";
// Models
import Language from "@db/models/Language.js";

export interface ServiceData {
  translations: {
    language_id: number;
    title?: string | null;
    slug?: string | null;
    excerpt?: string | null;
  }[];
  homepage?: boolean;
}

const checkDefaultTranslation = async (
  client: PoolClient,
  data: ServiceData
) => {
  const defaultLanguage = await Language.getDefault(client);
  if (!defaultLanguage) {
    throw new LucidError({
      type: "basic",
      name: T("error_generic_name", {
        type: T("language"),
      }),
      message: T("error_not_found", {
        type: T("language"),
      }),
      status: 404,
    });
  }

  const defaultTranslation = data.translations.find(
    (translation) => translation.language_id === defaultLanguage.id
  );
  if (
    !defaultTranslation ||
    !defaultTranslation.title ||
    (!defaultTranslation.slug && data.homepage !== true)
  ) {
    throw new LucidError({
      type: "basic",
      name: "Validation Error",
      message: "The default translation must have a title and slug.",
      status: 400,
      errors: modelErrors({
        translations: {
          children: data.translations.map((translation) => {
            if (translation.language_id === defaultLanguage.id) {
              const errors: {
                title?: ErrorResult;
                slug?: ErrorResult;
              } = {};

              if (!translation.title) {
                errors.title = {
                  code: "required",
                  message: "The default translation must have a title.",
                };
              }
              if (!translation.slug && data.homepage !== true) {
                errors.slug = {
                  code: "required",
                  message: "The default translation must have a slug.",
                };
              }

              return Object.keys(errors).length > 0 ? errors : null;
            }
            return null;
          }),
        },
      }),
    });
  }
};

export default checkDefaultTranslation;
