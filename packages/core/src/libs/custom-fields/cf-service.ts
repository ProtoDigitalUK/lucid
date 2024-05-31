import type CustomFieldConfig from "./cf-config.js";
import type { FieldTypes, CustomFieldInsertItem } from "./types.js";
import type { FieldInsertItem } from "../../services/collection-document-bricks/helpers/flatten-fields.js";

abstract class CustomFieldService<T extends FieldTypes> {
	groupId: number | null = null;
	brickId: number | null = null;

	abstract item: FieldInsertItem;
	abstract cf: CustomFieldConfig<T>;
	abstract get getInsertField(): CustomFieldInsertItem<T>;

	// Methods
	protected validate() {}

	// Setter
	set setGroupId(groupId: number | null) {
		this.groupId = groupId;
	}
	set setBrickId(brickId: number) {
		this.brickId = brickId;
	}
}

export default CustomFieldService;
