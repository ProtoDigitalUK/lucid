import builderStore, { type BrickStoreFieldT } from "@/store/builderStore";
import brickStore from "@/store/brickStore";
import type { CustomField, FieldResponse } from "@protoheadless/core/types";

// --------------------------------------------
// Get field value from store
const getField = (params: {
	brickIndex: number;
	field: CustomField;
	groupId?: BrickStoreFieldT["group_id"];
	key: string;
	contentLanguage: number | undefined;
}) => {
	const brick = builderStore.get.bricks[params.brickIndex];
	const fieldIndex = builderStore.get.findFieldIndex({
		fields: brick.fields,
		key: params.key,
		groupId: params.groupId,
		contentLanguage: params.contentLanguage,
	});
	const field = brick.fields[fieldIndex];
	if (!field) {
		return builderStore.get.addField(params);
	}
	return field;
};

// --------------------------------------------
// Get next brick order
const getNextBrickOrder = (type: "fixed" | "builder") => {
	// get the greatest order number from bricks
	const bricks = builderStore.get.bricks.filter((b) => b.type === type);
	if (bricks.length === 0) return 0;

	const greatestOrder = bricks.reduce((acc, curr) => {
		if (!curr.order) return acc;
		if (curr.order > acc) return curr.order;
		return acc;
	}, 0);

	return greatestOrder + 1;
};

// ---------------------------------------------
// Get field new
const getBrickField = (params: {
	brickIndex: number;
	fieldPath: string[];
	groupPath?: Array<number | string>;
}) => {
	const brick = brickStore.get.bricks[params.brickIndex];

	return getBrickFieldRecursive({
		fields: brick.fields,
		fieldPath: params.fieldPath,
		groupPath: params.groupPath || [],
	});
};

const getBrickFieldRecursive = (params: {
	fields: FieldResponse[];
	fieldPath: string[];
	groupPath: Array<number | string>;
	field?: FieldResponse;
	currentIndex?: number;
}): FieldResponse | undefined => {
	const currentIndex = params.currentIndex ?? 0;
	if (currentIndex >= params.fieldPath.length) return params.field;

	const key = params.fieldPath[currentIndex];
	const field = params.fields.find((f) => f.key === key);

	if (field?.type === "repeater") {
		const groupdId = params.groupPath[currentIndex] ?? 0;
		const group = field.groups?.find((g) => g.id === groupdId);
		if (!group) return field;

		return getBrickFieldRecursive({
			fields: group.fields,
			field: field,
			fieldPath: params.fieldPath,
			groupPath: params.groupPath,
			currentIndex: currentIndex + 1,
		});
	}

	return field;
};

// ---------------------------------------------
// Exports
const brickHelpers = {
	getField,
	getNextBrickOrder,
	getBrickField,
	getBrickFieldRecursive,
};

export default brickHelpers;
