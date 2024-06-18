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
import permissions from "./permissions/index.js";
import crons from "./crons/index.js";
import seed from "./seed/index.js";

const lucidServices = {
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
	crons: crons,
	permission: permissions,
	seed: seed,
};

export default lucidServices;
