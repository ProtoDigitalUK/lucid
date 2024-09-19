import upload from "./upload.js";
import update from "./update.js";
import deleteObject from "./delete.js";
import getPresignedUrl from "./get-presigned-url.js";

export default {
	upload,
	update,
	delete: deleteObject,
	getPresignedUrl,
};
