import type createMultipleGroups from "../create-multiple-groups.js";
import type { FieldInsertItem } from "./flatten-fields.js";
import type CollectionBuilder from "../../../libs/builders/collection-builder/index.js";
import type {
	CFInsertItem,
	FieldTypes,
} from "../../../libs/custom-fields/types.js";

const formatInsertFields = (props: {
	brickId: number;
	brickKey: string | undefined;
	brickType: "builder" | "fixed" | "collection-fields";
	groups: Awaited<ReturnType<typeof createMultipleGroups>>;
	fields: FieldInsertItem[];
	collection: CollectionBuilder;
}) => {
	return (
		props.fields
			.map((field) => {
				const fieldInstance = getFieldInstance({
					collection: props.collection,
					brickType: props.brickType,
					fieldKey: field.key,
					brickKey: props.brickKey,
				});
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
			// TODO: remove as when Typescript 5.5 is released
			.filter((f) => f !== null) as CFInsertItem<FieldTypes>[]
	);
};

const getFieldInstance = (props: {
	collection: CollectionBuilder;
	brickType: "builder" | "fixed" | "collection-fields";
	fieldKey: string;
	brickKey: string | undefined;
}) => {
	if (props.brickType === "collection-fields") {
		return props.collection.fields.get(props.fieldKey);
	}
	if (props.brickType === "fixed") {
		const fixedBrick = props.collection.config.bricks?.fixed?.find(
			(b) => b.key === props.brickKey,
		);
		return fixedBrick?.fields.get(props.fieldKey);
	}
	if (props.brickType === "builder") {
		const builderBrick = props.collection.config.bricks?.builder?.find(
			(b) => b.key === props.brickKey,
		);
		return builderBrick?.fields.get(props.fieldKey);
	}
	return undefined;
};

export default formatInsertFields;
