import brickStore from "@/store/brickStore";
import type {
	CustomField,
	FieldResponse,
	FieldResponseMeta,
} from "@lucidcms/core/types";

const findFieldRecursive = (props: {
	fields: FieldResponse[];
	targetKey: string;
	groupId?: number | string;
	repeaterKey?: string;
}): FieldResponse | null => {
	for (const field of props.fields) {
		// Direct match for top-level fields if no repeater key is specified
		if (
			!props.repeaterKey &&
			field.key === props.targetKey &&
			(!field.groupId || field.groupId === props.groupId)
		) {
			return field;
		}

		// If looking within a specific repeater field
		if (
			props.repeaterKey &&
			field.key === props.repeaterKey &&
			field.type === "repeater" &&
			field.groups
		) {
			for (const group of field.groups) {
				if (!props.groupId || group.id === props.groupId) {
					// Group ID check is here if specified
					for (const subField of group.fields) {
						if (
							subField.key === props.targetKey &&
							(!subField.groupId ||
								subField.groupId === props.groupId)
						) {
							return subField;
						}
						// Recursive check in case of nested repeater fields
						if (subField.type === "repeater") {
							const found = findFieldRecursive({
								fields:
									subField.groups?.flatMap((g) => g.fields) ||
									[],
								targetKey: props.targetKey,
								groupId: props.groupId,
								repeaterKey: props.repeaterKey,
							});
							if (found) return found;
						}
					}
				}
			}
		} else if (field.groups) {
			// Check recursively in other repeater fields
			const found = findFieldRecursive({
				fields: field.groups.flatMap((g) => g.fields),
				targetKey: props.targetKey,
				groupId: props.groupId,
				repeaterKey: props.repeaterKey,
			});
			if (found) return found;
		}
	}
	return null;
};

const getCollectionSudoBrickFields = () => {
	const sudoBrick = brickStore.get.bricks.find(
		(b) => b.type === "collection-fields",
	);
	if (!sudoBrick) return [];
	return sudoBrick.fields;
};

const getUpsertBricks = () =>
	brickStore.get.bricks.filter((b) => b.type !== "collection-fields");

const customFieldId = (props: {
	key: string;
	brickIndex: number;
	groupId?: number | string;
}): string => {
	if (props.groupId === undefined) {
		return `field-${props.key}-${props.brickIndex}`;
	}
	return `field-${props.key}-${props.brickIndex}-${props.groupId}`;
};

const getFieldValue = <T>(props: {
	fieldConfig: CustomField;
	fieldData?: FieldResponse;
	contentLanguage: string;
}) => {
	if (!props.fieldData) return undefined;

	if (props.fieldConfig.translations === true) {
		return props.fieldData.translations?.[props.contentLanguage] as T;
	}
	return props.fieldData.value as T;
};

const getFieldMeta = <T extends FieldResponseMeta>(props: {
	fieldConfig: CustomField;
	fieldData?: FieldResponse;
	contentLanguage: string;
}) => {
	if (!props.fieldData) return undefined;

	if (props.fieldConfig.translations === true) {
		return (props.fieldData.meta as Record<string, T>)?.[
			props.contentLanguage
		];
	}
	return props.fieldData.meta as T;
};

// ---------------------------------------------
// Exports
const brickHelpers = {
	findFieldRecursive,
	getCollectionSudoBrickFields,
	getUpsertBricks,
	customFieldId,
	getFieldValue,
	getFieldMeta,
};

export default brickHelpers;
