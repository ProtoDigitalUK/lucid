import z from "zod";
import bricksSchema from "../../schemas/bricks.js";
import getConfig from "../config.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";
import collectionsServices from "../collections/index.js";
import brickConfigService from "./index.js";
import type { BrickConfigT } from "@headless/types/src/bricks.js";

export interface ServiceData {
	query: z.infer<typeof bricksSchema.getAll.query>;
}

const getAll = async (serviceConfig: ServiceConfigT, data: ServiceData) => {
	const collectionKey = data.query.filter?.collection_key;

	let bricks: BrickConfigT[] = [];

	if (collectionKey) {
		const collection = await serviceWrapper(
			collectionsServices.getSingle,
			false,
		)(serviceConfig, {
			key: collectionKey,
		});
		const allowedBricks = await brickConfigService.getAllowedBricks({
			collection: collection,
		});
		bricks = allowedBricks.bricks;
	} else {
		const config = await getConfig();
		const builderInstances = config.bricks || [];
		for (const instance of builderInstances) {
			const brick = await brickConfigService.getBrickData({
				instance: instance,
				query: {
					include: ["fields"],
				},
			});
			bricks.push(brick);
		}
	}

	if (!data.query.include?.includes("fields")) {
		for (const brick of bricks) {
			brick.fields = undefined;
		}
	}

	return bricks;
};

export default getAll;
