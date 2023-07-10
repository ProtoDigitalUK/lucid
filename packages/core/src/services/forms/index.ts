import { FormBuilderOptionsT } from "@lucid/form-builder";
// Services
import getSingle from "./get-single";
import getAll from "./get-all";
import format from "./format";

// -------------------------------------------
// Types
export type FormT = {
  key: string;
  title: string;
  description: string | null;
  fields?: FormBuilderOptionsT["fields"];
};

// -------------------------------------------
// Exports
export default {
  getSingle,
  getAll,
  format,
};
