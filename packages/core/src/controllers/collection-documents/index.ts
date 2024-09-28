import client from "./client/index.js";
import getSingle from "./get-single.js";
import getMultiple from "./get-multiple.js";
import deleteMultiple from "./delete-multiple.js";
import deleteSingle from "./delete-single.js";
import restoreRevision from "./restore-revision.js";
import createDraft from "./create-draft.js";
import updateDraft from "./update-draft.js";
import updatePublish from "./update-publish.js";

export default {
	client,
	getSingle,
	getMultiple,
	deleteMultiple,
	deleteSingle,
	restoreRevision,
	createDraft,
	updateDraft,
	updatePublish,
};
