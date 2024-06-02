import type {
	CFConfig,
	FieldTypes,
	CFColumn,
	CFProps,
	CFResponse,
} from "./types.js";
import type { FieldProp } from "../formatters/collection-document-fields.js";

abstract class CustomFieldConfig<T extends FieldTypes> {
	repeater: string | null = null;

	abstract type: T;
	abstract column: CFColumn<T>;
	abstract key: string;
	abstract props?: CFProps<T>;
	abstract get config(): CFConfig<T>;
	responseValueFormat?: <T extends FieldTypes>(
		config: CFConfig<T>,
		data: FieldProp,
	) => CFResponse<T>;

	// Methods
	protected keyToTitle(key: string): string {
		if (typeof key !== "string") return key;

		const title = key
			.split(/[-_]/g)
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");

		return title;
	}
}

export default CustomFieldConfig;
