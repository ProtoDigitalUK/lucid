import T from "../../translations/index.js";
import formatEnvironment from "../../format/format-environment.js";
import { APIError } from "../../utils/app/error-handler.js";
import { jsonArrayFrom } from "kysely/helpers/postgres";

export interface ServiceData {
	key: string;
}

const getSingle = async (serviceConfig: ServiceConfigT, data: ServiceData) => {
	const environment = await serviceConfig.db
		.selectFrom("headless_environments")
		.select((eb) => [
			"key",
			"title",
			jsonArrayFrom(
				eb
					.selectFrom("headless_assigned_bricks")
					.select([
						"headless_assigned_bricks.id",
						"headless_assigned_bricks.key",
						"headless_assigned_bricks.environment_key",
					])
					.whereRef(
						"headless_assigned_bricks.environment_key",
						"=",
						"headless_environments.key",
					),
			).as("assigned_bricks"),
			jsonArrayFrom(
				eb
					.selectFrom("headless_assigned_collections")
					.select([
						"headless_assigned_collections.id",
						"headless_assigned_collections.key",
						"headless_assigned_collections.environment_key",
					])
					.whereRef(
						"headless_assigned_collections.environment_key",
						"=",
						"headless_environments.key",
					),
			).as("assigned_collections"),
		])
		.where("key", "=", data.key)
		.executeTakeFirst();

	if (environment === undefined) {
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

	return formatEnvironment(environment);
};

export default getSingle;
