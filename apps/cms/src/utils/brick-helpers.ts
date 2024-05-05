import builderStore, { type BrickStoreFieldT } from "@/store/builderStore";
import brickStore from "@/store/brickStore";
import type {
	CustomField,
	FieldResponse,
	FieldGroupResponse,
} from "@lucidcms/core/types";

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
	// fields: FieldResponse[];
	brickIndex: number;
	fieldPath: string[];
	groupPath?: Array<number | string>;
	field: CustomField;
	contentLanguage: number | undefined;
}) => {
	const brick = brickStore.get.bricks[params.brickIndex];

	const field = getBrickFieldRecursive({
		fields: brick.fields,
		fieldPath: params.fieldPath,
		groupPath: params.groupPath || [],
	});

	if (!field) {
		return brickStore.get.addField(params);
	}

	return field;
	// const field = getBrickFieldRecursive({
	// 	fields: params.fields,
	// 	fieldPath: params.fieldPath,
	// 	groupPath: params.groupPath || [],
	// });

	// if (!field) {
	// 	return brickStore.get.addField(params);
	// }

	// return field;
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
const getBrickFieldGroupRecursive = (params: {
	fields: FieldResponse[];
	fieldPath: string[];
	groupPath: Array<number | string>;
	field?: FieldResponse;
	currentIndex?: number;
}): FieldGroupResponse | undefined => {
	const currentIndex = params.currentIndex ?? 0;
	if (currentIndex >= params.fieldPath.length) return undefined;

	const key = params.fieldPath[currentIndex];
	const field = params.fields.find((f) => f.key === key);

	if (
		field?.type === "repeater" &&
		currentIndex < params.fieldPath.length - 1
	) {
		const groupId = params.groupPath[currentIndex];
		const group = field.groups?.find((g) => g.id === groupId);
		if (!group) return undefined;

		if (currentIndex < params.fieldPath.length - 1) {
			return getBrickFieldGroupRecursive({
				fields: group.fields,
				fieldPath: params.fieldPath,
				groupPath: params.groupPath,
				currentIndex: currentIndex + 1,
			});
		}
		return group;
	}

	return undefined;
};

// ---------------------------------------------
// Exports
const brickHelpers = {
	getField,
	getNextBrickOrder,
	getBrickField,
	getBrickFieldRecursive,
	getBrickFieldGroupRecursive,
};

export default brickHelpers;
