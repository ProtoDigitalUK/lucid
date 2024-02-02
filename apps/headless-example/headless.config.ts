import { headlessConfig } from "@protodigital/headless";

export default headlessConfig({
	mode: "development",
	host: "http://localhost:8393",
	databaseURL: process.env.DATABASE_URL as string,
	keys: {
		cookieSecret: process.env.COOKIE_SECRET as string,
	},
	collections: [],
	bricks: [],
});
