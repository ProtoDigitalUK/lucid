import checks from "./checks/index.js";
import upsertSingle from "./upsert-single.js";
import resetHomepages from "./reset-homepages.js";
import getSingle from "./get-single.js";
import getMultiple from "./get-multiple.js";
import deleteSingle from "./delete-single.js";
import deleteMultiple from "./delete-multiple.js";
import getMultipleValidParents from "./get-multiple-valid-parents.js";

export default {
	checks,
	upsertSingle,
	getSingle,
	resetHomepages,
	getMultiple,
	deleteSingle,
	deleteMultiple,
	getMultipleValidParents,
};
