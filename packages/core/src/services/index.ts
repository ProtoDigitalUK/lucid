import auth from "./auth/index.js";
import account from "./account/index.js";
import cdn from "./cdn/index.js";
import collectionDocumentBricks from "./collection-document-bricks/index.js";
import collectionDocuments from "./collection-documents/index.js";
import collections from "./collections/index.js";
import emails from "./email/index.js";
import locales from "./locales/index.js";
import media from "./media/index.js";
import options from "./options/index.js";
import processedImage from "./processed-images/index.js";
import roles from "./roles/index.js";
import settings from "./settings/index.js";
import translations from "./translations/index.js";
import users from "./users/index.js";
import userTokens from "./user-tokens/index.js";
// TODO: move these to be in their own folder
import cronJobs from "./cron-jobs.js";
import permissions from "./permissions.js";

const LucidServices = {
	auth: auth,
	collection: {
		...collections,
		document: {
			...collectionDocuments,
			brick: collectionDocumentBricks,
		},
	},
	account: account,
	user: {
		...users,
		token: userTokens,
	},
	email: emails,
	role: roles,
	setting: settings,
	option: options,
	media: media,
	processedImage: processedImage,
	cdn: cdn,
	locale: locales,
	translation: translations,
	cronJobs: cronJobs,
	permission: permissions,
};

export default LucidServices;
