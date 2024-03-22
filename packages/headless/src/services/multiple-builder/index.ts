import checks from "./checks/index.js";
import createSingle from "./create-single.js";
import resetHomepages from "./reset-homepages.js";
import getSingle from "./get-single.js";
import updateSingle from "./update-single.js";
import deleteMultiple from "./delete-multiple.js";
import deleteSingle from "./delete-single.js";
import getMultiple from "./get-multiple.js";
import getMultipleValidParents from "./get-multiple-valid-parents.js";

export default {
	checks,
	getSingle,
	createSingle,
	resetHomepages,
	updateSingle,
	deleteMultiple,
	deleteSingle,
	getMultiple,
	getMultipleValidParents,
};
