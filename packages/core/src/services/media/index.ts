import checks from "./checks/index.js";
import strategies from "./strategies/index.js";

import getSingle from "./get-single.js";
import deleteSingle from "./delete-single.js";
import getMultiple from "./get-multiple.js";
import updateSingle from "./update-single.js";
import getPresignedUrl from "./get-presigned-url.js";
import createSingle from "./create-single.js";

export default {
	checks,
	strategies,

	getSingle,
	deleteSingle,
	getMultiple,
	updateSingle,
	getPresignedUrl,
	createSingle,
};
