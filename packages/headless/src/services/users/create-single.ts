import T from "../../translations/index.js";
import { APIError } from "../../utils/app/error-handler.js";

export interface ServiceData {
	email: string;
	username: string;
	password: string;
	password_confirmation: string;
	first_name?: string;
	last_name?: string;
	super_admin?: boolean;
	role_ids: Array<number>;
}

const createSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	// check if the username or email already exists
	// if the current user is not a super admin, set data.super_admin to false
	// create new user with the data provided
	// add roles to the user
	// return user id
};

export default createSingle;
