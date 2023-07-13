"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const create_multiple_1 = __importDefault(require("./create-multiple"));
const verify_cateogies_in_collection_1 = __importDefault(require("./verify-cateogies-in-collection"));
const delete_multiple_1 = __importDefault(require("./delete-multiple"));
const update_multiple_1 = __importDefault(require("./update-multiple"));
exports.default = {
    createMultiple: create_multiple_1.default,
    verifyCategoriesInCollection: verify_cateogies_in_collection_1.default,
    deleteMultiple: delete_multiple_1.default,
    updateMultiple: update_multiple_1.default,
};
//# sourceMappingURL=index.js.map