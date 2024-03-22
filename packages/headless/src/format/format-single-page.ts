import type { SinglePagesResT } from "@headless/types/src/multiple-builder.js";
import { swaggerBrickRes } from "./format-bricks.js";
import { BrickResT } from "@headless/types/src/bricks.js";

const formatSinglepage = (
	page: {
		id: number;
	},
	bricks?: BrickResT[],
): SinglePagesResT => {
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
