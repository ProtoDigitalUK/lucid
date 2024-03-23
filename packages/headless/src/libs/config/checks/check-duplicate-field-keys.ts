import type { CustomFieldT } from "../../../libs/brick-builder-new/index.d.js";

const checkDuplicateFieldKeys = (brickKey: string, fields: CustomFieldT[]) => {
	const duplicateKeys = fields.filter((field, index, array) => {
		return array.findIndex((f) => f.key === field.key) !== index;
	});

	if (duplicateKeys.length > 0) {
		throw new Error(
			`Duplicate field keys found: ${duplicateKeys.map(
				(field) => field.key,
			)} in brick: ${brickKey}`,
		);
	}
};

export default checkDuplicateFieldKeys;
