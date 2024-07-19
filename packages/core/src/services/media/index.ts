import checks from "./checks/index.js";
import storage from "./storage/index.js";
import strategies from "./strategies/index.js";

import uploadSingle from "./upload-single.js";
import getSingle from "./get-single.js";
import deleteSingle from "./delete-single.js";
import getMultiple from "./get-multiple.js";
import updateSingle from "./update-single.js";

export default {
	checks,
	storage,
	strategies,

	uploadSingle,
	getSingle,
	deleteSingle,
	getMultiple,
	updateSingle,
};
