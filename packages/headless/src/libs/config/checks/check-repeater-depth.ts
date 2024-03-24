import constants from "../../../constants.js";

const checkRepeaterDepth = (
	brickKey: string,
	repeaterDepth: Record<string, number>,
) => {
	for (const [repeaterKey, depth] of Object.entries(repeaterDepth)) {
		if (depth > constants.fieldBuiler.maxRepeaterDepth) {
			throw new Error(
				`Repeater depth is too high in brick: ${brickKey} with key: ${repeaterKey}. Please reduce the depth from ${depth} to ${constants.fieldBuiler.maxRepeaterDepth}.`,
			);
		}
	}
};

export default checkRepeaterDepth;
