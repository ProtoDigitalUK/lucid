"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const create_multiple_js_1 = __importDefault(require("./create-multiple.js"));
const verify_cateogies_in_collection_js_1 = __importDefault(require("./verify-cateogies-in-collection.js"));
const delete_multiple_js_1 = __importDefault(require("./delete-multiple.js"));
const update_multiple_js_1 = __importDefault(require("./update-multiple.js"));
exports.default = {
    createMultiple: create_multiple_js_1.default,
    verifyCategoriesInCollection: verify_cateogies_in_collection_js_1.default,
    deleteMultiple: delete_multiple_js_1.default,
    updateMultiple: update_multiple_js_1.default,
};
//# sourceMappingURL=index.js.map