import("dotenv/config.js");
import headless from "./headless.js";
import headlessConfig from "./libs/config/headless-config.js";
import BrickBuilder from "./libs/builders/brick-builder/index.js";
import CollectionBuilder from "./libs/builders/collection-builder/index.js";
import sendEmail from "./services/email/send-external.js";
import serviceWrapper from "./utils/service-wrapper.js";
import LibSQLAdapter from "./libs/db/adapters/libsql/index.js";
import PostgresAdapter from "./libs/db/adapters/postgres/index.js";
import SQLLiteAdapter from "./libs/db/adapters/sqllite/index.js";

export * from "./types/config.js";
export * from "./types/response.js";

export {
	// Core
	headless,
	headlessConfig,
	// Services
	sendEmail,
	// Utils
	serviceWrapper,
	// Builders
	BrickBuilder,
	CollectionBuilder,
	// Adapters
	LibSQLAdapter,
	SQLLiteAdapter,
	PostgresAdapter,
};

export default headless;
