export default {
	defaultUser: {
		first_name: "Headless",
		last_name: "Admin",
		email: "admin@headless.com",
		username: "admin",
		password: "password",
		super_admin: true,
	},
	csrfExpiration: 86400000 * 7, // 7 days
	refreshTokenExpiration: 86400000 * 7, // 7 days
	accessTokenExpiration: 300000, // 5 minutes
};
