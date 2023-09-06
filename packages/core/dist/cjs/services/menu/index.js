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
const check_key_unique_js_1 = __importDefault(require("./check-key-unique.js"));
const get_items_js_1 = __importDefault(require("./get-items.js"));
const get_single_item_js_1 = __importDefault(require("./get-single-item.js"));
const delete_items_by_ids_js_1 = __importDefault(require("./delete-items-by-ids.js"));
const upsert_multiple_items_js_1 = __importDefault(require("./upsert-multiple-items.js"));
const upsert_item_js_1 = __importDefault(require("./upsert-item.js"));
exports.default = {
    createSingle: create_single_js_1.default,
    deleteSingle: delete_single_js_1.default,
    getMultiple: get_multiple_js_1.default,
    getSingle: get_single_js_1.default,
    updateSingle: update_single_js_1.default,
    checkKeyUnique: check_key_unique_js_1.default,
    getItems: get_items_js_1.default,
    getSingleItem: get_single_item_js_1.default,
    deleteItemsByIds: delete_items_by_ids_js_1.default,
    upsertMultipleItems: upsert_multiple_items_js_1.default,
    upsertItem: upsert_item_js_1.default,
};
//# sourceMappingURL=index.js.map