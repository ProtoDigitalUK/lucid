"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const create_single_js_1 = __importDefault(require("./create-single.js"));
const delete_single_js_1 = __importDefault(require("./delete-single.js"));
const get_multiple_js_1 = __importDefault(require("./get-multiple.js"));
const get_single_js_1 = __importDefault(require("./get-single.js"));
const update_single_js_1 = __importDefault(require("./update-single.js"));
const stream_media_js_1 = __importDefault(require("./stream-media.js"));
const can_store_files_js_1 = __importDefault(require("./can-store-files.js"));
const get_storage_used_js_1 = __importDefault(require("./get-storage-used.js"));
const set_storage_used_js_1 = __importDefault(require("./set-storage-used.js"));
const get_single_by_id_js_1 = __importDefault(require("./get-single-by-id.js"));
const get_multiple_by_ids_js_1 = __importDefault(require("./get-multiple-by-ids.js"));
const stream_error_image_js_1 = __importDefault(require("./stream-error-image.js"));
const get_s3_object_js_1 = __importDefault(require("./get-s3-object.js"));
const pipe_remote_url_js_1 = __importDefault(require("./pipe-remote-url.js"));
exports.default = {
    createSingle: create_single_js_1.default,
    deleteSingle: delete_single_js_1.default,
    getMultiple: get_multiple_js_1.default,
    getSingle: get_single_js_1.default,
    updateSingle: update_single_js_1.default,
    streamMedia: stream_media_js_1.default,
    canStoreFiles: can_store_files_js_1.default,
    getStorageUsed: get_storage_used_js_1.default,
    setStorageUsed: set_storage_used_js_1.default,
    getSingleById: get_single_by_id_js_1.default,
    getMultipleByIds: get_multiple_by_ids_js_1.default,
    streamErrorImage: stream_error_image_js_1.default,
    getS3Object: get_s3_object_js_1.default,
    pipeRemoteURL: pipe_remote_url_js_1.default,
};
//# sourceMappingURL=index.js.map