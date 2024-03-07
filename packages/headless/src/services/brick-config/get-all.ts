import z from "zod";
import bricksSchema from "../../schemas/bricks.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";
import collectionsServices from "../collections/index.js";
import brickConfigService from "./index.js";

export interface ServiceData {
	query: z.infer<typeof bricksSchema.getAll.query>;
}

const getAll = async (serviceConfig: ServiceConfigT, data: ServiceData) => {
	const collectionKey = data.query.filter?.collection_key;

	if (collectionKey) {
		const collection = await serviceWrapper(
			collectionsServices.getSingle,
			false,
		)(serviceConfig, {
			key: collectionKey,
		});
		return await brickConfigService.getBrickInstances({
			filter_bricks: collection.bricks?.map((b) => b.key),
			include_fields: data.query.include?.includes("fields"),
		});
	}

	return await brickConfigService.getBrickInstances({
		include_fields: data.query.include?.includes("fields"),
	});
};

export default getAll;
