import { FormBuilderOptionsT } from "../../core/src/builders/form-builder/index.js";

export interface FormResT {
  key: string;
  title: string;
  description: string | null;
  fields?: FormBuilderOptionsT["fields"];
}
