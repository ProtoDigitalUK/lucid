import T from "./translations/index.js";
import { permissionGroups } from "./services/permissions.js";

export default {
	seedDefaults: {
		user: {
			firstName: "Lucid",
			lastName: "CMS",
			email: "admin@lucidcms.io",
			username: "admin",
			password: "password",
			superAdmin: 1,
		},
		roles: [
			{
				name: "Admin",
				description: "The admin role has permissions to do everything.",
				permissions: [
					...permissionGroups.users.permissions,
					...permissionGroups.roles.permissions,
					...permissionGroups.media.permissions,
					...permissionGroups.settings.permissions,
					...permissionGroups.emails.permissions,
					...permissionGroups.content.permissions,
				],
			},
			{
				name: "Editor",
				description:
					"The editor role has permissions to manage content.",
				permissions: [
					...permissionGroups.media.permissions,
					...permissionGroups.content.permissions,
				],
			},
		],
	},
	fieldBuiler: {
		maxRepeaterDepth: 3,
	},
	query: {
		page: 1,
		perPage: 10,
	},
	locations: {
		resetPassword: "/admin/reset-password",
	},
	errors: {
		name: T("default_error_name"),
		message: T("default_error_message"),
		status: 500,
		code: null,
		errorResponse: null,
	},
	emailTemplates: {
		resetPassword: "reset-password",
		userInvite: "user-invite",
		passwordResetSuccess: "password-reset-success",
		emailChanged: "email-changed",
	},
	csrfExpiration: 604800, // 7 days in seconds
	refreshTokenExpiration: 604800, // 7 days in seconds
	accessTokenExpiration: 300, // 5 minutes in seconds
	passwordResetTokenExpirationMinutes: 15, // 15 minutes
	userInviteTokenExpirationMinutes: 1440, // 24 hours in minutes
	documentation: "https://lucidcms.io/getting-started",
};
