import type {
	CFConfig,
	FieldTypes,
	CFColumn,
	CFProps,
	CFResponse,
	CustomFieldInsertItem,
} from "./types.js";
import type { FieldProp } from "../formatters/collection-document-fields.js";
import type { FieldInsertItem } from "../../services/collection-document-bricks/helpers/flatten-fields.js";

// TODO: think about children instances storing config, then responseValueFormat and getInsertField can use it directly
// - will need field builder changes

abstract class CustomField<T extends FieldTypes> {
	repeater: string | null = null;

	abstract type: T;
	abstract column: CFColumn<T>;
	abstract key: string;
	abstract props?: CFProps<T>;
	abstract config: CFConfig<T>;
	abstract responseValueFormat(props?: {
		data?: FieldProp;
		host?: string;
	}): CFResponse<T>;
	// TODO: add back
	// abstract getInsertField(props: {
	// 	config: CFConfig<T>;
	// 	item: FieldInsertItem;
	// 	brickId: number;
	// 	groupId: number;
	// }): CustomFieldInsertItem<T>;

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

export default CustomField;
