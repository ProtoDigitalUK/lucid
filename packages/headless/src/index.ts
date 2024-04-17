import("dotenv/config.js");
import { start, fastify } from "./server.js";
import headlessPlugin from "./headless-plugin.js";
import config from "./libs/config/headless-config.js";
import BrickBuilder from "./libs/builders/brick-builder/index.js";
import CollectionBuilder from "./libs/builders/collection-builder/index.js";
import sendEmail from "./services/email/send-external.js";
import serviceWrapper from "./utils/service-wrapper.js";
import LibSQLAdapter from "./libs/db/adapters/libsql/index.js";
import PostgresAdapter from "./libs/db/adapters/postgres/index.js";
import SQLLiteAdapter from "./libs/db/adapters/sqllite/index.js";
import { HeadlessAPIError, HeadlessError } from "./utils/error-handler.js";
import headlessLogger from "./libs/logging/index.js";

export {
	// Services
	sendEmail,
	// Utils
	serviceWrapper,
	headlessLogger,
	// Builders
	BrickBuilder,
	CollectionBuilder,
	// Adapters
	LibSQLAdapter,
	SQLLiteAdapter,
	PostgresAdapter,
	// Misc
	headlessPlugin, // sets up fastify and headless routes, not needed unless you want you own implementation of start
	// Errors
	HeadlessError,
	HeadlessAPIError,
};

export default {
	start,
	config,
	fastify,
};
