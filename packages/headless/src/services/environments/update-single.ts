import T from "../../translations/index.js";
import { APIError } from "../../utils/app/error-handler.js";
import { environments } from "../../db/schema.js";
import { eq } from "drizzle-orm";
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

	const environmentExists = await serviceConfig.db
		.select({
			key: environments.key,
			title: environments.title,
		})
		.from(environments)
		.where(eq(environments.key, data.key))
		.limit(1);

	const environmentData = environmentExists[0];

	if (environmentExists.length === 0) {
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
		if (data.data.title && data.data.title !== environmentData.title) {
			await serviceConfig.db
				.update(environments)
				.set({
					title: data.data.title,
				})
				.where(eq(environments.key, data.key));
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
