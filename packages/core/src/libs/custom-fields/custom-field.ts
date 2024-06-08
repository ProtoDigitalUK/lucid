import T from "../../translations/index.js";
import type {
	CFConfig,
	FieldTypes,
	CFColumn,
	CFProps,
	CFResponse,
	CFInsertItem,
	CustomFieldErrorItem,
	CustomFieldValidateResponse,
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
	public validate(
		value: unknown,
		relationData?: unknown,
	): CustomFieldValidateResponse {
		if (this.config.type === "tab") return { valid: true };

		// required
		const requiredRes = this.requiredCheck(value);
		if (!requiredRes.valid) return requiredRes;

		// zod
		const zodRes = this.zodCheck(value);
		if (!zodRes.valid) return zodRes;

		// value type
		return this.typeValidation(value, relationData);
	}
	private requiredCheck(value: unknown): CustomFieldValidateResponse {
		if (this.config.type === "tab") return { valid: true };
		if (this.config.type === "repeater") return { valid: true };

		if (
			this.config.validation?.required === true &&
			this.errors.required.condition?.(value)
		) {
			return {
				valid: false,
				message: this.errors.required.message,
			};
		}
		return { valid: true };
	}
	private zodCheck(value: unknown): CustomFieldValidateResponse {
		if (this.config.type === "tab") return { valid: true };
		if (this.config.type === "repeater") return { valid: true };
		if (this.config.type === "media") return { valid: true };
		if (this.config.type === "checkbox") return { valid: true };
		if (this.config.type === "select") return { valid: true };
		if (this.config.type === "colour") return { valid: true };
		if (this.config.type === "link") return { valid: true };
		if (this.config.type === "user") return { valid: true };

		if (!this.config.validation?.zod) return { valid: true };

		const response = this.config.validation?.zod?.safeParse(value);
		if (response?.success) {
			return { valid: true };
		}

		return {
			valid: false,
			message: response?.error.message,
		};
	}
	// Getters
	get errors(): {
		required: CustomFieldErrorItem;
		zod: CustomFieldErrorItem;
	} {
		return {
			required: {
				condition: (value: unknown) =>
					value === undefined || value === null || value === "",
				message: T("generic_field_required"),
			},
			zod: {
				message: T("generic_field_invalid"),
			},
		};
	}
}

export default CustomField;
