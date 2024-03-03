import { FormBuilderOptionsT } from "../../headless/src/builders/form-builder/index.js";

export interface FormResT {
	key: string;
	title: string;
	description: string | null;
	fields?: FormBuilderOptionsT["fields"];
}
