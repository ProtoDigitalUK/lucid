import type CustomFieldConfig from "./cf-config.js";
import type { FieldTypes, CFResponse } from "./types.js";
// TODO: move these
import type { FieldProp } from "../formatters/collection-document-fields.js";

abstract class CustomFieldResult<T extends FieldTypes> {
	abstract field: FieldProp;
	abstract cf: CustomFieldConfig<T>;
	abstract get responseValueFormat(): CFResponse<T>;
}

export default CustomFieldResult;
