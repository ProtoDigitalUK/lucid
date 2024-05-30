import type { CustomFieldData, FieldTypes } from "./types.js";

export default abstract class CustomField<T extends FieldTypes> {
	abstract get data(): CustomFieldData<T>;
	protected keyToTitle(key: string): string {
		if (typeof key !== "string") return key;

		const title = key
			.split(/[-_]/g)
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");

		return title;
	}
	static validate() {}
}
