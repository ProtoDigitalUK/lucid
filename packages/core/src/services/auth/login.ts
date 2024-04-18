import T from "../../translations/index.js";
import { HeadlessAPIError } from "../../utils/error-handler.js";
import auth from "./index.js";
import Repository from "../../libs/repositories/index.js";
import type { ServiceConfig } from "../../utils/service-wrapper.js";

export interface ServiceData {
	usernameOrEmail: string;
	password: string;
}

const login = async (serviceConfig: ServiceConfig, data: ServiceData) => {
	const UsersRepo = Repository.get("users", serviceConfig.db);

	const user = await UsersRepo.selectSingleByEmailUsername({
		select: ["id", "password", "is_deleted"],
		data: {
			username: data.usernameOrEmail,
			email: data.usernameOrEmail,
		},
	});

	if (!user || !user.password) {
		throw new HeadlessAPIError({
			type: "authorisation",
			name: T("login_error_name"),
			message: T("login_error_message"),
			status: 401,
		});
	}

	if (user !== undefined && user.is_deleted === 1) {
		throw new HeadlessAPIError({
			type: "authorisation",
			name: T("login_error_name"),
			message: T("login_suspended_error_message"),
			status: 401,
		});
	}

	const passwordValid = await auth.validatePassword({
		hashedPassword: user.password,
		password: data.password,
	});

	if (!passwordValid) {
		throw new HeadlessAPIError({
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
