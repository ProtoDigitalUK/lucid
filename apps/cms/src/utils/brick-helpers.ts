// Store
import builderStore, { type BrickStoreFieldT } from "@/store/builderStore";
// Types
import type { CustomField } from "@protoheadless/core/types";

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
// Exports
const brickHelpers = {
	getField,
	getNextBrickOrder,
};

export default brickHelpers;
