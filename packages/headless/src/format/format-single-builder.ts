import type { SingleBuilderResT } from "@headless/types/src/multiple-builder.js";
import { swaggerBrickRes } from "./format-bricks.js";
import type { BrickResT } from "@headless/types/src/bricks.js";

const formatSingleBuilder = (
	page: {
		id: number;
	},
	bricks?: BrickResT[],
): SingleBuilderResT => {
	return {
		id: page.id,
		bricks: bricks || [],
	};
};

export const swaggerSingleBuilderRes = {
	type: "object",
	properties: {
		id: {
			type: "number",
		},
		bricks: {
			type: "array",
			items: swaggerBrickRes,
		},
	},
};

export default formatSingleBuilder;
