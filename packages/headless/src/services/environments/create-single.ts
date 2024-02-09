import slug from "slug";
import T from "../../translations/index.js";
import { APIError, modelErrors } from "../../utils/app/error-handler.js";
import assignedBricksServices from "../assigned-bricks/index.js";
import assignedCollectionsServices from "../assigned-collections/index.js";
import getConfig from "../config.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";

export interface ServiceData {
	key: string;
	title: string;
	assignedBricks?: string[];
	assignedCollections?: string[];
}

const createSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const config = await getConfig();
	const key = slug(data.key, { lower: true });

	const environmentExists = await serviceConfig.db
		.selectFrom("headless_environments")
		.select("key")
		.where("key", "=", key)
		.executeTakeFirst();

	if (environmentExists !== undefined) {
		throw new APIError({
			type: "basic",
			name: T("error_already_exists_name", {
				name: T("environment"),
			}),
			message: T("environment_with_key_already_exists", {
				key: key,
			}),
			status: 400,
			errors: modelErrors({
				key: {
					code: "duplicate",
					message: T("environment_with_key_already_exists", {
						key: key,
					}),
				},
			}),
		});
	}

	if (data.assignedBricks)
		assignedBricksServices.checkAssignedBricks(config, data.assignedBricks);
	if (data.assignedCollections)
		assignedCollectionsServices.checkAssignedCollections(
			config,
			data.assignedCollections,
		);

	const environment = await serviceConfig.db
		.insertInto("headless_environments")
		.values({
			key: key,
			title: data.title,
		})
		.returning("key")
		.executeTakeFirst();

	if (environment === undefined) {
		throw new APIError({
			type: "basic",
			name: T("error_not_created_name", {
				name: T("environment"),
			}),
			message: T("error_not_created_message", {
				name: T("environment"),
			}),
			status: 400,
		});
	}

	await Promise.all([
		serviceWrapper(assignedBricksServices.createMultiple, false)(
			serviceConfig,
			{
				environmentKey: environment.key,
				assignedBricks: data.assignedBricks,
			},
		),
		serviceWrapper(assignedCollectionsServices.createMultiple, false)(
			serviceConfig,
			{
				environmentKey: environment.key,
				assignedCollections: data.assignedCollections,
			},
		),
	]);

	return environment.key;
};

export default createSingle;
