import type z from "zod";
import type usersSchema from "../../schemas/users.js";
import { parseCount } from "../../utils/helpers.js";
import formatUser from "../../format/format-user.js";
import RepositoryFactory from "../../libs/factories/repository-factory.js";

export interface ServiceData {
	query: z.infer<typeof usersSchema.getMultiple.query>;
}

const getMultiple = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const UsersRepo = RepositoryFactory.getRepository(
		"users",
		serviceConfig.db,
	);

	const [users, count] = await UsersRepo.getMultipleQueryBuilder({
		query: data.query,
		config: serviceConfig.config,
	});

	return {
		data: users.map((u) => {
			return formatUser({
				user: u,
			});
		}),
		count: parseCount(count?.count),
	};
};

export default getMultiple;
