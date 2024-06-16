import Repository from "../../libs/repositories/index.js";
import Formatter from "../../libs/formatters/index.js";
import type z from "zod";
import type usersSchema from "../../schemas/users.js";
import type { ServiceFn } from "../../libs/services/types.js";
import type { UserResponse } from "../../types/response.js";

const getMultiple: ServiceFn<
	[
		{
			query: z.infer<typeof usersSchema.getMultiple.query>;
			auth: {
				id: number;
			};
		},
	],
	{
		data: UserResponse[];
		count: number;
	}
> = async (service, data) => {
	const UsersRepo = Repository.get("users", service.db);
	const UsersFormatter = Formatter.get("users");

	const [users, count] = await UsersRepo.selectMultipleFiltered({
		query: data.query,
		config: service.config,
		authId: data.auth.id,
	});

	return {
		error: undefined,
		data: {
			data: UsersFormatter.formatMultiple({
				users: users,
			}),
			count: Formatter.parseCount(count?.count),
		},
	};
};

export default getMultiple;
