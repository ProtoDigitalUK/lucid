import("dotenv/config.js");
import headless from "./headless.js";
import { headlessConfig } from "./services/config.js";
import BrickBuilder from "./libs/brick-builder/index.js";
import BrickBuilderNew from "./libs/brick-builder-new/index.js";
import CollectionBuilder from "./libs/collection-builder/index.js";
import sendEmail from "./services/email/send-external.js";
import serviceWrapper from "./utils/service-wrapper.js";
import { headlessDB } from "./db/db.js";

import headlessConfigNew from "./libs/config/headless-config.js";

export {
	headless,
	headlessConfig,
	headlessConfigNew,
	BrickBuilder,
	BrickBuilderNew,
	CollectionBuilder,
	sendEmail,
	serviceWrapper,
	headlessDB,
};
export type { EmailStrategyT } from "./schemas/config.js";

export default headless;
