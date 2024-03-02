export default {
	seedDefaults: {
		language: {
			code: "en",
			is_default: true,
			is_enabled: true,
		},
		environment: {
			key: "production",
			title: "Production",
		},
		user: {
			first_name: "Headless",
			last_name: "Admin",
			email: "admin@headless.com",
			username: "admin",
			password: "password",
			super_admin: true,
		},
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
