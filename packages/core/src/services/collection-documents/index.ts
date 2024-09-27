import checks from "./checks/index.js";
import client from "./client/index.js";
import upsertSingle from "./upsert-single.js";
import getSingle from "./get-single.js";
import getMultiple from "./get-multiple.js";
import deleteSingle from "./delete-single.js";
import deleteMultiple from "./delete-multiple.js";

import newServices from "./new-services/index.js";

export default {
	checks,
	client,
	newServices,
	upsertSingle,
	getSingle,
	getMultiple,
	deleteSingle,
	deleteMultiple,
};
