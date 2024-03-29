import T from "../../translations/index.js";
import { APIError } from "../../utils/error-handler.js";
import auth from "./index.js";

export interface ServiceData {
	username_or_email: string;
	password: string;
}

const login = async (serviceConfig: ServiceConfigT, data: ServiceData) => {
	const user = await serviceConfig.config.db.client
		.selectFrom("headless_users")
		.select(["id", "password", "is_deleted"])
		.where((eb) =>
			eb.or([
				eb("username", "=", data.username_or_email),
				eb("email", "=", data.username_or_email),
			]),
		)
		.executeTakeFirst();

	if (!user || !user.password) {
		throw new APIError({
			type: "authorisation",
			name: T("login_error_name"),
			message: T("login_error_message"),
			status: 401,
		});
	}

	if (user !== undefined && user.is_deleted === true) {
		throw new APIError({
			type: "authorisation",
			name: T("login_error_name"),
			message: T("login_suspended_error_message"),
			status: 401,
		});
	}

	const passwordValid = await auth.validatePassword({
		hashed_password: user.password,
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
