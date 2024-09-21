import update from "./update.js";
import deleteObject from "./delete.js";
import getPresignedUrl from "./get-presigned-url.js";
import syncMedia from "./sync-media.js";

export default {
	update,
	delete: deleteObject,
	getPresignedUrl,
	syncMedia,
};
