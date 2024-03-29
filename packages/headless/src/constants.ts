import { permissionGroups } from "./services/permissions.js";

export default {
	seedDefaults: {
		language: {
			code: "en",
			is_default: 1,
			is_enabled: 1,
		},
		user: {
			first_name: "Headless",
			last_name: "Admin",
			email: "admin@headless.com",
			username: "admin",
			password: "password",
			super_admin: 1,
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
					...permissionGroups.languages.permissions,
					...permissionGroups.emails.permissions,
					...permissionGroups.content.permissions,
					...permissionGroups.category.permissions,
					...permissionGroups.menu.permissions,
					...permissionGroups.form_submissions.permissions,
				],
			},
			{
				name: "Editor",
				description:
					"The editor role has permissions to manage content.",
				permissions: [
					...permissionGroups.media.permissions,
					...permissionGroups.content.permissions,
					...permissionGroups.category.permissions,
					...permissionGroups.menu.permissions,
				],
			},
		],
	},
	fieldBuiler: {
		maxRepeaterDepth: 3,
	},
	query: {
		page: 1,
		per_page: 10,
	},
	locations: {
		resetPassword: "/reset-password",
	},
	media: {
		storageLimit: 5368709120, // unit: byte (5GB)
		maxFileSize: 16777216, // unit: byte (16MB)
		processedImages: {
			limit: 10,
			store: false,
		},
	},
	csrfExpiration: 604800, // 7 days in seconds
	refreshTokenExpiration: 604800, // 7 days in seconds
	accessTokenExpiration: 300, // 5 minutes in seconds
	passwordResetTokenExpirationMinutes: 15,
};
