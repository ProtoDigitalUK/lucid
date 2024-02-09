import T from "../../translations/index.js";
import { APIError } from "../../utils/app/error-handler.js";
import assignedBricksServices from "../assigned-bricks/index.js";
import assignedCollectionsServices from "../assigned-collections/index.js";
import getConfig from "../config.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";

export interface ServiceData {
	key: string;
	data: {
		title?: string;
		assignedBricks?: string[];
		assignedCollections?: string[];
	};
}

const updateSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const config = await getConfig();

	const envrionmentExists = await serviceConfig.db
		.selectFrom("headless_environments")
		.select(["key", "title"])
		.where("key", "=", data.key)
		.executeTakeFirst();

	if (envrionmentExists === undefined) {
		throw new APIError({
			type: "basic",
			name: T("error_not_found_name", {
				name: T("environment"),
			}),
			message: T("error_not_found_message", {
				name: T("environment"),
			}),
			status: 404,
		});
	}

	if (data.data.assignedBricks)
		assignedBricksServices.checkAssignedBricks(
			config,
			data.data.assignedBricks,
		);
	if (data.data.assignedCollections)
		assignedCollectionsServices.checkAssignedCollections(
			config,
			data.data.assignedCollections,
		);

	const updateEnvironment = async () => {
		if (data.data.title && data.data.title !== envrionmentExists.title) {
			await serviceConfig.db
				.updateTable("headless_environments")
				.set({
					title: data.data.title,
				})
				.where("key", "=", data.key)
				.execute();
		}
	};

	await Promise.all([
		updateEnvironment(),
		serviceWrapper(assignedBricksServices.updateMultiple, false)(
			serviceConfig,
			{
				environmentKey: data.key,
				assignedBricks: data.data.assignedBricks,
			},
		),
		serviceWrapper(assignedCollectionsServices.updateMultiple, false)(
			serviceConfig,
			{
				environmentKey: data.key,
				assignedCollections: data.data.assignedCollections,
			},
		),
	]);

	return true;
};

export default updateSingle;
