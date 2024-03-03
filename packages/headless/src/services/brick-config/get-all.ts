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
	const environmentKey = data.query.filter?.environment_key;
	const collectionKey = data.query.filter?.collection_key;

	let bricks: BrickConfigT[] = [];

	if (environmentKey && collectionKey) {
		const collectionRes = await serviceWrapper(
			collectionsServices.getSingle,
			false,
		)(serviceConfig, {
			collectionKey: collectionKey,
			environmentKey: environmentKey,
		});
		const allowedBricks = await brickConfigService.getAllowedBricks({
			collection: collectionRes.collection,
			environment: collectionRes.environment,
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
