import type { GroupSimpleResponse } from "../create-multiple-groups.js";
import type { FieldInsertItem } from "./flatten-fields.js";
import type CollectionBuilder from "../../../libs/builders/collection-builder/index.js";
import type {
	CFInsertItem,
	FieldTypes,
} from "../../../libs/custom-fields/types.js";
import type CustomField from "../../../libs/custom-fields/custom-field.js";

const formatInsertFields = (props: {
	brick: {
		id: number;
		key: string | undefined;
		type: "builder" | "fixed" | "collection-fields";
		fields: FieldInsertItem[];
	};
	groups: GroupSimpleResponse[];
	collection: CollectionBuilder;
}): CFInsertItem<FieldTypes>[] => {
	return (
		props.brick.fields
			.map((field) => {
				const fieldInstance = getFieldInstance({
					collection: props.collection,
					brick: props.brick,
					fieldKey: field.key,
				});
				if (!fieldInstance) return null;

				const targetGroup = props.groups.find(
					(g) => g.ref === field.groupRef,
				);
				return fieldInstance.getInsertField({
					item: field,
					brickId: props.brick.id,
					groupId: targetGroup?.group_id ?? null,
				});
			})
			// TODO: remove as when Typescript 5.5 is released
			.filter((f) => f !== null) as CFInsertItem<FieldTypes>[]
	);
};

const getFieldInstance = (props: {
	collection: CollectionBuilder;
	fieldKey: string;
	brick: {
		type: "builder" | "fixed" | "collection-fields";
		key: string | undefined;
	};
}): CustomField<FieldTypes> | undefined => {
	if (props.brick.type === "collection-fields") {
		return props.collection.fields.get(props.fieldKey);
	}
	if (props.brick.type === "fixed") {
		const fixedBrick = props.collection.config.bricks?.fixed?.find(
			(b) => b.key === props.brick.key,
		);
		return fixedBrick?.fields.get(props.fieldKey);
	}
	if (props.brick.type === "builder") {
		const builderBrick = props.collection.config.bricks?.builder?.find(
			(b) => b.key === props.brick.key,
		);
		return builderBrick?.fields.get(props.fieldKey);
	}
	return undefined;
};

export default formatInsertFields;
