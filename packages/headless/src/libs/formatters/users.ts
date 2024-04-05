import type { BooleanInt } from "../db/types.js";
import { formatDate } from "../../utils/format-helpers.js";
import UserPermissionsFormatter from "./user-permissions.js";
import type { UserResT } from "../../types/response.js";

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
		user: UserPropT[];
	}) => {
		return props.user.map((u) =>
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
			super_admin: props.user.super_admin ?? 0,
			email: props.user.email,
			username: props.user.username,
			first_name: props.user.first_name,
			last_name: props.user.last_name,
			roles: roles,
			permissions: permissions,
			created_at: formatDate(props.user.created_at),
			updated_at: formatDate(props.user.updated_at),
		};
	};
	static swagger = {
		type: "object",
		properties: {
			id: { type: "number", example: 1 },
			super_admin: { type: "number", example: 1 },
			email: { type: "string", example: "admin@headless.com" },
			username: { type: "string", example: "admin" },
			first_name: { type: "string", example: "Admin" },
			last_name: { type: "string", example: "User" },
			roles: UserPermissionsFormatter.swaggerRoles,
			permissions: UserPermissionsFormatter.swaggerPermissions,
			created_at: { type: "string", example: "2021-06-10T20:00:00.000Z" },
			updated_at: { type: "string", example: "2021-06-10T20:00:00.000Z" },
		},
	};
}
