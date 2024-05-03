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
	groupIndexes?: number[];
}) => {
	const brick = brickStore.get.bricks[params.brickIndex];

	return getBrickFieldRecursive({
		fields: brick.fields,
		fieldPath: params.fieldPath,
		groupIndexes: params.groupIndexes || [],
	});
};

const getBrickFieldRecursive = (params: {
	fields: FieldResponse[];
	fieldPath: string[];
	groupIndexes: number[];
	field?: FieldResponse;
	currentIndex?: number;
	curretGroupIndex?: number;
}): FieldResponse | undefined => {
	const currentIndex = params.currentIndex ?? 0;
	const curretGroupIndex = params.curretGroupIndex ?? 0;

	if (currentIndex >= params.fieldPath.length) {
		return params.field;
	}

	const key = params.fieldPath[currentIndex];
	const groupIndex = params.groupIndexes[curretGroupIndex] ?? 0;

	const field = params.fields.find((f) => f.key === key);

	if (!field) return undefined;

	if (field.type === "repeater" && field.groups) {
		return getBrickFieldRecursive({
			fields: field.groups[groupIndex] || [],
			field: field,
			fieldPath: params.fieldPath,
			groupIndexes: params.groupIndexes,
			currentIndex: currentIndex + 1,
			curretGroupIndex: curretGroupIndex + 1,
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
