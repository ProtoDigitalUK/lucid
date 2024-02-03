export default {
	defaultUser: {
		first_name: "Headless",
		last_name: "Admin",
		email: "admin@headless.com",
		username: "admin",
		password: "password",
		super_admin: true,
	},
	query: {
		page: 1,
		per_page: 10,
	},
	// 7 days in seconds
	csrfExpiration: 604800, // 7 days in seconds
	refreshTokenExpiration: 604800, // 7 days in seconds
	accessTokenExpiration: 300, // 5 minutes in seconds
};
