import { FormBuilderOptionsT } from "@lucid/form-builder";

export interface FormResT {
  key: string;
  title: string;
  description: string | null;
  fields?: FormBuilderOptionsT["fields"];
}
