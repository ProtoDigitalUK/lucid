import type { BooleanInt } from "../db/types.js";
import type { UserResT } from "../../types/response.js";
import UserPermissionsFormatter from "./user-permissions.js";
import Formatter from "./index.js";

interface UserPropT {
	created_at: Date | string | null;
	email: string;
	first_name: string | null;
	super_admin: BooleanInt | null;
	id: number;
	last_name: string | null;
	updated_at: Date | string | null;
	username: string;
	roles?: {
		id: number;
		description: string | null;
		name: string;
		permissions?: {
			permission: string;
		}[];
	}[];
}

export default class UsersFormatter {
	formatMultiple = (props: {
		users: UserPropT[];
	}) => {
		return props.users.map((u) =>
			this.formatSingle({
				user: u,
			}),
		);
	};
	formatSingle = (props: {
		user: UserPropT;
	}): UserResT => {
		const { roles, permissions } =
			new UserPermissionsFormatter().formatMultiple({
				roles: props.user.roles || [],
			});

		return {
			id: props.user.id,
			superAdmin: props.user.super_admin ?? 0,
			email: props.user.email,
			username: props.user.username,
			firstName: props.user.first_name,
			lastName: props.user.last_name,
			roles: roles,
			permissions: permissions,
			createdAt: Formatter.formatDate(props.user.created_at),
			updatedAt: Formatter.formatDate(props.user.updated_at),
		};
	};
	static swagger = {
		type: "object",
		properties: {
			id: { type: "number", example: 1 },
			superAdmin: { type: "number", example: 1 },
			email: { type: "string", example: "admin@headless.com" },
			username: { type: "string", example: "admin" },
			firstAame: { type: "string", example: "Admin" },
			lastName: { type: "string", example: "User" },
			roles: UserPermissionsFormatter.swaggerRoles,
			permissions: UserPermissionsFormatter.swaggerPermissions,
			createdAt: { type: "string", example: "2021-06-10T20:00:00.000Z" },
			updatedAt: { type: "string", example: "2021-06-10T20:00:00.000Z" },
		},
	};
}
