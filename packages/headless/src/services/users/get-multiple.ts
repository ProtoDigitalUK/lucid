import type z from "zod";
import type usersSchema from "../../schemas/users.js";
import Repository from "../../libs/repositories/index.js";
import Formatter from "../../libs/formatters/index.js";

export interface ServiceData {
	query: z.infer<typeof usersSchema.getMultiple.query>;
}

const getMultiple = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const UsersRepo = Repository.get("users", serviceConfig.db);
	const UsersFormatter = Formatter.get("users");

	const [users, count] = await UsersRepo.selectMultipleFiltered({
		query: data.query,
		config: serviceConfig.config,
	});

	return {
		data: UsersFormatter.formatMultiple({
			users: users,
		}),
		count: Formatter.parseCount(count?.count),
	};
};

export default getMultiple;
