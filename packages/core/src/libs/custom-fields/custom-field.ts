import T from "../../translations/index.js";
import type {
	CFConfig,
	FieldTypes,
	CFColumn,
	CFProps,
	CFResponse,
	CFInsertItem,
} from "./types.js";
import type { FieldProp } from "../formatters/collection-document-fields.js";
import type { FieldInsertItem } from "../../services/collection-document-bricks/helpers/flatten-fields.js";

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
	abstract typeValidation(
		value: unknown,
		relationData?: unknown,
	): {
		valid: boolean;
		message?: string;
	};
	abstract getInsertField(props: {
		item: FieldInsertItem;
		brickId: number;
		groupId: number;
	}): CFInsertItem<T> | null;

	// Methods
	protected keyToTitle(key: string): string {
		if (typeof key !== "string") return key;

		const title = key
			.split(/[-_]/g)
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");

		return title;
	}
	protected validate(
		value: unknown,
		relationData?: unknown,
	): {
		valid: boolean;
		message?: string;
	} {
		if (this.config.type === "tab") return { valid: true };
		// TODO: add support for repeater max/min group count
		if (this.config.type === "repeater") return { valid: true };

		// required
		if (this.config.validation?.required === true) {
			if (value === undefined || value === null || value === "") {
				return { valid: false, message: this.errors.required };
			}
		}
		// zod
		// value type
		return this.typeValidation(value, relationData);
	}
	// Getters
	get errors(): {
		required: string;
	} {
		return {
			required: T("generic_field_required"),
		};
	}
}

export default CustomField;
