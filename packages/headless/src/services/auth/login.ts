import T from "../../translations/index.js";
import { type FastifyInstance } from "fastify";
import { or, eq } from "drizzle-orm";
import { APIError } from "../../utils/app/error-handler.js";
import { users } from "../../db/schema.js";
import auth from "./index.js";

export interface ServiceData {
	usernameOrEmail: string;
	password: string;
}

const login = async (fastify: FastifyInstance, data: ServiceData) => {
	const findUserRes = await fastify.db
		.select({
			id: users.id,
			password: users.password,
			email: users.email,
			username: users.username,
		})
		.from(users)
		.where(
			or(
				eq(users.username, data.usernameOrEmail),
				eq(users.email, data.usernameOrEmail),
			),
		)
		.limit(1);

	const user = findUserRes[0];

	if (!user || !user.password) {
		throw new APIError({
			type: "basic",
			name: T("login_error_name"),
			message: T("login_error_message"),
			status: 401,
		});
	}

	const passwordValid = await auth.validatePassword({
		hashedPassword: user.password,
		password: data.password,
	});

	if (!passwordValid) {
		throw new APIError({
			type: "basic",
			name: T("login_error_name"),
			message: T("login_error_message"),
			status: 401,
		});
	}

	return {
		id: user.id,
		email: user.email,
		username: user.username,
	};
};

export default login;
