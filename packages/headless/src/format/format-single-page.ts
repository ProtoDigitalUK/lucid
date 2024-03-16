import type { SingleBuilderResT } from "@headless/types/src/multiple-page.js";
import { swaggerBrickRes } from "./format-bricks.js";
import { BrickResT } from "@headless/types/src/bricks.js";

const formatSinglepage = (
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

export const swaggerSinglePageRes = {
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

export default formatSinglepage;
