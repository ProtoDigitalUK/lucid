import T from "../../translations/index.js";
import { or, eq } from "drizzle-orm";
import { APIError } from "../../utils/app/error-handler.js";
import { users } from "../../db/schema.js";
import auth from "./index.js";

export interface ServiceData {
	username_or_email: string;
	password: string;
}

const login = async (serviceConfig: ServiceConfigT, data: ServiceData) => {
	const findUserRes = await serviceConfig.db
		.select({
			id: users.id,
			password: users.password,
		})
		.from(users)
		.where(
			or(
				eq(users.username, data.username_or_email),
				eq(users.email, data.username_or_email),
			),
		)
		.limit(1);

	const user = findUserRes[0];

	if (!user || !user.password) {
		throw new APIError({
			type: "authorisation",
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
			type: "authorisation",
			name: T("login_error_name"),
			message: T("login_error_message"),
			status: 401,
		});
	}

	return {
		id: user.id,
	};
};

export default login;
