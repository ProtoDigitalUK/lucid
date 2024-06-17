import T from "../../../translations/index.js";
import constants from "../../../constants/constants.js";

const checkRepeaterDepth = (
	type: "brick" | "collection",
	typeKey: string,
	repeaterDepth: Record<string, number>,
) => {
	for (const [repeaterKey, depth] of Object.entries(repeaterDepth)) {
		if (depth > constants.fieldBuiler.maxRepeaterDepth) {
			throw new Error(
				T("repeater_depth_message", {
					type: type,
					typeKey: typeKey,
					repeaterKey: repeaterKey,
					depth: depth,
					maxRepeaterDepth: constants.fieldBuiler.maxRepeaterDepth,
				}),
			);
		}
	}
};

export default checkRepeaterDepth;
