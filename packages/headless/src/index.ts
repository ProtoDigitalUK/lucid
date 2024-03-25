import("dotenv/config.js");
import headless from "./headless.js";
import headlessConfig from "./libs/config/headless-config.js";
import BrickBuilder from "./libs/brick-builder/index.js";
import CollectionBuilder from "./libs/collection-builder/index.js";
import sendEmail from "./services/email/send-external.js";
import serviceWrapper from "./utils/service-wrapper.js";
import LibsqlAdapter from "./libs/db/libsql-adapter/index.js";
import PostgresAdapter from "./libs/db/postgres-adapter/index.js";
import { headlessDB } from "./db/db.js";

export {
	headless,
	headlessConfig,
	BrickBuilder,
	CollectionBuilder,
	sendEmail,
	serviceWrapper,
	headlessDB,
	LibsqlAdapter,
	PostgresAdapter,
};
export type { EmailStrategyT } from "./libs/config/config-schema.js";

export default headless;
