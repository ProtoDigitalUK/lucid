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
const check_key_unique_1 = __importDefault(require("./check-key-unique"));
const get_items_1 = __importDefault(require("./get-items"));
const get_single_item_1 = __importDefault(require("./get-single-item"));
const delete_items_by_ids_1 = __importDefault(require("./delete-items-by-ids"));
const format_1 = __importDefault(require("./format"));
const upsert_multiple_items_1 = __importDefault(require("./upsert-multiple-items"));
const upsert_item_1 = __importDefault(require("./upsert-item"));
exports.default = {
    createSingle: create_single_1.default,
    deleteSingle: delete_single_1.default,
    getMultiple: get_multiple_1.default,
    getSingle: get_single_1.default,
    updateSingle: update_single_1.default,
    checkKeyUnique: check_key_unique_1.default,
    getItems: get_items_1.default,
    getSingleItem: get_single_item_1.default,
    deleteItemsByIds: delete_items_by_ids_1.default,
    format: format_1.default,
    upsertMultipleItems: upsert_multiple_items_1.default,
    upsertItem: upsert_item_1.default,
};
//# sourceMappingURL=index.js.map