import upload from "./upload.js";
import update from "./update.js";
import deleteObject from "./delete.js";

export default {
	upload,
	update,
	delete: deleteObject,
};
