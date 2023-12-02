import ISO6391 from "iso-639-1";
// Models
import { LanguageT } from "@db/models/Language.js";
// Types
import { LanguageResT } from "@headless/types/src/language.js";

const formatLanguage = (language: LanguageT): LanguageResT => {
  const iso6391Code = language.code.split("-")[0];

  return {
    id: language.id,
    code: language.code,
    name: ISO6391.getName(iso6391Code),
    native_name: ISO6391.getNativeName(iso6391Code),
    is_default: language.is_default,
    is_enabled: language.is_enabled,
    created_at: language.created_at,
    updated_at: language.updated_at,
  };
};

export default formatLanguage;
