import T from "../../translations/index.js";
import { APIError } from "../../utils/app/error-handler.js";
import type { BrickObjectT } from "../../schemas/bricks.js";
import collectionBricksServices from "../collection-bricks/index.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";

export interface ServiceData {
	id: number;
	bricks?: Array<BrickObjectT>;
}

const updateSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const page = await serviceConfig.db
		.selectFrom("headless_collection_multiple_page")
		.select(["id", "collection_key"])
		.where("id", "=", data.id)
		.executeTakeFirst();

	if (page === undefined) {
		throw new APIError({
			type: "basic",
			name: T("error_not_found_name", {
				name: T("page"),
			}),
			message: T("error_not_found_message", {
				name: T("page"),
			}),
			status: 404,
		});
	}

	if (page.collection_key && data.bricks && data.bricks.length > 0) {
		await serviceWrapper(collectionBricksServices.upsertMultiple, false)(
			serviceConfig,
			{
				id: data.id,
				type: "multiple-page",
				bricks: data.bricks,
				collection_key: page.collection_key,
			},
		);
	}
};

export default updateSingle;
