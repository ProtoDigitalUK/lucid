import T from "../../translations/index.js";
import { APIError } from "../../utils/app/error-handler.js";
import type { BrickObjectT } from "../../schemas/bricks.js";
import collectionBricksServices from "../collection-bricks/index.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";
import singlePageService from "./index.js";

export interface ServiceData {
	collection_key: string;
	user_id: number;
	bricks: Array<BrickObjectT>;
}

const updateSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const singlePage = await serviceWrapper(singlePageService.getSingle, false)(
		serviceConfig,
		{
			collection_key: data.collection_key,
			user_id: data.user_id,
			include_bricks: false,
		},
	);

	const [pageRes] = await Promise.all([
		serviceConfig.db
			.updateTable("headless_collection_single_page")
			.set({
				updated_by: data.user_id,
				updated_at: new Date(),
			})
			.where("collection_key", "=", data.collection_key)
			.returning("id")
			.executeTakeFirst(),
		serviceWrapper(collectionBricksServices.upsertMultiple, false)(
			serviceConfig,
			{
				id: singlePage.id,
				type: "builder",
				multiple: false,
				bricks: data.bricks || [],
				collection_key: data.collection_key,
			},
		),
	]);

	if (pageRes === undefined) {
		throw new APIError({
			type: "basic",
			name: T("error_not_updated_name", {
				name: T("page"),
			}),
			message: T("update_error_message", {
				name: T("page").toLowerCase(),
			}),
			status: 500,
		});
	}

	return pageRes.id;
};

export default updateSingle;
