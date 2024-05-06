import type { FieldResponse } from "@lucidcms/core/types";

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

// ---------------------------------------------
// Exports
const brickHelpers = {
	findFieldRecursive,
};

export default brickHelpers;
