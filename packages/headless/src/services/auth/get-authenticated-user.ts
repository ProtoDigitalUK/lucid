import T from "../../translations/index.js";
import { type FastifyInstance } from "fastify";
import { eq } from "drizzle-orm";
import { APIError } from "../../utils/app/error-handler.js";
import { users } from "../../db/schema.js";
import formatUser from "../../format/format-user.js";
import usersServices from "../users/index.js";

export interface ServiceData {
	user_id: number;
}

const getAuthenticatedUser = async (
	fastify: FastifyInstance,
	data: ServiceData,
) => {
	const findUserRes = await fastify.db
		.select()
		.from(users)
		.where(eq(users.id, data.user_id))
		.limit(1);

	const user = findUserRes[0];

	if (!user) {
		throw new APIError({
			type: "basic",
			name: T("error_not_found_name", {
				name: T("user"),
			}),
			message: T("error_not_found_message", {
				name: T("user"),
			}),
			status: 500,
		});
	}

	// TODO: update when we have permissions and roles implemented
	// Get user permissions
	// const permissions = await usersServices.getPermissions(fastify, {
	// 	user_id: data.user_id,
	// });

	return formatUser(user, undefined);
};

export default getAuthenticatedUser;
