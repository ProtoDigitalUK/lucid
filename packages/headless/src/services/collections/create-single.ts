import T from "../../translations/index.js";
import { APIError, modelErrors } from "../../utils/app/error-handler.js";
import brickConfigServices from "../brick-config/index.js";

export interface ServiceData {
	key: string;
	type: "multiple-builder" | "single-builder";
	title: string;
	singular: string;
	description?: string;
	bricks?: {
		key: string;
		type: "builder" | "fixed";
		position?: "top" | "bottom" | "sidebar";
	}[];
}

const createSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	if (data.bricks !== undefined) {
		await brickConfigServices.checks.checkBricksExist({
			bricks: data.bricks.map((b) => b.key),
		});
	}

	const collectionExists = await serviceConfig.db
		.selectFrom("headless_collections")
		.where("key", "=", data.key)
		.executeTakeFirst();

	if (collectionExists !== undefined) {
		throw new APIError({
			type: "basic",
			name: T("error_not_created_name", {
				name: T("collection"),
			}),
			message: T("error_not_created_message", {
				name: T("collection"),
			}),
			status: 400,
			errors: modelErrors({
				key: {
					code: "invalid",
					message: T("duplicate_entry_error_message"),
				},
			}),
		});
	}

	const collection = await serviceConfig.db
		.insertInto("headless_collections")
		.values({
			key: data.key,
			type: data.type,
			title: data.title,
			singular: data.singular,
			description: data.description,
		})
		.returning("key")
		.executeTakeFirst();

	if (collection === undefined) {
		throw new APIError({
			type: "basic",
			name: T("dynamic_error_name", {
				name: T("collection"),
			}),
			message: T("creation_error_message", {
				name: T("collection").toLowerCase(),
			}),
			status: 400,
		});
	}

	if (data.bricks === undefined) {
		return collection.key;
	}

	await serviceConfig.db
		.insertInto("headless_collections_bricks")
		.values(
			data.bricks.map((b) => ({
				collection_key: collection.key,
				key: b.key,
				type: b.type,
				position: b.position ?? "bottom",
			})),
		)
		.execute();

	return collection.key;
};

export default createSingle;
