import type createMultipleGroups from "../create-multiple-groups.js";
import type { FieldInsertItem } from "./flatten-fields.js";
import type CollectionBuilder from "../../../libs/builders/collection-builder/index.js";
import type {
	CFInsertItem,
	FieldTypes,
} from "../../../libs/custom-fields/types.js";

const formatInsertFields = (props: {
	brickId: number;
	groups: Awaited<ReturnType<typeof createMultipleGroups>>;
	fields: FieldInsertItem[];
	collection: CollectionBuilder;
}) => {
	return props.fields
		.map((field) => {
			const fieldInstance = props.collection.fields.get(field.key);
			if (!fieldInstance) return null;

			const targetGroup = props.groups.find(
				(g) => g.ref === field.groupRef,
			);

			return fieldInstance.getInsertField({
				item: field,
				brickId: props.brickId,
				groupId: targetGroup?.group_id ?? null,
			});
		})
		.filter((f) => f !== null) as CFInsertItem<FieldTypes>[];
};

export default formatInsertFields;
