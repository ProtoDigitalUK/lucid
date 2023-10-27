import { iso6393 } from "iso-639-3";
// Models
import { LanguageT } from "@db/models/Language.js";
// Types
import { LanguageResT } from "@lucid/types/src/language.js";

const formatLanguage = (language: LanguageT): LanguageResT => {
  return {
    id: language.id,
    code: language.code,
    name: iso6393.find((lang) => lang.iso6393 === language.code)?.name || null,
    is_default: language.is_default,
    is_enabled: language.is_enabled,
    created_at: language.created_at,
    updated_at: language.updated_at,
  };
};

export default formatLanguage;
