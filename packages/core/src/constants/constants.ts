import T from "../translations/index.js";
import permissionGroups from "./permission-groups.js";

export default {
	tempDir: "./tmp",
	swaggerRoutePrefix: "/documentation",
	headers: {
		accessToken: "_access",
		csrf: "_csrf",
		refreshToken: "_refresh",
		clientIntegrationKey: "lucid-client-key",
		contentLocale: "lucid-content-locale",
	},
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
					...permissionGroups.emails.permissions,
					...permissionGroups.content.permissions,
					...permissionGroups["client-integrations"].permissions,
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
	customFields: {
		link: {
			targets: ["_self", "_blank", "_parent", "_top", "framename"],
		},
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
		code: undefined,
		errorResponse: undefined,
	},
	emailTemplates: {
		resetPassword: "reset-password",
		userInvite: "user-invite",
		passwordResetSuccess: "password-reset-success",
		emailChanged: "email-changed",
	},
	rateLimit: {
		max: 100,
		timeWindow: "1 minute", // ms format - https://github.com/vercel/ms
	},
	brickTypes: {
		builder: "builder",
		fixed: "fixed",
		collectionFields: "collection-fields",
	} as const,
	cronSchedule: "0 0 * * *",
	csrfExpiration: 604800, // 7 days in seconds
	refreshTokenExpiration: 604800, // 7 days in seconds
	accessTokenExpiration: 300, // 5 minutes in seconds
	passwordResetTokenExpirationMinutes: 15, // 15 minutes
	userInviteTokenExpirationMinutes: 1440, // 24 hours in minutes
	documentation: "https://lucidcms.io/getting-started",
	lucidUi: "https://lucidui.io/",
};
