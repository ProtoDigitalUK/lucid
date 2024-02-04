import { type FastifyInstance } from "fastify";
import slug from "slug";
import T from "../../translations/index.js";
import { APIError, modelErrors } from "../../utils/app/error-handler.js";
import {
	environments,
	assignedBricks,
	assignedCollections,
} from "../../db/schema.js";
import { eq } from "drizzle-orm";
import checkAssignedBricks from "./checks/check-assigned-bricks.js";
import checkAssignedCollections from "./checks/check-assigned-collectins.js";
import getConfig from "../config.js";

export interface ServiceData {
	key: string;
	title: string;
	assigned_bricks?: string[];
	assigned_collections?: string[];
}

const createSingle = async (fastify: FastifyInstance, data: ServiceData) => {
	const config = await getConfig();
	const key = slug(data.key, { lower: true });

	const environmentExists = await fastify.db
		.select({
			key: environments.key,
		})
		.from(environments)
		.where(eq(environments.key, key))
		.limit(1);

	console.log(environmentExists);

	if (environmentExists.length > 0) {
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

	if (data.assigned_bricks) checkAssignedBricks(config, data.assigned_bricks);
	if (data.assigned_collections)
		checkAssignedCollections(config, data.assigned_collections);

	const environment = await fastify.db
		.insert(environments)
		.values({
			key: key,
			title: data.title,
		})
		.returning({
			key: environments.key,
		})
		.execute();

	if (environment.length === 0) {
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
		data.assigned_bricks &&
			fastify.db
				.insert(assignedBricks)
				.values(
					data.assigned_bricks.map((brick) => ({
						key: brick,
						environment_key: key,
					})),
				)
				.execute(),
		data.assigned_collections &&
			fastify.db
				.insert(assignedCollections)
				.values(
					data.assigned_collections.map((collection) => ({
						key: collection,
						environment_key: key,
					})),
				)
				.execute(),
	]);

	return true;
};

export default createSingle;
