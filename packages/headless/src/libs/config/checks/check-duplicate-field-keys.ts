const checkDuplicateFieldKeys = (brickKey: string, fieldsKeys: string[]) => {
	const duplicateKeys = fieldsKeys.filter((key, index, array) => {
		return array.findIndex((k) => k === key) !== index;
	});

	if (duplicateKeys.length > 0) {
		throw new Error(
			`Duplicate field keys found: ${duplicateKeys.map(
				(k) => k,
			)} in brick: ${brickKey}`,
		);
	}
};

export default checkDuplicateFieldKeys;
