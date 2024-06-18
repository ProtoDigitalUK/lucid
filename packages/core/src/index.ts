import("dotenv/config.js");
import { start, fastify } from "./server.js";
import config from "./libs/config/lucid-config.js";
import BrickBuilder from "./libs/builders/brick-builder/index.js";
import CollectionBuilder from "./libs/builders/collection-builder/index.js";
import LibSQLAdapter from "./libs/db/adapters/libsql/index.js";
import PostgresAdapter from "./libs/db/adapters/postgres/index.js";
import SQLiteAdapter from "./libs/db/adapters/sqlite/index.js";
import { LucidAPIError, LucidError } from "./utils/error-handler.js";
import lucidLogger from "./libs/logging/index.js";
import toolkit from "./libs/toolkit/toolkit.js";

export {
	toolkit,
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
