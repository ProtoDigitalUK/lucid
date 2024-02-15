import("dotenv/config.js");
import headless from "./headless.js";
import { headlessConfig } from "./services/config.js";
import BrickBuilder from "./builders/brick-builder/index.js";
import CollectionBuilder from "./builders/collection-builder/index.js";
import sendEmail from "./services/email/send-external.js";
import serviceWrapper from "./utils/app/service-wrapper.js";
import { headlessDB } from "./db/db.js";

export {
	headless,
	headlessConfig,
	BrickBuilder,
	CollectionBuilder,
	sendEmail,
	serviceWrapper,
	headlessDB,
};
export type { EmailStrategyT } from "./schemas/config.js";

export default headless;
