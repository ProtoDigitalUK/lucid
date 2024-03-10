import T from "../../translations/index.js";
import { APIError } from "../../utils/app/error-handler.js";
import brickConfigServices from "../brick-config/index.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";
import collectionsServices from "./index.js";

export interface ServiceData {
	key: string;
	type: "multiple-page" | "single-page";
	slug?: string;
	title: string;
	singular: string;
	description?: string;
	disable_homepages?: boolean;
	disable_parents?: boolean;
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
	const [slug] = await Promise.all([
		serviceWrapper(collectionsServices.checks.checkSlugExists, false)(
			serviceConfig,
			{
				slug: data.slug,
			},
		),
		serviceWrapper(collectionsServices.checks.checkCollectionExists, false)(
			serviceConfig,
			{
				key: data.key,
			},
		),
		data.bricks !== undefined
			? brickConfigServices.checks.checkBricksExist({
					bricks: data.bricks.map((b) => b.key),
			  })
			: undefined,
	]);

	const collection = await serviceConfig.db
		.insertInto("headless_collections")
		.values({
			key: data.key,
			slug: slug,
			type: data.type,
			title: data.title,
			singular: data.singular,
			description: data.description,
			disable_homepages: data.disable_homepages ?? false,
			disable_parents: data.disable_parents ?? false,
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
