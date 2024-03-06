import T from "../../translations/index.js";
import { APIError } from "../../utils/app/error-handler.js";
import brickConfigServices from "../brick-config/index.js";

export interface ServiceData {
	key: string;
	title?: string;
	singular?: string;
	description?: string | null;
	disableHomepages?: boolean;
	disableParents?: boolean;
	bricks?: {
		key: string;
		type: "builder" | "fixed";
		position?: "top" | "bottom" | "sidebar";
	}[];
}

const updateSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	if (data.bricks !== undefined) {
		await brickConfigServices.checks.checkBricksExist({
			bricks: data.bricks.map((b) => b.key),
		});
	}

	const updateCollectionRes = await serviceConfig.db
		.updateTable("headless_collections")
		.set({
			title: data.title,
			singular: data.singular,
			description: data.description,
			disable_homepages: data.disableHomepages,
			disable_parents: data.disableParents,
			updated_at: new Date().toISOString(),
		})
		.where("key", "=", data.key)
		.executeTakeFirst();

	if (updateCollectionRes.numUpdatedRows === 0n) {
		throw new APIError({
			type: "basic",
			name: T("dynamic_error_name", {
				name: T("collection"),
			}),
			message: T("update_error_message", {
				name: T("collection").toLowerCase(),
			}),
			status: 400,
		});
	}

	if (data.bricks !== undefined) {
		await serviceConfig.db
			.deleteFrom("headless_collections_bricks")
			.where("collection_key", "=", data.key)
			.executeTakeFirst();

		if (data.bricks.length > 0) {
			await serviceConfig.db
				.insertInto("headless_collections_bricks")
				.values(
					data.bricks.map((b) => ({
						collection_key: data.key,
						key: b.key,
						type: b.type,
						position: b.position ?? "bottom",
					})),
				)
				.execute();
		}
	}
};

export default updateSingle;
