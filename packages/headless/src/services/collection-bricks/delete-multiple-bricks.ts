import type { CollectionConfigT } from "../../builders/collection-builder/index.js";

export interface ServiceData {
	id: number;
	type: CollectionConfigT["type"];
	multiple: CollectionConfigT["multiple"];
	bricks: {
		id: number;
		brick_key: string;
		brick_order: number;
	}[];
}

const deleteMultipleBricks = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	let deleteBricksQuery = serviceConfig.db
		.deleteFrom("headless_collection_bricks")
		.where(
			"id",
			"not in",
			data.bricks.map((brick) => brick.id),
		);

	if (data.multiple) {
		deleteBricksQuery = deleteBricksQuery.where(
			"multiple_page_id",
			"=",
			data.id,
		);
	} else {
		deleteBricksQuery = deleteBricksQuery.where(
			"single_page_id",
			"=",
			data.id,
		);
	}

	return deleteBricksQuery.execute();
};

export default deleteMultipleBricks;
