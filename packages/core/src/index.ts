import("dotenv/config.js");
import { start, fastify } from "./server.js";
import config from "./libs/config/lucid-config.js";
import BrickBuilder from "./libs/builders/brick-builder/index.js";
import CollectionBuilder from "./libs/builders/collection-builder/index.js";
import sendEmail from "./services/email/send-external.js";
import serviceWrapper from "./utils/service-wrapper.js";
import LibSQLAdapter from "./libs/db/adapters/libsql/index.js";
import PostgresAdapter from "./libs/db/adapters/postgres/index.js";
import SQLiteAdapter from "./libs/db/adapters/sqlite/index.js";
import { LucidAPIError, LucidError } from "./utils/error-handler.js";
import lucidLogger from "./libs/logging/index.js";

export {
	// Services
	sendEmail,
	// Utils
	serviceWrapper,
	lucidLogger,
	// Builders
	BrickBuilder,
	CollectionBuilder,
	// Adapters
	LibSQLAdapter,
	SQLiteAdapter,
	PostgresAdapter,
	// Errors
	LucidError,
	LucidAPIError,
};

export default {
	start,
	config,
	fastify,
};
