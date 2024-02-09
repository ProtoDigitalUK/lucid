import formatEnvironment from "../../format/format-environment.js";
import { jsonArrayFrom } from "kysely/helpers/postgres";

// export interface ServiceData {}

const getAll = async (serviceConfig: ServiceConfigT) => {
	const environments = await serviceConfig.db
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
		.execute();

	return environments.map((environment) => formatEnvironment(environment));
};

export default getAll;
