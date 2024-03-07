import T from "../../translations/index.js";
import { APIError } from "../../utils/app/error-handler.js";
import auth from "./index.js";

export interface ServiceData {
	username_or_email: string;
	password: string;
}

const login = async (serviceConfig: ServiceConfigT, data: ServiceData) => {
	const user = await serviceConfig.db
		.selectFrom("headless_users")
		.select(["id", "password"])
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
