import { headlessConfig } from "@protodigital/headless";

export default headlessConfig({
	databaseURL: process.env.DATABASE_URL as string,
	collections: [],
	bricks: [],
});
