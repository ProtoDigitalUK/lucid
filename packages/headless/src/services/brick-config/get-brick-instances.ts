import brickConfigServices from "./index.js";
import getConfig from "../config.js";
import type { BrickConfigT } from "@headless/types/src/bricks.js";

export interface ServiceData {
	filterBricks?: string[];
	includeFields?: boolean;
}

const getBrickInstances = async (data: ServiceData) => {
	const config = await getConfig();

	const brickInstances: BrickConfigT[] = [];
	const builderInstances = config.bricks || [];

	for (const brick of builderInstances) {
		const brickData = await brickConfigServices.getBrickData({
			instance: brick,
			query: data.includeFields
				? {
						include: ["fields"],
				  }
				: undefined,
		});
		if (!data.filterBricks) {
			brickInstances.push(brickData);
			continue;
		}
		if (data.filterBricks.includes(brick.key)) {
			brickInstances.push(brickData);
		}
	}

	return brickInstances;
};

export default getBrickInstances;
