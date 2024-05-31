import type { CFConfig, FieldTypes, CFColumn, CFProps } from "./types.js";

abstract class CustomFieldConfig<T extends FieldTypes> {
	repeater: string | null = null;

	abstract type: T;
	abstract column: CFColumn<T>;
	abstract key: string;
	abstract props?: CFProps<T>;
	abstract get config(): CFConfig<T>;

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
