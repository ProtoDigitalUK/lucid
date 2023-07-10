"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const create_single_1 = __importDefault(require("./create-single"));
const delete_single_1 = __importDefault(require("./delete-single"));
const get_multiple_1 = __importDefault(require("./get-multiple"));
const get_single_1 = __importDefault(require("./get-single"));
const update_single_1 = __importDefault(require("./update-single"));
const stream_media_1 = __importDefault(require("./stream-media"));
const can_store_files_1 = __importDefault(require("./can-store-files"));
const get_storage_used_1 = __importDefault(require("./get-storage-used"));
const set_storage_used_1 = __importDefault(require("./set-storage-used"));
exports.default = {
    createSingle: create_single_1.default,
    deleteSingle: delete_single_1.default,
    getMultiple: get_multiple_1.default,
    getSingle: get_single_1.default,
    updateSingle: update_single_1.default,
    streamMedia: stream_media_1.default,
    canStoreFiles: can_store_files_1.default,
    getStorageUsed: get_storage_used_1.default,
    setStorageUsed: set_storage_used_1.default,
};
//# sourceMappingURL=index.js.map