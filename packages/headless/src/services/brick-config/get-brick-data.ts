import type z from "zod";
import type bricksSchema from "../../schemas/bricks.js";
import type { BrickConfigT } from "@headless/types/src/bricks.js";
import type { BrickBuilderT } from "../../builders/brick-builder/index.js";

export interface ServiceData {
	instance: BrickBuilderT;
	query?: z.infer<typeof bricksSchema.getAll.query>;
}

const getBrickData = async (data: ServiceData) => {
	const brickData: BrickConfigT = {
		key: data.instance.key,
		title: data.instance.title,
		preview: data.instance.config?.preview,
	};

	if (!data.query) return brickData;
	if (data.query.include?.includes("fields"))
		brickData.fields = data.instance.fieldTree;

	return brickData;
};

export default getBrickData;
