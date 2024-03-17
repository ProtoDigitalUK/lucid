import brickConfigServices from "./index.js";
import getConfig from "../config.js";
import type { BrickConfigT } from "@headless/types/src/bricks.js";

export interface ServiceData {
	filter_bricks?: string[];
	include_fields?: boolean;
}

const getBrickInstances = async (data: ServiceData) => {
	const config = await getConfig();

	const brickInstances: BrickConfigT[] = [];
	const builderInstances = config.bricks || [];

	for (const brick of builderInstances) {
		const brickData = await brickConfigServices.getBrickData({
			instance: brick,
			query: data.include_fields
				? {
						include: ["fields"],
				  }
				: undefined,
		});
		if (!data.filter_bricks) {
			brickInstances.push(brickData);
			continue;
		}
		if (data.filter_bricks.includes(brick.key)) {
			brickInstances.push(brickData);
		}
	}

	return brickInstances;
};

export default getBrickInstances;
