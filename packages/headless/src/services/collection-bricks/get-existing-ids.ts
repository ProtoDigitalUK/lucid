import T from "../../translations/index.js";
import { APIError } from "../../utils/app/error-handler.js";
import type { BrickObjectT } from "../../schemas/bricks.js";
import { jsonArrayFrom } from "kysely/helpers/postgres";

export interface ServiceData {
	id: number;
	type: "multiple-page" | "single-page";
	bricks: Array<BrickObjectT>;
}

const getExistingIds = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	let existingIdsQuery = serviceConfig.db
		.selectFrom("headless_collection_bricks")
		.select((eb) => [
			"headless_collection_bricks.id",
			jsonArrayFrom(
				eb
					.selectFrom("headless_groups")
					.select("group_id")
					.whereRef(
						"headless_groups.collection_brick_id",
						"=",
						"headless_groups.group_id",
					),
			).as("groups"),
			jsonArrayFrom(
				eb
					.selectFrom("headless_fields")
					.select("fields_id")
					.whereRef(
						"headless_fields.collection_brick_id",
						"=",
						"headless_fields.fields_id",
					),
			).as("fields"),
		]);

	if (data.type === "multiple-page") {
		existingIdsQuery = existingIdsQuery.where(
			"multiple_page_id",
			"=",
			data.id,
		);
	} else {
		existingIdsQuery = existingIdsQuery.where(
			"single_page_id",
			"=",
			data.id,
		);
	}

	const existingIds = await existingIdsQuery.execute();

	// TODO: Add error handling

	return existingIds;
};

export default getExistingIds;
