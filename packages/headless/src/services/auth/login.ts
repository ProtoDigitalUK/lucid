import T from "../../translations/index.js";
import { APIError } from "../../utils/error-handler.js";
import auth from "./index.js";
import Repository from "../../libs/repositories/index.js";

export interface ServiceData {
	username_or_email: string;
	password: string;
}

const login = async (serviceConfig: ServiceConfigT, data: ServiceData) => {
	const UsersRepo = Repository.get("users", serviceConfig.db);

	const user = await UsersRepo.selectSingleByEmailUsername({
		select: ["id", "password", "is_deleted"],
		data: {
			username: data.username_or_email,
			email: data.username_or_email,
		},
	});

	if (!user || !user.password) {
		throw new APIError({
			type: "authorisation",
			name: T("login_error_name"),
			message: T("login_error_message"),
			status: 401,
		});
	}

	if (user !== undefined && user.is_deleted === 1) {
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
