import { headlessConfig } from "@protodigital/headless";

export default headlessConfig({
	databaseURL: process.env.DATABASE_URL as string,
	keys: {
		cookieSecret: process.env.COOKIE_SECRET as string,
	},
	collections: [],
	bricks: [],
});
