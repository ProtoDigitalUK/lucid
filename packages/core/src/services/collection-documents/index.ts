import checks from "./checks/index.js";
import client from "./client/index.js";
import upsertSingle from "./upsert-single.js";
import getSingle from "./get-single.js";
import getMultiple from "./get-multiple.js";
import deleteSingle from "./delete-single.js";
import deleteMultiple from "./delete-multiple.js";
import restoreRevision from "./restore-revision.js";

export default {
	checks,
	client,
	upsertSingle,
	getSingle,
	getMultiple,
	deleteSingle,
	deleteMultiple,
	restoreRevision,
};
